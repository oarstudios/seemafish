import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {FiPlusCircle } from "react-icons/fi"; // Lock icon for weight, Plus icon for category add
import { FaChevronDown } from "react-icons/fa"; // Dropdown arrow
import "./AddNewProduct.css";
import useNotify from "../../hooks/useNotify";
import weighttt from "../../assets/weight.svg";
import { useAuthContext } from "../../hooks/useAuthContext";

const AddNewProduct = () => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [defaultPrice, setDefaultPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Sea Fish");
  const [productTag, setProductTag] = useState("None");
  const [inStock, setInStock] = useState(true);
  const {notify} = useNotify();
  const {user} = useAuthContext();

  // Popups
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [isTagPopupOpen, setIsTagPopupOpen] = useState(false);
  const [newTag, setNewTag] = useState("");

  const [categories, setCategories] = useState([]);
  const [productTags, setProductTags] = useState([]);

  const fetchCategories = async()=>{
    try{
      const response = await fetch('http://localhost:4001/categories/');
      const json = await response.json();
      if(response.ok)
      {
        setCategories(json)
        console.log(json)
      }
    }catch(error){
      console.log(error)
    }
  }

  const fetchProductTags = async()=>{
    try{
      const response = await fetch('http://localhost:4001/productTags/');
      const json = await response.json();
      if(response.ok)
      {
        setProductTags(json)
        console.log(json)
      }
    }catch(error){
      console.log(error)
    }
  }


  useEffect(()=>{
    if(user?.userType === "Admin")
    {
      fetchCategories();
      fetchProductTags();
    }
  }, [user])

  

  const [note, setNote] = useState(
    `• Deliveries will take place between 11 AM and 7 PM on the chosen date. Same-day orders will be delivered via Uber, additional charges will apply.
• Short messages will be inscribed on a plaque, while longer messages will be included on a card.`
  );

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    if (images.length + uploadedFiles.length > 3) {
      alert("You can only upload up to 3 images.");
      return;
    }
    setImages((prevImages) => [...prevImages, ...uploadedFiles]);
  };

  // Handle Image Delete
  const handleImageDelete = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Open & Close Popups
  const openCategoryPopup = () => setIsCategoryPopupOpen(true);
  const closeCategoryPopup = () => setIsCategoryPopupOpen(false);

  const openTagPopup = () => setIsTagPopupOpen(true);
  const closeTagPopup = () => setIsTagPopupOpen(false);

  // Add New Category
  const addNewCategory = () => {
    if (newCategory.trim() !== "" && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setSelectedCategory(newCategory);
      setNewCategory("");
      closeCategoryPopup();
    }
  };

  // Add New Product Tag
  const addNewTag = () => {
    if (newTag.trim() !== "" && !productTags.includes(newTag)) {
      setProductTags([...productTags, newTag]);
      setProductTag(newTag);
      setNewTag("");
      closeTagPopup();
    }
  };

  useEffect(()=>{
    console.log(images, title, defaultPrice, salePrice, weight, description, categories, productTag, inStock, note)

  },[])

  // Handle Form Submission (Prevents Reload)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      return notify("Please enter a valid product name", "error");
    }
    
    if (!defaultPrice || isNaN(Number(defaultPrice)) || Number(defaultPrice) <= 0) {
      return notify("Please enter a valid default price", "error");
    }
    
    if (salePrice && (isNaN(Number(salePrice)) || Number(salePrice) >= Number(defaultPrice))) {
      return notify("Sale price must be a number and less than the default price", "error");
    }
    
    if (!weight) {
      return notify("Please enter a valid weight", "error");
    }
    
    if (!description) {
      return notify("Please enter a valid description", "error");
    }
    
    if (!selectedCategory) {
      return notify("Please select a category", "error");
    }
    
    if (!productTag) {
      return notify("Please enter a valid product tag", "error");
    }
    
    if (!note) {
      return notify("Please enter a valid note", "error");
    }
    
    if (!Array.isArray(images) || images.length === 0) {
      return notify("Please upload at least one product image", "error");
    }
    

    const price = {
        "default": defaultPrice,
        "sale": salePrice
    };

    const formData = new FormData();
    formData.append("name", title);
    formData.append("price", JSON.stringify(price)); // Serialize the price object
    formData.append("weight", weight);
    formData.append("description", description);
    formData.append("category", selectedCategory);
    formData.append("productTag", productTag);
    formData.append("note", note);
    // formData.append("images", images);  
    formData.append("inStock", inStock);

    images.forEach((file) => {
      formData.append("productImages", file); // 'productImages' will be used for uploading
    });

    try {
        const response = await fetch("http://localhost:4001/products/", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${user.token}`, // If you need authentication
            },
            body: formData, // Send the form data here
        });

        const json = await response.json();
        if (response.ok) {
            console.log("Product added successfully:", json);
            notify('Product added successfully', "success");
            setImages([]);
            setTitle("");
            setDefaultPrice("");
            setDescription("");
            setSelectedCategory("");
            setDefaultPrice("");
            setSalePrice("")
            setWeight("")
            setInStock(true)
            setProductTag("")
        } 
    }catch (error) {
        console.error("Error submitting product:", error);
        notify("Error adding the product", "error");
    }
};




const addCategory = async(e)=>{
  e.preventDefault();
  try{
    const formData = {
      "name": newCategory
    }
    const response = await fetch(`http://localhost:4001/categories/`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify(formData)
    })

    const json = await response.json();
    if(response.ok)
    {
      console.log(json)
      notify("Category added successfully", "success")
      fetchCategories();
      setIsCategoryPopupOpen(false)
    }
  }catch(error){
    console.log(error)
    notify("Error adding category", "error")
    setIsCategoryPopupOpen(false)
  }
}

