import db from "../db.js";
import express from "express";
const router = express.Router();

router.post("/register", async (req, res) => {
	const { user, password, age } = req.body;
	try {
		const [validateResults] = await db.query(
			"SELECT id FROM users WHERE login = ?",
			[user],
		);
		if (validateResults.length != 0)
			return res.status(400).json({ error: "Username already used" });

		const [results] = await db.query(
			"INSERT INTO users (login, password, age) VALUES(?, ?, ?)",
			[user, password, age],
		);
		return res.json(results);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
});

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
	let { count } = req.query;
	if (count > 25) count = 25;

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

router.get("/userRatings", async (req, res) => {
	const { userID } = req.query;
	try {
		const [results] = await db.query(
			"SELECT game_id, timestamp, comment, rating\
            FROM ratings\
            WHERE user_id = ?",
			[userID],
		);
		return res.json(results);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});
router.delete("/userRating", async (req, res) => {
	const { userID, gameID } = req.query;
	try {
		const [results] = await db.query(
			"DELETE FROM ratings WHERE ratings.user_id = ? AND ratings.game_id = ?",
			[userID, gameID],
		);

		return res.json(results);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});

router.patch("/userRating", async (req, res) => {
	const { userID, gameID, newComment, newRating } = req.body;
	try {
		let clampedRating = newRating;
		if (clampedRating > 5) clampedRating = 5;
		else if (clampedRating < 0) clampedRating = 0;
		const [results] = await db.query(
			"UPDATE ratings\
            SET ratings.comment = ?, ratings.rating = ?, ratings.timestamp = CURRENT_TIMESTAMP()\
            WHERE ratings.user_id = ? AND ratings.game_id = ?",
			[newComment, clampedRating, userID, gameID],
		);

		return res.json(results);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});

router.get("/userWishlist", async (req, res) => {
	const { userID } = req.query;
	try {
		const [results] = await db.query(
			"SELECT game_id, timestamp FROM game_wishlists WHERE user_id = ?",
			[userID],
		);

		return res.json(results);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});

router.post("/userWishlist", async (req, res) => {
	const { userID, gameID } = req.body;
	try {
		const [results] = await db.query(
			"INSERT INTO game_wishlists (user_id, game_id) VALUES(?, ?)",
			[userID, gameID],
		);
		return res.json(results);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
});

router.delete("/userWishlist", async (req, res) => {
	const { userID, gameID } = req.query;
	try {
		const [results] = await db.query(
			"DELETE FROM game_wishlists WHERE game_wishlists.user_id = ? AND game_wishlists.game_id = ?",
			[userID, gameID],
		);
		return res.json(results);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
});
export default router;
