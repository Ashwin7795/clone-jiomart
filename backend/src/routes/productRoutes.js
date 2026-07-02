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
  getRelatedProducts,
} = require("../controllers/productController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

router.get("/", getProducts);

router.post(
  "/",
  protect,
  adminOnly,
  createProduct
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateProduct
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

router.get("/category/:category", getProductsByCategory);

router.get("/subcategory/:subcategory", getProductsBySubcategory);

router.get("/:id/related", getRelatedProducts);

router.get("/:id", getProductById);


module.exports = router;