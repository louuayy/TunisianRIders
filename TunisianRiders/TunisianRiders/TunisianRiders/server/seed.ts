import { db } from "./db";
import { motorcycles, articles } from "@shared/schema";
import type { InsertMotorcycle, InsertArticle } from "@shared/schema";

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Check if data already exists
    const existingMotorcycles = await db.select().from(motorcycles);
    const existingArticles = await db.select().from(articles);

    if (existingMotorcycles.length > 0 && existingArticles.length > 0) {
      console.log("📊 Database already seeded, skipping...");
      return;
    }

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
        content: "Living in Tunisia means dealing with diverse weather conditions that can be challenging for motorcycle maintenance. From the Mediterranean coastal humidity to the dry Saharan winds, your motorcycle needs special care to perform optimally.\n\nRegular oil changes are crucial in Tunisia's hot climate. The high temperatures can break down engine oil faster than in cooler climates. We recommend changing your oil every 3,000 kilometers or every 3 months, whichever comes first.\n\nDust and sand are common issues in Tunisia. Make sure to clean your air filter regularly, especially if you ride in desert areas. A clogged air filter can reduce performance and increase fuel consumption.\n\nTire pressure should be checked weekly. The hot asphalt in Tunisia can cause tire pressure to fluctuate significantly. Proper tire pressure ensures better fuel economy and extends tire life.\n\nBattery maintenance is also important. The extreme heat can cause battery fluid to evaporate faster. Check your battery terminals regularly and ensure they're clean and tight.",
        excerpt: "Learn how to keep your motorcycle in perfect condition despite Tunisia's challenging weather conditions...",
        author: "Ahmed Ben Ali",
        category: "maintenance",
        imageUrl: "https://images.unsplash.com/photo-1609832002830-de9dab51ebaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        published: true,
      },
      {
        title: "Electric Motorcycles: The Future of Transportation in Tunisia",
        content: "As Tunisia moves towards sustainable transportation, electric motorcycles are gaining popularity. This comprehensive review explores the benefits, challenges, and market trends of electric motorcycles in Tunisia.\n\nElectric motorcycles offer numerous advantages for Tunisian riders. With no emissions, they help reduce air pollution in busy cities like Tunis and Sfax. The instant torque delivery provides excellent acceleration, making them perfect for city traffic.\n\nCharging infrastructure is rapidly expanding across Tunisia. Major cities now have public charging stations, and many hotels and businesses are installing charging points. Home charging is convenient and cost-effective.\n\nThe cost of ownership is significantly lower than gasoline motorcycles. With fewer moving parts, electric bikes require less maintenance. No oil changes, no air filter replacements, and regenerative braking extends brake pad life.\n\nBattery technology continues to improve. Modern electric motorcycles can achieve ranges of 100-200 kilometers on a single charge, suitable for most daily commutes and weekend rides around Tunisia.",
        excerpt: "A comprehensive review of electric motorcycles and their growing presence in the Tunisian market...",
        author: "Salma Cherni",
        category: "review",
        imageUrl: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        published: true,
      },
      {
        title: "Top 5 Motorcycle Routes in Tunisia You Must Experience",
        content: "Tunisia offers some of the most spectacular motorcycle routes in North Africa. From coastal roads along the Mediterranean to mountain passes in the Atlas Mountains, discover the best riding experiences.\n\n1. Tunis to Sidi Bou Said Coastal Route\nThis scenic 20km route offers stunning Mediterranean views. The winding coastal road provides a perfect blend of culture and natural beauty. Stop at Sidi Bou Said for its famous blue and white architecture.\n\n2. Kairouan to Sbeitla Desert Highway\nExperience the transition from civilization to desert on this 100km route. The straight desert roads are perfect for experiencing your motorcycle's top speed while enjoying endless dunes.\n\n3. Tabarka to Ain Draham Mountain Pass\nThis mountainous route through the Kroumirie Mountains offers cooler temperatures and lush forests. The twisting mountain roads challenge your riding skills while providing breathtaking views.\n\n4. Djerba Island Circuit\nA complete 150km circuit of Tunisia's largest island. Experience traditional Berber architecture, ancient olive groves, and pristine beaches. The flat terrain makes it accessible for all skill levels.\n\n5. Tozeur to Chott el Djerid Salt Lake\nRide to one of the largest salt lakes in the Sahara. This otherworldly landscape has been featured in Star Wars films and offers an unforgettable riding experience.",
        excerpt: "Discover the most breathtaking motorcycle routes across Tunisia, from coastal roads to mountain passes...",
        author: "Omar Kasmi",
        category: "travel",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        published: true,
      },
    ];

    // Insert motorcycles
    if (existingMotorcycles.length === 0) {
      console.log("🏍️  Seeding motorcycles...");
      await db.insert(motorcycles).values(initialMotorcycles);
      console.log(`✅ Inserted ${initialMotorcycles.length} motorcycles`);
    }

    // Insert articles
    if (existingArticles.length === 0) {
      console.log("📰 Seeding articles...");
      await db.insert(articles).values(initialArticles);
      console.log(`✅ Inserted ${initialArticles.length} articles`);
    }

    console.log("🎉 Database seeding completed successfully!");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}