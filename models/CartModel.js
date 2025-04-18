const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // Ensure only one cart per user, but remove if allowing multiple carts
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
      price: {
        type: Number,
      },
      color: {
        type: String,
        default: null, // Color is optional now
      },
      size: {
        type: String,
        default: null, // Size is optional now
      },
    },
  ],
  subTotal: {
    type: Number,
    default: 0,
  },
  cartTotal: {
    type: Number,
    default: 0,
  },
  deliveryCharge: {
    type: Number,
    default: 0,
  },
  finalAmount: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
