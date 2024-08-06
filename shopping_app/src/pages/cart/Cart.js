import React, { useState, useEffect } from "react";
import "./Cart.css";

export const Cart = () => {
  const [cart, setCart] = useState([]);
  const [name, setUserName] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [email, setEmail] = useState(""); // New state for email input
  const [emailPrompt, setEmailPrompt] = useState(false); // Flag to show email prompt

  useEffect(() => {
    const fetchCart = async () => {
      const userName = window.localStorage.getItem("userName");
      if (userName) {
        try {
          const response = await fetch(
            `http://localhost:4000/cart/${userName}`
          );
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
      } else {
        // Not logged in, use localStorage to load dummy cart
        const dummyCart = JSON.parse(localStorage.getItem("dummyCart")) || [];
        setCart(dummyCart);
        setUserName(""); // No username available
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    // Calculate the total cost whenever cart changes
    const calculateTotalCost = () => {
      if (!name) {
        const cost = cart
          .reduce((total, item) => total + item.price * item.quantity, 0)
          .toFixed(2);
        setTotalCost(cost);
      } else {
        const cost = cart
          .reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
          )
          .toFixed(2);
        setTotalCost(cost);
      }
    };

    calculateTotalCost();
  }, [cart]);

  const removeItemFromCart = async (productId) => {
    const userName = window.localStorage.getItem("userName");

    if (!userName) {
      // Update dummy cart when no user is logged in
      const dummyCart = JSON.parse(localStorage.getItem("dummyCart")) || [];
      const updatedCart = dummyCart.filter(
        (item) => item.productId !== productId
      );
      localStorage.setItem("dummyCart", JSON.stringify(updatedCart));
      setCart(updatedCart);
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

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const confirmPurchase = async () => {
    const userName = window.localStorage.getItem("userName");
    if (!userName) {
      setEmailPrompt(true);
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty. Please add items before confirming purchase.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:4000/cart/confirm-purchase",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userName }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Purchase confirmed!");
        setCart([]);
        setTotalCost(0);
      } else {
        alert(
          data.message || "An error occurred while confirming the purchase"
        );
      }
    } catch (error) {
      console.error("Error confirming purchase:", error);
      alert("An error occurred while confirming the purchase");
    }
  };

  const confirmPurchaseWithEmail = async () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:4000/cart/confirm-purchase-with-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, cart }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Purchase confirmed!");
        setCart([]);
        setTotalCost(0);
        localStorage.removeItem("dummyCart");
        setEmail("");
        setEmailPrompt(false);
      } else {
        alert(
          data.message || "An error occurred while confirming the purchase"
        );
      }
    } catch (error) {
      console.error("Error confirming purchase:", error);
      alert("An error occurred while confirming the purchase");
    }
  };

  return (
    <div className="cart-page">
      {name && <h1>{name}'s Cart</h1>}
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {name && (
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
                    <button
                      onClick={() => removeItemFromCart(item.product._id)}
                    >
                      REMOVE ITEM FROM CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!name && (
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.productId} className="cart-item">
                  <img src={item.thumbnail} alt={item.title} loading="lazy" />
                  <div className="cart-item-details">
                    <h2>{item.title}</h2>
                    <p>Price: ${item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Total Price: ${item.price * item.quantity}</p>
                    <button onClick={() => removeItemFromCart(item.productId)}>
                      REMOVE ITEM FROM CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="total-cost">Total Cost: ${totalCost}</p>
          <button className="purchase-btn" onClick={confirmPurchase}>
            Confirm purchase
          </button>
          {emailPrompt && (
            <div className="email-prompt">
              <p>Please enter your email address:</p>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Email address"
              />
              <button
                className="submit-email_btn"
                onClick={confirmPurchaseWithEmail}
              >
                Submit and confirm
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
