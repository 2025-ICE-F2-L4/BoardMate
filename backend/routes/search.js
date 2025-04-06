import db from "../db.js";
import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
	const { phrase } = req.query;
	console.log("Searching " + phrase);

	try {
		const [results] = await db.query(
			"SELECT * FROM games WHERE name LIKE '" + "%" + phrase + "%'",
		);
		res.json(results);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
});

export default router;
