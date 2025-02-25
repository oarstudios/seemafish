import React from "react";
import "./ContactUs.css"; // Import the CSS file

const ContactUs = () => {
  return (
    <div className="contact-container">
      <h2 className="contact-heading">Contact Us</h2>
      <p className="contact-subtext">
        Reach out to us with any inquiries or custom order requests.
      </p>

      <div className="contact-buttons">
        <a href="tel:+917506770659" className="contact-button">
          Call Us
        </a>

        <a href="https://wa.me/+917506770659" className="contact-button">
          Contact Us on WhatsApp
        </a>

        <a href="mailto:freshimeats@gmail.com" className="contact-button">
          Drop Us an Email
        </a>
      </div>
    </div>
  );
};

export default ContactUs;
