import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWantSchema, insertOfferSchema, insertUserSchema } from "@shared/schema";
import crypto from "crypto";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Simple session: store userId in a Map keyed by token
const sessions = new Map<string, number>();

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function getSessionUserId(req: Request): number | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  return sessions.get(token) ?? null;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ═══ AUTH ═══

  app.post("/api/auth/register", async (req, res) => {
    try {
      const parsed = insertUserSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });

      const existingUser = await storage.getUserByUsername(parsed.data.username);
      if (existingUser) return res.status(409).json({ message: "Username already taken" });
      const existingEmail = await storage.getUserByEmail(parsed.data.email);
      if (existingEmail) return res.status(409).json({ message: "Email already registered" });

      const user = await storage.createUser({
        ...parsed.data,
        password: hashPassword(parsed.data.password),
      });
      const token = generateToken();
      sessions.set(token, user.id);
      const { password, ...safeUser } = user;
      res.status(201).json({ user: safeUser, token });
    } catch (error) {
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ message: "Username and password required" });
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== hashPassword(password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = generateToken();
      sessions.set(token, user.id);
      const { password: _, ...safeUser } = user;
      res.json({ user: safeUser, token });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    const userId = getSessionUserId(req);
    if (!userId) return res.status(401).json({ message: "Not authenticated" });
    const user = await storage.getUserById(userId);
    if (!user) return res.status(401).json({ message: "User not found" });
    const { password, ...safeUser } = user;
    res.json(safeUser);
  });

  app.post("/api/auth/logout", (req, res) => {
    const auth = req.headers.authorization;
    if (auth?.startsWith("Bearer ")) sessions.delete(auth.slice(7));
    res.json({ ok: true });
  });

  app.patch("/api/auth/locale", async (req, res) => {
    const userId = getSessionUserId(req);
    if (!userId) return res.status(401).json({ message: "Not authenticated" });
    const { locale } = req.body;
    if (!["en", "es", "fr", "de", "zh"].includes(locale)) return res.status(400).json({ message: "Invalid locale" });
    const user = await storage.updateUserLocale(userId, locale);
    if (!user) return res.status(404).json({ message: "User not found" });
    const { password, ...safeUser } = user;
    res.json(safeUser);
  });

  // ═══ WANTS ═══

  app.get("/api/wants", async (req, res) => {
    try {
      const { search, category, location, page, limit } = req.query;
      const result = await storage.listWants({
        search: search as string,
        category: category as string,
        location: location as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 30,
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wants" });
    }
  });

  app.get("/api/wants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const want = await storage.getWant(id);
      if (!want) return res.status(404).json({ message: "Want not found" });
      const offrs = await storage.getOffersForWant(id);
      const txs = await storage.getTransactionsForWant(id);
      res.json({ ...want, offers: offrs, transactions: txs });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch want" });
    }
  });

  app.post("/api/wants", async (req, res) => {
    try {
      const parsed = insertWantSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });
      const userId = getSessionUserId(req);
      const want = await storage.createWant(parsed.data, userId ?? undefined);
      res.status(201).json(want);
    } catch (error) {
      res.status(500).json({ message: "Failed to create want" });
    }
  });

  app.patch("/api/wants/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      if (!["open", "fulfilled", "expired"].includes(status)) return res.status(400).json({ message: "Invalid status" });
      const want = await storage.updateWantStatus(id, status);
      if (!want) return res.status(404).json({ message: "Want not found" });
      res.json(want);
    } catch (error) {
      res.status(500).json({ message: "Failed to update want" });
    }
  });

  // ═══ OFFERS ═══

  app.post("/api/wants/:id/offers", async (req, res) => {
    try {
      const wantId = parseInt(req.params.id);
      const want = await storage.getWant(wantId);
      if (!want) return res.status(404).json({ message: "Want not found" });
      const parsed = insertOfferSchema.safeParse({ ...req.body, wantId });
      if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });
      const userId = getSessionUserId(req);
      const offer = await storage.createOffer(parsed.data, userId ?? undefined);

      // Create notification for want owner
      if (want.userId) {
        await storage.createNotification({
          userId: want.userId,
          type: "new_offer",
          title: "New offer received",
          message: `${offer.offererName} offered ${offer.price} ${offer.currency} for "${want.title}"`,
          relatedWantId: wantId,
          relatedOfferId: offer.id,
          read: 0,
          createdAt: new Date().toISOString(),
        });
      }

      res.status(201).json(offer);
    } catch (error) {
      res.status(500).json({ message: "Failed to create offer" });
    }
  });

  app.patch("/api/offers/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      if (!["pending", "accepted", "declined"].includes(status)) return res.status(400).json({ message: "Invalid status" });
      const offer = await storage.updateOfferStatus(id, status);
      if (!offer) return res.status(404).json({ message: "Offer not found" });

      // Create notification for offerer
      if (offer.userId) {
        const want = await storage.getWant(offer.wantId);
        await storage.createNotification({
          userId: offer.userId,
          type: status === "accepted" ? "offer_accepted" : "offer_declined",
          title: status === "accepted" ? "Offer accepted!" : "Offer declined",
          message: status === "accepted"
            ? `Your offer for "${want?.title}" was accepted!`
            : `Your offer for "${want?.title}" was declined.`,
          relatedWantId: offer.wantId,
          relatedOfferId: offer.id,
          read: 0,
          createdAt: new Date().toISOString(),
        });
      }

      res.json(offer);
    } catch (error) {
      res.status(500).json({ message: "Failed to update offer" });
    }
  });

  // ═══ TRANSACTIONS (Complete a deal) ═══

  app.post("/api/wants/:id/complete", async (req, res) => {
    try {
      const wantId = parseInt(req.params.id);
      const { offerId, finalPrice } = req.body;
      if (!offerId || !finalPrice) return res.status(400).json({ message: "offerId and finalPrice required" });

      const want = await storage.getWant(wantId);
      if (!want) return res.status(404).json({ message: "Want not found" });
      const offer = await storage.getOffer(offerId);
      if (!offer) return res.status(404).json({ message: "Offer not found" });

      // Accept the offer, mark want as fulfilled
      await storage.updateOfferStatus(offerId, "accepted");
      await storage.updateWantStatus(wantId, "fulfilled");

      // Decline other pending offers
      const allOffers = await storage.getOffersForWant(wantId);
      for (const o of allOffers) {
        if (o.id !== offerId && o.status === "pending") {
          await storage.updateOfferStatus(o.id, "declined");
          if (o.userId) {
            await storage.createNotification({
              userId: o.userId,
              type: "offer_declined",
              title: "Offer declined",
              message: `The want "${want.title}" was fulfilled by another offer.`,
              relatedWantId: wantId,
              relatedOfferId: o.id,
              read: 0,
              createdAt: new Date().toISOString(),
            });
          }
        }
      }

      // Record transaction
      const tx = await storage.createTransaction({
        wantId,
        offerId,
        finalPrice: parseFloat(finalPrice),
        currency: want.currency,
        buyerName: want.authorName,
        sellerName: offer.offererName,
        buyerLocation: want.location,
        sellerLocation: offer.location,
        itemDescription: want.title,
        category: want.category,
        completedAt: new Date().toISOString(),
      });

      // Notify both parties
      if (want.userId) {
        await storage.createNotification({
          userId: want.userId,
          type: "deal_completed",
          title: "Deal completed!",
          message: `Transaction for "${want.title}" recorded at ${finalPrice} ${want.currency}`,
          relatedWantId: wantId,
          relatedOfferId: offerId,
          read: 0,
          createdAt: new Date().toISOString(),
        });
      }
      if (offer.userId) {
        await storage.createNotification({
          userId: offer.userId,
          type: "deal_completed",
          title: "Deal completed!",
          message: `Transaction for "${want.title}" recorded at ${finalPrice} ${want.currency}`,
          relatedWantId: wantId,
          relatedOfferId: offerId,
          read: 0,
          createdAt: new Date().toISOString(),
        });
      }

      res.json(tx);
    } catch (error) {
      res.status(500).json({ message: "Failed to complete transaction" });
    }
  });

  app.get("/api/transactions", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const txs = await storage.listTransactions(limit);
      res.json(txs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // ═══ NOTIFICATIONS ═══

  app.get("/api/notifications", async (req, res) => {
    const userId = getSessionUserId(req);
    if (!userId) return res.status(401).json({ message: "Not authenticated" });
    const notifs = await storage.getNotificationsForUser(userId);
    const unread = await storage.getUnreadCount(userId);
    res.json({ notifications: notifs, unreadCount: unread });
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    const userId = getSessionUserId(req);
    if (!userId) return res.status(401).json({ message: "Not authenticated" });
    await storage.markNotificationRead(parseInt(req.params.id));
    res.json({ ok: true });
  });

  app.post("/api/notifications/read-all", async (req, res) => {
    const userId = getSessionUserId(req);
    if (!userId) return res.status(401).json({ message: "Not authenticated" });
    await storage.markAllNotificationsRead(userId);
    res.json({ ok: true });
  });

  // ═══ DATA EXPORT API ═══

  app.get("/api/export/wants", async (req, res) => {
    try {
      const format = req.query.format as string || "json";
      const allWants = await storage.getAllWantsForExport();

      if (format === "csv") {
        const header = "id,title,description,category,max_price,currency,location,status,created_at,author_name\n";
        const rows = allWants.map(w =>
          `${w.id},"${(w.title || "").replace(/"/g, '""')}","${(w.description || "").replace(/"/g, '""')}",${w.category},${w.maxPrice},${w.currency},"${w.location}",${w.status},${w.createdAt},"${w.authorName}"`
        ).join("\n");
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=wantd-wants.csv");
        res.send(header + rows);
      } else {
        res.json({ count: allWants.length, data: allWants });
      }
    } catch (error) {
      res.status(500).json({ message: "Export failed" });
    }
  });

  app.get("/api/export/transactions", async (req, res) => {
    try {
      const format = req.query.format as string || "json";
      const allTx = await storage.getAllTransactionsForExport();

      if (format === "csv") {
        const header = "id,want_id,offer_id,final_price,currency,buyer_name,seller_name,buyer_location,seller_location,item_description,category,completed_at\n";
        const rows = allTx.map(t =>
          `${t.id},${t.wantId},${t.offerId},${t.finalPrice},${t.currency},"${t.buyerName}","${t.sellerName}","${t.buyerLocation}","${t.sellerLocation}","${(t.itemDescription || "").replace(/"/g, '""')}",${t.category},${t.completedAt}`
        ).join("\n");
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=wantd-transactions.csv");
        res.send(header + rows);
      } else {
        res.json({ count: allTx.length, data: allTx });
      }
    } catch (error) {
      res.status(500).json({ message: "Export failed" });
    }
  });

  app.get("/api/export/pricing", async (req, res) => {
    try {
      const allTx = await storage.getAllTransactionsForExport();
      const allWants = await storage.getAllWantsForExport();

      // Aggregate pricing data by category
      const categoryPricing: Record<string, { count: number; totalPrice: number; minPrice: number; maxPrice: number; currency: string; locations: Set<string> }> = {};

      for (const tx of allTx) {
        if (!categoryPricing[tx.category]) {
          categoryPricing[tx.category] = { count: 0, totalPrice: 0, minPrice: Infinity, maxPrice: -Infinity, currency: tx.currency, locations: new Set() };
        }
        const cp = categoryPricing[tx.category];
        cp.count++;
        cp.totalPrice += tx.finalPrice;
        cp.minPrice = Math.min(cp.minPrice, tx.finalPrice);
        cp.maxPrice = Math.max(cp.maxPrice, tx.finalPrice);
        cp.locations.add(tx.buyerLocation);
        cp.locations.add(tx.sellerLocation);
      }

      // Also include demand data from wants
      const demandByCategory: Record<string, { count: number; avgMaxPrice: number }> = {};
      for (const w of allWants) {
        if (!demandByCategory[w.category]) {
          demandByCategory[w.category] = { count: 0, avgMaxPrice: 0 };
        }
        demandByCategory[w.category].count++;
        demandByCategory[w.category].avgMaxPrice += w.maxPrice;
      }
      for (const cat of Object.keys(demandByCategory)) {
        demandByCategory[cat].avgMaxPrice = Math.round(demandByCategory[cat].avgMaxPrice / demandByCategory[cat].count * 100) / 100;
      }

      res.json({
        generatedAt: new Date().toISOString(),
        transactionPricing: Object.entries(categoryPricing).map(([cat, data]) => ({
          category: cat,
          transactionCount: data.count,
          avgPrice: Math.round(data.totalPrice / data.count * 100) / 100,
          minPrice: data.minPrice === Infinity ? null : data.minPrice,
          maxPrice: data.maxPrice === -Infinity ? null : data.maxPrice,
          primaryCurrency: data.currency,
          locationCount: data.locations.size,
        })),
        demandSignals: demandByCategory,
      });
    } catch (error) {
      res.status(500).json({ message: "Export failed" });
    }
  });

  // ═══ STATS ═══

  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // ═══ SEED ═══

  app.post("/api/seed", async (req, res) => {
    try {
      const fs = await import("fs");
      const path = await import("path");

      const wantsPath = path.resolve("seed-data.json");
      const offersPath = path.resolve("seed-offers.json");

      if (!fs.existsSync(wantsPath)) return res.status(404).json({ message: "seed-data.json not found" });

      const wantsData = JSON.parse(fs.readFileSync(wantsPath, "utf-8"));
      const offersData = fs.existsSync(offersPath) ? JSON.parse(fs.readFileSync(offersPath, "utf-8")) : [];

      // Check if already seeded
      const existingStats = await storage.getStats();
      if (existingStats.totalWants >= 100) {
        return res.json({ message: "Already seeded", stats: existingStats });
      }

      const { db: dbInstance } = await import("./storage");
      const { wants: wantsTable, offers: offersTable } = await import("@shared/schema");

      // Bulk insert wants
      for (const w of wantsData) {
        dbInstance.insert(wantsTable).values({
          title: w.title,
          description: w.description,
          category: w.category,
          maxPrice: w.maxPrice,
          currency: w.currency,
          location: w.location,
          status: w.status,
          authorName: w.authorName,
          createdAt: w.createdAt,
        }).run();
      }

      // Bulk insert offers
      for (const o of offersData) {
        dbInstance.insert(offersTable).values({
          wantId: o.wantId,
          message: o.message,
          price: o.price,
          currency: o.currency,
          location: o.location,
          offererName: o.offererName,
          status: o.status,
          createdAt: o.createdAt,
        }).run();
      }

      const stats = await storage.getStats();
      res.json({ message: "Seeded", stats, wantsInserted: wantsData.length, offersInserted: offersData.length });
    } catch (error: any) {
      res.status(500).json({ message: "Seed failed", error: error.message });
    }
  });

  return httpServer;
}
