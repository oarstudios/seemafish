import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FiPlusCircle } from "react-icons/fi";
import { MdClose, MdCheck } from "react-icons/md"; // Icons for toggle
import "./EditAdminProducts.css";
import weighttt from "../../assets/weight.svg";
import { useAuthContext } from "../../hooks/useAuthContext";
import useNotify from "../../hooks/useNotify";

const EditAdminProducts = () => {
  const { productId } = useParams(); // Get product ID from URL (for demo purposes)
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [defaultPrice, setDefaultPrice] = useState();
  const [salePrice, setSalePrice] = useState();
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productTag, setProductTag] = useState("");
  const [inStock, setInStock] = useState(true);
  const [isArchived, setIsArchived] = useState()
  const [isBestsellerActive, setIsBestsellerActive] = useState(false);
  const {id} = useParams();

  const {user} = useAuthContext();
  const {notify} = useNotify();

 const [categories, setCategories] = useState([]);
   const [productTags, setProductTags] = useState([]);
   const [product, setProduct] = useState('')
 
   const fetchCategories = async()=>{
     try{
       const response = await fetch('https://backend.freshimeat.in/categories/');
       const json = await response.json();
       if(response.ok)
       {
         setCategories(json)
         //console.log(json)
       }
     }catch(error){
       //console.log(error)
     }
   }
 
   const fetchProductTags = async()=>{
     try{
       const response = await fetch('https://backend.freshimeat.in/productTags/');
       const json = await response.json();
       if(response.ok)
       {
         setProductTags(json)
         //console.log(json)
       }
     }catch(error){
       //console.log(error)
     }
   }

   const fetchProduct = async()=>{
    try{
      const response = await fetch(`https://backend.freshimeat.in/products/${id}`);
      const json = await response.json();
      if(response.ok)
      {
        setProduct(json)
        
    setTitle(json.name);
    setDefaultPrice(json?.price?.default);
    setSalePrice(json?.price?.sale);
    setWeight(json.weight);
    setDescription(json.description);
    setSelectedCategory(json.category);
    setProductTag(json.productTag);
    setInStock(json.inStock);
    setImages(json.images || []);
    //console.log(json.images)
    setNote(json.note);
    setIsBestsellerActive(json.bestseller)
    setSelectedCategory(json.category)
        //console.log(json)
        setIsArchived(json.isArchived)
      }
    }catch(error){
      //console.log(error)
    }
  }
 
 
   useEffect(()=>{
     if(user?.userType === "Admin")
     {
       fetchCategories();
       fetchProductTags();
       fetchProduct();
     }
   }, [user])

  const [note, setNote] = useState(
    `• Deliveries will take place between 11 AM and 7 PM on the chosen date.`
  );
  const handleBestsellerToggle = () => {
    setIsBestsellerActive(!isBestsellerActive);
  };


  // Handle Image Upload
  const handleImageUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    if (images.length + uploadedFiles.length > 3) {
      notify("You can only upload up to 3 images.", "error");
      return;
    }
    
    setImages((prevImages) => [...prevImages, ...uploadedFiles]); // Preserve old images
  };
  

  // Handle Image Delete
  const handleImageDelete = (index) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== index);
      //console.log("Updated images after deletion:", updatedImages);
      return updatedImages;
    });
  };
  
  

  

  const handleBestseller = async (e) => {
    e.preventDefault();
  
    const formData = {
      "bestseller": isBestsellerActive
    }
  
  

  
    try {
      const response = await fetch(`https://backend.freshimeat.in/products/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${user.token}`, // If you need authentication
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData), // Send the form data here
      });
  
      const json = await response.json();
      if (response.ok) {
        //console.log("Product updated successfully:", json);
        notify('Product updated successfully', "success");
      } else {
        console.error("Update failed:", json);
        notify("Error updating the product", "error");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      notify("Error updating the product", "error");
    }
  };

  const convertUrlToFile = async (url) => {
    try {
        //console.log(`Fetching image from: ${url}`);
        const res = await fetch(url, { mode: "cors" }); // Ensure CORS is handled
        if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
        
        const blob = await res.blob();
        const fileName = url.split('/').pop();
        //console.log(`Converted ${fileName} to File`);
        
        return new File([blob], fileName, { type: blob.type });
    } catch (error) {
        console.error("Error converting URL to File:", error);
        return null;
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", title);
    formData.append("price", JSON.stringify({
        default: Number(defaultPrice),
        sale: salePrice ? Number(salePrice) : null,
    }));
    formData.append("weight", weight);
    formData.append("description", description);
    formData.append("category", selectedCategory);
    formData.append("productTag", productTag);
    formData.append("note", note);
    formData.append("inStock", inStock);
    formData.append("bestseller", isBestsellerActive);

    let imageFiles = [];

    if (images.length > 0) {
        imageFiles = await Promise.all(
            images.map(async (image) => {
                if (typeof image === "string") {
                    return await convertUrlToFile(`https://backend.freshimeat.in/uploads/${image}`);
                }
                return image;
            })
        );
    }

    // Append valid image files only
    imageFiles.forEach((file) => {
        if (file) {
            formData.append("productImages", file, file.name);
        }
    });

    try {
        const response = await fetch(`https://backend.freshimeat.in/products/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${user.token}`, // Authentication if required
            },
            body: formData,
        });

        const json = await response.json();

        if (response.ok) {
            //console.log("Product updated successfully:", json);
            notify("Product updated successfully", "success");
        } else {
            console.error("Update failed:", json);
            notify(json.error || "Error updating the product", "error");
        }
    } catch (error) {
        console.error("Error submitting product:", error);
        notify("Error updating the product", "error");
    }
};




  

