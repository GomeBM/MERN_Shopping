const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/register", userController.createUser);

router.post("/login", userController.getUser);

router.get("/:userName/purchase-history", userController.getPurchaseHistory);

router.get("/:userName/get-wishlist", userController.getWishlist);

router.post("/:userName/add-to-wishlist", userController.addToWishlist);

module.exports = router;
