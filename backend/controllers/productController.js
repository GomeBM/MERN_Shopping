const productModel = require("../models/productModel");

// get ALL products
exports.getAllProducts = async (req, res) => {
  try {
    // Fetch products from the API
    const response = await fetch("https://dummyjson.com/products?limit=0");
    if (!response.ok) {
      throw new Error(`HTTP error status ${response.status}`);
    }

    const data = await response.json();
    console.log("Data from dummyjson:", data);

    // Transform and filter the data
    // const filteredProducts = data.products.map((product) => ({
    //   id: product.id,
    //   title: product.title,
    //   description: product.description,
    //   category: product.category,
    //   price: product.price,
    //   rating: product.rating,
    //   tags: product.tags,
    //   brand: product.brand,
    //   weight: product.weight,
    //   dimensions: {
    //     width: product.dimensions.width,
    //     height: product.dimensions.height,
    //     depth: product.dimensions.depth,
    //   },
    //   reviews: product.reviews.map((review) => ({
    //     rating: review.rating,
    //     comment: review.comment,
    //     date: new Date(review.date),
    //     reviewerName: review.reviewerName,
    //     reviewerEmail: review.reviewerEmail,
    //   })),
    //   thumbnail: product.thumbnail,
    //   images: product.images,
    // }));

    // Save each product to MongoDB
    // for (const product of filteredProducts) {
    //   await productModel.findOneAndUpdate(
    //     { id: product.id }, // Search by API id
    //     product, // Update with the filtered data
    //     { upsert: true, new: true } // Create if not exists, return the new document
    //   );
    // }
    res.status(200).json({ products: data.products });
  } catch (error) {
    console.log("fetch error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
};

exports.getAllProductsFromDB = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  try {
    const products = await productModel.find().skip(skip).limit(limit);
    const totalProducts = await productModel.countDocuments();
    res.json({ products, totalProducts });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

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

// get all products by category
// exports.getProductByCategory = async (req, res) => {
//   const { category } = req.params;
//   try {
//     const response = await fetch(
//       `https://dummyjson.com/products/category/${category}`
//     );
//     if (!response.ok) {
//       throw new Error(`http error status ${response.status}`);
//     }
//     const data = await response.json();
//     res.status(200).json({ products: data.products });
//   } catch (error) {
//     console.log("fetch error: ", error);
//     if (!res.headersSent) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// };

exports.getProductById = async (req, res) => {
  const { _id } = req.params;
  try {
    const product = await productModel.findOne({ _id });

    if (!product) {
      console.log(`No product with id of ${_id}`);
      return res
        .status(401)
        .json({ success: false, message: `No product with id of ${_id}` });
    }

    res.status(200).json({
      product: product,
    });
  } catch (error) {
    console.log("Server error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
