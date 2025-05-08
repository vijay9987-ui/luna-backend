const User = require("../models/User");
const Product = require('../models/ProductModel');
const Cart = require('../models/CartModel');
const Order = require('../models/OrderModel');
const QRCode = require('qrcode');  // Import the qrcode package


// POST /api/login
exports.loginUser = async (req, res) => {
  const { username, mobileNumber } = req.body;
  try {
    let user = await User.findOne({ mobileNumber });

    if (user) {
      user.username = username;
      await user.save();
    } else {
      user = new User({ username, mobileNumber });
      await user.save();
    }

    // Find the user based on mobile number and username
    const existingUser = await User.findOne({ username, mobileNumber });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found. Please sign up." });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: existingUser._id,
        username: existingUser.username,
        mobileNumber: existingUser.mobileNumber
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ GET /api/user/:userId
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// ✅ PUT /api/user/:userId
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};



// GET /api/users/getuser/:userId
exports.profileUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ profile: user.profile, mobileNumber: user.mobileNumber });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /api/users/updateuser/:userId
exports.updateProfileUser = async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, gender, email, mobile } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.profile.firstName = firstName || user.profile.firstName;
    user.profile.lastName = lastName || user.profile.lastName;
    user.profile.gender = gender || user.profile.gender;
    user.profile.email = email || user.profile.email;

    if (mobile) user.mobileNumber = mobile;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      profile: user.profile,
      mobileNumber: user.mobileNumber,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create or update user profile (POST)
exports.createProfileData = async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, gender, email, mobile } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profile = {
      firstName,
      lastName,
      gender,
      email,
    };

    user.mobileNumber = mobile;

    await user.save();
    res.status(200).json({ message: "Profile saved successfully", user });
  } catch (error) {
    console.error("Profile POST error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE /api/users/:userId
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found or already deleted" });
    }

    res.status(200).json({ message: "User deleted successfully", deletedUser: user });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};





