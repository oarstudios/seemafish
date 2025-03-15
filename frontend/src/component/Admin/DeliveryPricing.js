import React, { useEffect, useState } from "react";
import "./DeliveryPricing.css";
import { FiSearch } from "react-icons/fi";
import { useAuthContext } from "../../hooks/useAuthContext";
import useNotify from "../../hooks/useNotify";

const DeliveryPricing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [originalDeliveryAreas, setOriginalDeliveryAreas] = useState([]);
  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const [pincode, setPincode] = useState("");
  const [name, setName] = useState("");
  const [deliveryCharges, setDeliveryCharges] = useState("");
  const [enable, setEnable] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const { user } = useAuthContext();
  const { notify } = useNotify();

  // Fetch delivery areas
  const fetchDeliveryArea = async () => {
    try {
      const response = await fetch("https://backend.freshimeat.in/pincodes/");
      const json = await response.json();
      if (response.ok) {
        setOriginalDeliveryAreas(json);  // Store original data
        setDeliveryAreas(json);  // Set filtered data initially as original
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.userType === "Admin") {
      fetchDeliveryArea();
    }
  }, [user]);

  // Toggle the 'enabled' state
  const toggleEnable = (id) => {
    setDeliveryAreas((prevAreas) =>
      prevAreas.map((area) =>
        area._id === id ? { ...area, status: !area.status } : area
      )
    );
  };

  // Toggle edit mode
  const toggleEditMode = (id) => {
    setDeliveryAreas((prevAreas) =>
      prevAreas.map((area) =>
        area._id === id ? { ...area, isEditing: !area.isEditing } : area
      )
    );
  };

  // Handle change in input fields
  const handleChange = (id, field, value) => {
    setDeliveryAreas((prevAreas) =>
      prevAreas.map((area) =>
        area._id === id ? { ...area, [field]: value } : area
      )
    );
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase(); // Convert query to lowercase for case-insensitive search
    setSearchQuery(query);

    // Filter delivery areas based on either name or pincode
    const filteredAreas = originalDeliveryAreas.filter((area) => {
      return (
        area.name.toLowerCase().includes(query) || area.pincode.toString().includes(query)
      );
    });

    setDeliveryAreas(filteredAreas);
  };

  // Add new delivery area entry
  const addNewEntry = () => {
    setDeliveryAreas((prevAreas) => [
      ...prevAreas,
      { id: prevAreas.length + 1, pincode: "", name: "", deliveryCharges: "", status: false, isEditing: true },
    ]);
  };

  // Handle form submission for adding a new entry
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that pincode is a 6-digit number
    const pincodeRegex = /^[0-9]{6}$/; // Regular expression for exactly 6 digits
    if (!pincodeRegex.test(pincode)) {
      notify("Please enter a valid 6-digit pincode.", "error");
      return; // Prevent form submission if pincode is invalid
    }

    const formData = {
      pincode,
      name,
      deliveryCharges,
      status: enable,
    };

    try {
      const response = await fetch("https://backend.freshimeat.in/pincodes/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const json = await response.json();
      if (response.ok) {
        setPincode("");
        setName("");
        setDeliveryCharges("");
        setEnable(false);
        setAddNew(false);
        console.log(json);
        notify("Added pincode successfully", "success");
        fetchDeliveryArea();
      }
    } catch (error) {
      console.log(error);
      notify("Error adding pincode", "error");
    }
  };

  // Handle saving the edited entry
  const handleSave = async (id) => {
    const areaToUpdate = deliveryAreas.find((area) => area._id === id);

    // Validate that pincode is a 6-digit number
    const pincodeRegex = /^[0-9]{6}$/; // Regular expression for exactly 6 digits
    if (!pincodeRegex.test(areaToUpdate.pincode)) {
      notify("Please enter a valid 6-digit pincode.", "error");
      return; // Prevent form submission if pincode is invalid
    }

    const formData = {
      pincode: areaToUpdate.pincode,
      name: areaToUpdate.name,
      deliveryCharges: areaToUpdate.deliveryCharges,
      status: areaToUpdate.status,
    };

    try {
      const response = await fetch(`https://backend.freshimeat.in/pincodes/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedArea = await response.json();
        setDeliveryAreas((prevAreas) =>
          prevAreas.map((area) =>
            area._id === id ? { ...updatedArea, isEditing: false } : area
          )
        );
        console.log("Delivery Area updated successfully");
        notify("Pincode updated successfully", "success");
      } else {
        console.log("Failed to update delivery area");
      }
    } catch (error) {
      console.log("Error while updating delivery area", error);
      notify("Error updating the pincode", "error");
    }
  };

  return (
    <div className="delivery-pricing-container">
      <div className="admin-products-header lsp">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name or pincode"
            value={searchQuery}
            onChange={handleSearch}
          />
          <FiSearch className="search-icon" />
        </div>
        <div className="searchResults"></div>
      </div>

      <div className="table-responsive">
      {!addNew && 
      <button
      className="add-button-delivery"
      type={addNew ? "submit" : "button"}
      onClick={() => setAddNew(true)}
    >
      {addNew ? "Save" : "Add"}
    </button>}
    {/* Updated form submission */}
<form onSubmit={handleSubmit}>
  {addNew && (
    <button type="submit" className="add-button-delivery">
      {addNew ? "Save" : "Add"}
    </button>
  )}
</form>

{addNew && (
  <div className="addData">
    <input
      type="number"
      placeholder="Pincode"
      value={pincode}
      onChange={(e) => setPincode(e.target.value)}
    />
    <input
      type="text"
      placeholder="Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <input
      type="number"
      placeholder="Delivery Charges"
      value={deliveryCharges}
      onChange={(e) => setDeliveryCharges(e.target.value)}
    />
    <div className="enb">
      <label htmlFor="enable">Enable</label>
      <input
        type="checkbox"
        id="enable"
        onChange={(e) => setEnable(!enable)}
        checked={enable}
      />
    </div>
  </div>
)}




        <table className="delivery-pricing-table">
          <thead>
            <tr>
              <th>#</th>
              <th>PINCODE</th>
              <th>NAME</th>
              <th>DELIVERY CHARGES</th>
              <th>ENABLE</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {deliveryAreas.map((area, index) => (
              <tr key={area._id} className="delivery-row">
                <td data-label="#">{index + 1}</td>
                <td data-label="PINCODE">
                  <input
                    type="text"
                    value={area.pincode}
                    className={area.isEditing ? "pincode-field" : "pincode-field readonly"}
                    onChange={(e) => handleChange(area._id, "pincode", e.target.value)}
                    readOnly={!area.isEditing}
                  />
                </td>
                <td data-label="NAME">
                  <input
                    type="text"
                    value={area.name}
                    className={area.isEditing ? "name-field" : "name-field readonly"}
                    onChange={(e) => handleChange(area._id, "name", e.target.value)}
                    readOnly={!area.isEditing}
                  />
                </td>
                <td data-label="DELIVERY CHARGES">
                  <input
                    type="number"
                    value={area.deliveryCharges}
                    className={area.isEditing ? "charges-field" : "charges-field readonly"}
                    onChange={(e) => handleChange(area._id, "deliveryCharges", e.target.value)}
                    readOnly={!area.isEditing}
                  />
                </td>
                <td data-label="ENABLE">
                  <input
                    type="checkbox"
                    checked={area.status}
                    onChange={() => toggleEnable(area._id)}
                    className="checkbox-large"
                    disabled={!area.isEditing}
                  />
                </td>
                <td>
                  <button
                    className="edit-btn2"
                    onClick={() => {
                      if (area.isEditing) {
                        handleSave(area._id);
                      } else {
                        toggleEditMode(area._id);
                      }
                    }}
                  >
                    {area.isEditing ? "SAVE" : "EDIT"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryPricing;
