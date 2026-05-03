import { v4 as uuidv4 } from "uuid";
import type { Animu } from "../models/animu.model";

export function generateUniqueId(data: Animu): string {
    const setOfIds = new Set(Object.values(data).flatMap(entries => entries.map(x => x.id)));
    let id: string | null = null;
    while (id === null) {
        const newId = uuidv4();
        if (!setOfIds.has(newId)) {
            id = newId;
        }
    }

    return id;
}