const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
  try {

    const [
      orders,
      totalProducts,
      totalCustomers,
      pendingOrders,
    ] = await Promise.all([

      Order.find(),

      Product.countDocuments(),

      User.countDocuments({
        role: "user",
      }),

      Order.countDocuments({
        status: "Pending",
      }),

    ]);

    const revenue = orders.reduce(
      (total, order) => total + order.totalAmount,
      0
    );

    res.json({
      revenue,
      totalOrders: orders.length,
      totalProducts,
      totalCustomers,
      pendingOrders,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const getInventory = async (req, res) => {
  try {

    const products = await Product.find()
      .sort({ createdAt: -1 });

    res.json(products);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  getDashboardStats,
  getInventory,
};