// import React, { useEffect, useState } from "react";
// import { FaHeart } from "react-icons/fa";
// import "./Product.css";

// const Product = ({ product, popUpCheck, isHeart }) => {
//   const [wishListed,setWishListed]=useState(false)
//   useEffect(() => {
//     // You can add any effect you need here
//   }, [product]);

//   const addToWishlist = async () => {
//     const userName = window.localStorage.getItem("userName");
//     if (!userName) {
//       return;
//     }

//     const productId = product._id ? product._id.toString() : "";

//     try {
//       const response = await fetch(`http://localhost:4000/${userName}/add-to-wishlist`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userName,
//           productId,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Pass product details including image to the popUpCheck function
//         popUpCheck(product);
//       } else {
//         alert(data.message);
//       }
//     } catch (error) {
//       console.error("Error adding product to cart:", error);
//       alert("An error occurred while adding the product to the cart");
//     }
//   };

//   const addToCart = async () => {
//     const userName = window.localStorage.getItem("userName");
//     if (!userName) {
//       return;
//     }

//     const productId = product._id ? product._id.toString() : "";

//     try {
//       const response = await fetch("http://localhost:4000/cart/add", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userName,
//           productId,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Pass product details including image to the popUpCheck function
//         popUpCheck(product);
//       } else {
//         alert(data.message);
//       }
//     } catch (error) {
//       console.error("Error adding product to cart:", error);
//       alert("An error occurred while adding the product to the cart");
//     }
//   };

//   const handleAddToCartClick = () => {
//     addToCart();
//   };

//   return (
//     <div className="product">
//       <h2>{product.title}</h2>
//       <img src={product.thumbnail} alt={product.title} loading="lazy" />
//       <p>Rating: {product.rating}</p>
//       <p>{product.description}</p>
//       <p>Price: ${product.price}</p>
//       <button onClick={handleAddToCartClick}>Add to Cart</button>
//       {isHeart && <FaHeart></FaHeart>}
//     </div>
//   );
// };

// export default Product;

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
    if (!userName) return;

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
