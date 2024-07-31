import React, { useEffect } from "react";
import "./Product.css";

const Product = ({ product, popUpCheck }) => {
  useEffect(() => {
    // You can add any effect you need here
  }, [product]);

  const addToCart = async () => {
    const userName = window.localStorage.getItem("userName");
    if (!userName) {
      return;
    }

    const productId = product._id ? product._id.toString() : "";

    try {
      const response = await fetch("http://localhost:4000/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          productId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Pass product details including image to the popUpCheck function
        popUpCheck(product);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("An error occurred while adding the product to the cart");
    }
  };

  const handleAddToCartClick = () => {
    addToCart();
  };

  return (
    <div className="product">
      <h2>{product.title}</h2>
      <img src={product.thumbnail} alt={product.title} loading="lazy" />
      <p>Rating: {product.rating}</p>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <button onClick={handleAddToCartClick}>Add to Cart</button>
    </div>
  );
};

export default Product;
