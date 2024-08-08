const express = require("express");
const cartController = require("../controllers/cartController");
const router = express.Router();

router.post("/add", cartController.addToCart);
router.get("/:userEmail", cartController.getUserCart);
router.post("/removeItem", cartController.removeFromCart);
router.post("/confirm-purchase", cartController.confirmPurchase);
router.post(
  "/confirm-purchase-with-email",
  cartController.confirmPurchaseWithEmail
);

module.exports = router;
