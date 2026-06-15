const express = require("express");

const router = express.Router();

const {
  protect,
  vendorOnly,
} = require("../middleware/authMiddleware");

router.get("/", protect, (req, res) => {
  res.json({
    message: "Protected Route Accessed",
    user: req.user,
  });
});

router.get(
  "/vendor",
  protect,
  vendorOnly,
  (req, res) => {
    res.json({
      message: "Vendor Route Accessed",
    });
  }
);

module.exports = router;