// 2. 📦 Get all wishlist items
exports.getWishlist = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("myWishlist");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ wishlist: user.myWishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// 3. ❌ Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.myWishlist = user.myWishlist.filter(
      (id) => id.toString() !== productId
    );

    await user.save();

    res.status(200).json({ message: "Product removed from wishlist", wishlist: user.myWishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.addToCart = async (req, res) => {
  const { userId } = req.params;
  const { productId, action, color, size } = req.body;

  try {
    // Find or create cart for user
    let cart = await Cart.findOne({ user: userId }).populate("products.product");

    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({ user: userId, products: [] });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cartItem = cart.products.find(
      (item) => item.product._id.toString() === productId
    );

    if (cartItem) {
      if (action === "increment") {
        cartItem.quantity += 1;
      } else if (action === "decrement") {
        cartItem.quantity -= 1;
        if (cartItem.quantity <= 0) {
          cart.products = cart.products.filter(
            (item) => item.product._id.toString() !== productId
          );
        }
      }
      // Update color/size if provided
      if (color) cartItem.color = color;
      if (size) cartItem.size = size;
    } else {
      cart.products.push({
        product: productId,
        quantity: 1,
        price: product.price,
        color: color || null,
        size: size || null
      });
    }

    await cart.populate("products.product");

    // ✅ Calculations
    let subTotal = 0;
    let totalItems = 0;

    cart.products.forEach((item) => {
      const itemTotal = item.product.price * item.quantity;
      subTotal += itemTotal;
      totalItems += item.quantity;
    });

    const deliveryCharge = subTotal > 500 ? 0 : 50;
    const finalAmount = subTotal + deliveryCharge;

    // ✅ Save calculated fields to cart
    cart.subTotal = subTotal;
    cart.cartTotal = subTotal; // Assuming cartTotal is same as subTotal
    cart.deliveryCharge = deliveryCharge;
    cart.finalAmount = finalAmount;
    cart.totalPrice = finalAmount;

    // Save the cart to the database
    await cart.save();

    // Now, after the cart is created or updated, we push the cart ID into the user's `myCart` array
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Push the cart ID into the user's `myCart` array
    if (!user.myCart.includes(cart._id)) {
      user.myCart.push(cart._id);
      await user.save();
    }

    res.status(200).json({
      message: "Cart updated successfully",
      cartItems: cart.products,
      totalItems,
      subTotal,
      cartTotal: subTotal,
      deliveryCharge,
      finalAmount,
      totalPrice: finalAmount,
    });
  } catch (error) {
    console.error("Cart update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




exports.removeFromCart = async (req, res) => {
  const { userId, productId } = req.params;  // Getting userId and productId from request parameters

  try {
    // Find the user's cart
    let cart = await Cart.findOne({ user: userId }).populate("products.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the product in the cart
    let cartItem = cart.products.find(item => item.product._id.toString() === productId);

    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Remove the product from the cart
    cart.products = cart.products.filter(item => item.product._id.toString() !== productId);

    // Remove the product from user's myCart array
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.myCart = user.myCart.filter(cartId => cartId.toString() !== cart._id.toString());

    // Recalculate the totals
    let subTotal = 0;
    let totalItems = 0;
    cart.products.forEach((item) => {
      const itemTotal = item.product.price * item.quantity;
      subTotal += itemTotal;
      totalItems += item.quantity;
    });

    const deliveryCharge = subTotal > 500 ? 0 : 50;
    const finalAmount = subTotal + deliveryCharge;

    // Update the cart with new totals
    cart.subTotal = subTotal;
    cart.cartTotal = subTotal; // Assuming cartTotal is same as subTotal
    cart.deliveryCharge = deliveryCharge;
    cart.finalAmount = finalAmount;
    cart.totalPrice = finalAmount;

    // Save the updated cart and user
    await cart.save();
    await user.save();

    // Respond with the updated cart details
    res.status(200).json({
      message: "Product removed successfully",
      cartItems: cart.products,
      totalItems,
      subTotal,
      cartTotal: subTotal,
      deliveryCharge,
      finalAmount,
      totalPrice: finalAmount,
    });

  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// 2️⃣ Get all cart items
exports.getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId }).populate("products.product");

    if (!cart) {
      return res.status(200).json({
        message: "Cart is empty",
        cartItems: [],
        totalItems: 0,
        subTotal: 0,
        cartTotal: 0,
        deliveryCharge: 0,
        finalAmount: 0,
        totalPrice: 0,
      });
    }

    // If cart is empty
    if (!cart.products || cart.products.length === 0) {
      return res.status(200).json({
        message: "Cart is empty",
        cartItems: [],
        totalItems: 0,
        subTotal: 0,
        cartTotal: 0,
        deliveryCharge: 0,
        finalAmount: 0,
        totalPrice: 0,
      });
    }

    // Calculate all fields again (in case prices changed)
    let subTotal = 0;
    let totalItems = 0;

    cart.products.forEach((item) => {
      const itemTotal = item.product.price * item.quantity;
      subTotal += itemTotal;
      totalItems += item.quantity;
    });

    const deliveryCharge = subTotal > 500 ? 0 : 50;
    const finalAmount = subTotal + deliveryCharge;

    // Update cart summary
    cart.subTotal = subTotal;
    cart.cartTotal = subTotal;
    cart.deliveryCharge = deliveryCharge;
    cart.finalAmount = finalAmount;
    cart.totalPrice = finalAmount;

    await cart.save();

    res.status(200).json({
      message: "Cart fetched successfully",
      cartItems: cart.products,
      totalItems,
      subTotal,
      cartTotal: subTotal,
      deliveryCharge,
      finalAmount,
      totalPrice: finalAmount,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCartCount = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart || !cart.products || cart.products.length === 0) {
      return res.status(200).json({ cartCount: 0 });
    }

    // Total quantity (not total unique items, but sum of all quantities)
    const cartCount = cart.products.reduce((total, item) => total + item.quantity, 0);

    res.status(200).json({ cartCount });
  } catch (error) {
    console.error("Cart count error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// // 3️⃣ Remove product from cart
// exports.removeFromCart = async (req, res) => {
//   const { userId, productId } = req.params;
//   const { size, color } = req.body; // Get size and color from request body

//   try {
//     const cart = await Cart.findOne({ user: userId }).populate("products.product");
//     if (!cart) return res.status(404).json({ message: "Cart not found" });

//     // Filter out the specific variant
//     cart.products = cart.products.filter(item => 
//       !(
//         item.product._id.toString() === productId &&
//         (size !== undefined ? item.size === size : true) &&
//         (color !== undefined ? item.color === color : true)
//       )
//     );

//     // Recalculate totals
//     let subTotal = 0;
//     let totalItems = 0;

//     cart.products.forEach(item => {
//       subTotal += item.price * item.quantity; // Use item.price (stored at time of adding)
//       totalItems += item.quantity;
//     });

//     const deliveryCharge = subTotal > 500 ? 0 : 50;
//     const finalAmount = subTotal + deliveryCharge;

//     // Update cart fields
//     cart.subTotal = subTotal;
//     cart.cartTotal = subTotal;
//     cart.deliveryCharge = deliveryCharge;
//     cart.finalAmount = finalAmount;
//     cart.totalPrice = finalAmount;

//     await cart.save();

//     res.status(200).json({
//       success: true,
//       message: "Product removed from cart",
//       cart: {
//         products: cart.products,
//         totalItems,
//         subTotal,
//         cartTotal: subTotal,
//         deliveryCharge,
//         finalAmount,
//         totalPrice: finalAmount
//       }
//     });
//   } catch (error) {
//     console.error("Remove from cart error:", error);
//     res.status(500).json({ 
//       success: false,
//       message: "Server error" 
//     });
//   }
// };


// ✅ Create Address
exports.createAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const newAddress = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({ message: "Address added successfully", addresses: user.addresses });
  } catch (err) {
    console.error("Error adding address:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get All Addresses
exports.getAddresses = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ addresses: user.addresses });
  } catch (err) {
    console.error("Error fetching addresses:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update Address
exports.updateAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const updatedAddress = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    Object.assign(address, updatedAddress);
    await user.save();

    res.status(200).json({ message: "Address updated successfully", addresses: user.addresses });
  } catch (err) {
    console.error("Error updating address:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete Address
exports.deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    await user.save();

    res.status(200).json({ message: "Address deleted successfully", addresses: user.addresses });
  } catch (err) {
    console.error("Error deleting address:", err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.placeOrder = async (req, res) => {
  const { userId } = req.params;
  const {
    shippingAddress,
    paymentMethod = "COD",
    products,
    totalAmount,
    deliveryCharge
  } = req.body;

  console.log("➡️ Received order request for userId:", userId);
  console.log("➡️ Request body:", req.body);

  try {
    // Validate input
    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products provided for order" });
    }

    if (!shippingAddress || !shippingAddress.addressLine) {
      return res.status(400).json({ message: "Invalid shipping address" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log(`❌ User with ID ${userId} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ If payment method is UPI, generate QR code
    if (paymentMethod === "UPI") {
      const upiUrl = `upi://pay?pa=juleeperween@ybl&am=${totalAmount}&cu=INR`;

      QRCode.toDataURL(upiUrl, async (err, qrCodeDataURL) => {
        if (err) {
          console.error("❌ QR code generation error:", err);
          return res.status(500).json({ message: "Error generating UPI QR code" });
        }

        const newOrder = new Order({
          userId,
          products,
          shippingAddress,
          paymentMethod,
          totalAmount,
          deliveryCharge,
          orderStatus: "Pending",
          paymentStatus: "Pending"
        });

        const savedOrder = await newOrder.save();
        user.myOrders.push(savedOrder._id);
        await user.save();

        return res.status(201).json({
          message: "Order placed. Please pay via UPI.",
          upiId: "juleeperween@ybl",
          amount: totalAmount,
          qrCode: qrCodeDataURL,
          orderStatus: "Pending",
          paymentStatus: "Pending",
          order: savedOrder
        });
      });
    } else {
      // ✅ Handle COD or other payment methods
      const newOrder = new Order({
        userId,
        products,
        shippingAddress,
        paymentMethod,
        totalAmount,
        deliveryCharge,
        orderStatus: "Pending",
        paymentStatus: "Pending"
      });

      const savedOrder = await newOrder.save();
      user.myOrders.push(savedOrder._id);
      await user.save();

      return res.status(201).json({
        message: "Order placed successfully",
        orderStatus: "Pending",
        paymentStatus: "Pending",
        order: savedOrder
      });
    }

  } catch (error) {
    console.error("❌ Order placement failed:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};




exports.getAllOrders = async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find().populate('userId', 'name email') // Optionally, populate user details like name and email
      .populate({
        path: 'products.product',
        select: 'name price'
      });

    // Check if orders exist
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    // Return all orders
    return res.status(200).json({
      message: "Orders fetched successfully",
      orders: orders.map(order => ({
        orderId: order._id,
        userId: order.userId,
        products: order.products,
        shippingAddress: order.shippingAddress,
        totalAmount: order.totalAmount,
        deliveryCharge: order.deliveryCharge,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt
      }))
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Server error" });
  }
};





exports.getMyOrders = async (req, res) => {
  const { userId } = req.params;

  console.log("Received userId:", userId);

  try {
    const user = await User.findById(userId).populate({
      path: 'myOrders',
      populate: {
        path: 'products.productId', // 👈 fixed this line
        select: 'name price images', // add more fields if needed
      },
    });

    if (!user) {
      console.log(`User with ID ${userId} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.myOrders || user.myOrders.length === 0) {
      return res.status(200).json({
        message: "No orders found",
        orders: [],
      });
    }

    res.status(200).json({
      message: "Orders fetched successfully",
      orders: user.myOrders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
