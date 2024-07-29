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
