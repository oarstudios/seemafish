import React, { useState, useEffect } from "react";
import "./ShopByPrice.css";

// Default (Desktop) Images
import image1 from "../../assets/300.png";
import image2 from "../../assets/500.png";
import image3 from "../../assets/above500.png";

// Mobile Images
import image1Mobile from "../../assets/300mobile.png";
import image2Mobile from "../../assets/500mobile.png";
import image3Mobile from "../../assets/above500mob.png";
import { useNavigate } from "react-router-dom";

export default function ShopByPrice() {
  const [image1Src, setImage1Src] = useState(image1);
  const [image2Src, setImage2Src] = useState(image2);
  const [image3Src, setImage3Src] = useState(image3);

  useEffect(() => {
    const updateImages = () => {
      if (window.innerWidth <= 480) {
        setImage1Src(image1Mobile); // Use mobile image for first price range
        setImage2Src(image2Mobile); // Use mobile image for second price range
        setImage3Src(image3Mobile); // Use mobile image for third price range
      } else {
        setImage1Src(image1); // Use desktop image for first price range
        setImage2Src(image2); // Use desktop image for second price range
        setImage3Src(image3); // Use desktop image for third price range
      }
    };

    updateImages(); // Set initial images
    window.addEventListener("resize", updateImages); // Listen for window resize

    return () => {
      window.removeEventListener("resize", updateImages); // Cleanup event listener
    };
  }, []);

  const navigate = useNavigate();

  const handleNavigate = (price)=>{
    navigate(`/category/${price}`)
  }

  return (
    <div className="shop-by-price">
      <h2 className="title">Shop by Price</h2>
      <div className="price-grid">
        <div className="price-card" onClick={()=>handleNavigate('price1')}>
          <img src={image1Src} alt="Up to ₹300" className="price-image" />
        </div>
        <div className="price-card" onClick={()=>handleNavigate('price2')}>
          <img src={image2Src} alt="Up to ₹500" className="price-image" />
        </div>
        <div className="price-card" onClick={()=>handleNavigate('price3')}>
          <img src={image3Src} alt="Above ₹500" className="price-image" />
        </div>
      </div>
    </div>
  );
}
