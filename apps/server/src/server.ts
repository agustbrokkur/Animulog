import express, { type Request, type Response} from "express";
import { routes } from "./routes/index.ts"

const PORT = 3001;

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use("/api", routes);

app.get("/", (_: Request, res: Response) => {
    res.send("Animulog Server");
});

app.listen(PORT, () => console.log(`Animulog Server running on http://localhost:${PORT}`));