const mongoose = require("mongoose");

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
      color: String,
      size: String,
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
    enum: ['COD', 'Online', 'UPI'],
    default: 'COD',
  },
  totalAmount: Number,
  orderStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancel request', 'Cancelled'],
    default: 'Pending',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  deliveryCharge: {
    type: Number,
    default: 0,
  },
  statusHistory: [
    {
      status: {
        type: String,
        required: true,
        enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancel request', 'Cancelled'],
      },
      updatedAt: {
        type: Date,
        default: () => new Date(),
      },
    }
  ],
  cancellationReason: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to sync orderStatus with latest statusHistory entry
OrderSchema.pre('save', function (next) {
  if (this.statusHistory && this.statusHistory.length > 0) {
    const latestStatus = this.statusHistory[this.statusHistory.length - 1].status;
    this.orderStatus = latestStatus;
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
