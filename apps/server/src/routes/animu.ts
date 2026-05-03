import { type Request, type Response, Router } from "express";
import type { CreateEntry, Entry } from "../models/animu.model.ts";
import { isValidSection, validateCreateEntry } from "../utils/validator.ts";
import { generateUniqueId } from "../utils/generators.ts";
import { handleError } from "../utils/errorUtils.ts";
import { readAnimuData, writeAnimuData } from "../utils/fileUtils.ts";

const animuRouter = Router();

// Global
animuRouter.get("/", (_: Request, res: Response) => {
    try {
        const data = readAnimuData();

        res.status(200).json(data);
    } catch (error: unknown) {
        handleError(res, error, "Error fetching animulog");
    }
});

// Sections
// Get List of Sections
animuRouter.get("/sections", (_: Request, res: Response) => {
    try {
        const data = readAnimuData();
        const sections = Object.keys(data) ?? [];

        res.status(200).json(sections);
    } catch (error: unknown) {
        handleError(res, error, "Error fetching sections");
    }
});

// Create new Section
animuRouter.post("/sections", (req: Request<any, any, { newSection: string }>, res: Response) => {
    try {
        const { newSection } = req.body;
        if (!isValidSection(newSection)) {
            return res.status(400).json({ 
                message: "Invalid new section name" 

            });
        }

        const data = readAnimuData();
        if (data[newSection]) {
            return res.status(400).json({ 
                message: `Section "${newSection} already exist` 
            });
        }

        data[newSection] = [];
        writeAnimuData(data);

        res.status(201).json({
            message: `Section ${newSection} created`,
            ok: true,
        });
    } catch (error: unknown) {
        handleError(res, error, "Error creating section");
    }
});

// Update Section name
animuRouter.put("/sections/:section", (req: Request<{ section: string }, any, { newSection: string }>, res: Response) => {
    try {
        const { section } = req.params;
        if (!isValidSection(section)) {
            return res.status(400).json({ 
                message: "Invalid section name" 
            });
        }

        const { newSection } = req.body;
        if (!isValidSection(newSection)) {
            return res.status(400).json({ 
                message: "Invalid new section name" 
            });
        }

        const data = readAnimuData();

        if (!data[section]) {
            return res.status(404).json({ 
                message: `Section "${section}" not found` 
            });
        }

        if (data[newSection]) {
            return res.status(400).json({ 
                message: `Section "${newSection}" already exist` 
            });
        }

        data[newSection] = data[section];
        delete data[section];
        writeAnimuData(data);

        res.status(200).json({
            message: `Renamed section "${section}" to "${newSection}"`,
            ok: true,
        });
    } catch (error: unknown) {
        handleError(res, error, "Error renaming section");
    }
});

// Delete Section
animuRouter.delete("/sections/:section", (req: Request<{ section: string }>, res: Response) => {
    try {
        const { section } = req.params;
        if (!isValidSection(section)) {
            return res.status(400).json({ 
                message: "Invalid section name" 
            });
        }

        const data = readAnimuData();
        if (!data[section]) {
            return res.status(404).json({ 
                message: `Section "${section}" not found` 
            });
        }

        delete data[section];
        writeAnimuData(data);

        res.status(200).json({
            message: `Section "${section}" was deleted`,
            ok: true,
        });
    } catch (error: unknown) {
        handleError(res, error, "Error deleting section");
    }
});

// Section and Entries
// Get section list
animuRouter.get("/:section", (req: Request<{ section: string }>, res: Response) => {
    try {
        const { section } = req.params;
        if (!isValidSection(section)) {
            return res.status(400).json({ 
                message: "Invalid section name" 
            });
        }

        const data = readAnimuData();
        if (!data[section]) {
            return res.status(404).json({ 
                message: `Section "${section}" not found` 
            });
        }

        const sections = data[section];

        res.status(200).json(sections);
    } catch (error: unknown) {
        handleError(res, error, "Error fetching section");
    }
});

// Create new entry
animuRouter.post("/:section", (req: Request<{ section: string }, any, CreateEntry>, res: Response) => {
    try {
        const { section } = req.params;
        if (!isValidSection(section)) {
            return res.status(400).json({ 
                message: "Invalid section " 
            });
        }

        const createdEntry = req.body;
        const validated = validateCreateEntry(createdEntry);
        if (validated) {
            return res.status(400).json({ 
                message: validated 
            });
        }

        const data = readAnimuData();
        if (!data[section]) {
            return res.status(404).json({ 
                message: `Section "${section}" not found` 
            });
        }

        const newId = generateUniqueId(data);
        const newAddedAt = Date.now();
        const newEntry: Entry = {
            ...createdEntry,
            id: newId,
            addedAt: newAddedAt,
        };

        const newData = {
            ...data,
            [section]: [...data[section], newEntry],
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

// Get entry by Id
animuRouter.get("/:section/:id", (req: Request<{ section: string; id: string }>, res: Response) => {
    try {
        const data = readAnimuData();
        const { section, id } = req.params;
        const entry = data[section]?.find((item: Entry) => item.id == id);

        res.status(200).json(entry);
    } catch (error: unknown) {
        handleError(res, error, "Error fetching entry");
    }
});

// Update an entry by Id
animuRouter.put("/:section/:id", (req: Request, res: Response) => {
    try {
        writeAnimuData(req.body);
        res.status(201).json({ ok: true });
    } catch (error: unknown) {
        handleError(res, error, "Error creating entry");
    }
});

// Delete an entry by Id
animuRouter.delete("/:section/:id", (req: Request, res: Response) => {
    try {
        writeAnimuData(req.body);
        res.status(201).json({ ok: true });
    } catch (error: unknown) {
        handleError(res, error, "Error deleting entry");
    }
});

export { animuRouter };
