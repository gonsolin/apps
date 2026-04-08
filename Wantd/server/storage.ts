import {
  type Want, type InsertWant, wants,
  type Offer, type InsertOffer, offers,
  type User, type InsertUser, users,
  type Transaction, transactions,
  type Notification, notifications,
} from "@shared/schema";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, desc, and, sql } from "drizzle-orm";

const sqlite = new Database("data.db");
sqlite.pragma("journal_mode = WAL");

// Create tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    display_name TEXT NOT NULL,
    location TEXT,
    locale TEXT NOT NULL DEFAULT 'en',
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS wants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    max_price REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    location TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TEXT NOT NULL,
    author_name TEXT NOT NULL,
    user_id INTEGER
  );
  CREATE TABLE IF NOT EXISTS offers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    want_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    price REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    location TEXT NOT NULL,
    offerer_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL,
    user_id INTEGER
  );
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    want_id INTEGER NOT NULL,
    offer_id INTEGER NOT NULL,
    final_price REAL NOT NULL,
    currency TEXT NOT NULL,
    buyer_name TEXT NOT NULL,
    seller_name TEXT NOT NULL,
    buyer_location TEXT NOT NULL,
    seller_location TEXT NOT NULL,
    item_description TEXT NOT NULL,
    category TEXT NOT NULL,
    completed_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    related_want_id INTEGER,
    related_offer_id INTEGER,
    read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );
