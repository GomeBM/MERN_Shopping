const userModel = require("../models/userModel");
const productModel = require("../models/productModel");

// Add item to cart
exports.addToCart = async (req, res) => {
  const { userName, productId } = req.body;
  console.log("Received add to cart request:", req.body);

  try {
    const user = await userModel.findOne({ username: userName });
    if (!user) {
      console.log("User not found:", userName);
      return res.status(404).json({ message: "User not found" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      console.log("Product not found:", productId);
      return res.status(404).json({ message: "Product not found" });
    }

    const cartItemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity += 1;
    } else {
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();
    console.log("Product added to cart:", productId);
    res.status(200).json({ message: "Product added to cart", cart: user.cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  const { userName, product } = req.body;
  if (!userName || !product || !product._id) {
    return res
      .status(400)
      .json({ error: "userName and product._id are required" });
  }

  try {
    // Find the user by userName
    const user = await userModel.findOne({ username: userName });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove the product from the cart
    user.cart = user.cart.filter(
      (cartItem) => cartItem.product._id.toString() !== product._id
    );

    // Save the updated user document
    await user.save();

    // Return the updated cart
    res.json({ cart: user.cart });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ error: "Server error" });
  }
};

//Get user's cart
exports.getUserCart = async (req, res) => {
  const { userName } = req.params;
  console.log("Received get cart request for user:", userName);

  try {
    const user = await userModel
      .findOne({ username: userName })
      .populate("cart.product");

    if (!user) {
      console.log("User not found:", userName);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User cart retrieved:", user.cart);
    res.status(200).json({ cart: user.cart });
  } catch (error) {
    console.error("Error getting user cart:", error);
    res.status(500).json({ message: error.message });
  }
};

//CONFIRM PURCHASE OF USER CART:
exports.confirmPurchase = async (req, res) => {
  const { userName } = req.body;
  try {
    const user = await userModel
      .findOne({ username: userName })
      .populate("cart.product");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create new purchase history entry
    const newPurchase = {
      items_purchased: user.cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
    };

    // Add to purchase history and clear cart
    user.purchase_history.push(newPurchase);
    user.cart = [];

    await user.save();

    res.status(200).json({ message: "Purchase confirmed and cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// In your controllers/cartController.js
exports.confirmPurchaseWithEmail = async (req, res) => {
  const { email, cart } = req.body;

  try {
    // Check if the user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create new purchase history entry
    const newPurchase = {
      items_purchased: cart.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
      })),
    };

    // Add to purchase history and clear dummy cart
    user.purchase_history.push(newPurchase);
    await user.save();

    // Clear the dummy cart for the user
    // If you need to clear it from the database, you might want to add more logic here

    res.status(200).json({ message: "Purchase confirmed and cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
