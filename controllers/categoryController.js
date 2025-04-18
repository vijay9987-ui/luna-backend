const Category = require('../models/CategoryModel');

// ➕ Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { categoryName, subcategories } = req.body;

    if (!categoryName || !Array.isArray(subcategories)) {
      return res.status(400).json({ message: "categoryName and subcategories are required." });
    }

    const newCategory = new Category({ categoryName, subcategories });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📥 Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📥 Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update category
exports.updateCategory = async (req, res) => {
  try {
    const { categoryName, subcategories } = req.body;

    if (!categoryName || !Array.isArray(subcategories)) {
      return res.status(400).json({ message: "categoryName and subcategories are required." });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { categoryName, subcategories },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
