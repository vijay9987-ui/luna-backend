// models/Banner.js
const mongoose = require('mongoose');

// Define a schema where `images` is just an array of image paths (strings)
const bannerSchema = new mongoose.Schema({
  images: { 
    type: [String],  // Array of strings to store image paths
  },
  createdAt: { 
    type: Date, 
    default: Date.now // Timestamp for when the banner group was created
  }
});

module.exports = mongoose.model('Banner', bannerSchema);
