// Database connection.
import dotenv from "dotenv";
import cors from "cors";
import { createConnection } from "mysql2";

dotenv.config();
const db = createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT,
});

db.connect((err) => {
	if (err) {
		console.error("Database connection failed: ", err);
		return;
	}
	console.log("Connected to MySQL database.");
});

// Express setup.
import express, { json } from "express";
const app = express();
const port = 3001;

app.use(json(), cors());

app.get("/search", (req, res) => {
	const { phrase } = req.query;
	console.log("Searching " + phrase);
	db.query(
		"SELECT * FROM games WHERE name LIKE '" + "%" + phrase + "%'",
		(err, results) => {
			if (err) {
				return res.status(500).json({ error: err.message });
			}
			return res.status(200).json(results);
		},
	);
});

app.get("/login", (req, res) => {
	const { username } = req.username;
	console.log("Logging in " + username);

	const userMap = new Map();
	userMap.set("Marian", { Age: 22 });
	userMap.set("Arnold", { Age: 52 });
	userMap.set("Jan", { Age: 12 });

	if (!userMap.has(username))
		return res.status(401).json({ error: "Invalid credentials" });

	return res.status(200).json(userMap.get(username));
});

app.listen(port, () => {
	console.log(`Backend running on port: ${port}`);
});
