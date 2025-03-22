import React, { useState, useEffect } from "react";
import "./Creatives.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import useNotify from "../../hooks/useNotify";

const Creatives = () => {
  const [images, setImages] = useState({ desktop: [], mobile: [] });
  const { user } = useAuthContext();
  const {notify} = useNotify();

// Fetch existing images from backend
const fetchImages = async () => {
  try {
    const response = await fetch("https://backend.freshimeat.in/creatives/");
    const json = await response.json();

    if (response.ok) {
      // Separate images based on the "tag" field
      const desktopImages = json.data.filter((img) => img.tag === "desktop");
      const mobileImages = json.data.filter((img) => img.tag === "mobile");

      // Store the full image objects in state
      setImages({
        desktop: desktopImages,
        mobile: mobileImages,
      });

      console.log("Desktop Images:", desktopImages);
      console.log("Mobile Images:", mobileImages);
    }
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};


  useEffect(() => {
    fetchImages();
  }, []);
  

  const handleImageChange = async (e, category) => {
    const file = e.target.files[0];
    console.log(file)
    if (!file) return;

    const formData = new FormData();
    formData.append("media", file);
    formData.append("tag", category);

    try {
      const response = await fetch("https://backend.freshimeat.in/creatives/", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        console.log(json)
        setImages((prevImages) => ({
          ...prevImages,
          [category]: [...prevImages[category], json.data.image].slice(0, 4),
        }));
        fetchImages();
        notify("Creative added successfully", "success")
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      notify("Error adding the creative", "error")
    }
  };

  const handleDeleteImage = async (e, creativeId) => {
    e.preventDefault(); // Prevent form submission from reloading the page
  
    try {
      const response = await fetch(`https://backend.freshimeat.in/creatives/${creativeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
  
      if (response.ok) {
        setImages((prevImages) => ({
          desktop: prevImages.desktop.filter((img) => img._id !== creativeId),
          mobile: prevImages.mobile.filter((img) => img._id !== creativeId),
        }));
        notify("Creative deleted successfully", "success")
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      notify("Error deleting the creative", "error")
    }
  };
  

  return (
    <div className="creatives-container">
      <h2>Edit Home Page Carousel Images</h2>

      {/* Desktop Section */}
      <h3>Desktop/Tablet</h3>
      <form encType="multipart/form-data" className="image-box">
      {images?.desktop?.map((img, index) => (
  <div key={index} className="image-wrapper">
    <img src={`https://backend.freshimeat.in/uploads/${img?.media}`} alt={`Desktop ${index}`} className="creative-image" />
    <button onClick={(e) => handleDeleteImage(e, img._id)}>Delete</button>
  </div>
))}

        {images?.desktop?.length < 4 && (
          <label className="add-button" htmlFor="desktop-input">
            + Add Image
          </label>
        )}
        <input type="file" id="desktop-input" accept="image/*" onChange={(e) => handleImageChange(e, "desktop")} style={{ display: "none" }} />
      </form>

      {/* Mobile Section */}
      <h3>Mobile</h3>
      <div className="image-box">
      {images?.mobile?.map((img, index) => (
  <div key={index} className="image-wrapper2">
    <img src={`https://backend.freshimeat.in/uploads/${img?.media}`} alt={`Mobile ${index}`} className="creative-image mobile-image" />
    <button onClick={(e) => handleDeleteImage(e, img._id)}>Delete</button>
  </div>
))}

        {images.mobile.length < 4 && (
          <label className="add-button" htmlFor="mobile-input">
            + Add Image
          </label>
        )}
        <input type="file" id="mobile-input" accept="image/*" onChange={(e) => handleImageChange(e, "mobile")} style={{ display: "none" }} />
      </div>
    </div>
  );
};

export default Creatives;
