import { type Request, type Response, Router } from "express";
import type { Animu } from "../models/animu.model.ts";
import type { CreateEntry, Entry, UpdateEntry } from "../models/entry.model.ts";
import { isValidUUID, validateCreateEntry, validateUpdateEntry, } from "../utils/validators.ts";
import { generateUniqueId } from "../utils/generators.ts";
import { handleError } from "../utils/errorUtils.ts";
import { readAnimuData, writeAnimuData } from "../utils/fileUtils.ts";

const entryRouter = Router();

// GET /api/animu/entries          
// List all entries
entryRouter.get("/", (_: Request, res: Response) => {
    try {
        const data = readAnimuData();
        const entries = data.entries;

        res.status(200).json(entries);
    } catch (error: unknown) {
        handleError(res, error, "Error fetching entries");
    }
});

// POST /api/animu/entries          
// Create entry
entryRouter.post("/", (req: Request<any, any, CreateEntry>, res: Response) => {
    try {
        const createdEntry = req.body;
        const validated = validateCreateEntry(createdEntry);
        if (validated) {
            return res.status(400).json({ 
                message: validated 
            });
        }

        const data = readAnimuData();
        const setOfIds = Object.values(data).flatMap(entries => entries.map(x => x.id));
        const newId = generateUniqueId(setOfIds);
        const newAddedAt = Date.now();
        const newEntry: Entry = {
            ...createdEntry,
            id: newId,
            addedAt: newAddedAt,
        };

        const newData: Animu = {
            sections: data.sections,
            entries: [...data.entries, newEntry]
        };

        writeAnimuData(newData);

        res.status(201).json({
            message: `Entry with id ${newEntry.id} created`,
            ok: true,
        });
    } catch (error: unknown) {
        handleError(res, error, "Error creating entry");
    }
});

// GET /api/animu/entries/:id      
// get single entry
entryRouter.get("/:id", (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).json({ 
                message: "Invalid entry id" 
            });
        }
        
        const data = readAnimuData();
        const entry = data.entries.find(entry => entry.id === id);

        if (!entry) {
            return res.status(404).json({ 
                message: `Entry id "${id}" not found` 
            });
        }

        res.status(200).json(entry);
    } catch (error: unknown) {
        handleError(res, error, "Error fetching entry");
    }
});

// PUT /api/animu/entries/:id      
// Update entry
entryRouter.put("/:id", (req: Request<{ id: string }, any, UpdateEntry>, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).json({ 
                message: "Invalid entry id" 
            });
        }
        
        const updatedEntry = req.body;
        const validated = validateUpdateEntry(updatedEntry);
        if (validated) {
            return res.status(400).json({ 
                message: validated 
            });
        }

        const data = readAnimuData();
        const existingEntry = data.entries.find(e => e.id === id);

        if (!existingEntry) {
            return res.status(404).json({ 
                message: `Entry id "${id}" not found` 
            });
        }

        data.entries = data.entries.map(entry => entry.id == id ? { id: id, ...updatedEntry } : entry);

        writeAnimuData(data);
        res.status(201).json({ ok: true });
    } catch (error: unknown) {
        handleError(res, error, "Error creating entry");
    }
});

// DELETE /api/animu/entries/:id      
// Delete entry
entryRouter.delete("/:id", (req: Request<{ id: string}>, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).json({ 
                message: "Invalid entry id" 
            });
        }

        const data = readAnimuData();
        const existingEntry = data.entries.find(e => e.id === id);

        if (!existingEntry) {
            return res.status(404).json({ 
                message: `Entry id "${id}" not found` 
            });
        }

        data.entries = data.entries.filter(e => e.id !== id);
        writeAnimuData(data);

        res.status(201).json({ ok: true });
    } catch (error: unknown) {
        handleError(res, error, "Error deleting entry");
    }
});

export { entryRouter }