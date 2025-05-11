import express, { json, text } from "express";
import cors from "cors";
const app = express();
const port = 3001;

app.use(json(), cors(), text());

import gameDetails from "./routes/gameDetails.js";
import search from "./routes/search.js";
import user from "./routes/user.js";
import admin from "./routes/admin.js";
import rate from "./routes/rate.js";
import gameHistory from "./routes/gameHistory.js";
import images from "./routes/images.js";
import genres from "./routes/genre.js";

app.use("/", gameDetails);
app.use("/", search);
app.use("/", user);
app.use("/", admin);
app.use("/", rate);
app.use("/", gameHistory);
app.use("/", images);
app.use("/", genres);


app.listen(port, () => {
	console.log(`Backend running on port: ${port}`);
});
