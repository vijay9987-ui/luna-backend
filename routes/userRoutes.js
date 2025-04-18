const express = require("express");
const router = express.Router();
const {
    loginUser,
    getUserById,
    updateUser,
    profileUser,
    updateProfileUser,
    createProfileData,
    getWishlist,
    removeFromWishlist,
    addToCart,
    getCart,
    removeFromCart,
    createAddress,
    getAddresses,
    updateAddress,
    deleteAddress
} = require("../controllers/userController");

router.post("/login", loginUser);

// Updated routes to use userId instead of mobileNumber
router.get("/getuser/:userId", getUserById);
router.put("/setuser/:userId", updateUser);
router.post("/user/profiledata/:userId", profileUser);
router.post("/user/createprofiledata/:userId", createProfileData);
router.put("/updateuser/:userId", updateProfileUser);
router.get("/wishlist/:userId", getWishlist);
router.delete("/wishlist/:userId/:productId", removeFromWishlist)
router.post("/addtocart/:userId", addToCart);
router.get("/getcart/:userId", getCart);
router.delete("/removefromcart/:userId/:productId", removeFromCart);
router.post("/create-address/:userId", createAddress);
router.get("/getaddress/:userId", getAddresses);
router.put("/update-address/:userId/:addressId", updateAddress);
router.delete("/remove-address/:userId/:addressId", deleteAddress);


module.exports = router;
