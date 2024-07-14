const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

//GET ALL PRODUCTS
router.get("/", productController.getAllProducts);

//GET ALL PRODUCTS FOR SPECIFIC CATEGORY:
router.get("/:category", productController.getProductByCategory);

module.exports = router;
