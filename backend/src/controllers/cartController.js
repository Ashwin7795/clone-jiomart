const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
  try {

    if (req.user.role === "admin") {
      return res.status(403).json({
        message: "admin cannot add products to cart",
      });
    }

    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: "Product out of stock",
      });
    }

    let cart = await Cart.findOne({
      userId: req.user.id,
    });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
      });
    }

    await cart.save();

    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      userId: req.user.id,
    }).populate("items.productId");

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({
      userId: req.user.id,
    });

    if (req.user.role === "admin") {
  return res.status(403).json({
    message: "admin cannot modify cart",
  });
}

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        item.productId.toString() !== productId
    );

    await cart.save();

    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

if (!product) {
  return res.status(404).json({
    message: "Product not found",
  });
}

if (quantity > product.stock) {
  return res.status(400).json({
    message: `Only ${product.stock} items available`,
  });
}

    const cart = await Cart.findOne({
      userId: req.user.id,
    });


    if (req.user.role === "admin") {
  return res.status(403).json({
    message: "admin cannot modify cart",
  });
}
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found in cart",
      });
    }

    item.quantity = quantity;

    await cart.save();

    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
};