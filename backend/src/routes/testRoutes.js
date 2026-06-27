const express = require("express");

const router = express.Router();

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

router.get("/", protect, (req, res) => {
  res.json({
    message: "Protected Route Accessed",
    user: req.user,
  });
});

router.get(
  "/admin",
  protect,
  adminOnly,
  (req, res) => {
    res.json({
      message: "Admin Route Accessed",
    });
  }
);

module.exports = router;