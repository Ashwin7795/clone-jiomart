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

const seedData = async () => {
  try {
    await connectDB();

    // 1. Wipe the old corrupted database entries
    await User.deleteMany();
    await Product.deleteMany();

    const vendor = await User.create({
      name: "Demo Vendor",
      email: "vendor@jiomart.com",
      password: "123456",
      role: "vendor",
    });

    console.log("Vendor Created. Fetching real products...");

    // 2. Fetch 190+ real products with guaranteed working image URLs
    const response = await fetch("https://dummyjson.com/products?limit=194");
    const data = await response.json();

    // 3. Map the external data perfectly into your Mongoose Schema
    const productsToInsert = data.products.map((item) => {
      const mappedCategory = mapToSchemaCategory(item.category);
      
      return {
        vendorId: vendor._id,
        title: item.title,
        // DYNAMICALLY EXTENDED DESCRIPTION LINE
        description: expandDescription(item.description, mappedCategory),
        category: mappedCategory,
        subcategory: item.category, // Keeps the specific tag (e.g., 'smartphones')
        brand: item.brand || "Authentic",
        price: Math.round(item.price * 80), // Converts USD to INR roughly
        stock: item.stock || 50,
        images: item.images && item.images.length > 0 ? item.images : [item.thumbnail],
        rating: item.rating || 4.0,
      };
    });

    // 4. Inject into MongoDB
    await Product.insertMany(productsToInsert);

    console.log(`SUCCESS: ${productsToInsert.length} Perfect Products Inserted!`);
    process.exit();

  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedData();