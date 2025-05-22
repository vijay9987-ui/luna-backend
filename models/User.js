const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const addressSchema = require("./Address");
const profileSchema = require("./Profile");

const userSchema = new mongoose.Schema({
  fullName: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobileNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profile: profileSchema,

  myCart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart"
  }],

  profileImage: {
    type: String,
    default: ''
  },

  statusHistory: [{
    status: String,
    updatedAt: { type: Date, default: Date.now }
  }],

  totalItems: { type: Number, default: 0 },
  subTotal: { type: Number, default: 0 },
  cartTotal: { type: Number, default: 0 },
  deliveryCharge: { type: Number, default: 0 },
  finalAmount: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },

  myWishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }],

  myOrders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  }],

  recentlyViewed: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }],

  isAdmin: {
    type: Boolean,
    default: false
  },

  addresses: [addressSchema]
});

// Password hashing before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
