// import React, { useEffect } from "react";
// import "./Product.css";

// const Product = ({ product, popUpCheck }) => {
//   useEffect(() => {
//     // You can add any effect you need here
//   }, [product]);

//   const addToCart = async () => {
//     const userName = window.localStorage.getItem("userName");
//     if (!userName) {
//       return;
//     }

//     // Ensure that product._id is used correctly
//     const productId = product._id ? product._id.toString() : "";

//     console.log("Product object:", product); // Add this line
//     console.log("Sending request with data:", {
//       userName,
//       productId,
//     });

//     try {
//       const response = await fetch("http://localhost:4000/cart/add", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userName,
//           productId, // Use productId here
//         }),
//       });

//       const data = await response.json();
//       console.log("Response from server:", data);

//       if (response.ok) {
//         alert("Product added to cart");
//       } else {
//         alert(data.message);
//       }
//     } catch (error) {
//       console.error("Error adding product to cart:", error);
//       alert("An error occurred while adding the product to the cart");
//     }
//   };

//   const handleAddToCartClick = () => {
//     popUpCheck();
//     addToCart();
//   };

//   return (
//     <div className="product">
//       <h2>{product.title}</h2>
//       <img src={product.thumbnail} alt={product.title} loading="lazy" />
//       <p>{product.description}</p>
//       <p>Price: ${product.price}</p>
//       <button onClick={handleAddToCartClick}>Add to Cart</button>
//     </div>
//   );
// };

// export default Product;
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

    console.log("Product object:", product);
    console.log("Sending request with data:", {
      userName,
      productId,
    });

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
      console.log("Response from server:", data);

      if (response.ok) {
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("An error occurred while adding the product to the cart");
    }
  };

  const handleAddToCartClick = () => {
    // Pass the product to popUpCheck
    popUpCheck(product);
    addToCart();
  };

  return (
    <div className="product">
      <h2>{product.title}</h2>
      <img src={product.thumbnail} alt={product.title} loading="lazy" />
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <button onClick={handleAddToCartClick}>Add to Cart</button>
    </div>
  );
};

export default Product;
