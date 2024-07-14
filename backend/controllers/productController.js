// get ALL products
exports.getAllProducts = async (req, res) => {
  try {
    const response = await fetch("https://dummyjson.com/products?limit=0");
    if (!response.ok) {
      throw new Error(`http error status ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json({ products: data.products });
  } catch (error) {
    console.log("fetch error");
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
};

// get all products by category
exports.getProductByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const response = await fetch(
      `https://dummyjson.com/products/category/${category}`
    );
    if (!response.ok) {
      throw new Error(`http error status ${response.status}`);
    }
    const data = await response.json();
    res.status(200).json({ products: data.products });
  } catch (error) {
    console.log("fetch error: ", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
};
