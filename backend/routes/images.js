import db from "../db.js";

import { Router } from "express";
import multer, { memoryStorage } from "multer";
const router = Router();

const upload = multer({ storage: memoryStorage() });

router.post("/image", upload.single("image"), async (req, res) => {
	if (!req.file) res.status(400).send("No file uploaded.");

	const { originalname, encoding, mimetype, size, buffer } = req.file;
	try {
		const result = await db.query(
			`
            INSERT INTO images (name, encoding, mimetype, size, data)
            VALUES (?, ?, ?, ?, ?)
            `,
			[originalname, encoding, mimetype, size, buffer],
		);

		return res.json(result);
	} catch (error) {
		return res.status(500).json(error);
	}
});

router.get("/image/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const [rows] = await db.query(
			`
            SELECT name,encoding, mimetype,size, data FROM images WHERE images.id = ?
            `,
			[id],
		);

		const file = rows[0];
		console.log(file);

		res.setHeader("Content-Type", file.mimetype);
		res.setHeader("Content-Disposition", 'inline; filename="${file.name}"');
		return res.send(file.data);
	} catch (error) {
		return res.status(500).json(error);
	}
});
export default router;
