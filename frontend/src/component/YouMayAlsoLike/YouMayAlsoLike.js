import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import seerFish from "../../assets/fishimage.png";
import prawns from "../../assets/fishimage.png";
import pomfret from "../../assets/fishimage.png";
import bombil from "../../assets/fishimage.png";
import { useAuthContext } from "../../hooks/useAuthContext";
import useNotify from "../../hooks/useNotify";

export default function YouMayAlsoLike({fetchCart, cart}) {
  const [timeLeft, setTimeLeft] = useState(100 * 60); // 100 minutes in seconds (1hr 40min)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const [products, setProducts] = useState([])
  const {user} = useAuthContext();
  const {notify} = useNotify();
  const navigate = useNavigate();


  const fetchData = async () => {
    try {
        const response = await fetch(`https://backend.freshimeat.in/products  `);
        const json = await response.json();

        if (response.ok) {
            // Filter products where isArchived is false
            const filteredProducts = json.filter(product => !product.isArchived);

            // Shuffle and select 8 random products
            const randomProducts = filteredProducts
                .sort(() => 0.5 - Math.random()) // Shuffle array
                .slice(0, 8); // Get first 8 items

            //console.log(randomProducts);
            setProducts(randomProducts);
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
        updatedUserCart(); // Fetch updated cart
        if(!existingItem)
        {
          notify('Updated the cart', 'success')
        }
      } else {
        notify("Failed to update cart", "error");
      }
    } catch (error) {
      //console.log("Error updating cart:", error);
    }
  };

  return (
    <div className="best-sellers">
      <h2>You May Also Like</h2>
      <p>Explore our recommended products!</p>
      <div className="product-grid">
      {products?.map((product, index) => {
          const cartItem = cart.find((item) => item?.productId?._id === product?._id);
          return (
<Link to={`/product/${product?._id}`} key={index} className="product-card-link">
          <div key={index} className="product-card">
            <img src={`https://backend.freshimeat.in/uploads/${product?.images?.[0]}`} alt={product?.name} />
            <div className="product-info">
              <h3>{product?.name}</h3>
              <div className="product-bottom">
                <div className="price-info">
                  <span className="current-price">₹{product?.price?.sale}</span>
                  <span className="old-price">₹{product?.price?.default}</span>
                  <div className="weight">{product?.weight} g</div>
                </div>
                {cartItem ? (
                  <div className="quantity-control">
                    <button  onClick={(e) => { e.preventDefault(); handleAddToCart(product, "dec"); }}>-</button>
                    <span>{cartItem?.quantity}</span>
                    <button  onClick={(e) => { e.preventDefault(); handleAddToCart(product, "inc"); }}>+</button>
                  </div>
                ) :  user?.userType !== "Admin" && product.inStock === true &&(
                  <button className="add-btn" onClick={(e) => { e.preventDefault(); handleAddToCart(product, "inc"); }}>
                    ADD
                  </button>
                )}
              </div>
            </div>
          </div>
          </Link>
          )
              
})}
      </div>
    </div>
  );
}
