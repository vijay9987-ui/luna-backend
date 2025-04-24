const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  images: [String],
  price: {
    type: Number,
    required: true,
  },
  originalPrice: Number,
  discount: {
    type: Number,
    default: 0, // e.g., 20 means 20% off
  },
  stock: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  categoryName: {
    type: String,
    required: true,
  },
  subcategoryName: {
    type: String,
    required: true,
  },
  sizes: [String],
  colors: [String],
  rating: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      type: String,
    },
  ],
  isInWishlist: {
    type: Boolean,
    default: false,
  },
  salesCount: {
    type: Number,
    default: 0, // total number of times this product was sold
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', ProductSchema);
