import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import '../styles/components/GameDetails.css';
import '../styles/components/common.css';
import RatingSystem from './RatingSystem';

const GameDetails = () => {
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const name = searchParams.get("name");
    const userId = localStorage.getItem('userId');
    const isLoggedIn = !!userId;
    const historyRecorded = useRef(false);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isInHistory, setIsInHistory] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    const checkWishlistStatus = async (gameId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/userWishlist?userID=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch wishlist');
            }
            
            const wishlistData = await response.json();
            
            const gameIdString = String(gameId);
            const isInWishlist = wishlistData.some(item => String(item.game_id) === gameIdString);
            console.log(`Checking wishlist for game ${gameIdString}:`, wishlistData);
            console.log(`Result: ${isInWishlist}`);
            return isInWishlist;
            
        } catch (err) {
            console.error('Error checking wishlist status:', err);
            return false;
        }
    };

    useEffect(() => {
        historyRecorded.current = false;
        setLoading(true);
        
        const fetchGameDetails = async () => {
            if (!id) {
                setError("No game ID provided");
                setLoading(false);
                return;
            }

            try {
                if (userId) {
                    console.log("Checking wishlist status on page load...");
                    const inWishlist = await checkWishlistStatus(id);
                    console.log(`Initial wishlist check: Game ${id} in wishlist: ${inWishlist}`);
                    setIsInWishlist(inWishlist);
                }
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/gameDetails?id=${id}`);
                if (!response.ok) {
                    throw new Error('Game not found');
                }
                
                const data = await response.json();
                console.log("Game details:", data);
                
                setGame(data);

                if (userId && data) {
                    const history = JSON.parse(localStorage.getItem(`history_${userId}`)) || [];
                    setIsInHistory(history.some(g => g.id === data.id));
                }
                
                if (isLoggedIn && !historyRecorded.current) {
                    recordGameView(id);
                    historyRecorded.current = true;
                }
            } catch (err) {
                setError(err.message);
                console.error('Error in fetchGameDetails:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchGameDetails();
    }, [id, isLoggedIn, userId]);

    const recordGameView = async (gameId) => {
        try {
            const payload = {
                userID: parseInt(userId, 10),
                gameID: parseInt(gameId, 10)
            };
            
            console.log('Recording game history with payload:', payload);
            console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL);
            
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/gameHistory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            
            const responseText = await response.text();
            
            if (!response.ok) {
                console.error('Failed to record game history:', {
                    status: response.status,
                    statusText: response.statusText,
                    responseBody: responseText
                });
            } else {
                console.log('Game view recorded in history successfully:', responseText);
            }
        } catch (err) {
            console.error('Error recording game history:', err.message);
        }
    };

    const addToWishlist = async () => {
        if (!userId) {
            alert("You must be logged in.");
            return;
        }
        
        setWishlistLoading(true);
        
        try {
            const alreadyInWishlist = await checkWishlistStatus(id);
            if (alreadyInWishlist) {
                setIsInWishlist(true);
                return;
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/userWishlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userID: parseInt(userId, 10),
                    gameID: parseInt(id, 10) // Use id from URL instead of game.id
                }),
            });
            const responseData = await response.text();
            console.log('Wishlist API response:', responseData);
            
            if (!response.ok) {
                throw new Error(`Failed to add to wishlist: ${responseData}`);
            }
            
            setIsInWishlist(true);
            
        } catch (err) {
            console.error('Error adding to wishlist:', err);
            alert(`Failed to add to wishlist: ${err.message}`);
        } finally {
            setWishlistLoading(false);
        }
    };

    const addToHistory = async (gameId) => {
        if (!userId) {
            alert("You must be logged in.");
            return;
        }
        const key = `history_${userId}`;
        const current = JSON.parse(localStorage.getItem(key)) || [];
        const updated = [...current, { id: parseInt(game.id), name: game.name }];
        localStorage.setItem(key, JSON.stringify(updated));
        setIsInHistory(true);
    };

    const removeFromWishlist = async () => {
        if (!userId) {
            return;
        }
        
        setWishlistLoading(true);
        
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/userWishlist?userID=${userId}&gameID=${id}`, 
                {
                    method: 'DELETE'
                }
            );
            
            const responseData = await response.text();
            console.log('Wishlist removal API response:', responseData);
            
            if (!response.ok) {
                throw new Error(`Failed to remove from wishlist: ${responseData}`);
            }
            
            setIsInWishlist(false);
            
        } catch (err) {
            console.error('Error removing from wishlist:', err);
            alert(`Failed to remove from wishlist: ${err.message}`);
        } finally {
            setWishlistLoading(false);
        }
    };

    const removeFromHistory = () => {
        const userId = localStorage.getItem('userId');
        const key = `history_${userId}`;
        const current = JSON.parse(localStorage.getItem(key)) || [];
        const updated = current.filter(g => g.id !== game.id);
        localStorage.setItem(key, JSON.stringify(updated));
        setIsInHistory(false);
    };

    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;
    if (!game) return <div className="not-found">Game not found</div>;

    return (
        <div className="game-details">
            <Link to="/search" className="back-button">Back to Games</Link>

            
            <h1>{game.name}</h1>
            
            <div className="game-info">
                {game.genres && game.genres.length > 0 && (
                    <div className="genres-container">
                        <p><strong>Genres:</strong></p>
                        <div className="genre-tags">
                            {game.genres.map((genre, index) => (
                                <span key={index} className="genre-tag">{genre}</span>
                            ))}
                        </div>
                    </div>
                )}
                
                <p><strong>Age:</strong> {game.minAge}+</p>
                <p><strong>Players:</strong> {game.minPlayers} - {game.maxPlayers}</p>
                <p><strong>Play Time:</strong> {game.playTime} minutes</p>
                <p><strong>Description:</strong> {game.description}</p>
                {isLoggedIn && (
                    <div className="game-actions">
                        {isInWishlist ? (
                            <button 
                                onClick={removeFromWishlist} 
                                className="action-button remove"
                                disabled={wishlistLoading}
                            >
                                {wishlistLoading ? 'Removing...' : 'Remove from Wishlist'}
                            </button>
                        ) : (
                            <button 
                                onClick={addToWishlist} 
                                className="action-button"
                                disabled={wishlistLoading}
                            >
                                {wishlistLoading ? 'Adding...' : 'Add to Wishlist'}
                            </button>
                        )}

                        {isInHistory ? (
                            <button onClick={removeFromHistory} className="action-button remove">Remove from History</button>
                        ) : (
                            <button onClick={addToHistory} className="action-button">Add as Played</button>
                        )}
                    </div>
                )}
            </div>
            
            <RatingSystem gameId={id} />
        </div>
    );
};

export default GameDetails;

