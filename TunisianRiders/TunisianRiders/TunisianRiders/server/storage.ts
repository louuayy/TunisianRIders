import {
  motorcycles,
  articles,
  users,
  reviews,
  favorites,
  type Motorcycle,
  type Article,
  type User,
  type Review,
  type InsertMotorcycle,
  type InsertArticle,
  type InsertUser,
  type InsertReview,
  type InsertFavorite
} from "@shared/schema";
import { db } from "./db";
import { eq, like, ilike, and } from "drizzle-orm";

export interface IStorage {
  // Motorcycle operations
  getMotorcycles(): Promise<Motorcycle[]>;
  getMotorcycleById(id: number): Promise<Motorcycle | undefined>;
  getMotorcyclesByBrand(brand: string): Promise<Motorcycle[]>;
  getMotorcyclesByType(type: string): Promise<Motorcycle[]>;
  createMotorcycle(motorcycle: InsertMotorcycle): Promise<Motorcycle>;
  updateMotorcycle(id: number, motorcycle: Partial<InsertMotorcycle>): Promise<Motorcycle | undefined>;
  deleteMotorcycle(id: number): Promise<boolean>;

  // Article operations
  getArticles(): Promise<Article[]>;
  getPublishedArticles(): Promise<Article[]>;
  getArticleById(id: number): Promise<Article | undefined>;
  getArticlesByCategory(category: string): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;

  // Search operations
  searchMotorcycles(query: string): Promise<Motorcycle[]>;
  searchArticles(query: string): Promise<Article[]>;

