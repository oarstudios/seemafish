import React from "react";
import "./CartNotification.css"; 

const CartNotification = ({ cartItems, totalValue, onClose, onOpenCartPopup }) => {
  return (
    <div className="cart-notification">
      <div className="cart-notification-content">
        <div className="cnc">
        <p><strong>{cartItems} Items Added to Cart!</strong></p>
        <p className="cart-notification-value">Total Cart Value - ₹{totalValue}</p>
        </div>
       
        <button className="cart-notification-btn" onClick={onOpenCartPopup}>
          View Cart
        </button>
        <button className="cart-notification-close" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default CartNotification;
