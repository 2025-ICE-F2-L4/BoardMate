import db from "../db.js";
import express from "express";
const router = express.Router();

router.get("/gameDetails", async (req, res) => {
	const { id } = req.query;
	console.log("Requesting details about " + id);

	try {
		const [results] = await db.query(
			"SELECT name, minAge, minPlayers, maxPlayers, playtime FROM games WHERE id = ?",
			[id],
		);

		if (results.length != 1)
			return res.status(400).json({ error: "Invalid id" });

		return res.json(results[0]);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
});

export default router;
