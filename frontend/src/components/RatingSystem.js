import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { FaStarHalfAlt } from 'react-icons/fa';
import { FaRegStar } from 'react-icons/fa';
import '../styles/components/RatingSystem.css';

const RatingSystem = ({ gameId }) => {
    const [ratings, setRatings] = useState([]);
    const [userRating, setUserRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const userId = localStorage.getItem('userId');
    const isLoggedIn = !!userId;

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rate?gameID=${gameId}`);
                if (!response.ok) {
                    throw new Error('Failed to load ratings');
                }
                
                const data = await response.json();
                setRatings(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching ratings:', err);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchRatings();
    }, [gameId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (userRating === 0) {
            alert('Please select a star rating');
            return;
        }
        
        console.log("Submitting review with data:", {
            backend: process.env.REACT_APP_BACKEND_URL,
            userID: parseInt(userId, 10),
            gameID: parseInt(gameId, 10), 
            rating: userRating,
            comment: comment || ""
        });

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userID: parseInt(userId, 10),
                    gameID: parseInt(gameId, 10),
                    rating: userRating,
                    comment: comment
                }),
            });
            
            const responseData = await response.clone().json().catch(() => ({}));
            console.log("Rating response:", response.status, responseData);
            
            if (!response.ok) {
                throw new Error('Failed to submit rating');
            }
            
            setUserRating(0);
            setComment('');
            setSubmitSuccess(true);
            
            const ratingsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rate?gameID=${gameId}`);
            const ratingsData = await ratingsResponse.json();
            setRatings(ratingsData);
            
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 3000);
            
        } catch (err) {
            setError(err.message);
            console.error('Error submitting rating:', err);
        }
    };

    let totalRating = 0;
    let validRatings = 0;

    if (ratings.length > 0) {
      ratings.forEach(item => {
        const parsed = parseInt(item.rating, 10);
        if (!isNaN(parsed) && parsed > 0 && parsed <= 5) {
          totalRating += parsed;
          validRatings++;
        }
      });
    }

    const averageRating = validRatings > 0
      ? (totalRating / validRatings).toFixed(1)
      : 'No ratings yet';

    const numericAverage = validRatings > 0 ? totalRating / validRatings : 0;

    return (
        <div className="rating-system">
            <h2>Game Reviews</h2>
            
            <div className="average-rating">
                <span className="rating-score">{averageRating}</span>
                {ratings.length > 0 && (
                    <div className="stars-display">
                        {[...Array(5)].map((_, index) => {
                            const starValue = index + 1;
                            const fillPercent = Math.min(
                                Math.max(numericAverage - index, 0), 
                                1
                            );
                            
                            return (
                                <div key={index} className="star-container">
                                    <FaRegStar size={20} className="star-empty" />
                                    <div 
                                        className="star-fill" 
                                        style={{ width: `${fillPercent * 100}%` }}
                                    >
                                        <FaStar size={20} className="star-filled" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                <span className="rating-count">({ratings.length} {ratings.length === 1 ? 'review' : 'reviews'})</span>
            </div>

            {isLoggedIn ? (
                <div className="add-rating">
                    <h3>Add Your Review</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="star-rating">
                            {[...Array(5)].map((_, index) => {
                                const starValue = index + 1;
                                return (
                                    <label key={index}>
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={starValue}
                                            onClick={() => setUserRating(starValue)}
                                        />
                                        <FaStar
                                            size={30}
                                            className={starValue <= (hover || userRating) ? "star-filled" : "star-empty"}
                                            onMouseEnter={() => setHover(starValue)}
                                            onMouseLeave={() => setHover(0)}
                                        />
                                    </label>
                                );
                            })}
                        </div>
                        
                        <div className="comment-input">
                            <textarea
                                placeholder="Write your review (optional)"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                            />
                        </div>
                        
                        <button type="submit" className="submit-rating">
                            Submit Review
                        </button>
                        
                        {submitSuccess && (
                            <div className="success-message">
                                Your review has been submitted successfully!
                            </div>
                        )}
                    </form>
                </div>
            ) : (
                <div className="login-prompt">
                    <p>Please <a href="/login">log in</a> to leave a review</p>
                </div>
            )}
            
            <div className="ratings-list">
                <h3>User Reviews</h3>
                
                {isLoading ? (
                    <p>Loading reviews...</p>
                ) : error ? (
                    <p className="error-message">Error loading reviews: {error}</p>
                ) : ratings.length === 0 ? (
                    <p>No reviews yet. Be the first to review!</p>
                ) : (
                    ratings.map((item, index) => (
                        <div key={index} className="rating-item">
                            <div className="rating-header">
                                <span className="username">{item.login}</span>
                                <div className="user-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            size={16}
                                            className={i < item.rating ? "star-filled" : "star-empty"}
                                        />
                                    ))}
                                </div>
                                <span className="rating-date">
                                    {new Date(item.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                            {item.comment && (
                                <div className="rating-comment">{item.comment}</div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RatingSystem;