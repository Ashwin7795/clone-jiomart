const Address = require("../models/Address");

const addAddress = async (req, res) => {
  try {
    const existingAddresses = await Address.countDocuments({
      userId: req.user.id,
    });

    const address = await Address.create({
      ...req.body,
      userId: req.user.id,
      isDefault: existingAddresses === 0,
    });

    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      userId: req.user.id,
    });

    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const deleteAddress = async (req, res) => {
  try {
    await Address.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    res.json({
      message: "Address deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const updateAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      req.body,
      {
        returnDocument: "after",
      }
    );

    res.json(address);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const setDefaultAddress = async (req, res) => {
  try {
    await Address.updateMany(
      {
        userId: req.user.id,
      },
      {
        isDefault: false,
      }
    );

    const address = await Address.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      {
        isDefault: true,
      },
      {
        returnDocument: "after",
      }
    );

    res.json(address);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



module.exports = {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
    
};