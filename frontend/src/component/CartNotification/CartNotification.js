import React, { useEffect, useState } from "react";
import "./CartNotification.css"; 
import { useLocation } from "react-router-dom";

const CartNotification = ({ cartItems, totalValue, onClose, onOpenCartPopup, handleShowCartNot }) => {
  const location = useLocation();
  const [show, setShow] = useState(true)
  //console.log(location)
  useEffect(()=>{
    if(location?.pathname === "/myaccount" || location?.pathname == '/checkout')
    {
      setShow(false)
      
    }
  },[location])
  return (
    <div className="cart-notification" style={{display: show ? "block" : "none"}}>
      <div className="cart-notification-content">
        <div className="cnc">
        <p><strong>{cartItems} Items Added to Cart!</strong></p>
        <p className="cart-notification-value">Total Cart Value - ₹{totalValue}</p>
        </div>
       
        <button className="cart-notification-btn" onClick={() => {
  onOpenCartPopup();
  handleShowCartNot();
}}>
          View Cart
        </button>
        <button className="cart-notification-close" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default CartNotification;
