import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMotorcycleSchema, insertArticleSchema } from "@shared/schema";
import { z } from "zod";

// Simple authentication middleware
const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.session?.isAuthenticated) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    
    // Simple demo authentication
    if (username === "admin" && password === "admin123") {
      req.session.isAuthenticated = true;
      res.json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ success: true, message: "Logout successful" });
    });
  });

  app.get("/api/auth/check", (req, res) => {
    if (req.session?.isAuthenticated) {
      res.json({ authenticated: true });
    } else {
      res.json({ authenticated: false });
    }
  });
  // Motorcycle routes
  app.get("/api/motorcycles", async (req, res) => {
    try {
      const { brand, type, search } = req.query;
      
      let motorcycles;
      if (search) {
        motorcycles = await storage.searchMotorcycles(search as string);
      } else if (brand) {
        motorcycles = await storage.getMotorcyclesByBrand(brand as string);
      } else if (type) {
        motorcycles = await storage.getMotorcyclesByType(type as string);
      } else {
        motorcycles = await storage.getMotorcycles();
      }
      
      res.json(motorcycles);
    } catch (error) {
      console.error("Error fetching motorcycles:", error);
      res.status(500).json({ message: "Failed to fetch motorcycles" });
    }
  });

  app.get("/api/motorcycles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const motorcycle = await storage.getMotorcycleById(id);
      
      if (!motorcycle) {
        return res.status(404).json({ message: "Motorcycle not found" });
      }
      
      res.json(motorcycle);
    } catch (error) {
      console.error("Error fetching motorcycle:", error);
      res.status(500).json({ message: "Failed to fetch motorcycle" });
    }
  });

  app.post("/api/motorcycles", isAuthenticated, async (req, res) => {
    try {
      const motorcycleData = insertMotorcycleSchema.parse(req.body);
      const motorcycle = await storage.createMotorcycle(motorcycleData);
      res.status(201).json(motorcycle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid motorcycle data", errors: error.errors });
      }
      console.error("Error creating motorcycle:", error);
      res.status(500).json({ message: "Failed to create motorcycle" });
    }
  });

  app.put("/api/motorcycles/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertMotorcycleSchema.partial().parse(req.body);
      const motorcycle = await storage.updateMotorcycle(id, updates);
      
      if (!motorcycle) {
        return res.status(404).json({ message: "Motorcycle not found" });
      }
      
      res.json(motorcycle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid motorcycle data", errors: error.errors });
      }
      console.error("Error updating motorcycle:", error);
      res.status(500).json({ message: "Failed to update motorcycle" });
    }
  });

  app.delete("/api/motorcycles/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMotorcycle(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Motorcycle not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting motorcycle:", error);
      res.status(500).json({ message: "Failed to delete motorcycle" });
    }
  });

  // Article routes
  app.get("/api/articles", async (req, res) => {
    try {
      const { category, published, search } = req.query;
      
      let articles;
      if (search) {
        articles = await storage.searchArticles(search as string);
      } else if (category) {
        articles = await storage.getArticlesByCategory(category as string);
      } else if (published === "true") {
        articles = await storage.getPublishedArticles();
      } else {
        articles = await storage.getArticles();
      }
      
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getArticleById(id);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post("/api/articles", isAuthenticated, async (req, res) => {
    try {
      const articleData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid article data", errors: error.errors });
      }
      console.error("Error creating article:", error);
      res.status(500).json({ message: "Failed to create article" });
    }
  });

  app.put("/api/articles/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertArticleSchema.partial().parse(req.body);
      const article = await storage.updateArticle(id, updates);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid article data", errors: error.errors });
      }
      console.error("Error updating article:", error);
      res.status(500).json({ message: "Failed to update article" });
    }
  });

  app.delete("/api/articles/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteArticle(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  // Statistics route for admin dashboard
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const motorcycles = await storage.getMotorcycles();
      const articles = await storage.getPublishedArticles();
      
      res.json({
        motorcycles: motorcycles.length,
        articles: articles.length,
        visitors: "8.2k", // Mock data for demo
        pageviews: "34.7k", // Mock data for demo
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
