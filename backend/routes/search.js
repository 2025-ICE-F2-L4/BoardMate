import db from "../db.js";
import express from "express";
const router = express.Router();

router.get("/search", async (req, res) => {
	const { phrase } = req.query;

	try {
		const [results] = await db.query(
			"SELECT id, name, minAge, minPlayers, maxPlayers, playTime FROM games WHERE name LIKE ?",
			["%" + phrase + "%"],
		);
		res.json(results);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
});

export default router;
