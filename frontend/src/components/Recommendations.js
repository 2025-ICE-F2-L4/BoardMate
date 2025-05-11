import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/Recommendations.css';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const userId = localStorage.getItem('userId');
    const isLoggedIn = !!userId;

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!isLoggedIn) {
                setLoading(false);
                return;
            }
            
            try {
                // Fetch recommendation IDs using your existing endpoint
                const recommendResponse = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/recommendations?count=4`
                );
                
                if (!recommendResponse.ok) {
                    throw new Error('Failed to fetch recommendations');
                }
                
                const recommendData = await recommendResponse.json();
                
                if (recommendData.length === 0) {
                    setRecommendations([]);
                    setLoading(false);
                    return;
                }
                
                // Fetch details for each recommended game
                const gameDetailsPromises = recommendData.map(item =>
                    fetch(`${process.env.REACT_APP_BACKEND_URL}/gameDetails?id=${item.game_id}`)
                        .then(res => {
                            if (!res.ok) throw new Error(`Failed to fetch game ${item.game_id}`);
                            return res.json();
                        })
                        .then(game => ({ ...game, id: item.game_id }))
                );
                
                const gameDetails = await Promise.all(gameDetailsPromises);
                setRecommendations(gameDetails);
            } catch (err) {
                console.error('Error fetching recommendations:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchRecommendations();
    }, [isLoggedIn]);

    const handleGameClick = (gameId) => {
        navigate(`/gameDetails?id=${gameId}`);
    };
    
    if (!isLoggedIn) return null;
    if (loading) return <div className="recommendations-loading">Loading recommendations...</div>;
    if (error) return <div className="recommendations-error">Error: {error}</div>;
    if (!recommendations.length) return null;
    
    return (
        <div className="recommendations-container">
            <h2>Discover New Games</h2>
            <div className="recommendations-list">
                {recommendations.map(game => (
                    <div 
                        key={game.id}
                        className="recommendation-item"
                        onClick={() => handleGameClick(game.id)}
                    >
                        <h3 className="recommendation-name">{game.name}</h3>
                        <div className="recommendation-details">
                            <span>{game.minPlayers}-{game.maxPlayers} players</span>
                            <span>{game.playTime} min</span>
                        </div>
                        {game.genres && game.genres.length > 0 && (
                            <div className="recommendation-genres">
                                {game.genres.slice(0, 2).map((genre, i) => (
                                    <span key={i} className="genre-tag">{genre}</span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Recommendations;