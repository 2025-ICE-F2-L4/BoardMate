import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/BoardGamesList.css';
import Recommendations from './Recommendations';

const BoardGamesList = () => {
    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [genres, setGenres] = useState([]);
    const [allBoardGames, setAllBoardGames] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const navigate = useNavigate();
    const [showResults, setShowResults] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/genres`);
                if (response.ok) {
                    const data = await response.json();
                    console.log("DEBUG - Fetched genres:", data);
                    setGenres(data);
                }
            } catch (error) {
                console.error("Error fetching genres:", error);
            }
        };
        fetchGenres();
    }, []);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                let response = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/search?phrase=${encodeURIComponent(searchTerm)}`
                );
                let result = await response.json();
                setAllBoardGames(result);
            } catch (error) {
                console.error("Error fetching games:", error);
            }
        };
        fetchGames();
    }, [searchTerm]);

    useEffect(() => {
        const filterGamesByGenre = async () => {
            if (!selectedGenre) {
                setFilteredGames(allBoardGames);
                return;
            }

            const gamesWithGenreInfo = await Promise.all(
                allBoardGames.map(async (game) => {
                    try {
                        const detailsResponse = await fetch(
                            `${process.env.REACT_APP_BACKEND_URL}/gameDetails?id=${game.id}`
                        );
                        const gameDetails = await detailsResponse.json();
                        const hasSelectedGenre = gameDetails.genres && 
                            gameDetails.genres.some(genre => genre === selectedGenre);
                        return {
                            ...game,
                            hasSelectedGenre
                        };
                    } catch (error) {
                        console.error(`Error fetching details for game ${game.id}:`, error);
                        return {
                            ...game,
                            hasSelectedGenre: false
                        };
                    }
                })
            );

            const filtered = gamesWithGenreInfo.filter(game => game.hasSelectedGenre);
            setFilteredGames(filtered);
        };

        filterGamesByGenre();
    }, [allBoardGames, selectedGenre]);

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
        if (e.key === "Enter") {
            setSearchTerm(inputValue);
        }
    };

    const handleSearch = () => {
        setSearchTerm(inputValue);
    };

    const handleGenreChange = (e) => {
        setSelectedGenre(e.target.value);
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
                        <div className="search-controls">
                            <select 
                                value={selectedGenre} 
                                onChange={handleGenreChange}
                                className="genre-select"
                            >
                                <option value="">Genres</option>
                                {genres.map((genre) => (
                                    <option key={genre.id || genre.genre} value={genre.genre}>
                                        {genre.genre}
                                    </option>
                                ))}
                            </select>
                            <button onClick={handleSearch} className="search-button">
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                {showResults && (
                    <div className="dropdown-results">
                        {filteredGames.length > 0 ? (
                            filteredGames.map((game) => (
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
                                {selectedGenre ? "No games found in this genre" : "No games found"}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Recommendations />
        </div>
    );
};

export default BoardGamesList;
