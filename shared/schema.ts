import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Stories table
export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default("Untitled Story"),
  content: text("content").notNull().default(""),
  userId: integer("user_id").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  wordCount: integer("word_count").notNull().default(0),
});

// Story Ideas table
export const ideas = pgTable("ideas", {
  id: serial("id").primaryKey(),
  storyId: integer("story_id").notNull(),
  category: text("category").notNull(), // "Characters", "Locations", "Key Elements", etc.
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Generated Content table
export const contentGenerations = pgTable("content_generations", {
  id: serial("id").primaryKey(),
  storyId: integer("story_id").notNull(),
  prompt: text("prompt").notNull(),
  generatedContent: text("generated_content").notNull(),
  usedIdeas: jsonb("used_ideas").notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Schemas for inserts
export const insertStorySchema = createInsertSchema(stories)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertIdeaSchema = createInsertSchema(ideas)
  .omit({ id: true, createdAt: true });

export const insertContentGenerationSchema = createInsertSchema(contentGenerations)
  .omit({ id: true, createdAt: true });

// Types for client usage
export type Story = typeof stories.$inferSelect;
export type InsertStory = z.infer<typeof insertStorySchema>;

export type Idea = typeof ideas.$inferSelect;
export type InsertIdea = z.infer<typeof insertIdeaSchema>;

export type ContentGeneration = typeof contentGenerations.$inferSelect;
export type InsertContentGeneration = z.infer<typeof insertContentGenerationSchema>;
