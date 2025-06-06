const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getAllCategories,
  updateProduct,
  deleteProduct,
  addToWishlist,
  getCottonShirtProducts,
  getCottonSareeProducts,
  getTrendingProducts,
  getNewArrivals,
  getBestSellers,
  getOnSaleProducts,
  addRecentlyViewed,
  getRecentlyViewed,
  uploadBanners,
  getAllBanners,
  deleteBanner
} = require('../controllers/productController');

router.post('/create-product', createProduct);
router.get('/getproducts', getAllProducts);
router.get('/singleproduct/:id', getProductById);
router.get('/category/:category', getProductsByCategory);
router.get('/categories', getAllCategories);
router.put('/updateproducts/:id', updateProduct);
router.delete('/deleteproducts/:id', deleteProduct);
router.post("/wishlist/:userId", addToWishlist);
router.get('/cotton-shirt', getCottonShirtProducts);
router.get('/cotton-saree', getCottonSareeProducts);
// Get trending products
router.get('/trending', getTrendingProducts);

// Get new arrivals
router.get('/new-arrivals', getNewArrivals);

// Get best sellers
router.get('/best-sellers', getBestSellers);

// Get products on sale
router.get('/on-sale', getOnSaleProducts);

router.post('/recently-viewed/:userId', addRecentlyViewed);
router.get('/recently-viewed/:userId', getRecentlyViewed);
router.post('/uploadbanners', uploadBanners);
router.get('/getbanners', getAllBanners);

router.delete('/deletebanner/:id', deleteBanner);


module.exports = router;
