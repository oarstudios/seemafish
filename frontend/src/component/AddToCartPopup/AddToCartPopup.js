import React from "react";
import "./AddToCartPopup.css";
import logo from "../../assets/Seema Fish Logo.svg";

const AddToCartPopup = ({ onClose }) => {
  return (
    <div className="addtocart-popup-overlay" onClick={onClose}>
      <div className="addtocart-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="addtocart-close-btn" onClick={onClose}>
          &times;
        </button>
        <img src={logo} alt="Logo" className="addtocart-popup-logo" />
        <h3 className="addtocart-popup-title">Product Added to Cart!</h3>
      </div>
    </div>
  );
};

export default AddToCartPopup;