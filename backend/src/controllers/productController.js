const Product = require("../models/Product");

const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      sort,
      page=1,
      limit=10,
    } = req.query;

    let filter = {};

    // Search by title
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by brand
    if (brand) {
      filter.brand = brand;
    }
    const pageNumber = Number(page);
const limitNumber = Number(limit);

const skip = (pageNumber - 1) * limitNumber;
    let query = Product.find(filter);

    // Sorting
    if (sort === "priceAsc") {
      query = query.sort({ price: 1 });
    }

    if (sort === "priceDesc") {
      query = query.sort({ price: -1 });
    }

    if (sort === "rating") {
      query = query.sort({ rating: -1 });
    }

// Apply pagination only when searching/filtering/sorting
if (search || category || brand || sort) {

  const totalProducts = await Product.countDocuments(filter);

  const products = await query
    .skip(skip)
    .limit(limitNumber);

  return res.status(200).json({
    products,
    currentPage: pageNumber,
    totalPages: Math.ceil(totalProducts / limitNumber),
    totalProducts,
  });

}

// Homepage → return all products
const products = await query;

res.status(200).json({
  products,
  currentPage: 1,
  totalPages: 1,
  totalProducts: products.length,
});
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.category,
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProductsBySubcategory = async (req, res) => {
  try {
    const products = await Product.find({
      subcategory: req.params.subcategory,
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      adminId: req.user.id,
    });

    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after"}
    );

    res.status(200).json(updatedProduct);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

  await product.deleteOne();

    res.status(200).json({
      message: "Product deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductsByCategory,
  getProductsBySubcategory,
  createProduct,
  updateProduct,
  deleteProduct,
};

