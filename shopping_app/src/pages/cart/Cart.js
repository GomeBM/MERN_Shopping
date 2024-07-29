import React, { useState, useEffect } from "react";
import "./Cart.css";

export const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      const userName = window.localStorage.getItem("userName");
      if (!userName) {
        alert("Please log in to view your cart.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/cart/${userName}`);
        const data = await response.json();
        if (response.ok) {
          setCart(data.cart);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        alert("An error occurred while fetching the cart");
      }
    };

    fetchCart();
  }, []);

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.product._id} className="cart-item">
              <img
                src={item.product.thumbnail}
                alt={item.product.title}
                loading="lazy"
              />
              <div className="cart-item-details">
                <h2>{item.product.title}</h2>
                <p>Price: ${item.product.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
