const express = require("express");

const router = express.Router();

const {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

router.post("/add", protect, addToCart);

router.get("/", protect, getCart);

router.delete("/remove", protect, removeFromCart);

router.put("/update", protect, updateCartQuantity);

module.exports = router;