import React, { useState } from "react";
import "./AddProduct.css"; // Assuming the styling is similar to AddProduct
import Popup from "../Popup";

const UpdateProduct = () => {
  const [showPopup, setShowPopup] = useState({
    show: false,
    message: "",
    productImage: null,
  });

  const [product, setProduct] = useState({
    id: "",
    title: "",
    price: "",
    category: "",
    description: "",
    rating: "",
    thumbnail: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [productName, setProductName] = useState(
    window.localStorage.getItem("productName")
  ); // To store product name for fetching data

  // Fetch product details when the fetch button is clicked
  const handleFetchProduct = async () => {
    if (!productName) {
      setError("Please enter a product name.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/get-by-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: productName }), // Send name in request body
      });

      if (response.ok) {
        const result = await response.json();
        setProduct(result.product);
        setSuccess("Product data loaded successfully.");
        setError("");
      } else {
        const result = await response.json();
        setError(result.message || "Error fetching product data.");
        setSuccess("");
      }
    } catch (err) {
      console.error("Error fetching product data:", err);
      setError("Error fetching product data.");
      setSuccess("");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:4000/update-product`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...product }),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess(result.message || "Product updated successfully!");
        handleGoodSubmit(product.thumbnail, product.title);
      } else {
        const result = await response.json();
        setError(result.error || "Error updating product. Please try again.");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Error updating product. Please try again.");
    }
  };

  const handleGoodSubmit = (image, title) => {
    setShowPopup({
      show: true,
      message: `${title} has been updated successfully`,
      productImage: image,
    });
  };

  return (
    <div className="formContainer">
      <form onSubmit={handleSubmit}>
        <h2>Update Product</h2>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <label>
          <span>Product Name:</span>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name to load data"
          />
          <button type="button" onClick={handleFetchProduct}>
            Fetch Product
          </button>
        </label>

        <label>
          <span>Product ID:</span>
          <input
            type="number"
            name="id"
            value={product.id}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>Product Name:</span>
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>Price:</span>
          <input
            type="number"
            step="0.01"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>Category:</span>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="smartphones">Smartphones</option>
            <option value="beauty">Beauty</option>
            <option value="groceries">Groceries</option>
            <option value="fragrances">Fragrances</option>
            <option value="furniture">Furniture</option>
            <option value="home-decoration">Home Decoration</option>
            <option value="kitchen-accessories">Kitchen Accessories</option>
            <option value="laptops">Laptops</option>
            <option value="mens-shirts">Men's Shirts</option>
            <option value="mens-shoes">Men's Shoes</option>
            <option value="mens-watches">Men's Watches</option>
            <option value="mobile-accessories">Mobile Accessories</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="skin-care">Skin Care</option>
            <option value="sports-accessories">Sports Accessories</option>
            <option value="sunglasses">Sunglasses</option>
            <option value="tablets">Tablets</option>
            <option value="vehicle">Vehicle</option>
            <option value="womens-watches">Women's Watches</option>
            <option value="womens-jewellery">Women's Jewellery</option>
          </select>
        </label>

        <label>
          <span>Description:</span>
          <input
            type="text"
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>Rating (0-5):</span>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            name="rating"
            value={product.rating}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>Thumbnail URL:</span>
          <input
            type="text"
            name="thumbnail"
            value={product.thumbnail}
            onChange={handleChange}
            required
          />
        </label>

        <button className="submit-product-btn" type="submit">
          Update Product
        </button>
        {showPopup.show && (
          <Popup
            message={showPopup.message}
            productImage={showPopup.productImage}
            onClose={() =>
              setShowPopup({ show: false, message: "", productImage: "" })
            }
          />
        )}
      </form>
    </div>
  );
};

export default UpdateProduct;
