const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Address = require("../models/Address");

const createRazorpayOrder = async (req, res) => {
  try {
   const cart = await Cart.findOne({
  userId: req.user.id,
}).populate("items.productId");

if (!cart || cart.items.length === 0) {
  return res.status(400).json({
    message: "Cart is empty",
  });
}

const totalAmount = cart.items.reduce(
  (total, item) =>
    total + item.productId.price * item.quantity,
  0
);

const options = {
  amount: totalAmount * 100,
  currency: "INR",
  receipt: `receipt_${Date.now()}`,
};

    const order = await razorpay.orders.create(options);

    res.status(200).json(order);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create Razorpay order",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
const {
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  addressId,
} = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message: "Missing payment details",
      });
    }

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }


const savedAddress = await Address.findOne({
  _id: addressId,
  userId: req.user.id,
});

if (!savedAddress) {
  return res.status(404).json({
    message: "Address not found",
  });
}
const cart = await Cart.findOne({
  userId: req.user.id,
}).populate("items.productId");

if (!cart || cart.items.length === 0) {
  return res.status(400).json({
    message: "Cart is empty",
  });
}

const products = cart.items.map((item) => ({
  productId: item.productId._id,
  quantity: item.quantity,
  price: item.productId.price,
}));

const totalAmount = products.reduce(
  (total, item) => total + item.price * item.quantity,
  0
);

const existingOrder = await Order.findOne({
  "payment.paymentId": razorpay_payment_id,
});

if (existingOrder) {
  return res.status(200).json({
    success: true,
    order: existingOrder,
  });
}


const order = await Order.create({
  userId: req.user.id,
  products,
  totalAmount,

  shippingAddress: {
    fullName: savedAddress.fullName,
    phone: savedAddress.phone,
    address: savedAddress.address,
    city: savedAddress.city,
    state: savedAddress.state,
    pincode: savedAddress.pincode,
  },

  payment: {
    method: "Razorpay",
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    signature: razorpay_signature,
    status: "Paid",
  },
});


for (const item of cart.items) {
  await Product.findByIdAndUpdate(
    item.productId._id,
    {
      $inc: {
        stock: -item.quantity,
      },
    }
  );
}

cart.items = [];
await cart.save();

res.status(200).json({
  success: true,
  order,
});


  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};





module.exports = {
  createRazorpayOrder,
  verifyPayment,
};