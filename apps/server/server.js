import express from "express";
import fs from "fs";

const PORT = 3001;
const DATA_FILE = "./data/data.json";

const app = express();
app.use(express.json({ limit: '10mb' }));

function readData() {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

app.get("/", (req, res) => {
    res.send("Animulog Server");
});

app.get("/api/data", (req, res) => {
    const data = readData();
    res.json(data);
});

app.listen(PORT, () => console.log(`Animulog Server running on http://localhost:${PORT}`));