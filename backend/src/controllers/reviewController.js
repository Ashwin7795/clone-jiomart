const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");

const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Check if user purchased the product
    const hasPurchased = await Order.findOne({
      userId: req.user.id,
      "products.productId": productId,
      status: "Delivered",
    });

    if (!hasPurchased) {
      return res.status(403).json({
        message: "Only customers who purchased this product can review it.",
      });
    }

    // Prevent duplicate review
    const existingReview = await Review.findOne({
      userId: req.user.id,
      productId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this product.",
      });
    }

    // Create review
    const review = await Review.create({
      productId,
      userId: req.user.id,
      rating,
      comment,
    });

    // Update product average rating
    const reviews = await Review.find({ productId });

    const averageRating =
      reviews.reduce((sum, item) => sum + item.rating, 0) /
      reviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: averageRating.toFixed(1),
    });

    res.status(201).json(review);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId,
    }).populate("userId", "name");

    res.json(reviews);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const canReview = async (req, res) => {
  try {
    const { productId } = req.params;

    const hasPurchased = await Order.findOne({
      userId: req.user.id,
      "products.productId": productId,
      status: "Delivered",
    });

    const alreadyReviewed = await Review.findOne({
      userId: req.user.id,
      productId,
    });

    res.json({
      canReview: !!hasPurchased && !alreadyReviewed,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addReview,
  getProductReviews,
    canReview,
};