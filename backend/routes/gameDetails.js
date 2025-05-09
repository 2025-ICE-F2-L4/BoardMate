import db from "../db.js";
import express from "express";
const router = express.Router();

router.get("/gameDetails", async (req, res) => {
	const { id } = req.query;
	console.log("Requesting details about " + id);

	try {
		const [results] = await db.query(
			"SELECT name, minAge, minPlayers, maxPlayers, playTime,  AVG(ratings.rating) as averageRating, description\
            FROM games LEFT JOIN ratings ON ratings.game_id = games.id\
            WHERE games.id = ?\
            GROUP BY games.id, name,minAge,minPlayers,maxPlayers,playTime,description",
			[id],
		);

		if (results.length != 1)
			return res.status(400).json({ error: "Invalid id" });

		const [genreResults] = await db.query(
			"SELECT genres.genre\
            FROM genres\
            JOIN games_genres ON genres.id = games_genres.genre_id\
            WHERE games_genres.game_id = ?",
			[id],
		);
		const genres = genreResults.map((genreResults) => genreResults.genre);
		results[0].genres = genres;
		return res.json(results[0]);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
});

export default router;
