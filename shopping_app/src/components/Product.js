import React, { useEffect } from "react";
import "./Product.css"; // Import the CSS for Product

const Product = ({ product }) => {
  useEffect(() => {
    if (product.quantity) {
      // You can handle quantity changes here if needed
    }
  }, [product.quantity]);

  return (
    <div className="product">
      <h2>{product.title}</h2>
      <img src={product.images[0]} alt={product.title} />
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <p>Product ID: {product.id}</p>
    </div>
  );
};

export default Product;
