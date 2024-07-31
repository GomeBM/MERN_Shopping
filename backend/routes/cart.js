const express = require("express");
const cartController = require("../controllers/cartController");
const router = express.Router();

router.post("/add", cartController.addToCart);
router.get("/:userName", cartController.getUserCart);
router.post("/removeItem", cartController.removeFromCart);

module.exports = router;
