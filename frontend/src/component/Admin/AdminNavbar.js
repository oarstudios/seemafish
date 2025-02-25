import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminNavbar.css";
import logo from "../../assets/Seema Fish Logo.svg";
import admin from "../../assets/admin_acc.svg";

const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleAdminClick = () => {
    navigate("/myaccount");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Close menu when navigating
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-logo-container">
        <Link to="/admin" className="admin-navbar-logo-link" style={{ textDecoration: "none" }}>
          <img src={logo} alt="Seema Fish Logo" className="admin-navbar-logo" />
        </Link>
        <Link to="/admin" className="admin-navbar-admin-link" style={{ textDecoration: "none" }}>
          <span className="admin-text">Admin</span>
        </Link>
      </div>
      <ul ref={menuRef} className={`admin-navbar-links ${menuOpen ? "open" : ""}`}>
        <li>
          <Link to="/admin/customer-orders" className={location.pathname === "/admin/customer-orders" ? "active-link" : ""}>
            Orders
          </Link>
        </li>
        <li>
          <Link to="/admin/products" className={location.pathname === "/admin/products" ? "active-link" : ""}>
            Products
          </Link>
        </li>
        <li>
          <Link to="/admin/creatives" className={location.pathname === "/admin/creatives" ? "active-link" : ""}>
            Creatives
          </Link>
        </li>
        <li>
          <Link to="/admin/customers" className={location.pathname === "/admin/customers" ? "active-link" : ""}>
            Customers
          </Link>
        </li>
        <li>
          <Link to="/admin/quick-pricing" className={location.pathname === "/admin/quick-pricing" ? "active-link" : ""}>
            Quick Pricing
          </Link>
        </li>
        <li>
          <Link to="/admin/delivery-pricing" className={location.pathname === "/admin/delivery-pricing" ? "active-link" : ""}>
            Delivery Pricing
          </Link>
        </li>
      </ul>
      <div className="admin-navbar-icons">
        <img src={admin} alt="Admin Icon" onClick={handleAdminClick} />
        <button className="admin-hamburger" onClick={toggleMenu}>
          <div className="admin-hamburger-line"></div>
          <div className="admin-hamburger-line"></div>
          <div className="admin-hamburger-line"></div>
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