`);

export const db = drizzle(sqlite);

export interface IStorage {
  // Users
  createUser(user: InsertUser): Promise<User>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUserLocale(id: number, locale: string): Promise<User | undefined>;

  // Wants
  createWant(want: InsertWant, userId?: number): Promise<Want>;
  getWant(id: number): Promise<Want | undefined>;
  listWants(filters?: { search?: string; category?: string; location?: string; page?: number; limit?: number }): Promise<{ wants: Want[]; total: number }>;
  getWantsByUser(userId: number): Promise<Want[]>;
  updateWantStatus(id: number, status: string): Promise<Want | undefined>;

  // Offers
  createOffer(offer: InsertOffer, userId?: number): Promise<Offer>;
  getOffer(id: number): Promise<Offer | undefined>;
  getOffersForWant(wantId: number): Promise<Offer[]>;
  getOffersByUser(userId: number): Promise<Offer[]>;
  updateOfferStatus(id: number, status: string): Promise<Offer | undefined>;

  // Transactions
  createTransaction(tx: Omit<Transaction, "id">): Promise<Transaction>;
  getTransactionsForWant(wantId: number): Promise<Transaction[]>;
  listTransactions(limit?: number): Promise<Transaction[]>;

  // Notifications
  createNotification(n: Omit<Notification, "id">): Promise<Notification>;
  getNotificationsForUser(userId: number): Promise<Notification[]>;
  markNotificationRead(id: number): Promise<void>;
  markAllNotificationsRead(userId: number): Promise<void>;
  getUnreadCount(userId: number): Promise<number>;

  // Stats
  getStats(): Promise<{ totalWants: number; totalOffers: number; totalFulfilled: number; avgPrice: number; totalTransactions: number }>;

  // Export
  getAllWantsForExport(): Promise<Want[]>;
  getAllTransactionsForExport(): Promise<Transaction[]>;
}

export class DatabaseStorage implements IStorage {
  // ── Users ──
  async createUser(insertUser: InsertUser): Promise<User> {
    return db.insert(users).values({
      ...insertUser,
      createdAt: new Date().toISOString(),
    }).returning().get();
  }

  async getUserById(id: number): Promise<User | undefined> {
    return db.select().from(users).where(eq(users.id, id)).get();
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return db.select().from(users).where(eq(users.username, username)).get();
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return db.select().from(users).where(eq(users.email, email)).get();
  }

  async updateUserLocale(id: number, locale: string): Promise<User | undefined> {
    return db.update(users).set({ locale }).where(eq(users.id, id)).returning().get();
  }

  // ── Wants ──
  async createWant(insertWant: InsertWant, userId?: number): Promise<Want> {
    return db.insert(wants).values({
      ...insertWant,
      userId: userId ?? null,
      createdAt: new Date().toISOString(),
      status: "open",
    }).returning().get();
  }

  async getWant(id: number): Promise<Want | undefined> {
    return db.select().from(wants).where(eq(wants.id, id)).get();
  }

  async listWants(filters?: { search?: string; category?: string; location?: string; page?: number; limit?: number }): Promise<{ wants: Want[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 30;

    let allResults = db.select().from(wants).orderBy(desc(wants.id)).all();

    if (filters?.category && filters.category !== "all") {
      allResults = allResults.filter(w => w.category === filters.category);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      allResults = allResults.filter(w =>
        w.title.toLowerCase().includes(s) ||
        (w.description && w.description.toLowerCase().includes(s))
      );
    }
    if (filters?.location) {
      const loc = filters.location.toLowerCase();
      allResults = allResults.filter(w => w.location.toLowerCase().includes(loc));
    }

    const total = allResults.length;
    const offset = (page - 1) * limit;
    const paged = allResults.slice(offset, offset + limit);

    return { wants: paged, total };
  }

  async getWantsByUser(userId: number): Promise<Want[]> {
    return db.select().from(wants).where(eq(wants.userId, userId)).orderBy(desc(wants.id)).all();
  }

  async updateWantStatus(id: number, status: string): Promise<Want | undefined> {
    return db.update(wants).set({ status }).where(eq(wants.id, id)).returning().get();
  }

  // ── Offers ──
  async createOffer(insertOffer: InsertOffer, userId?: number): Promise<Offer> {
    return db.insert(offers).values({
      ...insertOffer,
      userId: userId ?? null,
      createdAt: new Date().toISOString(),
      status: "pending",
    }).returning().get();
  }

  async getOffer(id: number): Promise<Offer | undefined> {
    return db.select().from(offers).where(eq(offers.id, id)).get();
  }

  async getOffersForWant(wantId: number): Promise<Offer[]> {
    return db.select().from(offers).where(eq(offers.wantId, wantId)).orderBy(desc(offers.id)).all();
  }

  async getOffersByUser(userId: number): Promise<Offer[]> {
    return db.select().from(offers).where(eq(offers.userId, userId)).orderBy(desc(offers.id)).all();
  }

  async updateOfferStatus(id: number, status: string): Promise<Offer | undefined> {
    return db.update(offers).set({ status }).where(eq(offers.id, id)).returning().get();
  }

  // ── Transactions ──
  async createTransaction(tx: Omit<Transaction, "id">): Promise<Transaction> {
    return db.insert(transactions).values(tx).returning().get();
  }

  async getTransactionsForWant(wantId: number): Promise<Transaction[]> {
    return db.select().from(transactions).where(eq(transactions.wantId, wantId)).all();
  }

  async listTransactions(limit = 50): Promise<Transaction[]> {
    return db.select().from(transactions).orderBy(desc(transactions.id)).limit(limit).all();
  }

  // ── Notifications ──
  async createNotification(n: Omit<Notification, "id">): Promise<Notification> {
    return db.insert(notifications).values(n).returning().get();
  }

  async getNotificationsForUser(userId: number): Promise<Notification[]> {
    return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.id)).limit(50).all();
  }

  async markNotificationRead(id: number): Promise<void> {
    db.update(notifications).set({ read: 1 }).where(eq(notifications.id, id)).run();
  }

  async markAllNotificationsRead(userId: number): Promise<void> {
    db.update(notifications).set({ read: 1 }).where(eq(notifications.userId, userId)).run();
  }

  async getUnreadCount(userId: number): Promise<number> {
    const result = db.select({ count: sql<number>`count(*)` }).from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.read, 0))).get();
    return result?.count ?? 0;
  }

  // ── Stats ──
  async getStats() {
    const wantCount = db.select({ count: sql<number>`count(*)` }).from(wants).get();
    const offerCount = db.select({ count: sql<number>`count(*)` }).from(offers).get();
    const fulfilledCount = db.select({ count: sql<number>`count(*)` }).from(wants).where(eq(wants.status, "fulfilled")).get();
    const txCount = db.select({ count: sql<number>`count(*)` }).from(transactions).get();
    const avgResult = db.select({ avg: sql<number>`avg(max_price)` }).from(wants).get();

    return {
      totalWants: wantCount?.count ?? 0,
      totalOffers: offerCount?.count ?? 0,
      totalFulfilled: fulfilledCount?.count ?? 0,
      avgPrice: Math.round((avgResult?.avg ?? 0) * 100) / 100,
      totalTransactions: txCount?.count ?? 0,
    };
  }

  // ── Export ──
  async getAllWantsForExport(): Promise<Want[]> {
    return db.select().from(wants).orderBy(desc(wants.id)).all();
  }

  async getAllTransactionsForExport(): Promise<Transaction[]> {
    return db.select().from(transactions).orderBy(desc(transactions.id)).all();
  }
}

export const storage = new DatabaseStorage();
