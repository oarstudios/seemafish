import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./CategoryFull.css"

import seerFish from "../../assets/fishimage.png";
import prawns from "../../assets/fishimage.png";
import pomfret from "../../assets/fishimage.png";
import bombil from "../../assets/fishimage.png";
import DealOfTheDay from "../DealOfTheDay/DealOfTheDay";
import AboutUs from "../AboutUs/AboutUs";
import useNotify from "../../hooks/useNotify";
import { useAuthContext } from "../../hooks/useAuthContext";

const categoryFull = [
  { id: 1, name: "Seer Fish/ Surmai/ King Fish", price: 470, image: seerFish },
  { id: 2, name: "Prawns/ Kolambi/ Jhinga", price: 470, image: prawns },
  { id: 3, name: "Medium White Pomfret/ Paplet Fish", price: 470, image: pomfret },
  { id: 4, name: "Bombay Duck Fish/ Bombil Fish", price: 470, image: bombil },
  { id: 5, name: "Seer Fish/ Surmai/ King Fish", price: 470, image: seerFish },
  { id: 6, name: "Prawns/ Kolambi/ Jhinga", price: 470, image: prawns },
  { id: 7, name: "Medium White Pomfret/ Paplet Fish", price: 470, image: pomfret },
  { id: 8, name: "Bombay Duck Fish/ Bombil Fish", price: 470, image: bombil },
  { id: 9, name: "Seer Fish/ Surmai/ King Fish", price: 470, image: seerFish },
  { id: 10, name: "Prawns/ Kolambi/ Jhinga", price: 470, image: prawns },
  { id: 11, name: "Medium White Pomfret/ Paplet Fish", price: 470, image: pomfret },
  { id: 12, name: "Bombay Duck Fish/ Bombil Fish", price: 470, image: bombil },
];

function CategoryFull({fetchCart, cart}) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const {cat} = useParams();

    const [products, setProducts] = useState([])
  const {user} = useAuthContext();
  const {notify} = useNotify();
  const navigate = useNavigate();


  const fetchData = async () => {
    try {
      const response = await fetch(`https://backend.freshimeat.in/products`);
      const json = await response.json();
  
      if (response.ok) {
        let filteredProducts = [];
  
        if (cat === "price1") {
          // Fetch products with sale price up to 300
          filteredProducts = json.filter(product => product?.price?.sale <= 300  && product.isArchived === false);
        } else if (cat === "price2") {
          // Fetch products with sale price up to 500
          filteredProducts = json.filter(product => product?.price?.sale <= 500  && product.isArchived === false);
        } else if (cat === "price3") {
          // Fetch products with sale price above 300
          filteredProducts = json.filter(product => product?.price?.sale > 500  && product.isArchived === false);
        } else {
          // Default filtering based on category
          filteredProducts = json.filter(product => product?.category === cat  && product.isArchived === false);
        }
  
        console.log(filteredProducts);
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
  
    const totalPages = Math.ceil(categoryFull.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = products?.slice(startIndex, startIndex + itemsPerPage);
  
    
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

    const response = await fetch(`https://backend.freshimeat.in/users/${user?._id}/cart/${product._id}`, {
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

const [ctTitle, setCtTitle]=useState("")
const [ctDesc, setCtDesc]=useState("")

useEffect(() => {
  if (cat === "price1") {
    setCtTitle("Budget-Friendly Seafood");
    setCtDesc("Explore fresh seafood under ₹300.");
  } else if (cat === "price2") {
    setCtTitle("Premium Seafood");
    setCtDesc("Enjoy high-quality seafood under ₹500.");
  } else if (cat === "price3") {
    setCtTitle("Luxury Seafood Selection");
    setCtDesc("Indulge in the finest seafood above ₹500.");
  } else {
    setCtTitle("Sea Fish Products");
    setCtDesc("Explore our wide range of fresh Sea Fish.");
  }
}, [cat]);

  
    return (
      <>
        <div className="best-sellers">
          <h2>{ctTitle}</h2>
          <p>{ctDesc}</p>
          <div className="product-grid">
  {products?.length > 0 ? (
    paginatedItems?.map((product) => {
      const cartItem = cart.find((item) => item?.productId?._id === product?._id);
      
      return (
        <Link to={`/product/${product?._id}`} className="product-card-link" key={product.id}>
          <div className="product-card">
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
                    <button onClick={(e) => { e.preventDefault(); handleAddToCart(product, "dec"); }}>-</button>
                    <span>{cartItem?.quantity}</span>
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
    })
  ) : (
    <p>No products found.</p>
  )}
</div>

  
          {/* Pagination controls */}
          <div className="pagination1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
        <DealOfTheDay fetchCart={fetchCart} cart={cart}/>
        <AboutUs />
      </>
    );
  }
  

export default CategoryFull;
