import React, { useEffect, useState } from "react";
import "./CartPopup.css";
import closeIcon from "../../assets/cross.svg";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNotify } from "../../hooks/useNotify";

const CartPopup = ({ isOpen, onClose, fetchCart, cart }) => {
  const { user } = useAuthContext();
  const { notify } = useNotify();

  useEffect(() => {
    if (isOpen && user) {
      fetchCart();
      console.log(cart)
    }
  }, [isOpen, user]);

const updatedUserCart = async () => {
  if (!user) return showError();
  try {
    const response = await fetch(`http://localhost:4001/users/${user?._id}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });

    const updatedUser = await response.json();
    console.log('updated user', updatedUser)
    if (response.ok) {
      // setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify({token: user.token, user: updatedUser}));
      
      fetchCart();
      console.log("updt", user)
    }
  } catch (error) {
    console.error('Failed to update user cart:', error);
  }
};

const showError = ()=>{
  notify('Login in to add to basket', "error")
}

const removeFromCart = async (product) => {
  try {

    const response = await fetch(`http://localhost:4001/users/${user?._id}/cart/${product._id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${user?.token}`
      }
    });

    if (response.ok) {
      console.log("Product removed from cart");
      updatedUserCart(); // Fetch updated cart
    } else {
      notify("Failed to remove from cart", "error");
    }
  } catch (error) {
    console.log("Error removing product from cart:", error);
  }
};


const handleAddToCart = async (item, status) => {
  if (!user) {
    return showError();
  }

  try {
    const value = status === "inc" ? 1 : -1; // Increase or decrease quantity

    // Find if product exists in cart
    const existingItem = cart?.find((crt) => crt?.productId?._id === item._id);

    const formData = {
      productId: item?._id,
      quantity: existingItem ? existingItem.quantity + value : 1, // Adjust quantity
      weight: item?.weight,
      price: item?.price?.sale
    };

    // Prevent sending invalid quantity (e.g., 0 or negative)
    if (existingItem && existingItem.quantity + value <= 0) {
      return removeFromCart(item); // Call function to remove item from cart
    }

    console.log("Updating cart:", formData);

    const response = await fetch(`http://localhost:4001/users/${user?._id}/cart`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        'Authorization': `Bearer ${user?.token}`,
        'Content-Type': 'application/json'
      }
    });

    const json = await response.json();
    if (response.ok) {
      console.log("Successfully updated cart:", json);
      updatedUserCart(); // Fetch updated cart
      if(!existingItem)
      {
        notify('Updated the cart', 'success')
      }
    } else {
      notify("Failed to update cart", "error");
    }
  } catch (error) {
    console.log("Error updating cart:", error);
  }
};

  const subtotal = cart?.reduce(
    (acc, item) => acc + (item?.productId?.price?.sale || 0) * item?.quantity,
    0
  );
  // const deliveryCharges = 40;
  // const total = subtotal + deliveryCharges;

  return (
    <div className={`cart-popup ${isOpen ? "show" : ""}`}>
      <div className="cart-popup-content">
        <div className="cart-header">
          <img src={closeIcon} alt="Close" className="close-icon clsicon" onClick={onClose} />
          <h2>Cart</h2>
        </div>

        {/* Total Items Section */}
        <div className="cart-total-items">
          <span>PRODUCT</span>
          <span>QUANTITY</span>
        </div>

        <div className="cart-items">
          {cart?.map((item) => (
            <div key={item.productId} className="cut-item">
              <img
                src={`http://localhost:4001/uploads/${item.productId?.images?.[0] || 'default-image.jpg'}`}
                alt={item.productId?.name || "Product"}
                className="cut-image"
              />
              <div className="cut-details">
                <Link to={`/product/${item?.productId?._id}`} className="cut-name">{item.productId?.name}</Link>
                <p className="cut-weight">
                  {item.productId?.weight} g | Total: ₹{(item.productId?.price?.sale || 0) * item.quantity}
                </p>
                <div className="product-bottom">
                  <div className="price-info">
                    <span className="current-price">₹{item.productId?.price?.sale}</span>
                    <span className="old-price">₹{item.productId?.price?.default}</span>
                  </div>
                  <div className="quantity-control">
                    <button onClick={(e) => { e.preventDefault(); handleAddToCart(item?.productId, "dec"); }}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={(e) => { e.preventDefault(); handleAddToCart(item?.productId, "inc"); }}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart?.length === 0 && 
          <p>There are no products in the basket.</p>
        }

        {cart?.length > 0 && 
        (
          <div className="cart-summary">
          {/* <div className="summary-row">
            <span>Delivery Charges</span>
            <span>₹{deliveryCharges}</span>
          </div> */}
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span className="total-price">₹{subtotal}</span>
          </div>
        </div>
        )}

        {cart?.length > 0 &&
        <Link to="/checkout" className="checkout-link" style={{ textDecoration: "none" }} onClick={onClose}>
          <button className="checkout-button">Proceed to Checkout</button>
        </Link>
        }
      </div>
    </div>
  );
};

export default CartPopup;
