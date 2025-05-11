import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        const fetchGameDetails = async () => {
            if (!id) {
                setError("No game ID provided");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/gameDetails?id=${id}`);
                if (!response.ok) {
                    throw new Error('Game not found');
                }
                
                const data = await response.json();
                console.log("Game details with genres:", data);
                
                setGame(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchGameDetails();
    }, [id]);

    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;
    if (!game) return <div className="not-found">Game not found</div>;

    return (
        <div className="game-details">
            <Link to="/" className="back-button">Back to Games</Link>
            
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
            </div>
            
            <RatingSystem gameId={id} />
        </div>
    );
};

export default GameDetails;

