import React from "react";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faLinkedin, faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import logo from "../../assets/Seema Fish Logo.svg"
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer">
          <div className="footer-container">
            
            {/* Logo Section */}
            <div className="footer-section footer-logo">
              <img src={logo} alt="Freshi Meat" />
              <p>Freshness you can Trust,</p>
              <p>Quality you can Taste!</p>
            </div>
    
            {/* Terms, Categories, and Socials */}
            <div className="footer-section footer-links">
              <div className="footer-links-row">
                {/* First Column */}
                <div className="footer-links-column">
                  <Link to={'/tnc'}><strong>Terms and Conditions</strong></Link>
                  <Link to={'/privacypolicy'}><strong>Privacy Policy</strong></Link>
                  <Link to={'/refundpolicy'}><strong>Refund Policy</strong></Link>
                  <Link to={'/contactus'}><strong>Contact Us</strong></Link>
                </div>
                
                {/* Second Column */}
                <div className="footer-links-column">
                  <Link to={'/category/SeaWater'}><strong>SeaWater</strong></Link>
                  <Link to={'/category/FreshWater'}><strong>FreshWater</strong></Link>
                  <Link to={'/category/Chicken'}><strong>Chicken</strong></Link>
                  <Link to={'/category/Mutton'}><strong>Mutton</strong></Link>
                </div>
              </div>
    
              {/* Follow Us Section Below */}
              <div className="footer-social">
                <p><strong>Follow Us</strong></p>
                <div className="social-icons">
                  {/* <a href="#" aria-label="Facebook"><FontAwesomeIcon icon={faFacebook} /></a> */}
                  <a href="https://www.instagram.com/seema_fish_kamothe?igsh=bXgzbmN1bmx6enhw&utm_source=qr" target="_blank" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></a>
                  {/* <a href="#" aria-label="Twitter"><FontAwesomeIcon icon={faXTwitter} /></a> */}
                  <a href="https://youtube.com/@vlogsonu5470?si=8GHchVwxSaZgsHs6" target="_blank" aria-label="Twitter"><FontAwesomeIcon icon={faYoutube} /></a>
                </div>
              </div>
            </div>
    
            {/* Contact Section */}
            <div className="footer-section footer-contact">
              <p><strong>Email</strong></p>
              <p>freshimeats@gmail.com</p>
              <p><strong>Phone</strong></p>
              <p>+91 75067 70659</p>
              <p><strong>Address</strong></p>
              <p>Sector 11, Kamothe, Panvel, Raigad, Navi Mumbai, Maharashtra 410209</p>
            </div>
          </div>
    
          {/* Copyright */}
          <div className="footer-bottom">
            <p className="copyright">© COPYRIGHT FRESHI MEAT 2025</p>
            <p className="oar">POWERED BY <span className="oar1">OAR <span className="oar2">STUDIOS</span></span></p>
          </div>
        </footer>
      );
};

export default Footer;
