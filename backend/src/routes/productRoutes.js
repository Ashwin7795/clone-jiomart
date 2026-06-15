const express = require("express");

const router = express.Router();

const {
  getProducts,
  getProductById,
  getProductsByCategory,
  getProductsBySubcategory,
} = require("../controllers/productController");

router.get("/", getProducts);

router.get("/category/:category", getProductsByCategory);

router.get("/subcategory/:subcategory", getProductsBySubcategory);

router.get("/:id", getProductById);
module.exports = router;