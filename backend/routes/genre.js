import db from "../db.js";
import express from "express";
const router = express.Router();

router.get("/genres", async (req, res) => {
	try {
		const [results] = await db.query("SELECT genre FROM genres");
		return res.json(results);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
});
export default router;
