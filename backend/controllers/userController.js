const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

//GET a single user
exports.getUser = async (req, res) => {
  const { email, password } = req.body;
  if (!password || !email) {
    res.json({ success: false, message: "Please fill in all fields" });
  }
  const isAdmin = email === "gambashop120@gmail.com" ? true : false;
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
      email: user.email,
      isAdmin,
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

exports.getAdminStats = async (req, res) => {
  try {
    const users = await userModel.find().populate({
      path: "purchase_history.items_purchased.product",
      model: "Product",
      select: "title price category",
    });

    let moneyPerCategory = {};
    let moneyPerMonth = Array(12).fill(0);
    let productsPerCategory = {};

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    users.forEach((user) => {
      user.purchase_history.forEach((purchase) => {
        const purchaseDate = new Date(purchase.date_purchased);

        purchase.items_purchased.forEach((item) => {
          // Check if the product still exists in the database
          if (item.product) {
            const { category, price } = item.product;
            const quantity = item.quantity;
            const totalPrice = price * quantity;

            // Money per category
            moneyPerCategory[category] =
              (moneyPerCategory[category] || 0) + totalPrice;

            // Products per category
            productsPerCategory[category] =
              (productsPerCategory[category] || 0) + quantity;

            // Money per month (last 12 months)
            if (purchaseDate >= oneYearAgo) {
              const monthIndex = purchaseDate.getMonth();
              moneyPerMonth[monthIndex] += totalPrice;
            }
          } else {
            console.log(
              `Skipping deleted product in purchase history for user ${user._id}`
            );
          }
        });
      });
    });

    res.status(200).json({
      moneyPerCategory,
      moneyPerMonth,
      productsPerCategory,
    });
  } catch (error) {
    console.error("Error retrieving admin stats:", error);
    res.status(500).json({ message: error.message });
  }
};

//GET a user's purchase history:
exports.getPurchaseHistory = async (req, res) => {
  const { userEmail } = req.params;
  try {
    const user = await userModel.findOne({ email: userEmail }).populate({
      path: "purchase_history.items_purchased.product",
      model: "Product",
      select: "title price category",
    });

    if (!user) {
      console.log(`User not found: ${userEmail}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Transform the data to a more frontend-friendly format
    const transformedHistory = user.purchase_history.map((purchase) => ({
      date: purchase.date_purchased,
      items: purchase.items_purchased
        .filter((item) => item.product !== null)
        .map((item) => ({
          productId: item.product ? item.product._id : "Deleted Product",
          productName: item.product ? item.product.title : "Deleted Product",
          quantity: item.quantity,
          price: item.product ? item.product.price : 0,
          category: item.product ? item.product.category : "Unknown",
        })),
    }));

    console.log(`Purchase history retrieved for user: ${userEmail}`);
    res.status(200).json({ purchaseHistory: transformedHistory });
  } catch (error) {
    console.error(
      `Error retrieving purchase history for user ${userEmail}:`,
      error
    );
    res.status(500).json({ message: error.message });
  }
};

exports.getWishlist = async (req, res) => {
  const { userEmail } = req.params;
  console.log(`Attempting to fetch wishlist for user: ${userEmail}`);
  try {
    const user = await userModel.findOne({ email: userEmail }).populate({
      path: "wishlist.product",
      select: "title price thumbnail",
    });

    if (!user) {
      console.log(`User not found: ${userEmail}`);
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`User found: ${user.email}`);
    console.log(`Wishlist items: ${user.wishlist.length}`);

    const transformedWishlist = user.wishlist.map((item) => ({
      productId: item.product._id.toString(),
      productName: item.product.title,
      price: item.product.price,
      thumbnail: item.product.thumbnail,
    }));

    console.log(`Transformed wishlist:`, transformedWishlist);
    res.status(200).json({ wishlist: transformedWishlist });
  } catch (error) {
    console.error(`Error retrieving wishlist for user ${userEmail}:`, error);
    res.status(500).json({ message: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  const { userEmail, productId } = req.body;
  console.log("Received add to wishlist request:", req.body);
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

    const wishListItemIndex = user.wishlist.findIndex(
      (item) => item.product.toString() === productId
    );

    if (wishListItemIndex === -1) {
      // Add to wishlist if not already there
      user.wishlist.push({ product: productId });
      console.log(
        `Added product ${productId} to wishlist for user ${userEmail}`
      );
    } else {
      // Remove from wishlist if already there
      user.wishlist.splice(wishListItemIndex, 1);
      console.log(
        `Removed product ${productId} from wishlist for user ${userEmail}`
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
