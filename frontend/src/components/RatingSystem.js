import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { FaRegStar } from 'react-icons/fa';
import '../styles/components/RatingSystem.css';

const RatingSystem = ({ gameId }) => {
    const [ratings, setRatings] = useState([]);
    const [gameDetails, setGameDetails] = useState(null);
    const [userRating, setUserRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [hasUserRated, setHasUserRated] = useState(false);
    const [userExistingRating, setUserExistingRating] = useState(null);

    const userId = localStorage.getItem('userId');
    const userLogin = localStorage.getItem('login');
    const isLoggedIn = !!userId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const detailsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/gameDetails?id=${gameId}`);
                if (!detailsResponse.ok) {
                    throw new Error('Failed to load game details');
                }
                const detailsData = await detailsResponse.json();
                setGameDetails(detailsData);

                const ratingsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rate?gameID=${gameId}`);
                if (!ratingsResponse.ok) {
                    throw new Error('Failed to load ratings');
                }
                const ratingsData = await ratingsResponse.json();
                setRatings(ratingsData);
                
                if (isLoggedIn && userLogin) {
                    const userExistingRating = ratingsData.find(rating => rating.login === userLogin);
                    if (userExistingRating) {
                        setHasUserRated(true);
                        setUserExistingRating(userExistingRating);
                    }
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [gameId, isLoggedIn, userLogin]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (userRating === 0) {
            alert('Please select a star rating');
            return;
        }

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

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to submit rating');
            }

            setUserRating(0);
            setComment('');
            setSubmitSuccess(true);
            
            const newRatingsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rate?gameID=${gameId}`);
            const newRatingsData = await newRatingsResponse.json();
            setRatings(newRatingsData);
            
            const userNewRating = newRatingsData.find(rating => rating.login === userLogin);
            if (userNewRating) {
                setHasUserRated(true);
                setUserExistingRating(userNewRating);
            }

            setTimeout(() => {
                setSubmitSuccess(false);
            }, 3000);

        } catch (err) {
            setError(err.message);
            console.error('Error submitting rating:', err);
        }
    };

    const averageRating = gameDetails?.averageRating 
        ? parseFloat(gameDetails.averageRating).toFixed(1)
        : 'No ratings yet';

    const numericAverage = gameDetails?.averageRating 
        ? parseFloat(gameDetails.averageRating) 
        : 0;

    const sortedRatings = [...ratings].sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
    );

    return (
        <div className="rating-system">
            <h2>Game Reviews</h2>

            <div className="average-rating">
                <span className="rating-score">{averageRating}</span>
                {numericAverage > 0 && (
                    <div className="stars-display">
                        {[...Array(5)].map((_, index) => {
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

            {isLoggedIn && (
                hasUserRated ? (
                    <div className="user-existing-rating">
                        <h3>Your Review</h3>
                        <div className="user-stars">
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    size={24}
                                    className={i < userExistingRating?.rating ? "star-filled" : "star-empty"}
                                />
                            ))}
                        </div>
                        {userExistingRating?.comment && (
                            <div className="user-comment">
                                <p>{userExistingRating.comment}</p>
                            </div>
                        )}
                        <div className="rating-date">
                            Posted on {new Date(userExistingRating?.timestamp).toLocaleDateString()}
                        </div>
                    </div>
                ) : (
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

                            {error && <div className="error-message">{error}</div>}
                            
                            {submitSuccess && (
                                <div className="success-message">
                                    Your review has been submitted successfully!
                                </div>
                            )}
                        </form>
                    </div>
                )
            )}

            {!isLoggedIn && (
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
                    sortedRatings.map((item, index) => (
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