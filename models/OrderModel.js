const OrderSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: Number,
        price: Number,
      },
    ],
    shippingAddress: {
      fullName: String,
      addressLine: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      phone: String,
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Online'],
      default: 'COD',
    },
    totalAmount: Number,
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancel request', 'Cancelled'],
      default: 'Pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  module.exports = mongoose.model('Order', OrderSchema);
  