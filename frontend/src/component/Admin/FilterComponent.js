import React, { useEffect, useState, useRef } from "react";
import "./FilterComponent.css";
import { FiX } from "react-icons/fi";
import { useAuthContext } from "../../hooks/useAuthContext";

const FilterComponent = ({ onClose, handleProductTag, prdt }) => {
  const { user } = useAuthContext();
  const [productTags, setProductTags] = useState([]);
  const filterRef = useRef(null);

  const fetchProductTags = async () => {
    try {
      const response = await fetch("https://backend.freshimeat.in/productTags/");
      const json = await response.json();
      if (response.ok) {
        setProductTags(json);
        //console.log(json);
      }
    } catch (error) {
      //console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProductTags();
    }
  }, [user]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="filter-popup-container" ref={filterRef}>
      <div className="filter-popup">
        <div className="filter-section">
          <button className="close-button-filter" onClick={onClose}>
            <FiX />
          </button>
          <h3 className="filter-title">Products</h3>
          <div className="filter-options">
            <div className="filter-row">
              {productTags?.map((prd, index) => (
                <div className="filter-item" key={index}>
                  <span>{prd?.name}</span>
                  <input
                    onClick={() => handleProductTag(prd?.name)}
                    type="radio"
                    className="checkbox-large2"
                    checked={prdt === prd?.name}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
