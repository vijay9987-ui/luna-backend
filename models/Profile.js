const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    gender: String,
    email: String,
    mobile: Number
});

module.exports = profileSchema;
