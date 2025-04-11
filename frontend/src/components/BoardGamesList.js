import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const BoardGamesList = () => {
    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [boardGames, setBoardGames] = useState([]);
    const navigate = useNavigate();
    const [showTable, setShowTable] = useState(false);
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
                setShowTable(false);
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

    const handleGameClick = (e, gameId) => {
        e.stopPropagation();
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
                            onFocus={() => setShowTable(true)}
                            className="search-input"
                        />
                        <button onClick={handleSearch} className="search-button">Search</button>
                    </div>
                </div>


                {showTable && (
                    <div className="table-wrapper">
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
                                        <tr
                                            key={game.id}
                                            onClick={(e) => handleGameClick(e, game.id)}
                                            className="clickable-row"
                                        >

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
                )}
            </div>
        </div>
    );
};

export default BoardGamesList;
