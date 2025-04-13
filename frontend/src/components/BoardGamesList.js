import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const BoardGamesList = () => {
    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [boardGames, setBoardGames] = useState([]);
    const navigate = useNavigate();
    const [showResults, setShowResults] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setSearchTerm(inputValue);
        }
    };

    const handleSearch = () => {
        setSearchTerm(inputValue);
    };

    const handleGameClick = (gameId) => {
        navigate(`/gameDetails?id=${gameId}`);
    };

    return (
        <div className="main-background">
            <div className="search-table-wrapper" ref={wrapperRef}>
                <div className="search-bar-wrapper">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search board games..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setShowResults(true)}
                            className="search-input"
                        />
                        <button onClick={handleSearch} className="search-button">Search</button>
                    </div>
                </div>

                {showResults && (
                    <div className="dropdown-results">
                        {boardGames.length > 0 ? (
                            boardGames.map(game => (
                                <div
                                    key={game.id}
                                    className="dropdown-item"
                                    onClick={() => handleGameClick(game.id)}
                                >
                                    {game.name}
                                </div>
                            ))
                        ) : (
                            <div className="dropdown-item no-results">
                                No games found
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BoardGamesList;
