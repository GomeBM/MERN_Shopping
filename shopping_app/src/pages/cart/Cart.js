import React, { useState, useEffect } from "react";
import Product from "../../components/Product";
import "./Cart.css";

export const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [userName, setUserName] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [totalPay, setTotalPay] = useState(0);

  useEffect(() => {}, []);

  return (
    <div className="cart">
      {isConnected ? (
        <div>
          <h1>{userName}'s shopping cart:</h1>
          <div className="product-list">
            {cartProducts.map((product) => (
              <Product
                key={product.id}
                product={product}
                showButton={false}
                showAmmount={true}
              ></Product>
            ))}
          </div>
          <div className="total-pay">
            <h2>
              Your total is: <h1>{totalPay}</h1>
            </h2>
          </div>
        </div>
      ) : (
        <h1>Please Login to see your cart</h1>
      )}
    </div>
  );
};
