import mongoose from "mongoose";
import { config } from "dotenv";

import connectDB from "./config/db";
import { deleteMany, create } from "./models/User";
import { deleteMany as _deleteMany, insertMany } from "./models/Product";

config();

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

const seedData = async () => {
  try {
    await connectDB();

    // 1. Wipe the old corrupted database entries
    await deleteMany();
    await _deleteMany();

    const vendor = await create({
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
    const productsToInsert = data.products.map((item) => ({
      vendorId: vendor._id,
      title: item.title,
      description: item.description,
      category: mapToSchemaCategory(item.category),
      subcategory: item.category, // Keeps the specific tag (e.g., 'smartphones')
      brand: item.brand || "Authentic",
      price: Math.round(item.price * 80), // Converts USD to INR roughly
      stock: item.stock || 50,
      images: item.images && item.images.length > 0 ? item.images : [item.thumbnail],
      rating: item.rating || 4.0,
    }));

    // 4. Inject into MongoDB
    await insertMany(productsToInsert);

    console.log(`SUCCESS: ${productsToInsert.length} Perfect Products Inserted!`);
    process.exit();

  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedData();