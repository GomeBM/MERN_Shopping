import React from "react";
import Product from "./Product";
import "./ProductList.css";

const ProductList = ({
  products,
  popUpCheck,
  isHeart,
  wishlist,
  updateWishlist,
  popUpCheckLiked,
  isAdmin,
}) => {
  console.log("Is admin in ProductList:", isAdmin); // Add this line
  console.log("Products received:", products);

  return (
    <div className="product-list">
      {products.length > 0 ? (
        products.map((product) => (
          <Product
            key={product.id}
            product={product}
            popUpCheck={popUpCheck}
            isHeart={isHeart}
            wishlist={wishlist}
            updateWishlist={updateWishlist}
            popUpCheckLiked={popUpCheckLiked}
            isAdmin={isAdmin}
          />
        ))
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
};

export default ProductList;
