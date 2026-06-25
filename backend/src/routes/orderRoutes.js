const express = require("express");

const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);

router.get("/", protect, getOrders);

router.get("/:id", protect, getOrderById);

router.get("/admin/all", protect, getAllOrders);

router.put(
  "/admin/:id",
  protect,
  updateOrderStatus
);

module.exports = router;