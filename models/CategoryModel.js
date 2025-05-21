const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
  },
  imageUrl: {
    type: String
  },
  subcategories: [
    {
      type: String, // simple list of subcategory names
    },
  ]
});

module.exports = mongoose.model('Category', CategorySchema);
