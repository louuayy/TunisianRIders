import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
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
