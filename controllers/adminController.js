const User = require("../models/User");
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");


// In your backend routes (adminRoutes.js)
const adminLogin = async (req, res) => {
    try {
      const { mobileNumber } = req.body;
      
      // 1. Find admin by mobile number
      const admin = await Admin.findOne({ mobileNumber });
      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // 2. Create token
      const token = jwt.sign(
        { id: admin._id }, 
        process.env.ADMIN_JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      res.json({
        token,
        isAdmin: true
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };

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
