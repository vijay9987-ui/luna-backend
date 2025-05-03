const Product = require('../models/ProductModel');
const User = require('../models/User')

// Create product
exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get trending products
exports.getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isTrending: true }).limit(10);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// Get new arrival products
exports.getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get best seller products
exports.getBestSellers = async (req, res) => {
  try {
    const products = await Product.find().sort({ salesCount: -1 }).limit(10);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get products on sale
exports.getOnSaleProducts = async (req, res) => {
  try {
    const products = await Product.find({ discount: { $gt: 0 } });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get Product By Category
exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryName = req.params.category;
    const products = await Product.find({ categoryName });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found in this category" });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$categoryName',
          subcategories: { $addToSet: '$subcategoryName' },
          image: { $first: { $arrayElemAt: ["$images", 0] } } // pick first image
        }
      },
      {
        $project: {
          _id: 0,
          categoryName: '$_id',
          subcategories: 1,
          imageUrl: '$image'
        }
      },
      {
        $sort: { categoryName: 1 }
      }
    ]);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error });
  }
};



// Update product
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.addToWishlist = async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isAlreadyInWishlist = user.myWishlist.includes(productId);

    if (isAlreadyInWishlist) {
      // Remove from wishlist
      user.myWishlist = user.myWishlist.filter(id => id.toString() !== productId);
      await user.save();
      return res.status(200).json({
        message: "Product removed from wishlist",
        isInWishlist: false,
        wishlist: user.myWishlist
      });
    } else {
      // Add to wishlist
      user.myWishlist.push(productId);
      await user.save();
      return res.status(200).json({
        message: "Product added to wishlist",
        isInWishlist: true,
        wishlist: user.myWishlist
      });
    }
  } catch (error) {
    console.error("Wishlist toggle error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// Get all products with categoryName = "Cotton Saree"
exports.getCottonSareeProducts = async (req, res) => {
  try {
    const products = await Product.find({ categoryName: "Cotton Saree" });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found under 'Cotton Saree' category." });
    }

    res.status(200).json({
      message: "Products under 'Cotton Saree' category fetched successfully",
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching Cotton Saree products:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// Get all products with categoryName = "Cotton Shirt"
exports.getCottonShirtProducts = async (req, res) => {
  try {
    const products = await Product.find({ categoryName: "Cotton Shirt" });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found under 'Cotton Shirt' category." });
    }

    res.status(200).json({
      message: "Products under 'Cotton Shirt' category fetched successfully",
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching Cotton Shirt products:", error);
    res.status(500).json({ error: "Server error" });
  }
};




// Add product to recently viewed
exports.addRecentlyViewed = async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Remove if already exists
    user.recentlyViewed = user.recentlyViewed.filter(
      id => id.toString() !== productId
    );

    // Add to beginning
    user.recentlyViewed.unshift(productId);

    // Keep only latest 10
    if (user.recentlyViewed.length > 10) {
      user.recentlyViewed = user.recentlyViewed.slice(0, 10);
    }

    await user.save();

    res.status(200).json({ message: 'Product added to recently viewed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get recently viewed products
exports.getRecentlyViewed = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId)
      .populate('recentlyViewed')
      .select('recentlyViewed');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.recentlyViewed);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

