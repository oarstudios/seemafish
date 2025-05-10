import React, { useEffect, useState } from "react";
import "./PincodePopup.css";
import logo from "../../assets/Seema Fish Logo.svg";
import { useAuthContext } from "../../hooks/useAuthContext";

const PincodePopup = ({ onClose, onSubmit }) => {
  const [pincode, setPincode] = useState("");
  const [serviceMessage, setServiceMessage] = useState("");
  const [isServiceable, setIsServiceable] = useState(null);
  const { user } = useAuthContext();

  const [pincodes, setPincodes] = useState([]);

  const fetchPincodes = async () => {
    try {
      const response = await fetch(`https://backend.freshimeat.in/pincodes`);
      const json = await response.json();

      if (response.ok) {
        // const prdTags = json.filter(prd => prd?.produtTag === product?.productTag);
        //console.log(json);
        setPincodes(json);
        //console.log(json);
        // setCart(json)
      } else {
        console.error("Failed to fetch products:", json);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchPincodes();
  }, [user]);

  const handleSubmit = () => {
    onSubmit(pincode);

    const matchedPincode = pincodes.find(
      (item) => JSON.stringify(item?.pincode) === pincode
    );

    if (!matchedPincode) {
      setServiceMessage("Sorry! We do not serve in your city yet.");
      setIsServiceable(false);
    } else {
      setServiceMessage("Awesome! We serve in your city.");
      setIsServiceable(true);
    }
    setTimeout(() => {
      onClose();
    }, 2000); // Close popup after 3 seconds
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <img src={logo} alt="Logo" className="popup-logo" />
        <h3 className="popup-title">Choose Delivery Location</h3>

        <input
          type="text"
          placeholder="Enter your city's PINCODE"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="pincode-input"
        />

        <button onClick={handleSubmit} className="continue-btn">
          Continue
        </button>

        {serviceMessage && (
          <p
            className={`service-message ${
              isServiceable ? "serviceable" : "not-serviceable"
            }`}
          >
            {serviceMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default PincodePopup;
