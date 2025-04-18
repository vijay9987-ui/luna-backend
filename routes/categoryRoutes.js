const express = require('express');
const router = express.Router();

const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory} = require("../controllers/categoryController")
// POST: Create category
router.post('/create-cat', createCategory);

// GET: Get all categories
router.get('/getall-cat', getAllCategories);

// GET: Get category by ID
router.get('/get-singlecat/:id', getCategoryById);

// PUT: Update category by ID
router.put('/update-cat/:id', updateCategory);

// DELETE: Delete category by ID
router.delete('delete-cat/:id', deleteCategory);

module.exports = router;
