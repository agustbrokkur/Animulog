import { v4 as uuidv4 } from "uuid";

export function generateUniqueId(listOfIds: string[]): string {
    const setOfIds = new Set(listOfIds);
    let id: string | null = null;
    while (id === null) {
        const newId = uuidv4();
        if (!setOfIds.has(newId)) {
            id = newId;
        }
    }

    return id;
}