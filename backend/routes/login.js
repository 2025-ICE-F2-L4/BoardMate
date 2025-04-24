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

export default router;
