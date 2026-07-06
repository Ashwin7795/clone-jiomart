const express = require("express");

const router = express.Router();

const {
  addReview,
  getProductReviews,
    canReview,
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");

router.get("/can-review/:productId", protect, canReview);

router.get("/:productId", getProductReviews);

router.post("/", protect, addReview);



module.exports = router;