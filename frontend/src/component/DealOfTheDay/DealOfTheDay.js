import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link
import "./DealOfTheDay.css";

import CartNotification from "../CartNotification/CartNotification";

import seerFish from "../../assets/fishimage.png";
import prawns from "../../assets/fishimage.png";
import pomfret from "../../assets/fishimage.png";
import bombil from "../../assets/fishimage.png";
import { useAuthContext } from "../../hooks/useAuthContext";
import useNotify from "../../hooks/useNotify";

const dealOfTheDay = [
  { name: "Seer Fish/ Surmai/ King Fish", price: 470, image: seerFish },
  { name: "Prawns/ Kolambi/ Jhinga", price: 470, image: prawns },
  { name: "Medium White Pomfret/ Paplet Fish", price: 470, image: pomfret },
  { name: "Bombay Duck Fish/ Bombil Fish", price: 470, image: bombil },
];

export default function DealOfTheDay({fetchCart, cart}) {

  const [products, setProducts] = useState([])
  const {user} = useAuthContext();
  const {notify} = useNotify();
  const navigate = useNavigate();


   const [showNotification, setShowNotification] = useState(false);
    const [cartValue, setCartValue] = useState(0);
    const [cartItems, setCartItems] = useState(0);
    const [notificationTimer, setNotificationTimer] = useState(null); // Track the timer
    
    useEffect(() => {
      if (cart.length > 0) {
        const totalValue = cart.reduce((sum, item) => sum + item.productId.price.sale * item.quantity, 0);
        setCartValue(totalValue);
        setCartItems(cart.reduce((sum, item) => sum + item.quantity, 0));
      }
    }, [cart]);


  const fetchData = async () => {
    try {
        const response = await fetch(`https://backend.freshimeat.in/ftds`);
        const json = await response.json();

        if (response.ok) {
            //console.log(json);
            const filteredProducts = json.filter(product => !product?.product?.isArchived);
            setProducts(filteredProducts);
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
      const response = await fetch(`https://backend.freshimeat.in/users/${user?._id}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
  
      const updatedUser = await response.json();
      //console.log('updated user', updatedUser)
      if (response.ok) {
        // setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify({token: user.token, user: updatedUser}));
        
        fetchCart();
        //console.log("updt", user)
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
  
      const response = await fetch(`https://backend.freshimeat.in/users/${user?._id}/cart/${product._id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
  
      if (response.ok) {
        //console.log("Product removed from cart");
        updatedUserCart(); // Fetch updated cart
      } else {
        notify("Failed to remove from cart", "error");
      }
    } catch (error) {
      //console.log("Error removing product from cart:", error);
    }
  };
  
  
  const handleAddToCart = async (product, status) => {

    fetchCart();  // Update the cart
    setShowNotification(true); // Show the notification


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
  
      //console.log("Updating cart:", formData);
  
      const response = await fetch(`https://backend.freshimeat.in/users/${user?._id}/cart`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const json = await response.json();
      if (response.ok) {
        //console.log("Successfully updated cart:", json);
        updatedUserCart();
        notify("Updated the cart", "success");
  
        // Show only one notification and reset the timer
        setShowNotification(true);
  
        if (notificationTimer) {
          clearTimeout(notificationTimer);
        }
  
        const newTimer = setTimeout(() => {
          setShowNotification(false);
        }, 60000);
  
        setNotificationTimer(newTimer);
      } else {
        notify("Failed to update cart", "error");
      }
    } catch (error) {
      //console.log("Error updating cart:", error);
    }
  };

  return (
    <div className="best-sellers">
      <h2>Deal of the Day</h2>
      <p>Exclusive offers on our finest seafood!</p>
      <div className="product-grid">
       {products?.map((product, index) => {
                 const cartItem = cart.find((item) => item?.productId?._id === product?.product?._id);
                 return (
       <Link to={`/product/${product?.product?._id}`} key={index} className="product-card-link">
                 <div key={index} className="product-card">
                   <img src={`https://backend.freshimeat.in/uploads/${product?.product?.images?.[0]}`} alt={product?.product?.name} />
                   <div className="product-info">
                     <h3>{product?.product?.name}</h3>
                     <div className="product-bottom">
                       <div className="price-info">
                         <span className="current-price">₹{product?.product?.price?.sale}</span>
                         <span className="old-price">₹{product?.product?.price?.default}</span>
                         <div className="weight">{product?.product?.weight} g</div>
                       </div>
                       {cartItem ? (
  <div className="quantity-control">
    <button onClick={(e) => { e.preventDefault(); handleAddToCart(product?.product, "dec"); }}>-</button>
    <span>{cartItem?.quantity}</span>
    <button onClick={(e) => { e.preventDefault(); handleAddToCart(product?.product, "inc"); }}>+</button>
  </div>
) : ( 
  user?.userType !== "Admin" && product?.product?.inStock === true && (
    <button className="add-btn" onClick={(e) => { e.preventDefault(); handleAddToCart(product?.product, "inc"); }}>
      ADD
    </button>
  )
)}

                     </div>
                   </div>
                 </div>
                 </Link>
                 )
                     
       })}
       {products?.length === 0 && <p>No Deals for today.</p>}
      </div>


      {/* {showNotification && <CartNotification cartItems={cartItems} totalValue={cartValue} onClose={() => setShowNotification(false)} />} */}
    </div>
  );
}
