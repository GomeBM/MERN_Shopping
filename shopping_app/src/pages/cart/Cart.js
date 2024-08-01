import React, { useState, useEffect } from "react";
import "./Cart.css";

export const Cart = () => {
  const [cart, setCart] = useState([]);
  const [name, setUserName] = useState("");
  const [totalCost, setTotalCost] = useState("");

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
          setUserName(userName);
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

  useEffect(() => {
    // Calculate the total cost whenever cart changes
    const calculateTotalCost = () => {
      const cost = cart
        .reduce((total, item) => total + item.product.price * item.quantity, 0)
        .toFixed(2);
      setTotalCost(cost);
    };

    calculateTotalCost();
  }, [cart]);

  const removeItemFromCart = async (productId) => {
    const userName = window.localStorage.getItem("userName");

    if (!userName) {
      alert("Please log in to remove items from your cart.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/cart/removeItem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          product: {
            _id: productId,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update cart state without causing endless loops
        setCart((prevCart) =>
          prevCart.filter((item) => item.product._id !== productId)
        );
      } else {
        alert(
          data.error ||
            "An error occurred while removing the item from the cart"
        );
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      alert("An error occurred while removing the item from the cart");
    }
  };

  return (
    <div className="cart-page">
      <h1>{name}'s Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
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
                  <p>Total Price: ${item.product.price * item.quantity}</p>
                  <button onClick={() => removeItemFromCart(item.product._id)}>
                    REMOVE ITEM FROM CART
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="total-cost">Total Cost: ${totalCost}</p>
        </>
      )}
      <button className="purchase-btn">Confirm purchase</button>
    </div>
  );
};

export default Cart;
