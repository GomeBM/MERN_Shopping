const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/register", userController.createUser);

router.post("/login", userController.getUser);

router.get("/:userEmail/purchase-history", userController.getPurchaseHistory);

router.get("/:userEmail/get-wishlist", userController.getWishlist);

router.post("/:userEmail/add-to-wishlist", userController.addToWishlist);

module.exports = router;
