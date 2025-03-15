import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./OrderSection.css";
import cake from "../../assets/fishimage.png";
import FullStar from "../../assets/material-symbols_star.svg";
import EmptyStar from "../../assets/material-symbols_star-outline.svg";
import UploadIcon from "../../assets/Vector.svg";
import { useAuthContext } from "../../hooks/useAuthContext";
import useNotify from "../../hooks/useNotify";

const OrderSection = () => {
  const [ratings, setRatings] = useState({});
  const [inputs, setInputs] = useState({});
  const [submittedReviews, setSubmittedReviews] = useState({});
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { user } = useAuthContext();
  const { id } = useParams();
  const { notify } = useNotify();

  const [order, setOrder] = useState("");

  const fetchOrder = async () => {
    try {
      const response = await fetch(`https://backend.freshimeat.in/orders/${id}`);
      const json = await response.json();
      if (response.ok) {
        console.log(json?.data);
        setOrder(json?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [pincode, setPincode] = useState([]);

  const fetchPincodes = async () => {
    try {
      const response = await fetch(`https://backend.freshimeat.in/pincodes`);
      const json = await response.json();

      if (response.ok) {
        console.log(json);
        // Check if pincode exists in the fetched pincodes list
        const pc = await json?.filter(
          (item) =>
            Number(item?.pincode) === Number(order?.shippingAddress?.pincode)
        );
        setPincode(pc?.[0]);
        console.log(pc?.[0]);
        // setCart(json)
      } else {
        console.error("Failed to fetch products:", json);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [user]);

  useEffect(() => {
    fetchPincodes();
  }, [order]);

  const handleTextChange = (e, itemId) => {
    const text = e.target.value;
    setInputs((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        review: text.trim() ? text : "",
      },
    }));
  };

  const handleImageUpload = (e, itemId) => {
    const files = Array.from(e.target.files);
    // const newImages = files.map((file) => URL.createObjectURL(file));

    setInputs((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        media: [...(prev[itemId]?.media || []), ...files],
      },
    }));
  };

  useEffect(() => {
    console.log(inputs);
  }, []);

  const handleRemoveImage = (productId, index) => {
    setInputs((prev) => {
      const updatedMedia =
        prev[productId]?.media?.filter((_, i) => i !== index) || [];
      return {
        ...prev,
        [productId]: { ...prev[productId], media: updatedMedia },
      };
    });
  };

  // Handle Rating Click
  const handleClick = (index, productId) => {
    setRatings((prev) => ({
      ...prev,
      [productId]: index + 1,
    }));
    setInputs((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], rating: index + 1 },
    }));
  };

  const isSubmitEnabled = (itemId) => {
    const itemInputs = inputs[itemId];
    return itemInputs?.review || itemInputs?.media?.length > 0;
  };

  const handleReviewSubmit = async (e, id) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", user?.username);
    formData.append("review", inputs[id]?.review);
    formData.append("rating", inputs[id]?.rating);

    // Append the media files to formData
    (inputs[id]?.media || []).forEach((file) => {
      formData.append("review", file); // media should match the field name used in the multer upload
    });

    try {
      const response = await fetch(
        `https://backend.freshimeat.in/reviews/createreview/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          body: formData, // Use FormData here
        }
      );

      const json = await response.json();
      if (response.ok) {
        setSubmittedReviews((prev) => ({ ...prev, [id]: true })); // Mark the review as submitted
        notify("Review added successfully", "success");
        console.log(json);
      } else {
        console.error(json);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}`;
  };

  useEffect(() => {
    // Get the selected delivery slot from local storage
    const savedSlot = localStorage.getItem("selectedDeliverySlot");
    setSelectedDeliveryDate(savedSlot);
  }, []);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const formatAddress = (address) => {
    return `${address?.firstName} ${address?.lastName}, ${address?.address}, ${address?.landmark}, ${address?.city}, ${address?.state}, ${address?.pincode}, Phone: ${address?.phoneNo}`;
  };

  const formatDay = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString("en-US", {
      month: "short",
    })}`;
  };

  return (
    <div className="order-section">
      <div className="order-left">
        <h3 className="order-id">Order ID: {order?.billId}</h3>
        <h2 className="order-date">{formatDate(order?.createdAt)}</h2>
        <p className="delivered-date-order-section">
        {order?.status === "Canceled" ? (
  "Cancelled"
) : order?.status === "Delivered" ? (
  "Delivered"
) : (
  <>
    Delivery: {order?.time?.day ? formatDay(order?.time?.day) : "No Date"} {order?.time?.slot}
  </>
)}

        </p>
        <h3 className="customer-name">{order?.userId?.username}</h3>
        <p className="customer-phone">
          Phone: {order?.shippingAddress?.phoneNo}
        </p>
        <p className="customer-address">
          Address: {formatAddress(order?.shippingAddress)}
        </p>

        {/* Feedback Section */}
        <h3 className="feedback-title">Tell us how much you loved it!</h3>
        {order?.products?.map((item) => (
          <form
            className="feedback-item"
            key={item?.product?._id}
            onSubmit={(e) => handleReviewSubmit(e, item?.product?._id)}
            // encType="multipart/form-data"
          >
            {/* {console.log(item)} */}
            <div className="item-details">
              <img
                src={`https://backend.freshimeat.in/uploads/${item?.product?.images?.[0]}`}
                alt={item?.name}
                className="item-image"
              />
              <p className="item-name">{item?.product?.name}</p>
            </div>
            <div className="rating-section">
              {[...Array(5)].map((_, index) => (
                <img
                  key={index}
                  src={
                    index < (ratings[item?.product?._id] || 0)
                      ? FullStar
                      : EmptyStar
                  }
                  alt={
                    index < (ratings[item?.product?._id] || 0)
                      ? "Full Star"
                      : "Empty Star"
                  }
                  className="star-icon"
                  onClick={() => handleClick(index, item?.product?._id)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>
            <div className="review-container">
              <textarea
                className="review-box"
                placeholder="Write a review"
                onChange={(e) => handleTextChange(e, item?.product?._id)}
              ></textarea>
              <div className="image-preview-grid">
                {(inputs[item?.product?._id]?.media || []).map(
                  (image, index) => (
                    <div key={index} className="image-preview">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Uploaded ${index + 1}`}
                        className="uploaded-preview"
                        onClick={() =>
                          handleImageClick(URL.createObjectURL(image))
                        } // Open in modal
                      />
                      <button
                      type="button"
                        className="delete-image-button"
                        onClick={() =>
                          handleRemoveImage(item?.product?._id, index)
                        }
                      >
                        ×
                      </button>
                    </div>
                  )
                )}
              </div>

              <label
                htmlFor={`upload-${item?.product?._id}`}
                className="upload-icon"
              >
                <img src={UploadIcon} alt="Upload Icon" />
              </label>
              <input
                name="review" // Add this
                id={`upload-${item?.product?._id}`}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e, item?.product?._id)}
                style={{ display: "none" }}
              />

              <button
                className="submit-btn"
                disabled={
                  !isSubmitEnabled(item?.product?._id) ||
                  submittedReviews[item?.product?._id]
                }
                style={{
                  cursor:
                    isSubmitEnabled(item?.product?._id) &&
                    !submittedReviews[item?.product?._id]
                      ? "pointer"
                      : "not-allowed",
                }}
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        ))}
      </div>

      <div className="billing-right">
        {/* Order Details Section */}
        <div className="user-order-details">
          <h3 className="order-details-title">Order Details:</h3>
          {order?.products?.map((product, index) => (
            <Link
              to={`/product/${product?.product?._id}`}
              key={index}
              className="user-order-item-link"
              style={{ textDecoration: "none", color: "inherit" }} // Inline styles
            >
              <div key={index} className="user-order-item">
                <img
                  src={`https://backend.freshimeat.in/uploads/${product?.product?.images?.[0]}`}
                  alt="Product"
                  className="user-order-img"
                />
                <div className="user-order-info">
                  <p className="user-product-name">{product?.product?.name}</p>
                  <p className="user-product-weight">
                    {product?.product?.weight} g
                  </p>
                  <div className="user-price-quantity-order">
                    <p className="user-product-price">
                      ₹{product?.product?.price?.sale}
                    </p>
                    <p className="user-product-quantity">
                      Quantity x{product.quantity}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Price Summary */}
        <div className="user-price-summary">
          <p className="user-price-text">Delivery:</p>
          <p className="user-price-value">₹{pincode?.deliveryCharges}</p>

          <p className="user-price-text">Subtotal:</p>
          <p className="user-price-value">
            ₹
            {order?.products?.reduce(
              (total, product) => total + product.price * product.quantity,
              0
            )}
          </p>

          <h3 className="user-price-total">Total:</h3>
          <h3 className="user-price-total-value">
            ₹
            {order?.products?.reduce(
              (total, product) => total + product.price * product.quantity,
              0
            ) + pincode?.deliveryCharges}
          </h3>
        </div>
      </div>
      {isModalOpen && (
        <div className="image-modal" onClick={closeModal}>
          <img src={selectedImage} alt="Expanded" className="expanded-image" />
        </div>
      )}
    </div>
  );
};

export default OrderSection;
