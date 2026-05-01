import express from "express";
import fs from "fs";
import { routes } from "./routes/index.js"

const PORT = 3001;

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use("/app", routes);

app.get("/", (req, res) => {
    res.send("Animulog Server");
});

app.listen(PORT, () => console.log(`Animulog Server running on http://localhost:${PORT}`));