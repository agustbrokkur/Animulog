import { type Request, type Response, Router} from "express";
import fs from "fs";
import type { Animu, CreateEntry, Entry } from "../models/animu.model.ts";
import { validateCreateEntry } from "../utils/validator.ts";
import { generateUniqueId } from "../utils/generators.ts";

const DATA_FILE = "./src/database/animu.json";

const animuRouter = Router();

function readData(): Animu {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function writeData(data: Animu): void {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// function handleError(error: any): string {
//     return error instanceof Error ? error.message : String(error); 
// }

// Global
animuRouter.get("/", (_: Request, res: Response) => {
    try {
        const data = readData();

        res.status(200)
            .json(data);
    } catch (error: any) {
        res.status(500)
            .json({ message: "Error fetching animulog", error });
    }
});

// Sections
// Get List of Sections
animuRouter.get("/sections", (_: Request, res: Response) => {
    try {
        const data = readData();
        const sections = Object.keys(data) ?? [];

        res.status(200)
            .json(sections);
    } catch (error: any) {
        res.status(500)
            .json({ message: "Error fetching sections", error });
    }
});

// Create new Section
animuRouter.post("/sections", (req: Request<any, any, { newSection: string }>, res: Response) => {
    try {
        const { newSection } = req.body;
        if (!newSection || newSection.trim().length === 0) {
            return res.status(400)
                .json(({ message: "Invalid new section name"}))
        }
        
        const data = readData();
        if (data[newSection]) {
            return res.status(400)
                .json({ message: `Section "${newSection} already exist` });
        }

        data[newSection] = [];
        writeData(data);

        res.status(201)
            .json({ message: `Section ${newSection} created`, ok: true });
    } catch (error: any) {
        res.status(500)
            .json({ message: "Error creating section", error });
    }
});

// Update Section name
animuRouter.put("/sections/:section", (req: Request<{ section: string }, any, { newSection: string }>, res: Response) => {
    try {
        const { section } = req.params;
        if (!section || section.trim().length === 0) {
            return res.status(400)
                .json(({ message: "Invalid section name"}))
        }

        const { newSection } = req.body;
        if (!newSection || newSection.trim().length === 0) {
            return res.status(400)
                .json(({ message: "Invalid new section name"}))
        }

        const data = readData();

        if (!data[section]) {
            return res.status(404)
                .json({ message: `Section "${section}" not found` });
        }

        if (data[newSection]) {
            return res.status(400)
                .json({ message: `Section "${newSection}" already exist` });
        }

        data[newSection] = data[section];
        delete data[section];
        writeData(data);

        res.status(200)
            .json({ message: `Renamed section "${section}" to "${newSection}"`, ok: true });
    } catch (error: any) {
        res.status(500)
            .json({ message: "Error renaming section", error });
    }
});

// Delete Section
animuRouter.delete("/sections/:section", (req: Request<{ section: string }>, res: Response) => {
    try {
        const { section } = req.params;
        if (!section || section.trim().length === 0) {
            return res.status(400)
                .json(({ message: "Invalid section name"}))
        }

        const data = readData();
        if (!data[section]) {
            return res.status(404)
                .json({ message: `Section "${section}" not found` });
        }
        
        delete data[section];
        writeData(data);

        res.status(200)
            .json({ message: `Section "${section}" was deleted`, ok: true });
    } catch (error: any) {
        res.status(500)
            .json({ message: "Error deleting section", error });
    }
});

// Section and Entries
// Get section list 
animuRouter.get("/:section", (req: Request<{ section: string }>, res: Response) => {
    try {
        const { section } = req.params;
        if (!section || section.trim().length === 0) {
            return res.status(400)
                .json(({ message: "Invalid section name"}))
        }

        const data = readData();
        if (!data[section]) {
            return res.status(404)
                .json({ message: `Section "${section}" not found` });
        }

        const sections = data[section];

        res.status(200)
            .json(sections);
    } catch (error: any) {
        res.status(500)
            .json({ message: "Error fetching section", error });
    }
});

// Create new entry
animuRouter.post("/:section", (req: Request<{ section: string }, any, CreateEntry>, res: Response) => {
    try {
        const { section } = req.params;
        if (!section || section.trim().length === 0) {
            return res.status(400)
                .json(({ message: "Invalid section "}))
        }

        const createdEntry = req.body;
        const validated = validateCreateEntry(createdEntry);
        if (validated) {
            return res.status(400)
                .json({ message: validated });
        }

        const data = readData();
        if (!data[section]) {
            return res.status(404)
                .json({ message: `Section "${section}" not found` });
        }

        const newId = generateUniqueId(data);
        const newAddedAt = Date.now();
        const newEntry: Entry = {
            ...createdEntry,
            id: newId,
            addedAt: newAddedAt
        }

        const newData = {
            ...data,
            [section]: [...data[section], newEntry]
        };

        writeData(newData);

        res.status(201)
            .json({ message: `Entry with id ${newEntry.id} created`, ok: true });
    } catch (error: unknown) {
        console.error(error);

        const message = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: `Error creating entry: ${message}` });
    }
});

// Get entry by Id
animuRouter.get("/:section/:id", (req: Request<{ section: string; id: string}>, res: Response) => {
    try {
        const data = readData();
        const { section, id } = req.params;
        const entry = data[section]?.find((item: Entry) => item.id == id);

        res.status(200)
            .json(entry);
    } catch (error: any) {
        res.status(500)
            .json({ message: "Error fetching entry", error });
    }

});

// Update an entry by Id
animuRouter.put("/:section/:id", (req: Request, res: Response) => {
    try {
        writeData(req.body);
        res.status(201)
            .json({ ok: true });
    } catch (error: any) {
        res.status(500)
            .json({ message: "Error creating section", error });
    }
});

// Delete an entry by Id
animuRouter.delete("/:section/:id", (req: Request, res: Response) => {
    try {
        writeData(req.body);
        res.status(201)
            .json({ ok: true });
    } catch (error: any) {
        res.status(500)
            .json({ message: "Error creating entry", error });
    }
});

export { animuRouter };