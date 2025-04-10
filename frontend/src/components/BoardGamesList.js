import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BoardGamesList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [boardGames, setBoardGames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGames = async () => {
            try {
                let query = new URLSearchParams({ phrase: searchTerm }).toString();
                let response = await fetch("http://localhost:3001/search?" + query);
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
        console.log(gameId);
    };

    return (
        <div className="board-games-container">
            <h2>Board Games</h2>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search board games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />

            {/* Table */}
            <table className="board-games-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Min Age</th>
                        <th>Players</th>
                        <th>Play Time</th>
                    </tr>
                </thead>
                <tbody>
                    {boardGames.length > 0 ? (
                        boardGames.map(game => (
                            <tr key={game.id} 
                                onClick={() => handleGameClick(game.id)}
                                className="clickable-row">
                                <td>{game.name}</td>
                                <td>{game.minAge}</td>
                                <td>{game.minPlayers} - {game.maxPlayers}</td>
                                <td>{game.playTime}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="no-games">No games found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BoardGamesList;
