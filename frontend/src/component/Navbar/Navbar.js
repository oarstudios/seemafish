import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import logo from "../../assets/Seema Fish Logo.svg";
import callIcon from "../../assets/call.svg";
import messageIcon from "../../assets/mail.svg";
import locationIcon from "../../assets/location.svg";
import searchIcon from "../../assets/search.svg";
import adminIcon from "../../assets/account.svg";
import cartIcon from "../../assets/cart.svg";
import hamburgerIcon from "../../assets/Hamburger.svg";
import closeIcon from "../../assets/cross.svg";
import PincodePopup from "../PincodePopup/PincodePopup";
import Signup from "../Signup/Signup";
import CartPopup from "../CartPopup/CartPopup";
import "./Navbar.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import trend from '../../assets/trend.png'

const Navbar = ({ fetchCart, cart, handleShowCartNot }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [pincode, setPincode] = useState("400001");
  const [sOpen, setSOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 680px)").matches
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPopupOpen(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handlePincodeClick = () => setIsPopupOpen(true);
  const handlePincodeSubmit = (newPincode) => setPincode(newPincode);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 580px)").matches);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (sOpen) {
      setMenuOpen(false);
    }
  }, [sOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        !event.target.closest(".mobile-menu") &&
        !event.target.closest(".hamburger-menu")
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  const [sgStyle, setSgStyle] = useState({
    display: "flex",
  });

  useEffect(() => {
    console.log(user?._id);
    if (user) {
      setSOpen(false);
    }
  }, [user]);

  const handleAccClick = () => {
    if (!user) {
      setSOpen(true); // Open signup modal
    } else {
      navigate("/myaccount"); // Redirect to my account
    }
  };

  useEffect(() => {
    if (!sOpen) {
      setTimeout(() => {
        setSgStyle({
          display: "none",
        });
      }, 1000);
    } else {
      setSgStyle({
        display: "flex",
      });
    }
  }, [sOpen]);

  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(`https://backend.freshimeat.in/products`);
      const json = await response.json();

      if (response.ok) {
        console.log(json);
        const filteredProducts = json.filter((product) => !product.isArchived);
        setProducts(filteredProducts);
        setFilteredProducts(filteredProducts);
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
  }, [user]);

  // Search Handler
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        !event.target.closest(".mobile-menu") &&
        !event.target.closest(".hamburger-menu")
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  const handleDash = ()=>{
    navigate('/admin/')
  }

  return (
    <div>
      {isPopupOpen && (
        <PincodePopup
          onClose={() => setIsPopupOpen(false)}
          onSubmit={handlePincodeSubmit}
        />
      )}
      {/* {sOpen && ( */}
      <div
        className={`sgIn ${sOpen ? "rollDown" : "rollUp"}`}
        style={sgStyle}
        onClick={() => setSOpen(false)}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <Signup />
        </div>
      </div>
      {/* )} */}

      {/* Top Bar (Hidden on Mobile) */}
      {!isMobile && (
        <div className="top-bar">
          <div className="left-info">
            <img src={callIcon} alt="Call" className="icon" />
            <Link to="tel:+917506770659">+91 75067 70659</Link>
            <span className="divider">|</span>
            <img src={messageIcon} alt="Email" className="icon" />
            <Link to="mailto:freshimeats@gmail.com">freshimeats@gmail.com</Link>
          </div>
          <div className="right-info">
            <Link to={"/about-us"}>Why Us</Link>
            <span className="divider">|</span>
            <Link to={"/contact"}>Bulk Order</Link>
          </div>
        </div>
      )}

      {/* Navbar */}
      <div className="navbar">
        <div className="left-section">
          <Link to="/">
            {" "}
            <img src={logo} alt="Freshimeat Logo" className="logo" />
          </Link>
          {user && user?.userType === "Admin" && (
            <button onClick={handleDash} className="lgnBtn" style={{marginLeft: "20px"}}>Dashboard</button>
          )}
        </div>

        <div className="right-section">
         {user && (

<div className="location" onClick={handlePincodeClick}>
<img src={locationIcon} alt="Location" />
<span className="pincode">{pincode}</span>
<span className="dropdown">&#9662;</span>
</div>
         )}

          {/* Search Box */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
            />
            <img src={searchIcon} alt="Search" className="search-icon" />
            {searchQuery && (
              <div className="search-results">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      onClick={() => setSearchQuery("")}
                      className="search-item"
                    >
                      {product?.name}
                      {product?.bestseller && <img src={trend} alt="tren" />}
                    </Link>
                  ))
                ) : (
                  <p className="no-results">No products found</p>
                )}
              </div>
            )}
          </div>


          {/* Mobile View: Hamburger Menu */}
          {isMobile ? (
            <div className="hamburger-menu" onClick={toggleMenu}>
              <img src={hamburgerIcon} alt="Menu" className="icon" />
            </div>

          ) : (
            <>
              {user ? (
                <img
                src={adminIcon}
                alt="Admin"
                className="icon"
                onClick={handleAccClick}
              />
              ):(

              <button onClick={handleAccClick} className="lgnBtn">Login</button>
              )}
              
              {!user || user.userType === "Admin" ? null : (
                <img
                  src={cartIcon}
                  alt="Cart"
                  className="icon"
                  onClick={() => {setIsCartOpen(true); handleShowCartNot(false)}}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && isMobile && (
    <div className="mobile-menu">
      <div className="close-menu" onClick={toggleMenu}>
        <img src={closeIcon} alt="Close" className="close-icon" />
      </div>
      <Link
        to={user ? "/myaccount" : "#"}
        onClick={(e) => {
          if (!user) {
            e.preventDefault();
            setSOpen(true);
          }
          setMenuOpen(false); // Close menu on navigation
        }}
      >
        Account
      </Link>
      <Link onClick={() => setIsCartOpen(true)}>
      Cart
      </Link>

      <Link
        to={'/contact'}
        onClick={() => setMenuOpen(false)}
      >
        Bulk Order
      </Link>
      <Link
        to={'/about-us'}
        onClick={() => setMenuOpen(false)}
      >
        Why Us
      </Link>
      <Link
        to="tel:+917506770659"
        onClick={() => setMenuOpen(false)}
      >
        Call Us
      </Link>
      <Link
        to="mailto:freshimeats@gmail.com"
        onClick={() => setMenuOpen(false)}
      >
        Mail Us
      </Link>
    </div>
  )}

      {/* Cart Popup */}
      <CartPopup
        isOpen={isCartOpen}
        onClose={() => {setIsCartOpen(false); handleShowCartNot(true)}}
        fetchCart={fetchCart}
        cart={cart}
      />
    </div>
  );
};

export default Navbar;
