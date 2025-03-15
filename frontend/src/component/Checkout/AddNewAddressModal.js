import React, { useEffect, useState, useRef } from "react";
import "./AddNewAddressModal.css";
import homeActiveIcon from "../../assets/home (1).png";
import homeInactiveIcon from "../../assets/home (2).png";
import officeActiveIcon from "../../assets/location (1).png";
import officeInactiveIcon from "../../assets/location.png";
import { useAuthContext } from "../../hooks/useAuthContext";
import useNotify from "../../hooks/useNotify";

const AddNewAddressModal = ({ onClose, onSave, availableTypes }) => {
  const modalRef = useRef(null);
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    landmark: "",
    state: "Maharashtra",
    city: "",
    pincode: "",
    phoneNo: "",
    tag: ""
  });

   const [pincodes, setPincodes] = useState([])
  
    const fetchPincodes = async () => {
      try {
          const response = await fetch(`https://backend.freshimeat.in/pincodes`);
          const json = await response.json();
  
          if (response.ok) {
            // const prdTags = json.filter(prd => prd?.produtTag === product?.productTag); 
            console.log(json);
              setPincodes(json)
              console.log(json)
              // setCart(json)
          } else {
              console.error("Failed to fetch products:", json);
          }
      } catch (error) {
          console.error("Error fetching products:", error);
      }
  };
  const {user, dispatch} = useAuthContext();

  useEffect(()=>{
    fetchPincodes();
  },[user])

  const {notify} = useNotify();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleSave = async() => {
    onSave(newAddress);
    onClose();

     // After saving, refetch the user data to get the updated address
  try {
    const response = await fetch(`https://backend.freshimeat.in/users/${user?._id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${user.token}`,
      },
    });

    const json = await response.json();
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify({ user: json, token: user?.token }));
      // Update the parent state with the new user data
      // onSave(json);
    } else {
      notify("Error fetching updated user data", "error");
    }
  } catch (error) {
    notify("Error fetching updated user data", "error");
  }
  };

  const handleAddresses= async(e)=>{
    e.preventDefault();
    console.log(user);

    if (!validateInput()) return; // Stop if validation fails

  if (user?.addresses?.length >= 3) {
    notify("Cannot add more than 3 addresses", "error");
    return;
  }

  try {
    // Proceed with API call if validation passes
  } catch (error) {
    notify("Error adding address", "error");
  }

     // Validate that all required fields are filled out
  const requiredFields = [
    "firstName", "lastName", "address", "landmark", 
    "state", "city", "pincode", "phoneNo", "tag"
  ];

  for (let field of requiredFields) {
    if (newAddress[field] == "") {
      notify(`Please fill out the ${field}`, "error");
      return;
    }
  }

  if (user?.addresses?.length >= 3) {
    return notify("Cannot add more than 3 addresses", "error");
  }

  // const matchedPincode = pincodes.find(item => JSON.stringify(item?.pincode) === newAddress?.pincode);
  const matchedPincode = pincodes?.find(
    item => Number(item?.pincode) === Number(newAddress?.pincode) && item?.status
  );
  
  
  // Check if pincode exists in the fetched pincodes list
  if (!matchedPincode) {
    notify("Entered pincode is not serviceable", "error");
    return;
  }
  
  

    try{
      const formData = {
        firstName: newAddress.firstName,
    lastName: newAddress.lastName,
    address: newAddress.address,
    landmark: newAddress.landmark,
    state: "Maharashtra",
    city: newAddress.city,
    pincode: newAddress.pincode,
    phoneNo: newAddress.phoneNo,
    tag: newAddress.tag
      }

      console.log("Form Data:", formData);console.log("Form Data:", formData);

      const response = await fetch(`https://backend.freshimeat.in/users/${user?._id}/address`,{
        method: "POST",
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const json = await response.json();

      if(response.ok)
      {
        console.log(json)
        
        localStorage.setItem('user', JSON.stringify({user: json, token: user?.token}));
        dispatch({ type: 'LOGIN', payload: {user: json, token: user?.token} });
        notify("Address added successfully", "success")
        handleSave();
        onClose();
      }
    }catch(error){
      console.log(error)
      notify("Error adding address", "error")
    }
  }

  const validateInput = () => {
    const { firstName, lastName, phoneNo, pincode } = newAddress;
  
    // Name validation (Only alphabets)
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(firstName)) {
      notify("First name must contain only letters", "error");
      return false;
    }
    if (!nameRegex.test(lastName)) {
      notify("Last name must contain only letters", "error");
      return false;
    }
  
    // Phone number validation (Must be exactly 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNo)) {
      notify("Phone number must be exactly 10 digits", "error");
      return false;
    }
  
    // Pincode validation (Check if it's serviceable)
    const matchedPincode = pincodes.find(
      (item) => Number(item.pincode) === Number(pincode) && item.status
    );
    if (!matchedPincode) {
      notify("Entered pincode is not serviceable", "error");
      return false;
    }
  
    return true;
  };
  

  return (
    <div className="modal-overlay">
      <form className="modal-content" onSubmit={handleAddresses}>
        <button type="button" className="close-button-pop" onClick={onClose}>×</button>

        <h2>Add New Address</h2>

        {/* Address Type Selection */}
        {/* Address Type Selection */}
        <div className="address-type">
          {availableTypes.includes("home1") && (
            <button
            type="button"
              className={`home-button ${newAddress.tag === "home1" ? "active" : "inactive"}`}
              onClick={() => setNewAddress({ ...newAddress, tag: "home1" })}
            >
              <img 
                src={newAddress.tag === "home1" ? homeActiveIcon : homeInactiveIcon} 
                alt="Home Icon" 
                className="home-icon" 
              />
              HOME 1
            </button>
          )}

          {availableTypes.includes("home2") && (
            <button
            type="button"
              className={`home-button ${newAddress.tag === "home2" ? "active" : "inactive"}`}
              onClick={() => setNewAddress({ ...newAddress, tag: "home2" })}
            >
              <img 
                src={newAddress.tag === "home2" ? homeActiveIcon : homeInactiveIcon} 
                alt="Home Icon" 
                className="home-icon" 
              />
              HOME 2
            </button>
          )}

          {availableTypes.includes("office") && (
            <button
            type="button"
              className={`home-button ${newAddress.tag === "office" ? "active" : "inactive"}`}
              onClick={() => setNewAddress({ ...newAddress, tag: "office" })}
            >
              <img 
                src={newAddress.tag === "office" ? officeActiveIcon : officeInactiveIcon} 
                alt="Office Icon" 
                className="home-icon" 
              />
              OFFICE
            </button>
          )}
        </div>


        {/* Address Form */}
        <div className="input-group">
          <div className="input-container">
            <input type="text" name="firstName" value={newAddress.firstName} onChange={handleChange} />
            <label>First Name*</label>
          </div>
          <div className="input-container">
            <input type="text" name="lastName" value={newAddress.lastName} onChange={handleChange} />
            <label>Last Name*</label>
          </div>
        </div>

        <textarea name="address" value={newAddress.address} onChange={handleChange} placeholder="Full Address"></textarea>
        <div className="input-container">
          <input type="text" name="landmark" value={newAddress.landmark} onChange={handleChange} placeholder="Landmark" />
        </div>

        <div className="input-group">
          <div className="input-container">
            <select name="state" value={newAddress.state} onChange={handleChange}>
              <option value="Maharashtra">Maharashtra</option>
            </select>
          </div>
          <div className="input-container">
            <input type="text" name="city" value={newAddress.city} onChange={handleChange} placeholder="City" />
          </div>
          <div className="input-container">
            <input type="text" name="pincode" value={newAddress.pincode} onChange={handleChange} placeholder="Pincode" />
          </div>
        </div>

        <div className="input-container">
          <input type="text" name="phoneNo" value={newAddress.phoneNo} onChange={handleChange} placeholder="Phone Number" />
        </div>

        {/* Save Button */}
        <div className="modal-buttons">
          <button className="select-address" type="submit">Save Address</button>
        </div>
      </form>
    </div>
  );
};

export default AddNewAddressModal;
