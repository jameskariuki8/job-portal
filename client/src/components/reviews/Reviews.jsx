import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import newRequest from "../../utils/newRequest";
import Review from "../review/Review";
import "./reviews.scss";

const Reviews = ({ gigId }) => {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();
  
  const { isLoading, error, data } = useQuery({
    queryKey: ["reviews"],
    queryFn: () =>
      newRequest.get(`/reviews/${gigId}`).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (review) => {
      return newRequest.post("/reviews", review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
      setReviewText("");
      setSelectedStar(0);
      setIsSubmitting(false);
    },
    onError: () => {
      setIsSubmitting(false);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedStar) {
      alert('Please select a rating');
      return;
    }
    
    if (!reviewText.trim()) {
      alert('Please write a review');
      return;
    }

    setIsSubmitting(true);
    mutation.mutate({ gigId, desc: reviewText, star: selectedStar });
  };

  const handleStarClick = (star) => {
    setSelectedStar(star);
  };

  const handleStarHover = (star) => {
    setHoveredStar(star);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const renderStars = (rating, interactive = false, size = "medium") => {
    const stars = [];
    const maxStars = 5;
    
    for (let i = 1; i <= maxStars; i++) {
      let starClass = "star";
      let starIcon = "☆";
      
      if (interactive) {
        // For interactive rating (hover and selection)
        if (i <= hoveredStar || i <= selectedStar) {
          starClass += " active";
          starIcon = "★";
        }
      } else {
        // For display rating
        if (i <= rating) {
          starClass += " active";
          starIcon = "★";
        }
      }
      
      stars.push(
        <span
          key={i}
          className={`${starClass} ${size}`}
          onClick={interactive ? () => handleStarClick(i) : undefined}
          onMouseEnter={interactive ? () => handleStarHover(i) : undefined}
          onMouseLeave={interactive ? handleStarLeave : undefined}
        >
          {starIcon}
        </span>
      );
    }
    
    return stars;
  };

  return (
    <div className="reviews">
      <div className="reviews-header">
        <h2>Customer Reviews</h2>
        <div className="reviews-summary">
          {!isLoading && !error && data && data.length > 0 && (
            <div className="average-rating">
              <div className="stars-display">
                {renderStars(Math.round(data.reduce((acc, review) => acc + review.star, 0) / data.length))}
              </div>
              <span className="rating-count">
                {data.length} {data.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Add Review Form */}
      <div className="add-review-section">
        <div className="form-header">
          <h3>Write a Review</h3>
          <p>Share your experience with this service</p>
        </div>
        
        <form className="review-form" onSubmit={handleSubmit}>
          <div className="rating-section">
            <label className="rating-label">Your Rating</label>
            <div className="star-rating-container">
              {renderStars(0, true, "large")}
              <span className="rating-text">
                {selectedStar > 0 ? `${selectedStar} star${selectedStar > 1 ? 's' : ''}` : 'Select rating'}
              </span>
            </div>
          </div>
          
          <div className="review-text-section">
            <label className="review-label" htmlFor="reviewText">
              Your Review
            </label>
            <textarea
              id="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell us about your experience with this service..."
              rows="4"
              maxLength="500"
              className="review-textarea"
            />
            <div className="character-count">
              {reviewText.length}/500 characters
            </div>
          </div>
          
          <button 
            type="submit" 
            className="submit-review-btn"
            disabled={isSubmitting || !selectedStar || !reviewText.trim()}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Submitting...
              </>
            ) : (
              <>
                <span className="btn-icon">📝</span>
                Submit Review
              </>
            )}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        <h3>All Reviews</h3>
        
        {isLoading ? (
          <div className="loading-reviews">
            <div className="loader"></div>
            <p>Loading reviews...</p>
          </div>
        ) : error ? (
          <div className="error-reviews">
            <p>Something went wrong loading reviews!</p>
          </div>
        ) : data && data.length > 0 ? (
          <div className="reviews-grid">
            {data.map((review) => (
              <Review key={review._id} review={review} />
            ))}
          </div>
        ) : (
          <div className="no-reviews">
            <div className="no-reviews-icon">💬</div>
            <h4>No reviews yet</h4>
            <p>Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;