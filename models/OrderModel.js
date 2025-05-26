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
    deliveryCharge: {  // ✅ New field added here
    type: Number,
    default: 0,   // Default delivery charge can be 0, or whatever you need
  },
   statusHistory: [
    {
      status: {
        type: String,
        required: true
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  module.exports = mongoose.model('Order', OrderSchema);
  