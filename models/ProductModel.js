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
  sizes: [String], // size list only
  colors: [String], // color list only
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
  default: false
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
