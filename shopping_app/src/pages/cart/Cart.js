import React, { useState, useEffect } from "react";
import Popup from "../../components/Popup";
import "./Cart.css";

export const Cart = () => {
  const [cart, setCart] = useState([]);
  const [name, setUserName] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [email, setEmail] = useState("");
  const [emailPrompt, setEmailPrompt] = useState(false);
  const [showPopup, setShowPopup] = useState({
    show: false,
    message: "",
    productImage: null,
  });

  useEffect(() => {
    const fetchCart = async () => {
      const userName = window.localStorage.getItem("userName");
      const userEmail = window.localStorage.getItem("userEmail");
      if (userName) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASEURL}/cart/${userEmail}`
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
    const userEmail = window.localStorage.getItem("userEmail");

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
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASEURL}/cart/removeItem`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail,
            product: {
              _id: productId,
            },
          }),
        }
      );

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
    const userEmail = window.localStorage.getItem("userEmail");
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
        `${process.env.REACT_APP_BACKEND_BASEURL}/cart/confirm-purchase`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userEmail }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setShowPopup({
          show: true,
          message: `Purchase confirmed! Check you Email for details!`,
          productImage: null,
        });
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
        `${process.env.REACT_APP_BACKEND_BASEURL}/cart/confirm-purchase-with-email`,
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
        setShowPopup({
          show: true,
          message: `Purchase confirmed! Check you Email for details!`,
          productImage: null,
        });
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
      {showPopup.show && (
        <Popup
          message={showPopup.message}
          productImage={showPopup.productImage}
          onClose={() =>
            setShowPopup({ show: false, message: "", productImage: "" })
          }
        />
      )}
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
