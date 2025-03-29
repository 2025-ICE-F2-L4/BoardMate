import React, { useState } from 'react';

const boardGames = [
    { id: 1, name: 'Catan', minAge: 10, minPlayers: 3, maxPlayers: 4, playTime: '60-120 min' },
    { id: 2, name: 'Carcassonne', minAge: 7, minPlayers: 2, maxPlayers: 5, playTime: '35-45 min' },
    { id: 3, name: 'Ticket to Ride', minAge: 8, minPlayers: 2, maxPlayers: 5, playTime: '30-60 min' },
    { id: 4, name: 'Azul', minAge: 8, minPlayers: 2, maxPlayers: 4, playTime: '30-45 min' },
    { id: 5, name: '7 Wonders', minAge: 10, minPlayers: 3, maxPlayers: 7, playTime: '30 min' }
];

const BoardGamesList = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredGames = boardGames.filter(game =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
    );




    const exampleFetchFunction = async () => {
      try {
        let query = new URLSearchParams({phrase : "example"}).toString();
        let response = await fetch('http://localhost:3001/search?' + query );
        let result = await response.json();
        console.log(result);
        return result;
      } catch (error) {
        console.error("Error:", error);
      }
    };
    exampleFetchFunction();


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
                    {filteredGames.length > 0 ? (
                        filteredGames.map(game => (
                            <tr key={game.id}>
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