const handleArchive = async (e) => {
  e.preventDefault();


  const formData = {
    "isArchived": !isArchived
  }

  try {
      const response = await fetch(`https://backend.freshimeat.in/products/${id}`, {
          method: "PUT",
          headers: {
              "Authorization": `Bearer ${user.token}`, // If you need authentication
              "Content-type": "application/json" 
          },
          body: JSON.stringify(formData), // Send the form data here
      });

      const json = await response.json();
      if (response.ok) {
          //console.log("Product updated successfully:", json);
          notify('Product updated successfully', "success");
          fetchProduct();
      } else {
          console.error("Update failed:", json);
          notify("Error updating the product", "error");
      }
  } catch (error) {
      console.error("Error submitting product:", error);
      notify("Error updating the product", "error");
  }
};


  return (
    <div className="edit-admin-product-container">
      <form className="top-bars" onSubmit={handleBestseller}>
        <Link to="/admin/products">
          <button type="button" className="back-button">Back</button>
        </Link>
        {/* {productTag === "Bestseller" && ( */}
          <button
          type="submit"
            className={`bestseller-tag ${isBestsellerActive ? "active" : ""}`}
            onClick={handleBestsellerToggle}
          >
            {isBestsellerActive ? <MdCheck className="check-icon" /> : <MdClose className="close-icon-best" />}
            Bestseller
          </button>
        {/* )} */}
      </form>

      <form className="product-form" onSubmit={(e)=>handleSubmit(e)} encType="multipart/form-data">
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
                {/* {console.log(typeof image)} */}
                <img
                  src={typeof image === "string" ? `https://backend.freshimeat.in/uploads/${image}` : URL.createObjectURL(image)}
                  alt={`Uploaded ${index + 1}`}
                  className="uploaded-image"
                />
                <button type="button" className="delete-image-button" onClick={() => handleImageDelete(index)}>
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
              <input type="number" value={defaultPrice} onChange={(e) => setDefaultPrice(e.target.value)} className="input-field"/>
              <span className="input-label">Default price</span>
            </div>

            <div className="input-wrapper">
              <span className="input-icon">₹</span>
              <input type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className="input-field"/>
              <span className="input-label">Sale price</span>
            </div>
          </div>

          {/* Weight Field */}
          <div className="input-wrapper">
           <img src={weighttt} alt="" className="input-icon-weightt" />
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="input-field"/>
            <span className="input-label">Weight (g)</span>
          </div>

          {/* Description */}
          <textarea placeholder="Product Description" value={description} onChange={(e) => setDescription(e.target.value)} className="input-description"/>

          {/* Category Selection */}
          <div className="categories-section">
            <p>Category</p>
            <div className="category-buttons">
    {categories?.map((cat) => (
      <button
        key={cat}
        type="button"
        className={`category-button ${selectedCategory === cat?.name ? "selected" : ""}`}
        onClick={() => setSelectedCategory(cat.name)}
      >
        {cat?.name}
      </button>
    ))}
  </div>
          </div>

          {/* Product Tag Selection */}
          <div className="categories-section">
            <p>Product Tag</p>

            <select className="dropdownn" value={productTag} onChange={(e) => setProductTag(e.target.value)}>
              {productTag === "" && <option className="drop-list">Product Tags</option>}
              {productTags?.map((tag) => (
                <option className="drop-list" key={tag} value={tag?.name}>{tag?.name}</option>
              ))}
            </select>
          </div>

          {/* In Stock Toggle */}
          <div className="categories-section">
            <p>In Stock</p>
            <div className="category-buttons">
              <button type="button" className={`category-button ${inStock ? "selected" : ""}`} onClick={() => setInStock(true)}>Yes</button>
              <button type="button" className={`category-button ${!inStock ? "selected" : ""}`} onClick={() => setInStock(false)}>No</button>
            </div>
          </div>

          {/* Edit Note Section */}
          <div className="edit-note-section">
            <p className="edit-note-title">Edit Note/Storage Instructions:</p>
            <textarea className="edit-note" onChange={(e) => setNote(e.target.value)} value={note} />
          </div>

          <div className="buttons-container">
             <button className="publish-button" type="submit">Update Product</button>
          <button className="delete-button" type="submit" onClick={(e)=>handleArchive(e)}>{isArchived ? "Remove from archive" : "Archive product"}</button>
         
        </div>
        </div>
      </form>
    </div>
  );
};

export default EditAdminProducts;
