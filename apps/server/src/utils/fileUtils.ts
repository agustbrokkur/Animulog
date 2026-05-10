import fs from "fs";
import type { Animu } from "../models/animu.model";

const DATA_FILE = "./src/database/animu.json";


export function readAnimuData(): Animu {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

export function writeAnimuData(data: Animu): void {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}