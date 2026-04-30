import express from "express";
const app = express();
const PORT = 3001;

app.listen(PORT, () => console.log(`Animulog Server running on http://localhost:${PORT}`));

app.get("/", (req, res) => {
    res.send("Animulog Server");
});
