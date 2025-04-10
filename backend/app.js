import express, { json, text } from "express";
import cors from "cors";
const app = express();
const port = 3001;

app.use(json(), cors(), text());

import gameDetails from "./routes/gameDetails.js";
import search from "./routes/search.js";
import login from "./routes/login.js";
import admin from "./routes/admin.js";

app.use("/", gameDetails);
app.use("/", search);
app.use("/", login);
app.use("/", admin);

app.listen(port, () => {
	console.log(`Backend running on port: ${port}`);
});
