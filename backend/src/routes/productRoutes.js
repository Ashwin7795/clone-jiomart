const express = require("express");

const router = express.Router();

const {
  getProducts,
  getProductById,
  getProductsByCategory,
  getProductsBySubcategory,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  protect,
  vendorOnly,
} = require("../middleware/authMiddleware");

router.get("/", getProducts);

router.post(
  "/",
  protect,
  vendorOnly,
  createProduct
);

router.put(
  "/:id",
  protect,
  vendorOnly,
  updateProduct
);

router.delete(
  "/:id",
  protect,
  vendorOnly,
  deleteProduct
);

router.get("/category/:category", getProductsByCategory);

router.get("/subcategory/:subcategory", getProductsBySubcategory);

router.get("/:id", getProductById);

module.exports = router;