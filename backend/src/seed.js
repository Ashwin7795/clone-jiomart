const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const User = require("./models/User");
const Product = require("./models/Product");

dotenv.config();

// Safely maps the API's random categories into your strict Mongoose Schema enums
const mapToSchemaCategory = (apiCategory) => {
  const electronics = ["smartphones", "laptops", "tablets", "mobile-accessories"];
  const beauty = ["fragrances", "skincare", "beauty", "personal-care", "womens-makeup"];
  const home = ["home-decoration", "furniture", "lighting", "kitchen-accessories"];
  const fashion = ["tops", "womens-dresses", "womens-shoes", "mens-shirts", "mens-shoes", "mens-watches", "womens-watches", "womens-bags", "womens-jewellery", "sunglasses", "motorcycle"];

  if (electronics.includes(apiCategory)) return "Electronics";
  if (beauty.includes(apiCategory)) return "Beauty & Personal Care";
  if (home.includes(apiCategory)) return "Home & Lifestyle";
  if (fashion.includes(apiCategory)) return "Fashion";
  
  return "Groceries"; // Fallback for food/groceries
};

// Generates category-specific descriptions to cleanly fill 2-3 layout lines
const expandDescription = (base, category) => {
  switch (category) {
    case "Groceries":
      return `${base} Sourced from premium facilities to ensure top-tier quality, optimal purity, and rich freshness for your daily cooking needs. Packaged under strict hygienic standards to preserve standard weight and organic composition properties.`;
    
    case "Electronics":
      return `${base} Engineered with cutting-edge technology and premium interior nodes for ultra-responsive performance. Features a sleek design layout, durable case structures, and energy-optimized configuration metrics for high daily productivity.`;
    
    case "Beauty & Personal Care":
      return `${base} Dermatologically checked and formulated with gentle, safe extracts suitable for regular application. Designed to preserve natural moisture and skin vitality while maintaining consistent protection throughout the day.`;
    
    case "Home & Lifestyle":
    case "Furniture":
      return `${base} Crafted from highly durable, premium-grade materials designed to blend seamlessly into modern home interiors. Offers excellent structural integrity, hassle-free maintenance, and space-optimized utility for your living spaces.`;
    
    default:
      return `${base} Carefully selected and manufactured under strict quality compliance metrics to ensure exceptional reliability, long-lasting performance, and premium value for everyday consumer requirements.`;
  }
};

// High-Fidelity Authentic Multi-Image Indian E-Commerce Products
const premiumAuthenticProducts = [
  {
    title: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
    brand: "Sony",
    category: "Electronics",
    subcategory: "mobile-accessories",
    price: 19990,
    stock: 45,
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "Apple iPhone 15 Pro (128 GB) - Natural Titanium",
    brand: "Apple",
    category: "Electronics",
    subcategory: "smartphones",
    price: 129900,
    stock: 14,
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1565630916779-e303be97b6f5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "OnePlus 12R (Cool Blue, 8GB RAM, 128GB Storage)",
    brand: "OnePlus",
    category: "Electronics",
    subcategory: "smartphones",
    price: 39999,
    stock: 28,
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
    ]
  },

  {
    title: "Nescafe Classic Instant Coffee Powder Dawn Jar",
    brand: "Nescafe",
    category: "Groceries",
    subcategory: "Beverages",
    price: 340,
    stock: 85,
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "Samsung Galaxy Watch 6 Bluetooth (44mm, Graphite)",
    brand: "Samsung",
    category: "Electronics",
    subcategory: "mobile-accessories",
    price: 29999,
    stock: 22,
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=600&q=80"
    ]
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // 1. Wipe the old database entries
    await User.deleteMany();
    await Product.deleteMany();

    const vendor = await User.create({
      name: "Demo Vendor",
      email: "vendor@jiomart.com",
      password: "123456",
      phone: "9876543210",
      role: "admin",
    });

    console.log("Vendor Created. Fetching raw products...");

    // 2. Fetch products from the public API database
    const response = await fetch("https://dummyjson.com/products?limit=194");
    const data = await response.json();

    // 3. Map the public API data safely into your Mongoose fields
    const apiProducts = data.products.map((item) => {
      const mappedCategory = mapToSchemaCategory(item.category);
      
      // Fallback fallback mechanism ensures multiple images if the item dataset contains them
      let productImages = [item.thumbnail];
      if (item.images && item.images.length > 0) {
        productImages = item.images;
      }

      return {
        vendorId: vendor._id,
        title: item.title,
        description: expandDescription(item.description, mappedCategory),
        category: mappedCategory,
        subcategory: item.category,
        brand: item.brand || "Authentic",
        price: Math.round(item.price * 80),
        stock: item.stock || 50,
        images: productImages,
        rating: item.rating || 4.0,
      };
    });

    // 4. Map the guaranteed premium products into your format
    const localPremiumProducts = premiumAuthenticProducts.map((item) => ({
      vendorId: vendor._id,
      title: item.title,
      description: expandDescription("Premium authentic release.", item.category),
      category: item.category,
      subcategory: item.subcategory,
      brand: item.brand,
      price: item.price,
      stock: item.stock,
      images: item.images,
      rating: item.rating,
    }));

    // 5. Merge both sets together (Premium items go first)
    const productsToInsert = [...localPremiumProducts, ...apiProducts];

    // 6. Inject final combined set into MongoDB
    await Product.insertMany(productsToInsert);

    console.log(`SUCCESS: ${productsToInsert.length} Perfect Products Inserted! (Including authentic multi-image items)`);
    process.exit();

  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedData();