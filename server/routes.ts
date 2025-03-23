import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertStorySchema, insertIdeaSchema, insertContentGenerationSchema } from "@shared/schema";
import { generateStoryContent } from "./lib/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Stories Routes
  app.get("/api/stories", async (req: Request, res: Response) => {
    try {
      const stories = await storage.getStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stories", error: (error as Error).message });
    }
  });

  app.get("/api/stories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid story ID" });
      }

      const story = await storage.getStory(id);
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }

      res.json(story);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch story", error: (error as Error).message });
    }
  });

  app.post("/api/stories", async (req: Request, res: Response) => {
    try {
      const validatedData = insertStorySchema.parse(req.body);
      const story = await storage.createStory(validatedData);
      res.status(201).json(story);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid story data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create story", error: (error as Error).message });
    }
  });

  app.put("/api/stories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid story ID" });
      }

      const validatedData = insertStorySchema.partial().parse(req.body);
      const story = await storage.updateStory(id, validatedData);
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }

      res.json(story);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid story data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update story", error: (error as Error).message });
    }
  });

  app.delete("/api/stories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid story ID" });
      }

      const success = await storage.deleteStory(id);
      if (!success) {
        return res.status(404).json({ message: "Story not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete story", error: (error as Error).message });
    }
  });

  // Ideas Routes
  app.get("/api/stories/:storyId/ideas", async (req: Request, res: Response) => {
    try {
      const storyId = parseInt(req.params.storyId);
      if (isNaN(storyId)) {
        return res.status(400).json({ message: "Invalid story ID" });
      }

      const ideas = await storage.getIdeasByStory(storyId);
      res.json(ideas);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ideas", error: (error as Error).message });
    }
  });

  app.post("/api/ideas", async (req: Request, res: Response) => {
    try {
      const validatedData = insertIdeaSchema.parse(req.body);
      const idea = await storage.createIdea(validatedData);
      res.status(201).json(idea);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid idea data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create idea", error: (error as Error).message });
    }
  });

  app.put("/api/ideas/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid idea ID" });
      }

      const validatedData = insertIdeaSchema.partial().parse(req.body);
      const idea = await storage.updateIdea(id, validatedData);
      if (!idea) {
        return res.status(404).json({ message: "Idea not found" });
      }

      res.json(idea);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid idea data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update idea", error: (error as Error).message });
    }
  });

  app.delete("/api/ideas/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid idea ID" });
      }

      const success = await storage.deleteIdea(id);
      if (!success) {
        return res.status(404).json({ message: "Idea not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete idea", error: (error as Error).message });
    }
  });

  // Content Generation Routes
  app.post("/api/stories/:storyId/generate", async (req: Request, res: Response) => {
    try {
      const storyId = parseInt(req.params.storyId);
      if (isNaN(storyId)) {
        return res.status(400).json({ message: "Invalid story ID" });
      }

      const { prompt, useIdeas, style } = req.body;
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      // Get active ideas if useIdeas is true
      let activeIdeas = [];
      if (useIdeas) {
        const allIdeas = await storage.getIdeasByStory(storyId);
        activeIdeas = allIdeas.filter(idea => idea.isActive);
      }

      // Generate content using OpenAI
      const generatedContent = await generateStoryContent(prompt, activeIdeas, style);

      // Save the generated content
      const contentGeneration = await storage.createContentGeneration({
        storyId,
        prompt,
        generatedContent,
        usedIdeas: activeIdeas
      });

      res.json({ 
        generatedContent,
        id: contentGeneration.id 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate content", error: (error as Error).message });
    }
  });

  app.get("/api/stories/:storyId/generations", async (req: Request, res: Response) => {
    try {
      const storyId = parseInt(req.params.storyId);
      if (isNaN(storyId)) {
        return res.status(400).json({ message: "Invalid story ID" });
      }

      const generations = await storage.getContentGenerationsByStory(storyId);
      res.json(generations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch generations", error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
