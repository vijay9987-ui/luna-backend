const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addToWishlist,
  getCottonShirtProducts,
  getCottonSareeProducts
} = require('../controllers/productController');

router.post('/create-product', createProduct);
router.get('/getproducts', getAllProducts);
router.get('/singleproduct/:id', getProductById);
router.put('/updateproducts/:id', updateProduct);
router.delete('/deleteproducts/:id', deleteProduct);
router.post("/wishlist/:userId", addToWishlist);
router.get('/cotton-shirt', getCottonShirtProducts);
router.get('/cotton-saree', getCottonSareeProducts);




module.exports = router;