  // User operations
  getUserById(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;

  // Review operations
  getReviewsByMotorcycleId(motorcycleId: number): Promise<Review[]>;
  getReviewsByUserId(userId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, review: Partial<InsertReview>): Promise<Review | undefined>;
  deleteReview(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private motorcycles: Map<number, Motorcycle>;
  private articles: Map<number, Article>;
  private currentMotorcycleId: number;
  private currentArticleId: number;

  constructor() {
    this.motorcycles = new Map();
    this.articles = new Map();
    this.currentMotorcycleId = 1;
    this.currentArticleId = 1;

    // Initialize with some real motorcycle data for Tunisia market
    this.initializeData();
  }

  private async initializeData() {
    // Real motorcycles available in Tunisia - with better images and more models
    const initialMotorcycles: InsertMotorcycle[] = [
      {
        name: "Honda CB650R",
        brand: "Honda",
        model: "CB650R",
        year: 2024,
        engineSize: "649cc",
        horsepower: "95 HP",
        type: "gasoline",
        category: "naked",
        description: "A neo-sports café racer with a 649cc inline-four engine, perfect for Tunisian roads with excellent build quality and reliability.",
        imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        available: true,
      },
      {
        name: "Honda CBR600RR",
        brand: "Honda",
        model: "CBR600RR",
        year: 2024,
        engineSize: "599cc",
        horsepower: "118 HP",
        type: "gasoline",
        category: "sport",
        description: "A high-performance supersport motorcycle with race-inspired technology and aggressive aerodynamics.",
        imageUrl: "https://images.unsplash.com/photo-1599819177302-fb9cb297161b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        available: true,
      },
      {
        name: "Honda CRF1100L Africa Twin",
        brand: "Honda",
        model: "CRF1100L Africa Twin",
        year: 2024,
        engineSize: "1084cc",
        horsepower: "102 HP",
        type: "gasoline",
        category: "adventure",
        description: "The legendary adventure bike built for exploring Africa and beyond, with advanced electronics and robust construction.",
        imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        available: true,
      },
      {
        name: "BMW R 1250 GS",
        brand: "BMW",
        model: "R 1250 GS",
        year: 2024,
        engineSize: "1254cc",
        horsepower: "136 HP",
        type: "gasoline",
        category: "adventure",
        description: "The ultimate adventure touring motorcycle with boxer engine technology, ideal for exploring Tunisia's diverse landscapes.",
        imageUrl: "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        available: true,
      },
      {
        name: "BMW S1000RR",
        brand: "BMW",
        model: "S1000RR",
        year: 2024,
        engineSize: "999cc",
        horsepower: "210 HP",
        type: "gasoline",
        category: "sport",
        description: "A track-focused superbike with race-derived technology and extreme performance capabilities.",
        imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        available: true,
      },
      {
        name: "BMW F850GS",
        brand: "BMW",
        model: "F850GS",
        year: 2024,
        engineSize: "853cc",
        horsepower: "95 HP",
        type: "gasoline",
        category: "adventure",
        description: "A mid-weight adventure bike perfect for both on-road touring and off-road exploration.",
        imageUrl: "https://images.unsplash.com/photo-1609771860227-f1cbc0c3b8c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        available: true,
      },
      {
        name: "KTM 390 Duke",
        brand: "KTM",
        model: "390 Duke",
        year: 2024,
        engineSize: "373cc",
        horsepower: "44 HP",
        type: "gasoline",
        category: "naked",
        description: "A lightweight naked bike with aggressive styling and excellent performance, perfect for city riding and weekend adventures.",
        imageUrl: "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        available: true,
      },
      {
        name: "KTM 890 Duke R",
        brand: "KTM",
        model: "890 Duke R",
        year: 2024,
        engineSize: "889cc",
        horsepower: "121 HP",
        type: "gasoline",
        category: "naked",
        description: "The sharp-edged track weapon with premium components and track-focused setup for serious riders.",
        imageUrl: "https://images.unsplash.com/photo-1580310614729-c55b4d71b77d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        available: true,
      },
      {
        name: "KTM 1290 Super Adventure S",
        brand: "KTM",
        model: "1290 Super Adventure S",
        year: 2024,
        engineSize: "1301cc",
        horsepower: "160 HP",
        type: "gasoline",
        category: "adventure",
        description: "The most powerful adventure bike from KTM with advanced electronics and extreme performance.",
        imageUrl: "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        available: true,
      },
      {
        name: "Yamaha MT-07",
        brand: "Yamaha",
        model: "MT-07",
        year: 2024,
        engineSize: "689cc",
        horsepower: "74 HP",
        type: "gasoline",
        category: "naked",
        description: "A versatile naked bike with a crossplane twin engine, offering excellent balance of performance and comfort for every rider.",
        imageUrl: "https://images.unsplash.com/photo-1609878656663-0b223bba4df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        available: true,
      },
      {
        name: "Yamaha MT-09",
        brand: "Yamaha",
        model: "MT-09",
        year: 2024,
        engineSize: "889cc",
        horsepower: "119 HP",
        type: "gasoline",
        category: "naked",
        description: "The Dark Side of Japan with a triple-cylinder engine that delivers thrilling performance and character.",
        imageUrl: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        available: true,
      },
      {
        name: "Yamaha YZF-R6",
        brand: "Yamaha",
        model: "YZF-R6",
        year: 2024,
        engineSize: "599cc",
        horsepower: "117 HP",
        type: "gasoline",
        category: "sport",
        description: "A pure supersport motorcycle with race-bred technology and uncompromising performance.",
        imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        available: true,
      },
      {
        name: "Yamaha Ténéré 700",
        brand: "Yamaha",
        model: "Ténéré 700",
        year: 2024,
        engineSize: "689cc",
        horsepower: "73 HP",
        type: "gasoline",
        category: "adventure",
        description: "A rally-inspired adventure bike designed for serious off-road exploration with lightweight construction.",
        imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        available: true,
      },
      {
        name: "Mash Seventy Five",
        brand: "Mash",
        model: "Seventy Five",
        year: 2024,
        engineSize: "125cc",
        horsepower: "11 HP",
        type: "gasoline",
        category: "classic",
        description: "A retro-styled motorcycle combining vintage aesthetics with modern reliability, perfect for urban commuting.",
        imageUrl: "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        available: true,
      },
      {
        name: "Mash Black Seven",
        brand: "Mash",
        model: "Black Seven",
        year: 2024,
        engineSize: "125cc",
        horsepower: "11 HP",
        type: "gasoline",
        category: "classic",
        description: "A stylish retro motorcycle with modern features and reliable performance for daily commuting.",
        imageUrl: "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        available: true,
      },
      {
        name: "Orcal Astor",
        brand: "Orcal",
        model: "Astor",
        year: 2024,
        engineSize: "Electric",
        horsepower: "15 kW",
        type: "electric",
        category: "electric",
        description: "An innovative electric motorcycle with cutting-edge technology and zero emissions, representing the future of mobility.",
        imageUrl: "https://images.unsplash.com/photo-1580310614729-c55b4d71b77d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        available: true,
      },
      {
        name: "Orcal eX100",
        brand: "Orcal",
        model: "eX100",
        year: 2024,
        engineSize: "Electric",
        horsepower: "8 kW",
        type: "electric",
        category: "electric",
        description: "A compact electric motorcycle designed for urban mobility with modern styling and efficient performance.",
        imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        available: true,
      },
      {
        name: "Rieju MRT 125",
        brand: "Rieju",
        model: "MRT 125",
        year: 2024,
        engineSize: "125cc",
        horsepower: "15 HP",
        type: "gasoline",
        category: "naked",
        description: "A Spanish motorcycle offering excellent value with modern design and reliable performance for beginners.",
        imageUrl: "https://images.unsplash.com/photo-1599819177302-fb9cb297161b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        available: true,
      },
      {
        name: "Rieju Tango 250",
        brand: "Rieju",
        model: "Tango 250",
        year: 2024,
        engineSize: "250cc",
        horsepower: "25 HP",
        type: "gasoline",
        category: "adventure",
        description: "A lightweight adventure bike perfect for exploring Tunisia's varied terrain with excellent fuel economy.",
        imageUrl: "https://images.unsplash.com/photo-1609771860227-f1cbc0c3b8c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        available: true,
      },
    ];

    const initialArticles: InsertArticle[] = [
      {
        title: "Essential Motorcycle Maintenance Tips for Tunisian Climate",
        content: "Living in Tunisia means dealing with diverse weather conditions that can be challenging for motorcycle maintenance. From the Mediterranean coastal humidity to the dry Saharan winds, your motorcycle needs special care to perform optimally...",
        excerpt: "Learn how to keep your motorcycle in perfect condition despite Tunisia's challenging weather conditions...",
        author: "Ahmed Ben Ali",
        category: "maintenance",
        imageUrl: "https://images.unsplash.com/photo-1609832002830-de9dab51ebaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        published: true,
      },
      {
        title: "Electric Motorcycles: The Future of Transportation in Tunisia",
        content: "As Tunisia moves towards sustainable transportation, electric motorcycles are gaining popularity. This comprehensive review explores the benefits, challenges, and market trends of electric motorcycles in Tunisia...",
        excerpt: "A comprehensive review of electric motorcycles and their growing presence in the Tunisian market...",
        author: "Salma Cherni",
        category: "review",
        imageUrl: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        published: true,
      },
      {
        title: "Top 5 Motorcycle Routes in Tunisia You Must Experience",
        content: "Tunisia offers some of the most spectacular motorcycle routes in North Africa. From coastal roads along the Mediterranean to mountain passes in the Atlas Mountains, discover the best riding experiences...",
        excerpt: "Discover the most breathtaking motorcycle routes across Tunisia, from coastal roads to mountain passes...",
        author: "Omar Kasmi",
        category: "travel",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        published: true,
      },
    ];

    for (const motorcycle of initialMotorcycles) {
      await this.createMotorcycle(motorcycle);
    }

    for (const article of initialArticles) {
      await this.createArticle(article);
    }
  }

  async getMotorcycles(): Promise<Motorcycle[]> {
    return Array.from(this.motorcycles.values());
  }

  async getMotorcycleById(id: number): Promise<Motorcycle | undefined> {
    return this.motorcycles.get(id);
  }

  async getMotorcyclesByBrand(brand: string): Promise<Motorcycle[]> {
    return Array.from(this.motorcycles.values()).filter(m => m.brand.toLowerCase() === brand.toLowerCase());
  }

  async getMotorcyclesByType(type: string): Promise<Motorcycle[]> {
    return Array.from(this.motorcycles.values()).filter(m => m.type.toLowerCase() === type.toLowerCase());
  }

  async createMotorcycle(insertMotorcycle: InsertMotorcycle): Promise<Motorcycle> {
    const id = this.currentMotorcycleId++;
    const motorcycle: Motorcycle = { 
      ...insertMotorcycle, 
      id, 
      available: insertMotorcycle.available ?? true,
      createdAt: new Date() 
    };
    this.motorcycles.set(id, motorcycle);
    return motorcycle;
  }

  async updateMotorcycle(id: number, updates: Partial<InsertMotorcycle>): Promise<Motorcycle | undefined> {
    const existing = this.motorcycles.get(id);
    if (!existing) return undefined;

    const updated: Motorcycle = { ...existing, ...updates };
    this.motorcycles.set(id, updated);
    return updated;
  }

  async deleteMotorcycle(id: number): Promise<boolean> {
    return this.motorcycles.delete(id);
  }

  async getArticles(): Promise<Article[]> {
    return Array.from(this.articles.values());
  }

  async getPublishedArticles(): Promise<Article[]> {
    return Array.from(this.articles.values()).filter(a => a.published);
  }

  async getArticleById(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async getArticlesByCategory(category: string): Promise<Article[]> {
    return Array.from(this.articles.values()).filter(a => a.category.toLowerCase() === category.toLowerCase());
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentArticleId++;
    const now = new Date();
    const article: Article = { 
      ...insertArticle, 
      id, 
      published: insertArticle.published ?? false,
      createdAt: now,
      updatedAt: now
    };
    this.articles.set(id, article);
    return article;
  }

  async updateArticle(id: number, updates: Partial<InsertArticle>): Promise<Article | undefined> {
    const existing = this.articles.get(id);
    if (!existing) return undefined;

    const updated: Article = { 
      ...existing, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.articles.set(id, updated);
    return updated;
  }

  async deleteArticle(id: number): Promise<boolean> {
    return this.articles.delete(id);
  }

  async searchMotorcycles(query: string): Promise<Motorcycle[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.motorcycles.values()).filter(m => 
      m.name.toLowerCase().includes(searchTerm) ||
      m.brand.toLowerCase().includes(searchTerm) ||
      m.model.toLowerCase().includes(searchTerm) ||
      m.description.toLowerCase().includes(searchTerm)
    );
  }

  async searchArticles(query: string): Promise<Article[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.articles.values()).filter(a => 
      a.title.toLowerCase().includes(searchTerm) ||
      a.content.toLowerCase().includes(searchTerm) ||
      a.excerpt.toLowerCase().includes(searchTerm)
    );
  }

  // User operations (basic implementation for MemStorage)
  async getUserById(id: number): Promise<User | undefined> {
    // Mock implementation - in real app would use Map
    return undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    // Mock implementation
    return undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    // Mock implementation
    const newUser: User = { ...user, id: 1, createdAt: new Date(), updatedAt: new Date() };
    return newUser;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
    return undefined;
  }

  // Review operations (basic implementation for MemStorage)
  async getReviewsByMotorcycleId(motorcycleId: number): Promise<Review[]> {
    return [];
  }

  async getReviewsByUserId(userId: number): Promise<Review[]> {
    return [];
  }

  async createReview(review: InsertReview): Promise<Review> {
    const newReview: Review = { ...review, id: 1, createdAt: new Date(), updatedAt: new Date() };
    return newReview;
  }

  async updateReview(id: number, review: Partial<InsertReview>): Promise<Review | undefined> {
    return undefined;
  }

  async deleteReview(id: number): Promise<boolean> {
    return false;
  }
}

export class DatabaseStorage implements IStorage {
  // Motorcycle operations
  async getMotorcycles(): Promise<Motorcycle[]> {
    return await db.select().from(motorcycles);
  }

  async getMotorcycleById(id: number): Promise<Motorcycle | undefined> {
    const [motorcycle] = await db.select().from(motorcycles).where(eq(motorcycles.id, id));
    return motorcycle || undefined;
  }

  async getMotorcyclesByBrand(brand: string): Promise<Motorcycle[]> {
    return await db.select().from(motorcycles).where(ilike(motorcycles.brand, `%${brand}%`));
  }

  async getMotorcyclesByType(type: string): Promise<Motorcycle[]> {
    return await db.select().from(motorcycles).where(eq(motorcycles.type, type));
  }

  async createMotorcycle(insertMotorcycle: InsertMotorcycle): Promise<Motorcycle> {
    const [motorcycle] = await db
      .insert(motorcycles)
      .values(insertMotorcycle)
      .returning();
    return motorcycle;
  }

  async updateMotorcycle(id: number, updates: Partial<InsertMotorcycle>): Promise<Motorcycle | undefined> {
    const [motorcycle] = await db
      .update(motorcycles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(motorcycles.id, id))
      .returning();
    return motorcycle || undefined;
  }

  async deleteMotorcycle(id: number): Promise<boolean> {
    const result = await db.delete(motorcycles).where(eq(motorcycles.id, id));
    return result.rowCount > 0;
  }

  // Article operations
  async getArticles(): Promise<Article[]> {
    return await db.select().from(articles);
  }

  async getPublishedArticles(): Promise<Article[]> {
    return await db.select().from(articles).where(eq(articles.published, true));
  }

  async getArticleById(id: number): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article || undefined;
  }

  async getArticlesByCategory(category: string): Promise<Article[]> {
    return await db.select().from(articles).where(eq(articles.category, category));
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db
      .insert(articles)
      .values(insertArticle)
      .returning();
    return article;
  }

  async updateArticle(id: number, updates: Partial<InsertArticle>): Promise<Article | undefined> {
    const [article] = await db
      .update(articles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(articles.id, id))
      .returning();
    return article || undefined;
  }

  async deleteArticle(id: number): Promise<boolean> {
    const result = await db.delete(articles).where(eq(articles.id, id));
    return result.rowCount > 0;
  }

  // Search operations
  async searchMotorcycles(query: string): Promise<Motorcycle[]> {
    const searchPattern = `%${query}%`;
    return await db
      .select()
      .from(motorcycles)
      .where(
        like(motorcycles.name, searchPattern) ||
        like(motorcycles.brand, searchPattern) ||
        like(motorcycles.description, searchPattern)
      );
  }

  async searchArticles(query: string): Promise<Article[]> {
    const searchPattern = `%${query}%`;
    return await db
      .select()
      .from(articles)
      .where(
        like(articles.title, searchPattern) ||
        like(articles.content, searchPattern) ||
        like(articles.excerpt, searchPattern)
      );
  }

  // User operations
  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Review operations
  async getReviewsByMotorcycleId(motorcycleId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.motorcycleId, motorcycleId));
  }

  async getReviewsByUserId(userId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.userId, userId));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values(insertReview)
      .returning();
    return review;
  }

  async updateReview(id: number, updates: Partial<InsertReview>): Promise<Review | undefined> {
    const [review] = await db
      .update(reviews)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(reviews.id, id))
      .returning();
    return review || undefined;
  }

  async deleteReview(id: number): Promise<boolean> {
    const result = await db.delete(reviews).where(eq(reviews.id, id));
    return result.rowCount > 0;
  }

  // Favorites methods
  async addToFavorites(data: InsertFavorite) {
    try {
      const [favorite] = await db.insert(favorites).values(data).returning();
      return favorite;
    } catch (error) {
      console.error("Error adding to favorites:", error);
      throw error;
    }
  }

  async removeFromFavorites(userId: number, motorcycleId: number): Promise<boolean> {
    try {
      const result = await db.delete(favorites)
        .where(and(eq(favorites.userId, userId), eq(favorites.motorcycleId, motorcycleId)));
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error removing from favorites:", error);
      return false;
    }
  }

  async getFavoritesByUserId(userId: number) {
    try {
      return await db.select({
        id: favorites.id,
        motorcycleId: favorites.motorcycleId,
        createdAt: favorites.createdAt,
        motorcycle: motorcycles
      })
      .from(favorites)
      .leftJoin(motorcycles, eq(favorites.motorcycleId, motorcycles.id))
      .where(eq(favorites.userId, userId));
    } catch (error) {
      console.error("Error fetching user favorites:", error);
      throw error;
    }
  }

  async isFavorite(userId: number, motorcycleId: number): Promise<boolean> {
    try {
      const result = await db.select()
        .from(favorites)
        .where(and(eq(favorites.userId, userId), eq(favorites.motorcycleId, motorcycleId)))
        .limit(1);
      return result.length > 0;
    } catch (error) {
      console.error("Error checking favorite status:", error);
      return false;
    }
  }

  async getUserByEmail(email: string) {
    try {
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw error;
    }
  }

  async createUser(data: InsertUser) {
    try {
      const [user] = await db.insert(users).values(data).returning();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();