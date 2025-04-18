const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: String,
  mobile: Number,
  email: String,
  addressline1: String,
  addressline2: String,
  landmark: String,
  city: String,
  state: String,
  country: String,
  pincode: String,
  type: { type: String, enum: ["Home", "Office", "Other"], default: "Home" },
}, { timestamps: true });

module.exports = addressSchema;
