import React, { useEffect, useState } from "react";
import "./AddressEditModal.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import useNotify from "../../hooks/useNotify";

const AddressEditModal = ({ address, onClose, onSave, onDelete, addressId }) => {
  const [editedAddress, setEditedAddress] = useState({ ...address });
  const {user, dispatch} = useAuthContext();
  const {notify} = useNotify();
  const asd = addressId

  const handleChange = (e) => {
    setEditedAddress({ ...editedAddress, [e.target.name]: e.target.value });
  };

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

    useEffect(()=>{
      fetchPincodes();
    },[user])
  

  const handleAfterDelete = async () => {
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
        // onDelete(); 
      } else {
        notify("Error fetching updated user data", "error");
      }
    } catch (error) {
      notify("Error fetching updated user data", "error");
    }
  };
  
  const handleSave = async() => {
    onSave(editedAddress);
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
      dispatch({ type: 'LOGIN', payload: {user: json, token: user?.token} });
      // Update the parent state with the new user data
      // onSave(json);
    } else {
      notify("Error fetching updated user data", "error");
    }
  } catch (error) {
    notify("Error fetching updated user data", "error");
  }
  };

  const handleDelete = async(e) => {
    e.preventDefault();
    try{
      const response = await fetch(`https://backend.freshimeat.in/users/${user?._id}/${asd}`,{
        method: "Delete",
        headers: {
          "Authorization": `Bearer ${user.token}`,
        },
      })
  
      const json = await response.json();
      if(response.ok)
      {
        localStorage.setItem('user', JSON.stringify({user: json, token: user?.token}));
          dispatch({ type: 'LOGIN', payload: {user: json, token: user?.token} });
        notify("Address deleted successfully", "success")
        handleAfterDelete()
        onClose();
        console.log(json)
      }
    }catch(error)
    {
      notify("Error deleting the address", "error")
    }
  };

  const handleEditAddress= async(e)=>{
    e.preventDefault();
    console.log(user);

     // Validate that all required fields are filled out
  const requiredFields = [
    "firstName", "lastName", "address", "landmark", 
    "state", "city", "pincode", "phoneNo", "tag"
  ];

  for (let field of requiredFields) {
    if (editedAddress[field] == "" || !editedAddress[field]) {
      notify(`Please fill out the ${field}`, "error");
      return;
    }
  }

  const matchedPincode = pincodes?.find(
    item => Number(item?.pincode) === Number(editedAddress?.pincode) && item?.status
  );
  

  // Check if pincode exists in the fetched pincodes list
  if (!matchedPincode) {
    notify("Entered pincode is not serviceable", "error");
    return;
  }


    try{
      const formData = {
        firstName: editedAddress.firstName,
    lastName: editedAddress.lastName,
    address: editedAddress.address,
    landmark: editedAddress.landmark,
    state: "Maharashtra",
    city: editedAddress.city,
    pincode: editedAddress.pincode,
    phoneNo: editedAddress.phoneNo,
    tag: editedAddress.tag
      }

      console.log("Form Data:", formData);console.log("Form Data:", formData);

      const response = await fetch(`https://backend.freshimeat.in/users/${user?._id}/${asd}`,{
        method: "PUT",
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
        notify("Address updated successfully", "success")
        handleSave();
        onClose();
      }
    }catch(error){
      console.log(error)
      notify("Error updating address", "error")
    }
  }

  return (
    <div className="modal-overlay">
      <form className="modal-content" onSubmit={handleEditAddress}>
        <button type="button" className="close-button-pop" onClick={onClose}>×</button>
        
        <h2>Edit Address</h2>
        
        <div className="input-group">
          <div className="input-container">
            <input type="text" name="firstName" value={editedAddress.firstName} onChange={handleChange} />
            <label>First Name*</label>
          </div>
          <div className="input-container">
            <input type="text" name="lastName" value={editedAddress.lastName} onChange={handleChange} />
            <label>Last Name*</label>
          </div>
        </div>

        <textarea name="address" value={editedAddress.address} onChange={handleChange} placeholder="Full Address"></textarea>
        <div className="input-container"> 
          <input type="text" name="landmark" value={editedAddress.landmark} onChange={handleChange} placeholder="Landmark" />
        </div>

        <div className="input-group">
          <div className="input-container">
            <select name="state" value={editedAddress.state} onChange={handleChange}>
              <option value="Maharashtra">Maharashtra</option>
            </select>
          </div>
          <div className="input-container">
            <input type="text" name="city" value={editedAddress.city} onChange={handleChange} placeholder="City"/>
          </div>
          <div className="input-container">
            <input type="text" name="pincode" value={editedAddress.pincode} onChange={handleChange} placeholder="Pincode" />
          </div>
        </div>

        <div className="input-container">
          <input type="text" name="phoneNo" value={editedAddress.phoneNo} onChange={handleChange} placeholder="Phone Number"/>
        </div>

        <div className="modal-buttons">
          <button type="submit" className="select-address">Update Address</button>
          <button type="button" className="delete-button-checkout" onClick={handleDelete}>Delete Address</button>
        </div>
      </form>
    </div>
  );
};

export default AddressEditModal;
