import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BACKEND_URL from '../config';

const BoardGamesList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [boardGames, setBoardGames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGames = async () => {
            try {
                let query = new URLSearchParams({ phrase: searchTerm }).toString();
                let response = await fetch(`${BACKEND_URL}/search?${query}`);
                let result = await response.json();
                setBoardGames(result);
            } catch (error) {
                console.error("Error fetching games:", error);
            }
        };

        fetchGames();
    }, [searchTerm]);

    const handleGameClick = (gameId) => {
        navigate(`/gameDetails?id=${gameId}`);
    };

    return (
        <>
            <div className="search-bar-wrapper">
                <input
                    type="text"
                    placeholder="Search board games..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {searchTerm && (
                <div className="dropdown-results">
                    {boardGames.length > 0 ? (
                        boardGames.map((game) => (
                            <div
                                key={game.id}
                                className="dropdown-item"
                                onClick={() => handleGameClick(game.id)}
                            >
                                {game.name}
                            </div>
                        ))
                    ) : (
                        <div className="dropdown-item no-results">No games found</div>
                    )}
                </div>
            )}
        </>
    );


};

export default BoardGamesList;
