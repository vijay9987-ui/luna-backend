require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/ProductModel");

const MONGO_URI = process.env.MONGODB;

async function updateAllDiscounts() {
  try {
    await mongoose.connect(MONGO_URI);
    const products = await Product.find();

    for (const product of products) {
      if (product.originalPrice && product.price < product.originalPrice) {
        const discount = Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        );
        product.discount = discount;
      } else {
        product.discount = 0;
      }
      await product.save(); // triggers pre('save')
    }

    console.log("Discounts updated successfully for all products.");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error updating discounts:", error);
  }
}

updateAllDiscounts();