const addProductTag = async(e)=>{
  e.preventDefault();
  try{
    const formData = {
      "name": newTag
    }
    const response = await fetch(`http://localhost:4001/productTags/`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify(formData)
    })

    const json = await response.json();
    if(response.ok)
    {
      console.log(json)
      notify("Product Tag added successfully", "success")
      fetchProductTags();
      setIsTagPopupOpen(false)
    }
  }catch(error){
    console.log(error)
    notify("Error adding product tag", "error")
    setIsTagPopupOpen(false)
  }
}


  return (
    <div className="add-new-product-container">
      <Link to="/admin">
        <button className="back-button">Back</button>
      </Link>

      <form className="product-form" onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Image Upload Section */}
        <div className="image-section">
          <label htmlFor="image-upload" className="upload-placeholder">
            <span>+</span>
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <div className="uploaded-images-container">
            {images.map((image, index) => (
              <div className="uploaded-image-wrapper" key={index}>
                <img
                  name="productImages"
                  src={URL.createObjectURL(image)}
                  alt={`Uploaded ${index + 1}`}
                  className="uploaded-image"
                />
                <button
                  className="delete-image-button"
                  onClick={() => handleImageDelete(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="details-section">
          <input
            type="text"
            placeholder="Title of the Listing"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-title"
          />

          {/* Price Fields */}
<div className="price-fields">
  <div className="input-wrapper">
    <span className="input-icon">₹</span>
    <input
      type="number"
      value={defaultPrice}
      onChange={(e) => setDefaultPrice(e.target.value)}
      className="input-field"
      placeholder=" " /* Keep this empty */
    />
    <span className="input-label">Default price</span>
  </div>

  <div className="input-wrapper">
    <span className="input-icon">₹</span>
    <input
      type="number"
      value={salePrice}
      onChange={(e) => setSalePrice(e.target.value)}
      className="input-field"
      placeholder=" "
    />
    <span className="input-label">Sale price</span>
  </div>
</div>

{/* Weight Field with Lock Icon */}
<div className="input-wrapper">
<img src={weighttt} alt="" className="input-icon-weightt" />

  <input
    type="number"
    value={weight}
    onChange={(e) => setWeight(e.target.value)}
    className="input-field"
    placeholder=" "
  />
  <span className="input-label">Weight (g)</span>
</div>


          <textarea
            placeholder="Product Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-description"
          />

          {/* Category Selection */}
<div className="categories-section">
  <div className="category-header-admin">
    <p>Category</p>  
    <button type="button" className="add-category-button" onClick={openCategoryPopup}>
      <FiPlusCircle className="add-category-icon" /> ADD NEW
    </button>
  </div>
  <div className="category-buttons">
    {categories.map((cat) => (
      <button
        key={cat}
        type="button"
        className={`category-button ${selectedCategory === cat.name ? "selected" : ""}`}
        onClick={() => setSelectedCategory(cat.name)}
      >
        {cat?.name}
      </button>
    ))}
  </div>
</div>

{/* Product Tag Selection */}
<div className="categories-section">
  <div className="category-header-admin">
    <p>Product Tag</p>  
    <button type="button" className="add-category-button" onClick={openTagPopup}>
      <FiPlusCircle className="add-category-icon" /> ADD NEW
    </button>
  </div>
  <select className="dropdownn" value={productTag} onChange={(e) => setProductTag(e.target.value)}>
  {productTag === "" && <option className="drop-list">Product Tags</option>}
    {productTags.map((tag) => (
      <option className="drop-list" key={tag} value={tag.name}>{tag?.name}</option>
    ))}
  </select>
</div>


          

          {/* In Stock Toggle */}
          <div className="categories-section">
            <p>In Stock</p>
            <div className="category-buttons">
              <button
                type="button"
                className={`category-button ${inStock ? "selected" : ""}`}
                onClick={() => setInStock(true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={`category-button ${!inStock ? "selected" : ""}`}
                onClick={() => setInStock(false)}
              >
                No
              </button>
            </div>
          </div>

          {/* Edit Note Section */}
          <div className="edit-note-section">
            <p className="edit-note-title">Edit Note/Storage Instructions:</p>
            <textarea
              className="edit-note"
              onChange={(e) => setNote(e.target.value)}
              value={note}
            />
          </div>

          <button className="publish-button" type="submit">
            Publish Product
          </button>
        </div>
      </form>
      {/* Popups */}
      {isCategoryPopupOpen && (
            <div className="popup-overlay">
              <form className="popup-box" onSubmit={addCategory}>
                <button className="close-popup" type="button" onClick={closeCategoryPopup}>×</button>
                <button type="submit" className="popup-title confirm-button"><FiPlusCircle /> CONFIRM</button>
                <input type="text" placeholder="Type here" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="popup-input" />
              </form>
            </div>
          )}

          {isTagPopupOpen && (
            <div className="popup-overlay">
              <form className="popup-box" onSubmit={addProductTag}>
                <button className="close-popup" type="button" onClick={closeTagPopup}>×</button>
                <button className="popup-title confirm-button" type="submit"><FiPlusCircle /> CONFIRM</button>
                <input type="text" placeholder="Type here" value={newTag} onChange={(e) => setNewTag(e.target.value)} className="popup-input" />
              </form>
            </div>
          )}
    </div>
  );
};

export default AddNewProduct;
