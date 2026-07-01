const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },


  shippingAddress: {
  fullName: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
},

payment: {
  method: {
    type: String,
    enum: ["Razorpay", "COD"],
    default: "Razorpay",
  },

  paymentId: String,

  orderId: String,

  signature: String,

  status: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Paid",
  },
},

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);