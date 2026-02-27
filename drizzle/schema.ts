import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Testimonials table
export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  content: text("content").notNull(),
  rating: int("rating").default(5),
  approved: int("approved").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

// Camino Francés stages
export const stages = mysqlTable("stages", {
  id: int("id").autoincrement().primaryKey(),
  stageNumber: int("stageNumber").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  startPoint: varchar("startPoint", { length: 255 }).notNull(),
  endPoint: varchar("endPoint", { length: 255 }).notNull(),
  distanceKm: int("distanceKm").notNull(),
  difficulty: mysqlEnum("difficulty", ["1", "2", "3", "4", "5"]).notNull(),
  elevation: int("elevation"),
  description: text("description"),
});

export type Stage = typeof stages.$inferSelect;
export type InsertStage = typeof stages.$inferInsert;

// Accommodations table
export const accommodations = mysqlTable("accommodations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  stage: varchar("stage", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["albergue", "hostal", "hotel", "casa_rural"]).notNull(),
  pricePerNight: int("pricePerNight"),
  services: text("services"),
  description: text("description"),
  phone: varchar("phone", { length: 20 }),
  website: varchar("website", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Accommodation = typeof accommodations.$inferSelect;
export type InsertAccommodation = typeof accommodations.$inferInsert;

// Blog articles table
export const blogArticles = mysqlTable("blogArticles", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  stage: varchar("stage", { length: 255 }),
  accommodationIds: text("accommodationIds"),
  published: int("published").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogArticle = typeof blogArticles.$inferSelect;
export type InsertBlogArticle = typeof blogArticles.$inferInsert;

// User consultations/inquiries table
export const userConsultations = mysqlTable("userConsultations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  serviceType: mysqlEnum("serviceType", [
    "orientation",
    "stage_planning",
    "accommodation_search",
    "complete_management",
  ]).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "responded"]).default("new"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserConsultation = typeof userConsultations.$inferSelect;
export type InsertUserConsultation = typeof userConsultations.$inferInsert;
