const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
  getInventory,
} = require("../controllers/adminController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

router.get("/dashboard", protect, adminOnly,getDashboardStats);

router.get("/inventory", protect, adminOnly,getInventory);

module.exports = router;
