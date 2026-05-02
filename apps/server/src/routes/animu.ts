import { type Request, type Response, Router} from "express";
import fs from "fs";
import type { Animu } from "../models/animu.model.ts";

const DATA_FILE = "./src/database/animu.json";

const animuRouter = Router();

function readData(): Animu {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function writeData(data: Animu): void {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function handleError(error: any): string {
    return error instanceof Error ? error.message : String(error); 
}

animuRouter.get("/", (_: Request, res: Response) => {
    const data = readData();
    res.json(data);
});

animuRouter.post("/", (req: Request, res: Response) => {
    try {
        writeData(req.body);
        res.status(200)
            .json({ ok: true });
    } catch (error: any) {
        const message = handleError(error);
        res.status(500)
            .json({ error: message })
    }
});

export { animuRouter };