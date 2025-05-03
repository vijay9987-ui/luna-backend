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
    default: 0, // Automatically calculated before saving
  },
  isTrending: {
    type: Boolean,
    default: false,
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
    default: 0,
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

// Auto-calculate discount before saving
ProductSchema.pre('save', function (next) {
  if (this.originalPrice && this.price < this.originalPrice) {
    const discountPercentage = Math.round(
      ((this.originalPrice - this.price) / this.originalPrice * 100)
    );
    this.discount = discountPercentage;
  } else {
    this.discount = 0; // No discount if originalPrice is missing or price >= originalPrice
  }
  next();
});

module.exports = mongoose.model('Product', ProductSchema);