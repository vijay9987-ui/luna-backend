const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,

  },
  description: String,
  images: [String],
  price: {
    type: Number,

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
    
  },
  subcategoryName: {
    type: String,
    
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

ProductSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();

  const price = update.price ?? update.$set?.price;
  const originalPrice = update.originalPrice ?? update.$set?.originalPrice;

  if (price && originalPrice && price < originalPrice) {
    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
    if (update.$set) {
      update.$set.discount = discount;
    } else {
      update.discount = discount;
    }
  } else {
    if (update.$set) {
      update.$set.discount = 0;
    } else {
      update.discount = 0;
    }
  }

  next();
});


module.exports = mongoose.model('Product', ProductSchema);