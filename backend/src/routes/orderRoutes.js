const express = require("express");

const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  
} = require("../controllers/orderController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);

router.get("/", protect, getOrders);

router.get(
  "/admin",
  protect,
  adminOnly,
  getAllOrders
);

router.put(
  "/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

router.get("/:id", protect, getOrderById);
module.exports = router;