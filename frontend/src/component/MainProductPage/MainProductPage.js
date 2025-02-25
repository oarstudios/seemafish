import React from "react";
import ProductPage from "./ProductPage";
import CutsProduct from "./CutsProduct";
import CustomerReviews from "../../component/CustomerReviews/CustomerReviews"; // Import CustomerReviews
import YouMayAlsoLike from "../../component/YouMayAlsoLike/YouMayAlsoLike"; // Import YouMayAlsoLike
import AboutUs from "../../component/AboutUs/AboutUs"; // Import AboutUs
import "./MainProductPage.css"; // Add CSS file for proper styling
import { useParams } from "react-router-dom";

const MainProductPage = ({fetchCart, cart}) => {

const {id} = useParams();

  return (
    <>
      <div className="product-page-container">
        <div className="product-left">
          <ProductPage fetchCart={fetchCart} cart={cart} id={id}/>
        </div>
        <div className="product-right">
          <CutsProduct fetchCart={fetchCart} cart={cart}/>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="customer-reviews-section">
        <CustomerReviews />
      </div>

      {/* You May Also Like Section */}
      <div className="you-may-also-like-section">
        <YouMayAlsoLike fetchCart={fetchCart} cart={cart}/>
      </div>

      {/* About Us Section */}
      <div className="about-us-section">
        <AboutUs />
      </div>
    </>
  );
};

export default MainProductPage;
