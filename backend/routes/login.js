import express from "express";
const router = express.Router();

router.get("/login", (req, res) => {
	const { username } = req.query;
	console.log("Logging in " + username);

	const userMap = new Map();
	userMap.set("Marian", { Age: 22 });
	userMap.set("Arnold", { Age: 52 });
	userMap.set("Jan", { Age: 12 });

	if (!userMap.has(username))
		return res.status(400).json({ error: "Invalid credentials" });

	return res.json(userMap.get(username));
});

export default router;
