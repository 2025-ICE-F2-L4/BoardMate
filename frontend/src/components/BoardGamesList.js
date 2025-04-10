import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BoardGamesList = () => {
    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [boardGames, setBoardGames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        //console.log("Search term changed to:", searchTerm);
        const fetchGames = async () => {
            try {
                let query = new URLSearchParams({ phrase: searchTerm }).toString();
                let response = await fetch("https://boardmate.onrender.com/search?" + query);
                let result = await response.json();
                setBoardGames(result);
            } catch (error) {
                console.error("Error fetching games:", error);
            }
        };

        fetchGames();
    }, [searchTerm]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            //console.log("Enter key pressed, setting searchTerm to:", inputValue);
            setSearchTerm(inputValue);
        }
    }

    const handleSearch = () => {
        //console.log("Search button clicked, setting searchTerm to:", inputValue);
        setSearchTerm(inputValue);
    };

    const handleGameClick = (gameId) => {
        navigate(`/gameDetails?id=${gameId}`);
    };

    return (
        <div className="board-games-container">
            <h2>Board Games</h2>

            {/* Search Input */}
            <div className="search-container">
            <input
                type="text"
                placeholder="Search board games..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="search-input"
            />
            <button onClick={handleSearch} className="search-button">Search</button>
            </div>

            {/* Table */}
            <table className="board-games-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
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
                                <td>{game.minAge}+</td>
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
