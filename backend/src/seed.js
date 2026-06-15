const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const User = require("./models/User");
const Product = require("./models/Product");

const products = require("./data/products");

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();

    
    const vendor = await User.create({
      name: "Demo Vendor",
      email: "vendor@jiomart.com",
      password: "123456",
      role: "vendor",
    });

    console.log("Vendor Created");

    // Add vendorId to all products
    const productsWithVendor = products.map((product) => ({
      ...product,
      vendorId: vendor._id,
    }));

    // Insert all products
    await Product.insertMany(productsWithVendor);

    console.log(`${products.length} Products Inserted`);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();