import React from "react";
import Product from "./Product";
import "./ProductList.css";

const ProductList = ({ products, popUpCheck }) => {
  console.log("Products received:", products); // Log products to check their value

  return (
    <div className="product-list">
      {products.length > 0 ? (
        products.map((product) => (
          <Product key={product.id} product={product} popUpCheck={popUpCheck} />
        ))
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
};

export default ProductList;
