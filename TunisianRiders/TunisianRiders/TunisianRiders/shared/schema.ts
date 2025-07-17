import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, index, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const motorcycles = pgTable("motorcycles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  engineSize: text("engine_size").notNull(),
  horsepower: text("horsepower").notNull(),
  type: text("type").notNull(), // electric, gasoline, hybrid
  category: text("category").notNull(), // naked, sport, adventure, classic, etc
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  available: boolean("available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull(), // maintenance, review, travel, news
  imageUrl: text("image_url").notNull(),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMotorcycleSchema = createInsertSchema(motorcycles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMotorcycle = z.infer<typeof insertMotorcycleSchema>;
export type Motorcycle = typeof motorcycles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  provider: text("provider").notNull(), // 'google', 'facebook', 'email'
  providerId: text("provider_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userSchema = createSelectSchema(users);
export type User = z.infer<typeof userSchema>;
export const insertUserSchema = createInsertSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  motorcycleId: integer("motorcycle_id").references(() => motorcycles.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reviewSchema = createSelectSchema(reviews);
export type Review = z.infer<typeof reviewSchema>;
export const insertReviewSchema = createInsertSchema(reviews);
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Favorites table
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  motorcycleId: integer("motorcycle_id").references(() => motorcycles.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const favoriteSchema = createSelectSchema(favorites);
export type Favorite = z.infer<typeof favoriteSchema>;
export const insertFavoriteSchema = createInsertSchema(favorites);
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;