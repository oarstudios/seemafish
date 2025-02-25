import React from "react";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faLinkedin, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import logo from "../../assets/Seema Fish Logo.svg"

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
                  <p><strong>Terms and Conditions</strong></p>
                  <p><strong>Privacy Policy</strong></p>
                  <p><strong>Refund Policy</strong></p>
                  <p><strong>Contact Us</strong></p>
                </div>
                
                {/* Second Column */}
                <div className="footer-links-column">
                  <p><strong>Sea water fish</strong></p>
                  <p><strong>Fresh water fish</strong></p>
                  <p><strong>Chicken</strong></p>
                  <p><strong>Mutton</strong></p>
                </div>
              </div>
    
              {/* Follow Us Section Below */}
              <div className="footer-social">
                <p><strong>Follow Us</strong></p>
                <div className="social-icons">
                  <a href="#" aria-label="Facebook"><FontAwesomeIcon icon={faFacebook} /></a>
                  <a href="#" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></a>
                  <a href="#" aria-label="LinkedIn"><FontAwesomeIcon icon={faLinkedin} /></a>
                  <a href="#" aria-label="Twitter"><FontAwesomeIcon icon={faXTwitter} /></a>
                </div>
              </div>
            </div>
    
            {/* Contact Section */}
            <div className="footer-section footer-contact">
              <p><strong>Email</strong></p>
              <p>freshimeat@gmail.com</p>
              <p><strong>Phone</strong></p>
              <p>+91 99999 99999</p>
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
