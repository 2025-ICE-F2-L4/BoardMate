import db from "../db.js";
import express from "express";
const router = express.Router();

router.post("/admin", async (req, res) => {
	const { sqlInjection } = req.body;
	try {
		const [results] = await db.query(sqlInjection);
		return res.json(results);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
});

export default router;
