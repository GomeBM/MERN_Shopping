import React, { useState, useEffect } from "react";
import "./Wishlist.css";
import ProductList from "../../components/ProductList";

export const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [name, setUserName] = useState("");

  useEffect(() => {
    const fetchWishlist = async () => {
      const userName = window.localStorage.getItem("userName");
      const userEmail = window.localStorage.getItem("userEmail");
      if (userEmail) {
        try {
          const response = await fetch(
            `http://localhost:4000/auth/${userEmail}/get-wishlist`
          );
          const data = await response.json();
          if (response.ok) {
            setWishlist(data.wishlist);
            setUserName(userName);
          } else {
            console.error("Server responded with an error:", data.message);
            alert(
              data.message || "An error occurred while fetching the wishlist"
            );
          }
        } catch (error) {
          console.error("Error fetching wishlist:", error);
          alert(
            "An error occurred while fetching the wishlist. Please check the console for more details."
          );
        }
      } else {
        setUserName(""); // No username available
        alert("Please log in to view your wishlist");
      }
    };

    fetchWishlist();
  }, []);

  const removeItemFromWishlist = async (productId) => {
    const userName = window.localStorage.getItem("userName");
    const userEmail = window.localStorage.getItem("userEmail");
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
        setWishlist((prevWishlist) =>
          prevWishlist.filter((item) => item.productId !== productId)
        );
      } else {
        alert(
          data.error ||
            "An error occurred while removing the item from the wishlist"
        );
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      alert("An error occurred while removing the item from the wishlist");
    }
  };

  return (
    <div className="wishlist-page">
      <h1>{name}'s Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty</p>
      ) : (
        <div className="wishlist-items">
          {wishlist.map((item) => (
            <div key={item.productId} className="wishlist-item">
              <img src={item.thumbnail} alt={item.productName} loading="lazy" />
              <div className="wishlist-item-details">
                <h2>{item.productName}</h2>
                <p>Price: ${item.price}</p>
                <button onClick={() => removeItemFromWishlist(item.productId)}>
                  REMOVE FROM WISHLIST
                </button>
              </div>
            </div>
          ))}
          {/* <ProductList products={wishlist} popUpCheck={null} isHeart={true} /> */}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
