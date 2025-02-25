import { useState } from "react";
import "./PaymentMethod.css";

const PaymentMethod = () => {
  const [selectedPayment, setSelectedPayment] = useState("paynow");
  const [errorMessage, setErrorMessage] = useState("");

  // COD availability
  const isCODAvailable = false; // Set to false to show 'Not Serviceable' message

  const handlePaymentSelection = (method) => {
    if (method === "cod" && !isCODAvailable) {
      setErrorMessage("COD is currently not Serviceable");
      setSelectedPayment("paynow"); // Keep Pay Now as selected
      return;
    }
    setSelectedPayment(method);
    setErrorMessage(""); // Clear error message if other option is selected
  };

  return (
    <div className="payment-method-container">
      <h3>Payment Method</h3>
      <div className="payment-options">
        <button
          className={`payment-button ${selectedPayment === "paynow" ? "active" : ""}`}
          onClick={() => handlePaymentSelection("paynow")}
        >
          Online Payment
        </button>

        <button
          className={`payment-button cod-button ${selectedPayment === "cod" ? "active" : ""} ${!isCODAvailable ? "disabled" : ""}`}
          onClick={() => handlePaymentSelection("cod")}
        >
          Cash on Delivery
        </button>
      </div>

      {errorMessage && (
        <p className="cod-not-available">{errorMessage}</p>
      )}
    </div>
  );
};

export default PaymentMethod;
