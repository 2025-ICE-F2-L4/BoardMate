import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

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
				const response = await fetch(`http://localhost:3001/gameDetails?id=${id}`);
				if (!response.ok) {
					throw new Error('Game not found');
				}
				const data = await response.json();
				setGame(data);
				setLoading(false);
			} catch (err) {
				setError(err.message);
				setLoading(false);
			}
		};

		fetchGameDetails();
	}, [id]);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!game) return <div>Game not found</div>;

	return (
		<div className="game-details">
			<Link to="/" className="back-button">Back to Home</Link>

			<h1>{game.name}</h1>

			<div className="game-info">
				<p><strong>Age:</strong> {game.minAge}+</p>
				<p><strong>Players:</strong> {game.minPlayers} - {game.maxPlayers}</p>
				<p><strong>Play Time:</strong> {game.playTime} minutes</p>
			</div>
		</div>
	);
};

export default GameDetails;

