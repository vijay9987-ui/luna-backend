const User = require("../models/User");
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate("user");
  res.json(orders);
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllOrders,
  getAllProducts,
};
