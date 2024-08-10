const productModel = require("../models/productModel");

// get ALL products from dummyjson api, this was used once in order to store all of the products in the DB
exports.getAllProducts = async (req, res) => {
  try {
    // Fetch products from the API
    const response = await fetch("https://dummyjson.com/products?limit=0");
    if (!response.ok) {
      throw new Error(`HTTP error status ${response.status}`);
    }

    const data = await response.json();
    console.log("Data from dummyjson:", data);

    //Transform and filter the data to the productSchema and save it to mongoDB
    const filteredProducts = data.products.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      rating: product.rating,
      tags: product.tags,
      brand: product.brand,
      weight: product.weight,
      dimensions: {
        width: product.dimensions.width,
        height: product.dimensions.height,
        depth: product.dimensions.depth,
      },
      reviews: product.reviews.map((review) => ({
        rating: review.rating,
        comment: review.comment,
        date: new Date(review.date),
        reviewerName: review.reviewerName,
        reviewerEmail: review.reviewerEmail,
      })),
      thumbnail: product.thumbnail,
      images: product.images,
    }));

    //Save each product to MongoDB
    for (const product of filteredProducts) {
      await productModel.findOneAndUpdate(
        { id: product.id }, // Search by API id
        product, // Update with the filtered data
        { upsert: true, new: true } // Create if not exists, return the new document
      );
    }

    res.status(200).json({ products: data.products });
  } catch (error) {
    console.log("fetch error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
};

exports.getAllProductsFromDB = async (req, res) => {
  try {
    const products = await productModel.find();
    const totalProducts = await productModel.countDocuments();
    res.json({ products, totalProducts });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

//GET all products based on the category param beeing passed
exports.getProductByCategory = async (req, res) => {
  const { category } = req.params;
  const page = parseInt(req.query.page) || 1; // Get page number from query params, default to 1
  const limit = parseInt(req.query.limit) || 20; // Get limit from query params, default to 20
  const skip = (page - 1) * limit; // Calculate number of documents to skip

  try {
    // Query the database for products matching the given category with pagination
    const products = await productModel
      .find({ category: category })
      .skip(skip)
      .limit(limit);

    // Count the total number of products found
    const totalProducts = await productModel.countDocuments({
      category: category,
    });

    // Check if any products are found
    if (totalProducts === 0) {
      return res.status(404).json({
        message: "No products found for this category",
        totalProducts: 0,
      });
    }
    res.status(200).json({ products, totalProducts });
  } catch (error) {
    console.log("Database query error: ", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
};

//GET a single product by the _id param beeing sent.
exports.getProductByName = async (req, res) => {
  const { name } = req.body; // Extract product name from request body

  try {
    const product = await productModel.findOne({ title: name }); // Assuming the field is `title`, adjust if necessary

    if (!product) {
      console.log(`No product found with name of ${name}`);
      return res.status(404).json({
        success: false,
        message: `No product found with name of ${name}`,
      });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.log("Server error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id, title, price, category, description, rating, thumbnail } =
    req.body;

  try {
    const updatedProduct = await productModel.findOneAndUpdate(
      { id },
      { title, price, category, description, rating, thumbnail },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({
      message: "Product updated successfully!",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.addProduct = async (req, res) => {
  const { userEmail } = req.body;
  const authorizedEmail = "gambashop120@gmail.com";

  console.log("Received request to add product:");
  console.log("User email:", userEmail);
  console.log("Authorized email:", authorizedEmail);

  if (userEmail !== authorizedEmail) {
    console.log("Unauthorized request to add product:", userEmail);
    return res
      .status(403)
      .json({ error: "You are not authorized to add products." });
  }

  const { id, title, price, category, description, rating, thumbnail } =
    req.body;

  try {
    console.log("Received product data:", {
      id,
      title,
      price,
      category,
      description,
      rating,
      thumbnail,
    });

    const newProduct = new productModel({
      id,
      title,
      price,
      category,
      description,
      rating,
      thumbnail,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully!" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { productName } = req.body;
};
