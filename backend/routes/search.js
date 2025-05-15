import db from "../db.js";
import express from "express";
const router = express.Router();

router.get("/search", async (req, res) => {
	const { phrase, genreID } = req.query;
	if (genreID == null) {
		try {
			const [results] = await db.query(
				"SELECT games.id, name\
                FROM games LEFT JOIN ratings ON  ratings.game_id = games.id\
                WHERE name LIKE ?\
                GROUP BY games.id, name\
                ORDER BY AVG(ratings.rating) DESC",
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
				" SELECT games.id, name, genres.genre\
                FROM games\
                JOIN games_genres ON games.id = games_genres.game_id\
                JOIN genres ON games_genres.genre_id = genres.id\
                LEFT JOIN ratings ON ratings.game_id = games.id\
                WHERE games_genres.genre_id = ? AND name LIKE ?\
                GROUP BY games.id, name, genres.genre\
                ORDER BY AVG(ratings.rating) DESC ",
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
