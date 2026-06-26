const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");


const createOrder = async (req, res) => {
  try {
    const {
  fullName,
  phone,
  address,
  city,
  state,
  pincode,
} = req.body;
    const cart = await Cart.findOne({
      userId: req.user.id,
    }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const products = cart.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    const totalAmount = products.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );

   const order = await Order.create({
  userId: req.user.id,
  products,
  totalAmount,
  shippingAddress: {
    fullName,
    phone,
    address,
    city,
    state,
    pincode,
  },
});


for (const item of cart.items) {
  await Product.findByIdAndUpdate(
    item.productId._id,
    {
      $inc: {
        stock: -item.quantity,
      },
    }
  );
}
    cart.items = [];

    await cart.save();

    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
    }).populate("products.productId");

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {

    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("products.productId");

    res.status(200).json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const updateOrderStatus = async (req, res) => {

  try {

    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(

      req.params.id,

      { status },

      { new: true }

    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

const getOrderById = async (req, res) => {
  try {
   const order = await Order.findById(req.params.id)
  .populate("products.productId")
  .populate("userId", "name email");
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(order);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};