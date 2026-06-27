const Wishlist = require("../models/Wishlist");

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const existing = await Wishlist.findOne({
      userId: req.user.id,
      productId,
    });

    if (existing) {
      return res.status(400).json({
        message: "Product already in wishlist",
      });
    }

    const wishlist = await Wishlist.create({
      userId: req.user.id,
      productId,
    });

    res.status(201).json(wishlist);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({
      userId: req.user.id,
    }).populate("productId");

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({
      userId: req.user.id,
      productId: req.params.productId,
    });

    res.json({
      message: "Removed from wishlist",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};