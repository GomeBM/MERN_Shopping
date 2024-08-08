const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const emailjs = require("@emailjs/nodejs");
require("dotenv").config();

emailjs.init({
  publicKey: process.env.EMAIL_PUBLIC_KEY,
  privateKey: process.env.EMAIL_PRIVATE_KEY,
});

// Add item to cart
exports.addToCart = async (req, res) => {
  const { userEmail, productId } = req.body;
  console.log("Received add to cart request:", req.body);

  try {
    const user = await userModel.findOne({ email: userEmail });
    if (!user) {
      console.log("User not found:", userEmail);
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
  const { userEmail, product } = req.body;
  if (!userEmail || !product || !product._id) {
    return res
      .status(400)
      .json({ error: "userName and product._id are required" });
  }

  try {
    // Find the user by userName
    const user = await userModel.findOne({ email: userEmail });

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
  const { userEmail } = req.params;
  console.log("Received get cart request for user:", userEmail);

  try {
    const user = await userModel
      .findOne({ email: userEmail })
      .populate("cart.product");

    if (!user) {
      console.log("User not found:", userEmail);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User cart retrieved:", user.cart);
    res.status(200).json({ cart: user.cart });
  } catch (error) {
    console.error("Error getting user cart:", error);
    res.status(500).json({ message: error.message });
  }
};

// CONFIRM PURCHASE OF USER CART:
exports.confirmPurchase = async (req, res) => {
  const { userEmail } = req.body;
  try {
    const user = await userModel
      .findOne({ email: userEmail })
      .populate("cart.product");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create new purchase history entry
    const newPurchase = {
      items_purchased: user.cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        category: item.product.category, // Include category here
      })),
    };

    // Add to purchase history and clear cart
    user.purchase_history.push(newPurchase);

    // Prepare email content
    const purchaseDetails = user.cart
      .map(
        (item) =>
          `${item.product.title} - Quantity: ${item.quantity} - Price: $${(
            item.product.price * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");

    const totalCost = user.cart
      .reduce((total, item) => total + item.product.price * item.quantity, 0)
      .toFixed(2);

    // Send email using EmailJS
    await emailjs.send(
      process.env.EMAIL_SERVICE_ID,
      process.env.EMAIL_TEMPLATE_ID,
      {
        to_name: user.username,
        to_email: user.email,
        purchases: purchaseDetails,
        total: totalCost,
      }
    );

    user.cart = [];
    await user.save();

    res
      .status(200)
      .json({ message: "Purchase confirmed, cart cleared, and email sent" });
  } catch (error) {
    console.error("Error in confirmPurchaseWithEmail:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your purchase" });
  }
};

//CONFIRM PURCHASE FOR NON LOGGED IN USERS
exports.confirmPurchaseWithEmail = async (req, res) => {
  const { email, cart } = req.body;

  try {
    // Prepare email content
    const purchaseDetails = cart
      .map(
        (item) =>
          `${item.title} - Quantity: ${item.quantity} - Price: $${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");

    const totalCost = cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);

    // Send email using EmailJS
    await emailjs.send(
      process.env.EMAIL_SERVICE_ID,
      process.env.EMAIL_TEMPLATE_ID,
      {
        to_name: "Valued Customer",
        to_email: email,
        purchases: purchaseDetails,
        total: totalCost,
      }
    );

    res
      .status(200)
      .json({ message: "Purchase confirmed, cart cleared, and email sent" });
  } catch (error) {
    console.error("Error in confirmPurchase:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your purchase" });
  }
};
