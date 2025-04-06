import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
	const { gameName } = req.query;
	console.log("Requesting details about " + gameName);

	const gameMap = new Map();
	gameMap.set("Game1", {
		minimumAge: 12,
		minPlayers: 4,
		maxPlayers: 7,
		estimatedPlayTime: 30,
		description: "Game about gaming",
	});
	gameMap.set("Game2", {
		minimumAge: 42,
		minPlayers: 2,
		maxPlayers: 3,
		estimatedPlayTime: 20,
		description: "Game about gaming",
	});
	gameMap.set("Game3", {
		minimumAge: 32,
		minPlayers: 1,
		maxPlayers: 5,
		estimatedPlayTime: 60,
		description: "Game about gaming",
	});

	if (!gameMap.has(gameName))
		return res.status(400).json({ error: "Invalid game name" });

	return res.json(gameMap.get(gameName));
});

export default router;
