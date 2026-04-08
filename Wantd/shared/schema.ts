import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ── Users ──
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  location: text("location"),
  locale: text("locale").notNull().default("en"),
  createdAt: text("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
}).extend({
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  displayName: z.string().min(1, "Display name is required"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// ── Wants ──
export const wants = sqliteTable("wants", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  maxPrice: real("max_price").notNull(),
  currency: text("currency").notNull().default("USD"),
  location: text("location").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  status: text("status").notNull().default("open"), // open, fulfilled, expired
  createdAt: text("created_at").notNull(),
  authorName: text("author_name").notNull(),
  userId: integer("user_id"),
});

export const insertWantSchema = createInsertSchema(wants).omit({
  id: true,
  createdAt: true,
  status: true,
  userId: true,
}).extend({
  title: z.string().min(2, "Title must be at least 2 characters"),
  maxPrice: z.number().positive("Price must be positive"),
  location: z.string().min(1, "Location is required"),
  authorName: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
});

export type Want = typeof wants.$inferSelect;
export type InsertWant = z.infer<typeof insertWantSchema>;

// ── Offers ──
export const offers = sqliteTable("offers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  wantId: integer("want_id").notNull(),
  message: text("message").notNull(),
  price: real("price").notNull(),
  currency: text("currency").notNull().default("USD"),
  location: text("location").notNull(),
  offererName: text("offerer_name").notNull(),
  status: text("status").notNull().default("pending"), // pending, accepted, declined
  createdAt: text("created_at").notNull(),
  userId: integer("user_id"),
});

export const insertOfferSchema = createInsertSchema(offers).omit({
  id: true,
  createdAt: true,
  status: true,
  userId: true,
}).extend({
  message: z.string().min(1, "Message is required"),
  price: z.number().positive("Price must be positive"),
  location: z.string().min(1, "Location is required"),
  offererName: z.string().min(1, "Name is required"),
});

export type Offer = typeof offers.$inferSelect;
export type InsertOffer = z.infer<typeof insertOfferSchema>;

// ── Transactions (completed deals) ──
export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  wantId: integer("want_id").notNull(),
  offerId: integer("offer_id").notNull(),
  finalPrice: real("final_price").notNull(),
  currency: text("currency").notNull(),
  buyerName: text("buyer_name").notNull(),
  sellerName: text("seller_name").notNull(),
  buyerLocation: text("buyer_location").notNull(),
  sellerLocation: text("seller_location").notNull(),
  itemDescription: text("item_description").notNull(),
  category: text("category").notNull(),
  completedAt: text("completed_at").notNull(),
});

export type Transaction = typeof transactions.$inferSelect;

// ── Notifications ──
export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // new_offer, offer_accepted, offer_declined, deal_completed
  title: text("title").notNull(),
  message: text("message").notNull(),
  relatedWantId: integer("related_want_id"),
  relatedOfferId: integer("related_offer_id"),
  read: integer("read").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

export type Notification = typeof notifications.$inferSelect;

// ── Categories ──
export const CATEGORIES = [
  { value: "electronics", label: "Electronics" },
  { value: "furniture", label: "Furniture" },
  { value: "vehicles", label: "Vehicles" },
  { value: "auto-parts", label: "Auto Parts" },
  { value: "clothing", label: "Clothing" },
  { value: "services", label: "Services" },
  { value: "real-estate", label: "Real Estate" },
  { value: "food", label: "Food & Drink" },
  { value: "collectibles", label: "Collectibles" },
  { value: "sports", label: "Sports" },
  { value: "books", label: "Books" },
  { value: "tools", label: "Tools" },
  { value: "music", label: "Music" },
  { value: "pets", label: "Pets" },
  { value: "health", label: "Health" },
  { value: "education", label: "Education" },
  { value: "crafts", label: "Crafts" },
  { value: "garden", label: "Garden" },
  { value: "other", label: "Other" },
] as const;

export const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "GBP", label: "GBP (£)", symbol: "£" },
  { value: "JPY", label: "JPY (¥)", symbol: "¥" },
  { value: "CNY", label: "CNY (¥)", symbol: "¥" },
  { value: "KRW", label: "KRW (₩)", symbol: "₩" },
  { value: "CHF", label: "CHF", symbol: "Fr." },
  { value: "CAD", label: "CAD ($)", symbol: "C$" },
  { value: "AUD", label: "AUD ($)", symbol: "A$" },
  { value: "MXN", label: "MXN ($)", symbol: "MX$" },
  { value: "BRL", label: "BRL (R$)", symbol: "R$" },
  { value: "INR", label: "INR (₹)", symbol: "₹" },
] as const;
