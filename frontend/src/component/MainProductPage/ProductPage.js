import React, { useEffect, useState } from "react";
import "./ProductPage.css";
import img1 from "../../assets/fishimage.png";
import img2 from "../../assets/mutton.png";
import useNotify from "../../hooks/useNotify";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

const product = {
  name: "Whole Cleaned (with head) Black Pomfret Fish/ Halwa Fish",
  unitWeight: 250, // Weight per unit in grams
  unitPrice: 170, // Price per unit
  originalPrice: 500, // Old price
  images: [img1, img2], // Product images
  inStock: true, // Change to false if out of stock
};

const ProductPage = ({fetchCart, cart}) => {
 
  const [product, setProduct] = useState('')
  const {user} = useAuthContext();
  const {notify} = useNotify();
  const navigate = useNavigate();
  const {id} = useParams();
  const [mainImage, setMainImage] = useState("");
  const [zoomedImage, setZoomedImage] = useState(null); // Modal Image

  const fetchData = async () => {
    try {
        const response = await fetch(`https://backend.freshimeat.in/products/${id}`);
        const json = await response.json();

        if (response.ok) {
            setProduct(json)
            console.log(json)
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
  },[user, id])

  useEffect(() => {
    setMainImage(product?.images?.[0]);
  }, [product]);

  const handleImageChange = (image) => {
    setMainImage(image);
  };

  const openZoom = (image) => {
    setZoomedImage(image);
  };

  const closeZoom = () => {
    setZoomedImage(null);
  };

  
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



// Calculate total price & weight dynamically
const cartItem = cart?.find((item) => item?.productId?._id === id);
const totalPrice = cartItem ? cartItem.quantity * product?.price?.sale : 0;
const totalWeight = cartItem ? cartItem.quantity * product?.weight : 0;

const unitSellingPrice = (product?.price?.sale / product?.weight).toFixed(2); // ₹ per gram

useEffect(()=>{
  setMainImage(product?.images?.[0])
  console.log(cartItem)
},[product, cartItem])
console.log(mainImage)

  return (
    <div className="product-container">
      {/* Main Product Image */}
      <img
        src={`https://backend.freshimeat.in/uploads/${mainImage}`}
        alt={product?.name}
        className="product-image"
        onClick={() => openZoom(mainImage)}
      />

      {/* Small Images below Main Image */}
      <div className="product-thumbnails">
        {product?.images?.map((image, index) => (
          <img
            key={index}
            src={`https://backend.freshimeat.in/uploads/${image}`}
            alt={`Thumbnail ${index + 1}`}
            className={`thumbnail-image ${mainImage === image ? "active" : ""}`}
            onClick={() => handleImageChange(image)}
          />
        ))}
      </div>

      {/* Product Details */}
      <h2 className="product-title">{product?.name}</h2>
      <p className="product-subtitle">
        {product?.weight} g | Unit Selling Price: ₹{unitSellingPrice}/g
      </p>

      <div className="product-bottom">
        <div className="product price-info">
          <span className="product-current current-price">₹{product?.price?.sale}</span>
          <span className="product-old old-price">₹{product?.price?.default}</span>
        </div>

        {product?.inStock ? (
          cartItem ? (
            <div className="quantity-control">
              <button onClick={(e) => { e.preventDefault(); handleAddToCart(product, "dec"); }}>-</button>
              <span>{cartItem?.quantity}</span>
              <button onClick={(e) => { e.preventDefault(); handleAddToCart(product, "inc"); }}>+</button>
            </div>
          ) : user?.userType !== "Admin" &&(
            <button className="add-btn" onClick={(e) => { e.preventDefault(); handleAddToCart(product, "inc"); }}>
              ADD
            </button>
          )
        ) : (
          <p className="product-outofstock">Currently Out of Stock</p>
        )}
      </div>

      {/* Dynamic Total Price & Weight */}
      {cartItem && (
  <p className="product-weight">
    Total Price: ₹{totalPrice} | Total Weight: {totalWeight}g
  </p>
)}


      <hr className="productdown"  />

      {/* Description */}
      <h3 className="section-title">Description</h3>
      <p className="product-warning">Actual Product Weight may vary by 30g - 40g.</p>
      <p className="product-description">
  {product?.description?.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ))}
</p>


      <hr className="productdown" />

      {/* Storage Instructions */}
      <h3 className="section-title">Storage Instructions</h3>
      <ul className="product-description">
        <li>Store in an airtight container or vacuum-sealed bag below 4°C.</li>
        <li>Consume within 1-2 days.</li>
        <li>Keep airtight to prevent odor absorption and freezer burn.</li>
      </ul>


       {/* Modal for Zoomed Image */}
       {zoomedImage && (
        <div className="modal-overlay1" onClick={closeZoom}>
          <div className="modal-content1">
            <span className="close-button" onClick={closeZoom}>✖</span>
            <img src={`https://backend.freshimeat.in/uploads/${zoomedImage}`} alt="Zoomed" className="zoomed-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
