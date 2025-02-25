import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./CustomerReviews.css";

// Import assets
import FullStar from "../../assets/material-symbols_star.svg";
import EmptyStar from "../../assets/material-symbols_star-outline.svg";
import UserIcon from "../../assets/user.png";

const backendUrl = "http://localhost:4001/reviews"; // Replace with your actual backend URL

const CustomerReviews = () => {
  const [reviewsData, setReviewsData] = useState(null); // Store the entire object
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reviewsPerPage = 5;
  const { id } = useParams();

  // Fetch Reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${backendUrl}/getproductreview/${id}`);
        const json = await response.json();
    
        console.log("API Response:", json); // Debugging
    
        if (json?.reviews && Array.isArray(json.reviews.reviews)) {
          // Sort reviews by rating in descending order
          const sortedReviews = json.reviews.reviews.sort((a, b) => b.rating - a.rating);
    
          setReviewsData({ ...json.reviews, reviews: sortedReviews }); // Store the entire object with sorted reviews
        } else {
          console.error("Invalid reviews format:", json);
          setReviewsData({ reviews: [] });
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };
    

    fetchReviews();
  }, [id]);

  // Calculate average rating
  const calculateAverageRating = (reviewsData) => {
    if (!reviewsData || !reviewsData.reviews || reviewsData.reviews.length === 0) return 0;
    const totalRating = reviewsData.reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviewsData.reviews.length).toFixed(1);
  };

  const avgRating = calculateAverageRating(reviewsData);

  // Render stars based on rating
  const renderStars = (rating) => (
    [...Array(5)].map((_, i) => (
      <img key={i} src={i < rating ? FullStar : EmptyStar} alt="Star" className="star-icon" />
    ))
  );

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviewsData?.reviews?.slice(indexOfFirstReview, indexOfLastReview) || [];

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const totalPages = Math.ceil((reviewsData?.reviews?.length || 0) / reviewsPerPage);
    return (
      <div className="pagination">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            className={`pagination-button ${i + 1 === currentPage ? "active" : ""}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    );
  };

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="customer-reviews">
      <h2>Customer Reviews ({reviewsData?.reviews?.length || 0})</h2>
      <div className="rating-summary">
        <div className="stars">{renderStars(avgRating)}</div>
        <p>{avgRating} out of 5</p>
      </div>

      {currentReviews.length > 0 ? (
        currentReviews.map((review, index) => (
          <div key={index} className="review-card">
            <div className="review-header">
              <div className="review-author">
                <img src={UserIcon} alt="User Icon" className="user-icon" />
                <h4>{review.username}</h4>
                <div className="stars">{renderStars(review.rating)}</div>
              </div>
            </div>
            <h3>{reviewsData?.productId?.name || "Unknown Product"}</h3>
            <p>{review.review}</p>

            {/* Render images if available */}
            {review?.media && review.media.length > 0 && (
              <div className="review-images">
                {review.media.map((img, index) => (
                  <img
                    key={index}
                    src={`http://localhost:4001/uploads/${img}`}
                    alt={`Review ${index + 1}`}
                    onClick={() => setSelectedImage(`http://localhost:4001/uploads/${img}`)}
                  />
                ))}
              </div>
            )}

            <hr className="review-divider" />
          </div>
        ))
      ) : (
        <p>No reviews yet...</p>
      )}

      {renderPagination()}

      {/* Image Modal for Enlarged View */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="image-modal-content">
            <img src={selectedImage} alt="Full Review" className="full-image" />
            <button className="close-button" onClick={() => setSelectedImage(null)}>✖</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default CustomerReviews;
