const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//GET a single user
exports.getUser = async (req, res) => {
  const { email, password } = req.body;
  if (!password || !email) {
    res.json({ success: false, message: "Please fill in all fields" });
  }
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      console.log("Invalid email");
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password");
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ name: user.username }, process.env.JWT_SECRET);

    res.status(200).json({
      success: true,
      message: "Login successful",
      name: user.username,
      token,
    });
  } catch (error) {
    console.log("Server error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createUser = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      return res.json({
        success: false,
        message: "A user with this email adress already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      username,
      password: hashedPassword,
      email,
    });
    const savedUser = await newUser.save();

    res.status(201).json({ success: true, user: savedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//GET a users search history:
exports.getPurchaseHistory = async (req, res) => {
  const { userName } = req.params;
  try {
    const user = await userModel.findOne({ username: userName }).populate({
      path: "purchase_history.items_purchased.product",
      model: "Product", // Make sure this matches your Product model name
    });

    if (!user) {
      console.log(`User not found: ${userName}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Transform the data to a more frontend-friendly format
    const transformedHistory = user.purchase_history.map((purchase) => ({
      date: purchase.date_purchased,
      items: purchase.items_purchased.map((item) => ({
        productId: item.product._id,
        productName: item.product.title, // Assuming your product has a 'title' field
        quantity: item.quantity,
        price: item.product.price, // Assuming your product has a 'price' field
      })),
    }));

    console.log(`Purchase history retrieved for user: ${userName}`);
    res.status(200).json({ purchaseHistory: transformedHistory });
  } catch (error) {
    console.error(
      `Error retrieving purchase history for user ${userName}:`,
      error
    );
    res.status(500).json({ message: error.message });
  }
};

exports.getWishlist = async (req, res) => {
  const { userName } = req.params;
  console.log(`Attempting to fetch wishlist for user: ${userName}`);
  try {
    const user = await userModel.findOne({ username: userName }).populate({
      path: "wishlist.product",
      model: "Product",
    });

    if (!user) {
      console.log(`User not found: ${userName}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Transform the data to a more frontend-friendly format
    const transformedWishlist = user.wishlist.map((item) => ({
      productId: item.product._id,
      productName: item.product.title,
      price: item.product.price,
    }));

    console.log(
      `Wishlist retrieved for user: ${userName}`,
      transformedWishlist
    );
    res.status(200).json({ wishlist: transformedWishlist });
  } catch (error) {
    console.error(`Error retrieving wishlist for user ${userName}:`, error);
    res.status(500).json({ message: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  const { userName, productId } = req.body;
  console.log("Received add to wishlist request:", req.body);
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

    const wishListItemIndex = user.wishlist.findIndex(
      (item) => item.product.toString() === productId
    );

    if (wishListItemIndex === -1) {
      // Add to wishlist if not already there
      user.wishlist.push({ product: productId });
      console.log(
        `Added product ${productId} to wishlist for user ${userName}`
      );
    } else {
      // Remove from wishlist if already there
      user.wishlist.splice(wishListItemIndex, 1);
      console.log(
        `Removed product ${productId} from wishlist for user ${userName}`
      );
    }

    await user.save();
    res
      .status(200)
      .json({ message: "Wishlist updated", wishlist: user.wishlist });
  } catch (error) {
    console.error("Error updating wishlist:", error);
    res.status(500).json({ message: error.message });
  }
};
