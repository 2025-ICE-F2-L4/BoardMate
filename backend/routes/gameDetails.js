import db from "../db.js";
import express from "express";
const router = express.Router();

router.get("/gameDetails", async (req, res) => {
	const { name } = req.query;
	console.log("Requesting details about " + name);

	try {
		const [results] = await db.query(
			"SELECT name, minimum_age, player_count_min, player_count_max, playtime, description FROM games WHERE name = ?",
			[name],
		);

		if (results.length != 1)
			return res.status(400).json({ error: "Invalid name" });

		return res.json(results[0]);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
});

export default router;
