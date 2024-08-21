import React, { useState } from "react";
import "./AddProduct.css";
import "./UpdateProduct.css";
import Popup from "../Popup";

const UpdateProduct = () => {
  const [showPopup, setShowPopup] = useState({
    show: false,
    message: "",
    productImage: null,
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState({
    title: "",
    image: "",
    productId: "",
  });

  const [product, setProduct] = useState({
    _id: "",
    title: "",
    price: "",
    category: "",
    description: "",
    rating: "",
    thumbnail: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [productId, setProductId] = useState(
    window.localStorage.getItem("productId")
  );

  const handleFetchProduct = async () => {
    if (!productId) {
      setError("Please enter a product ID.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASEURL}/get-by-id`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: productId }),
        }
      );

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
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASEURL}/update-product`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...product }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setSuccess(result.message || "Product updated successfully!");
        handleGoodSubmit(product.thumbnail, product.title, "update");
      } else {
        const result = await response.json();
        setError(result.error || "Error updating product. Please try again.");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Error updating product. Please try again.");
    }
  };

  const handleGoodSubmit = (image, title, method) => {
    if (method === "update") {
      setShowPopup({
        show: true,
        message: `${title} has been updated successfully`,
        productImage: image,
      });
    } else {
      setShowPopup({
        show: true,
        message: `${title} has been deleted from your data base`,
        productImage: image,
      });
    }
    window.localStorage.removeItem("productId");
    setProductId("");
    setProduct({
      _id: "",
      title: "",
      price: "",
      category: "",
      description: "",
      rating: "",
      thumbnail: "",
    });
    setError("");
    setSuccess("");
  };

  const handleDeleteConfirmation = () => {
    setShowConfirmation(true);
    setConfirmationData({
      title: product.title,
      image: product.thumbnail,
      productId: productId,
    });
  };

  const handleConfirmDelete = async () => {
    setShowConfirmation(false);
    if (!confirmationData.productId) {
      setError("Please enter a product ID.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASEURL}/delete-product`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: confirmationData.productId }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setSuccess(result.message);
        setError("");
        handleGoodSubmit(result.image, result.title, "delete");
      } else {
        const result = await response.json();
        setError(result.message || "Error deleting product.");
        setSuccess("");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Error deleting product.");
      setSuccess("");
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="formContainer">
      <form onSubmit={handleSubmit}>
        <h2>Update Product</h2>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <label>
          <span>Product ID:</span>
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter product ID to load data"
          />
          <button
            type="button"
            className="fetch-product-btn"
            onClick={handleFetchProduct}
          >
            Fetch Product
          </button>
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
          <textarea
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
          <textarea
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
        <button
          className="submit-product-btn delete"
          type="button"
          onClick={handleDeleteConfirmation}
        >
          DELETE Product
        </button>

        {showConfirmation && (
          <Popup
            message={`Are you sure you want to delete ${confirmationData.title}?`}
            productImage={confirmationData.image}
            onClose={() => setShowConfirmation(false)}
            additionalButtons={
              <>
                <button onClick={handleConfirmDelete}>Yes</button>
                <button className="cancel-button" onClick={handleCancelDelete}>
                  No
                </button>
              </>
            }
          />
        )}

        {showPopup.show && (
          <Popup
            message={showPopup.message}
            productImage={showPopup.productImage}
            onClose={() => setShowPopup({ show: false })}
          />
        )}
      </form>
    </div>
  );
};

export default UpdateProduct;
