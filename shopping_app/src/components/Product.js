import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { GrEdit } from "react-icons/gr";
import "./Product.css";

const Product = ({
  product,
  popUpCheck,
  isHeart,
  wishlist,
  updateWishlist,
  popUpCheckLiked,
  isAdmin,
}) => {
  console.log("Is admin in Product:", isAdmin); // Add this line
  const [wishListed, setWishListed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isWishListed = wishlist.some(
      (item) => item.productId.toString() === product._id.toString()
    );
    setWishListed(isWishListed);
  }, [wishlist, product._id, isAdmin]);

  const toggleWishlist = async () => {
    const userName = window.localStorage.getItem("userName");
    const userEmail = window.localStorage.getItem("userEmail");
    if (!userName) {
      popUpCheckLiked();
    }

    const productId = product._id ? product._id.toString() : "";

    try {
      const response = await fetch(
        `http://localhost:4000/auth/${userEmail}/add-to-wishlist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail,
            productId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setWishListed((prev) => !prev);
        if (wishListed) {
          updateWishlist((prev) =>
            prev.filter((item) => item.productId !== productId)
          );
        } else {
          updateWishlist((prev) => [
            ...prev,
            { productId, productName: product.title, price: product.price },
          ]);
        }
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
    const userEmail = window.localStorage.getItem("userEmail");
    if (userName) {
      const productId = product._id ? product._id.toString() : "";

      try {
        const response = await fetch("http://localhost:4000/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail,
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

  const handleEditProduct = () => {
    window.localStorage.setItem("productId", product._id);
    navigate("/update-product");
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
      {!isAdmin && (
        <button className="add-to-cart-btn" onClick={handleAddToCartClick}>
          Add to Cart
        </button>
      )}
      {!isAdmin && (
        <FaHeart
          className={`wishlist-icon ${wishListed ? "wishlisted" : ""}`}
          onClick={toggleWishlist}
        />
      )}
      {isAdmin && (
        <button className="add-to-cart-btn" onClick={handleEditProduct}>
          Edit product details
        </button>
      )}
      {product._id && <p>Product ID: {product._id}</p>}
    </div>
  );
};

export default Product;
