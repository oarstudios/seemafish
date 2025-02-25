import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link
import "./BestSellers.css";

import seerFish from "../../assets/fishimage.png";
import prawns from "../../assets/fishimage.png";
import pomfret from "../../assets/fishimage.png";
import bombil from "../../assets/fishimage.png";
import { useAuthContext } from "../../hooks/useAuthContext";
import {useNotify} from "../../hooks/useNotify"

export default function BestSellers({fetchCart, cart}) {
  const [bestSellers, setBestSellers] = useState([])
  const {user} = useAuthContext();
  const {notify} = useNotify();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
        const response = await fetch(`http://localhost:4001/products`);
        const json = await response.json();

        if (response.ok) {
            const bestSellers = json.filter(product => product.bestseller === true && product.isArchived === false); // Filter bestsellers
            console.log(json);
            setBestSellers(bestSellers);
            // setCart(json)
        } else {
            console.error("Failed to fetch products:", json);
        }
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};


  useEffect(()=>{
    fetchData();
    fetchCart();
  },[user])

  
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


const handleAddToCart = async (product, status) => {
  if (!user) {
    return showError();
  }

  try {
    const value = status === "inc" ? 1 : -1; // Increase or decrease quantity

    // Find if product exists in cart
    const existingItem = cart.find((item) => item?.productId?._id === product?._id);

    const formData = {
      productId: product?._id,
      quantity: existingItem ? existingItem.quantity + value : 1, // Adjust quantity
      weight: product?.weight,
      price: product?.price?.sale
    };

    // Prevent sending invalid quantity (e.g., 0 or negative)
    if (existingItem && existingItem.quantity + value <= 0) {
      return removeFromCart(product); // Call function to remove item from cart
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



  return (
    <div className="best-sellers">
      <h2>Best Sellers</h2>
      <p>Try out our people favorites!</p>
      <div className="product-grid">
      {bestSellers?.map((product) => {
  const cartItem = cart.find((item) => item?.productId?._id === product?._id);

  return (
    <Link to={`/product/${product._id}`} className="product-card-link" key={product._id}>
      <div className="product-card">
        <img src={`http://localhost:4001/uploads/${product?.images?.[0]}`} alt={product.name} />
        <div className="product-info">
          <h3>{product.name}</h3>
          <div className="product-bottom">
            <div className="price-info">
              <span className="current-price">₹{product?.price?.sale}</span>
              <span className="old-price">₹{product?.price?.default}</span>
              <div className="weight">{product?.weight} g</div>
            </div>
            
            {cartItem ? (
              <div className="quantity-control">
                <button onClick={(e) => { e.preventDefault(); handleAddToCart(product, "dec"); }}>-</button>
                <span>{cartItem.quantity}</span>
                <button onClick={(e) => { e.preventDefault(); handleAddToCart(product, "inc"); }}>+</button>
              </div>
            ) : user?.userType != "Admin" && product?.inStock === true &&(
              <button className="add-btn" onClick={(e) => { e.preventDefault(); handleAddToCart(product, "inc"); }}>
                ADD
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
})}

      </div>
    </div>
  );
}
