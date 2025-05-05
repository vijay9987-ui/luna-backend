const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const {
  getAllUsers,
  deleteUser,
  getAllOrders,
  getAllProducts,
} = require("../controllers/adminController");

router.use(protect, adminOnly);

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.get("/orders", getAllOrders);
router.get("/products", getAllProducts);

module.exports = router;
