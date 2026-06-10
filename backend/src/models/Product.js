const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

   category: {
  type: String,
  enum: [
    "Fruits & Vegetables",
    "Dairy & Bakery",
    "Snacks & Beverages",
    "Grocery & Staples",
    "Personal Care",
    "Home & Kitchen",
    "Electronics",
  ],
  required: true,
},
    brand: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    images: [
      {
        type: String,
      },
    ],

    rating: {
  type: Number,
  min: 0,
  max: 5,
  default: 0,
},

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);