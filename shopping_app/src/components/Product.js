import React, { useState, useEffect, useMemo } from "react";
import { FaHeart } from "react-icons/fa";
import "./Product.css";

const Product = ({ product, popUpCheck }) => {
  const [wishListed, setWishListed] = useState(false);

  // Memoize the wishlist fetch
  const fetchWishlist = useMemo(() => {
    return async () => {
      const userName = window.localStorage.getItem("userName");
      if (!userName) return [];

      try {
        const response = await fetch(
          `http://localhost:4000/auth/${userName}/get-wishlist`
        );
        if (response.ok) {
          const data = await response.json();
          return data.wishlist;
        } else {
          console.error("Error fetching wishlist");
          return [];
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        return [];
      }
    };
  }, []); // Empty dependency array means this will only be created once

  useEffect(() => {
    const checkWishlistStatus = async () => {
      const wishlist = await fetchWishlist();
      const isWishListed = wishlist.some(
        (item) => item.productId.toString() === product._id.toString()
      );
      setWishListed(isWishListed);
    };

    checkWishlistStatus();
  }, [product._id, fetchWishlist]);

  const toggleWishlist = async () => {
    const userName = window.localStorage.getItem("userName");
    if (!userName) return;

    const productId = product._id ? product._id.toString() : "";

    try {
      const response = await fetch(
        `http://localhost:4000/auth/${userName}/add-to-wishlist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName,
            productId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setWishListed((prev) => !prev); // Toggle wishlist status
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      alert("An error occurred while updating the wishlist");
    }
  };

  const addToCart = async () => {
    const userName = window.localStorage.getItem("userName");
    if (userName) {
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
          popUpCheck(product);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error adding product to cart:", error);
        alert("An error occurred while adding the product to the cart");
      }
    } else {
      // Not logged in, use localStorage to save dummy cart
      let dummyCart = JSON.parse(localStorage.getItem("dummyCart")) || [];

      // Check if the item is already in the cart
      const itemIndex = dummyCart.findIndex(
        (item) => item.productId === product._id.toString()
      );

      if (itemIndex !== -1) {
        // Item already in cart, update the quantity
        dummyCart[itemIndex].quantity += 1;
      } else {
        // Item not in cart, add it
        dummyCart.push({
          productId: product._id.toString(),
          title: product.title,
          price: product.price,
          quantity: 1,
          thumbnail: product.thumbnail,
        });
      }

      localStorage.setItem("dummyCart", JSON.stringify(dummyCart));
      popUpCheck(product);
    }
  };

  const handleAddToCartClick = () => {
    addToCart();
  };

  return (
    <div className="product">
      {product.title && <h2>{product.title}</h2>}
      {product.thumbnail && (
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
      )}
      {product.rating && <p>Rating: {product.rating}</p>}
      {product.description && <p>{product.description}</p>}
      {product.price && <p>Price: ${product.price}</p>}
      <button className="add-to-cart-btn" onClick={handleAddToCartClick}>
        Add to Cart
      </button>
      <FaHeart
        className={`wishlist-icon ${wishListed ? "wishlisted" : ""}`}
        onClick={toggleWishlist}
      />
    </div>
  );
};

export default Product;
