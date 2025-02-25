import { useEffect, useRef, useState } from "react";
import "./Checkout.css";
import homeIcon from "../../assets/home (1).png";
import AddressEditModal from "./AddressEditModal";
import AddNewAddressModal from "./AddNewAddressModal";
import OrderSummary from "./OrderSummary"; // Import Order Summary
import img1 from "../../assets/fishimage.png";
import { useAuthContext } from "../../hooks/useAuthContext";
import useNotify from "../../hooks/useNotify";
import officeActiveIcon from "../../assets/location (1).png";


const Checkout = ({cart, fetchCart}) => {
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false); // Toggle between address selection and order summary
  const [currentAddress, setCurrentAddress] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1 = Address, 2 = Order Summary, 3 = Payment
  const [addressId, setAddressId] = useState('')
  const {notify} = useNotify();

  const [addresses, setAddresses] = useState([]);
  const {user} = useAuthContext();
  const [ssH, setSsH] = useState(0)

  useEffect(()=>{
    setAddresses(user?.addresses)
    console.log(user)
  },[user, user?.address])

  const handleEditClick = (index) => {
    setCurrentAddress({ ...addresses[index] });
    setIsEditing(true);
  };

  const handleSaveAddress = (updatedAddress) => {
    setAddresses(
      addresses.map((addr) =>
        addr._id === updatedAddress._id ? updatedAddress : addr
      )
    );
    setIsEditing(false);
  };

  const handleAddNewAddress = (newAddress) => {
    setAddresses([...addresses, { id: addresses?.length, ...newAddress }]);
    setIsAdding(false);
  };

  const usedtags = addresses?.map((addr) => addr?.tag);
  const availableTypes = ["home1", "home2", "office"]?.filter(
    (type) => !usedtags?.includes(type)
  );
  const disableAddButton = availableTypes.length === 0;

  useEffect(() => {
    if (currentStep === 1) {
        setSsH("0%");
    } else if (currentStep === 2) {
        setSsH("50%");
    } else if (currentStep === 3) {
        setSsH("100%");
    }
}, [currentStep]); // ✅ Only depend on currentStep


  return (
    <div className="checkout-container">
      {showOrderSummary ? (
        <OrderSummary
        address={addresses[selectedAddress]}
        orderItems={cart}
        setCurrentStep={setCurrentStep}
        setShowOrderSummary={setShowOrderSummary} // ✅ Pass this prop
        fetchCart={fetchCart}
      />
      
      ) : (
        <div className="address-section">
          <h2>Your Saved Addresses</h2>
          {addresses?.map((addr, index) => (
            <div
              key={addr?._id}
              className={`address-box ${
                selectedAddress === index ? "selected" : ""
              }`}
              onClick={() => setSelectedAddress(index)}
            >
              <div className="address-content">
                <p className="name">
                  {addr?.firstName} {addr?.lastName}{" "}
                  <span className="phone">{addr?.phoneNo}</span>
                </p>
                <p className="address">
                  {addr?.address}, {addr?.landmark}, {addr?.city}, {addr?.state} -{" "}
                  {addr?.pincode}
                </p>
              </div>
              <div className="address-actions">
                <button className="home-button-checkout">
                  <img src={addr?.tag === "office" ? officeActiveIcon: homeIcon} alt="Home Icon" className="home-icon" />{" "}
                  {addr?.tag?.toUpperCase()}
                </button>
                <button
                  className="edit-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(index);
                    setAddressId(addr?._id)
                  }}
                >
                  EDIT
                </button>
              </div>
            </div>
          ))}
          <div className="buttons">
            <button
              className="add-address"
              onClick={() => setIsAdding(true)}
              disabled={disableAddButton}
            >
              Add New Address
            </button>

            <button
              className="select-address"
              onClick={() => {
                if (addresses?.length > 0) {
                  setShowOrderSummary(true);
                  setCurrentStep(2); // Move progress to Order Summary
                }else{
                  notify("Add address to continue", "error")
                }
              }}
              
            >
              Select Address
            </button>
          </div>
          
        </div>
        
      )}
    <div className="scrolling-steps">
        <ul>
          <div className="ssLine" style={{height: ssH}}></div>
          <li
            className={currentStep >= 1 ? "active" : ""}
            onClick={() => {
              setCurrentStep(1);
              setShowOrderSummary(false); // ✅ Go back to Address Selection
            }}
          >
            Address <br />
            <span>Select delivery address</span>
          </li>
          <li className={currentStep >= 2 ? "active" : ""}>
            Order Summary <br />
            <span>Confirm order details</span>
          </li>
          <li className={currentStep >= 3 ? "active" : ""}>Payment</li>
        </ul>
      </div>

      {isEditing && (
        <AddressEditModal
          address={currentAddress}
          onClose={() => setIsEditing(false)}
          onSave={handleSaveAddress}
          addressId={addressId}
        />
      )}
      {isAdding && (
        <AddNewAddressModal
          onClose={() => setIsAdding(false)}
          onSave={handleAddNewAddress}
          availableTypes={availableTypes}
        />
      )}
    </div>
  );
};

export default Checkout;
