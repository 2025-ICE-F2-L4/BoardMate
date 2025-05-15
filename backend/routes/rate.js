import db from "../db.js";
import express from "express";
const router = express.Router();

router.post("/rate", async (req, res) => {
	const { userID, gameID, comment, rating } = req.body;

	try {
		const [validationResults] = await db.query(
			"SELECT * FROM ratings WHERE user_id = ?",
			[userID],
		);
		if (validationResults.length != 0)
			throw new Error("Cannot add multiple comments");

		const [results] = await db.query(
			"INSERT INTO ratings (user_id,game_id,comment,rating) VALUES(?,?,?,?)",
			[userID, gameID, comment, clamp(rating, 0, 5)],
		);
		return res.json(results);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
});

router.get("/rate", async (req, res) => {
	const { gameID } = req.query;
	try {
		const [results] = await db.query(
			"SELECT users.login, ratings.timestamp, ratings.comment, ratings.rating\
            FROM ratings JOIN users ON users.id = ratings.user_id\
            WHERE ratings.game_id= ?",
			[gameID],
		);
		return res.json(results);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
});
export default router;
