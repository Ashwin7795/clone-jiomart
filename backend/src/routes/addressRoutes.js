const express = require("express");

const router = express.Router();

const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/addressController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addAddress);

router.get("/", protect, getAddresses);

router.put("/:id", protect, updateAddress);

router.delete("/:id", protect, deleteAddress);

router.put("/default/:id", protect, setDefaultAddress);

module.exports = router;