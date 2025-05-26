const express = require("express");
const router = express.Router();
const {
    loginUser,
    registerUser,
    getUserById,
    updateUser,
    getAllUsers,
    deleteUser,
    profileUser,
    updateProfileUser,
    createProfileData,
    getWishlist,
    removeFromWishlist,
    addToCart,
    getCart,
    getCartCount,
    removeFromCart,
    createAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
    placeOrder,
    getMyOrders,
    getAllOrders,
    uploadProfileImage,
    updateProfileImage,
    updateOrderStatus,
    updatePaymentStatus,
    getOrderStatusHistory,
    getTotalRevenue,
    getProfileImage,
    cancelOrder
} = require("../controllers/userController");
const upload = require('../middleware/upload.js')

router.post("/login", loginUser);
router.post("/register", registerUser);
// Updated routes to use userId instead of mobileNumber
router.get("/getuser/:userId", getUserById);
router.put("/setuser/:userId", updateUser);
router.get('/users', getAllUsers);
router.delete('/delete/:userId', deleteUser);
router.post("/user/profiledata/:userId", profileUser);
router.post("/user/createprofiledata/:userId", createProfileData);
router.put("/updateuser/:userId", updateProfileUser);
router.get("/wishlist/:userId", getWishlist);
router.delete("/wishlist/:userId/:productId", removeFromWishlist)
router.post("/addtocart/:userId", addToCart);
router.get("/getcart/:userId", getCart);
router.get("/getcartcount/:userId", getCartCount);
router.delete("/removefromcart/:userId/:productId", removeFromCart);
router.post("/create-address/:userId", createAddress);
router.get("/getaddress/:userId", getAddresses);
router.put("/update-address/:userId/:addressId", updateAddress);
router.delete("/remove-address/:userId/:addressId", deleteAddress);
router.post("/create-order/:userId", placeOrder);
router.put("/updateorderstatus/:orderId", updateOrderStatus);
router.put("/updatepaymentstatus/:orderId", updatePaymentStatus);
router.get('/trackstatus/:userId/:orderId', getOrderStatusHistory);
router.get("/myorders/:userId", getMyOrders);
router.get('/revenue', getTotalRevenue);
router.get("/allorders", getAllOrders);
router.post('/uploadprofile/:userId',upload.single('profileImage'), uploadProfileImage);
router.put('/updateprofile/:userId', upload.single('profileImage'), updateProfileImage);
router.get('/profile/:userId', getProfileImage);
router.post('/cancelorder/:userId/:orderId', cancelOrder);


module.exports = router;
