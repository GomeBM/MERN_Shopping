const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

//GET ALL PRODUCTS FROM DUMMYJSON API
router.get("/", productController.getAllProducts);

//GET ALL PRODUCTS FROM MONGOOS PRODUCT SCHEMA
router.get("/productsDB", productController.getAllProductsFromDB);

//GET ALL PRODUCTS FOR SPECIFIC CATEGORY:
router.get("/:category", productController.getProductByCategory);

//GET PRODUCT BY ID:
router.post("/get-by-id", productController.getProductById);

router.post("/add-product", productController.addProduct);

router.put("/update-product", productController.updateProduct);

router.delete("/delete-product", productController.deleteProduct);

module.exports = router;
