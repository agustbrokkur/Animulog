import express from "express";
import fs from "fs";

const DATA_FILE = "./database/animu.json";

const animuRouter = express.Router();

function readData() {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

animuRouter.get("/", (req, res) => {
    const data = readData();
    res.json(data);
});

animuRouter.post("/", (req, res) => {
    try {
        writeData(req.body);
        res.status(200)
            .json({ ok: true });
    } catch (error) {
        res.status(500)
            .json({ error: error.message })
    }
});

export { animuRouter };