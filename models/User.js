const mongoose = require("mongoose");
const addressSchema = require("./Address");
const profileSchema = require('./Profile');

const userSchema = new mongoose.Schema({
  username: String,
  mobileNumber: {
    type: Number,
    required: true,
    match: /^[0-9]{10}$/, // Enforces 10-digit numbers
    unique: true
  },
  profile: profileSchema,

  // Instead of embedding products directly, you can reference the Cart model
  myCart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart"  // Reference to the Cart model, which will hold products and their details
  }],

  profileImage: {
  type: String, // This will store the filename or image URL
  default: '',  // Or a default avatar if you want
},

statusHistory: [
  {
    status: { type: String },
    updatedAt: { type: Date, default: Date.now }
  }
],

  // User summary fields that can be updated based on cart calculations
  totalItems: {
    type: Number,
    default: 0,
  },
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

  // Wishlist
  myWishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ],

  // Orders (previously placed)
  myOrders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    }
  ],
  recentlyViewed: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  isAdmin: {
    type: Boolean,
    default: false,
  },

  // Addresses array
  addresses: [addressSchema]  // Assuming Address schema is defined separately
});

module.exports = mongoose.model("User", userSchema);
