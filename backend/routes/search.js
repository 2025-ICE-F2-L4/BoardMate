import db from "../db.js";
import express from "express";
const router = express.Router();

router.get("/search", async (req, res) => {
	const { phrase, genreID } = req.query;
	if (genreID == null) {
		try {
			const [results] = await db.query(
				"SELECT id, name FROM games WHERE name LIKE ?",
				["%" + phrase + "%"],
			);

			return res.json(results);
		} catch (err) {
			console.error(err);
			return res.status(500).json({ error: err.message });
		}
	} else {
		try {
			const [results] = await db.query(
				"SELECT games.id, name, genres.genre\
                FROM games\
                JOIN games_genres ON games.id = games_genres.game_id\
                JOIN genres ON games_genres.genre_id = genres.id\
                WHERE games_genres.genre_id = ? AND name LIKE ?",
				[genreID, "%" + phrase + "%"],
			);
			const resultsWithNoGenre = results.map(({ genre, ...rest }) => rest);
			return res.json(resultsWithNoGenre);
		} catch (err) {
			console.error(err);
			return res.status(500).json({ error: err.message });
		}
	}
});

export default router;
