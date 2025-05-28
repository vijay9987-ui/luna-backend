const Product = require('../models/ProductModel');
const User = require('../models/User')
const multer = require('multer');
const path = require('path');
const Banner = require('../models/Banner');

// ✅ Multer Storage for Product Images Only
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products/'); // Folder: uploads/products/
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const uploadProduct = multer({ storage: productStorage });
exports.createProduct = (req, res) => {
  const upload = uploadProduct.array('images', 5); // Max 5 images

  upload(req, res, async (err) => {
    try {
      if (err) return res.status(400).json({ error: err.message });

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No images uploaded' });
      }

      const images = req.files.map(file => `/uploads/products/${file.filename}`);

      // Convert sizes/colors from comma-separated string to array
      const sizes = req.body.sizes ? req.body.sizes.split(',').map(s => s.trim()) : [];
      const colors = req.body.colors ? req.body.colors.split(',').map(c => c.trim()) : [];

      const newProduct = new Product({
        ...req.body,
        images,
        sizes,
        colors,
      });

      const savedProduct = await newProduct.save();

      res.status(201).json({
        message: 'Product created successfully',
        product: savedProduct,
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Server error while creating product' });
    }
  });
};

exports.updateProduct = (req, res) => {
  const productUpload = uploadProduct.array("images", 5);

  productUpload(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const productId = req.params.id;
      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      let updateData = {
        ...req.body,
      };

      // Convert sizes/colors from comma-separated string to array
      if (req.body.sizes) {
        updateData.sizes = req.body.sizes.split(',').map(s => s.trim());
      }
      if (req.body.colors) {
        updateData.colors = req.body.colors.split(',').map(c => c.trim());
      }

      if (req.files && req.files.length > 0) {
        const imagePaths = req.files.map(file => `/uploads/products/${file.filename}`);
        updateData.images = imagePaths;
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updateData,
        { new: true }
      );

      return res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });

    } catch (error) {
      console.error("Update Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
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


//banner code 
// Define storage strategy
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/banners/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Set file filter (optional, for image type checking)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Export the configured middleware
exports.uploadBanners = (req, res) => {
  const bannerUpload = upload.array('images', 10); // Accept up to 10 files with field name 'images'

  bannerUpload(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const images = req.files.map(file => `/uploads/banners/${file.filename}`);

      const newBanner = new Banner({ images });
      await newBanner.save();

      res.status(201).json({
        message: "Banners uploaded successfully",
        images: newBanner.images,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};


// Controller function to get all banners
exports.getAllBanners = async (req, res) => {
  try {
    // Find all banners in the database
    const banners = await Banner.find();

    if (!banners || banners.length === 0) {
      return res.status(404).json({ error: "No banners found" });
    }

    res.status(200).json({
      message: "Banners fetched successfully",
      banners: banners, // Return all banners with their image paths
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fs = require('fs');


exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    // Delete image files from the filesystem
    banner.images.forEach((imagePath) => {
      const fullPath = path.join(__dirname, '..', imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    // Delete the banner document from MongoDB
    await Banner.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete banner' });
  }
};
