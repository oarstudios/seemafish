import React, { useEffect, useState } from "react";
import "./CutsProduct.css";
import img1 from "../../assets/fishimage.png";
import { useAuthContext } from "../../hooks/useAuthContext";
import useNotify from "../../hooks/useNotify";
import { Link, useNavigate, useParams } from "react-router-dom";

const cuts = [
  { id: 1, name: "Whole Black Pomfret Fish", weight: "500 g", price: 670, originalPrice: 770, img: img1 },
  { id: 2, name: "Whole Black Pomfret Fish", weight: "1000 g", price: 970, originalPrice: 1070, img: img1 },
  { id: 3, name: "Steaks (with skin) Black Pomfret", weight: "500 g", price: 730, originalPrice: 870, img: img1 },
  { id: 4, name: "Steaks Black Pomfret Fish", weight: "500 g", price: null, originalPrice: null, img: img1, outOfStock: true },
];

const CutsProduct = ({fetchCart, cart}) => {

  const [products, setProducts] = useState([])
  const [prdTag, setPrdTag] = useState('')
  const {user} = useAuthContext();
  const {notify} = useNotify();
  const navigate = useNavigate();
  const {id} = useParams();

  const fetchData = async () => {
    try {
        const response = await fetch(`http://localhost:4001/products/${id}`);
        const json = await response.json();

        if (response.ok) {
          // const prdTags = json.filter(prd => prd?.produtTag === product?.productTag); 
          console.log(json);
            setPrdTag(json)
            console.log(json)
            // setCart(json)
        } else {
            console.error("Failed to fetch products:", json);
        }
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

const fetchAllPrds = async () => {
  try {
      const response = await fetch(`http://localhost:4001/products`);
      const json = await response.json();

      if (response.ok) {
        // const prdTags = json.filter(prd => prd?.productTag === prdTag && prd.isArchived === false); 
        const prdTags = json.filter(prd => prd.isArchived === false); 
        console.log(prdTags);
          setProducts(prdTags)
          console.log(json)
          // setCart(json)
      } else {
          console.error("Failed to fetch products:", json);
      }
  } catch (error) {
      console.error("Error fetching products:", error); 
  }
};


useEffect(() => {
    fetchData();
    fetchCart();
    fetchAllPrds();
  
}, [user, id]); // Now it runs every time `id` changes


  
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
    console.log(product, status,)
    const value = status === "inc" ? 1 : -1; // Increase or decrease quantity

    // Find if product exists in cart
    const existingItem = cart.find((item) => item?.productId?._id === product?._id);

    const formData = {
      productId: product?._id,
      quantity: existingItem ? existingItem?.quantity + value : 1, // Adjust quantity
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

const handleNavigate = (productId) => {
  navigate(`/product/${productId}`);
};

  return (
    <div className="cuts-container">
      <h3 className="cuts-title">Explore other Cuts/ Quantity in this product</h3>
      {products?.map((cut) => {
        const cartItem = cart?.find((item) => item?.productId?._id === cut?._id);
        return (
          <div key={cut.id} className="cut-item">
            <img src={`http://localhost:4001/uploads/${cut?.images?.[0]}`} onClick={() => handleNavigate(cut?._id)} alt={cut.name} className="cut-image" />
            <div className="cut-details">
              <p className="cut-name" onClick={() => handleNavigate(cut?._id)}>{cut?.name}</p>
              <p className="cut-weight">{cut?.weight}g | Total Price: ₹{ cartItem ? cartItem?.quantity * cut?.price?.sale : cut?.price?.sale }</p>

              <div className="product-bottom">
                <div className="price-info">
                  {cut?.inStock ? (
                    <>
                      <span className="current-price">₹{cut?.price?.sale}</span>
                      <span className="old-price">₹{cut?.price?.default}</span>
                    </>
                  ) : (
                    <p className="product-outofstock">Currently Out of Stock</p>
                  )}
                </div>

                {cut.inStock && (
                  cartItem ? (
                    <div className="quantity-control">
                      <button onClick={(e) => { e.preventDefault(); handleAddToCart(cut, "dec"); }}>-</button>
                      <span>{cartItem?.quantity}</span>
                      <button onClick={(e) => { e.preventDefault(); handleAddToCart(cut, "inc"); }}>+</button>
                    </div>
                  ) : user?.userType !== "Admin" &&(
                    <button className="add-btn" onClick={(e) => { e.preventDefault(); handleAddToCart(cut, "inc"); }}>
                      ADD
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CutsProduct;
