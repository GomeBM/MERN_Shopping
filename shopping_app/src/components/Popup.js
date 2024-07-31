import React from "react";
import "./Popup.css"; // Import the CSS for Popup

const Popup = ({ message, productImage, onClose }) => {
  return (
    <div className="popup-container">
      <div className="popup">
        {productImage && (
          <img src={productImage} alt="Product" className="popup-image" />
        )}
        <p>{message}</p>
        <button className="ok-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default Popup;
