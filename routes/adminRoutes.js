const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const {
    adminLogin,
    getAllUsers,
    deleteUser,
    getAllOrders,
    getAllProducts,
} = require("../controllers/adminController");

router.use(protect, adminOnly);

router.post('/admin/login', adminLogin);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.get("/orders", getAllOrders);
router.get("/products", getAllProducts);

module.exports = router;
