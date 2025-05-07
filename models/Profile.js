const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    gender: String,
    email: String,
    mobile: Number,
    profileImage: String,  // This will store the image URL
});

module.exports = profileSchema;
