import db from "../db.js";
import express from "express";
const router = express.Router();

router.get("/login", async (req, res) => {
	const { user, password } = req.query;

	try {
		const [results] = await db.query(
			"SELECT id FROM users WHERE login = ? AND password = ?",
			[user, password],
		);
		if (results.length != 1)
			return res.status(400).json({ error: "Invalid credentials" });

		return res.json(results[0]);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
});

router.post("/profilePicture", async (req, res) => {
	const { userID, pictureID } = req.body;
	try {
		const [results] = await db.query(
			" UPDATE users SET profile_picture_id = ? WHERE id = ?",
			[pictureID, userID],
		);
		return res.json(results);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
});

router.get("/profilePicture", async (req, res) => {
	const { userID } = req.query;
	try {
		const [results] = await db.query(
			"SELECT profile_picture_id FROM users WHERE id=?",
			[userID],
		);
		const { profile_picture_id } = results[0];
		return res.redirect("image/" + profile_picture_id.toString());
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});

router.get("/recommendations", async (req, res) => {
	const { count } = req.query;
	try {
		const [results] = await db.query(
			"SELECT game_id\
            FROM (\
                SELECT game_id, COUNT(game_id) AS count\
                FROM game_history\
                GROUP BY game_id\
            ) AS sub\
            ORDER BY count ASC\
            LIMIT ?",
			[parseInt(count, 10)],
		);
		return res.json(results);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});

export default router;
