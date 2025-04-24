import db from "../db.js";
import express from "express";
const router = express.Router();

router.post("/gameHistory", async (req, res) => {
	const { userID, gameID } = req.body;
	try {
		const [results] = await db.query(
			"INSERT INTO game_history (user_id,game_id) VALUES(?,?)",
			[userID, gameID],
		);
		return res.json(results);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
});

router.get("/gameHistory", async (req, res) => {
	const { userID } = req.query;
	try {
		const [results] = await db.query(
			"SELECT games.name, game_history.timestamp\
            FROM games JOIN game_history ON games.id = game_history.game_id\
            WHERE game_history.user_id = ?",
			[userID],
		);
		return res.json(results);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
});

export default router;
