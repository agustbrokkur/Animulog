import { type Request, type Response, Router } from "express";
import type { CreateEntry, CreateSection, UpdateSection, Entry, Section } from "../models/animu.model.ts";
import { isValidUUID, validateCreateEntry, validateCreateSection, validateUpdateSection } from "../utils/validator.ts";
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
        const sections = data.sections;

        res.status(200).json(sections);
    } catch (error: unknown) {
        handleError(res, error, "Error fetching sections");
    }
});

// Create new Section
animuRouter.post("/sections", (req: Request<any, any, CreateSection>, res: Response) => {
    try {
        const createdSection = req.body;
        const validated = validateCreateSection(createdSection);
        if (validated) {
            return res.status(400).json({ 
                message: validated 
            });
        }

        const data = readAnimuData();
        if (data.sections.some(section => section.label === createdSection.label)) {
            return res.status(400).json({ 
                message: `Section "${createdSection.label} already exist` 
            });
        }

        const sectionIds = data.sections.map(section => section.id);
        const newSection: Section = {
            id: generateUniqueId(sectionIds),
            label: createdSection.label,
            system: createdSection.system,
            entryIds: []
        }

        data.sections.push(newSection);
        writeAnimuData(data);

        res.status(201).json({
            message: `Section ${newSection} created`,
            ok: true,
        });
    } catch (error: unknown) {
        handleError(res, error, "Error creating section");
    }
});

// Get Section via Id
animuRouter.get("/sections:id", (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).json({ 
                message: "Invalid section id" 
            });
        }
        const data = readAnimuData();
        const section = data.sections.find(s => s.id === id); //Object.keys(data) ?? [];

        if (!section) {
            return res.status(404).json({ 
                message: `Section id "${id}" not found` 
            });
        }

        res.status(200).json(section);
    } catch (error: unknown) {
        handleError(res, error, "Error fetching sections");
    }
});

// Update Section name
animuRouter.put("/sections/:id", (req: Request<{ id: string }, any, UpdateSection>, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).json({ 
                message: "Invalid section id" 
            });
        }

        const updatedSection = req.body;
        const validated = validateUpdateSection(updatedSection);
        if (validated) {
            return res.status(400).json({ 
                message: validated 
            });
        }

        const data = readAnimuData();
        const existingSection = data.sections.find(s => s.id === id)

        if (!existingSection) {
            return res.status(404).json({ 
                message: `Section id "${id}" not found` 
            });
        }

        if (data.sections.some(s => s.label === updatedSection.label)) {
            return res.status(400).json({ 
                message: `Section "${updatedSection.label}" already exist` 
            });
        }

        const oldSectionName = existingSection.label;
        const newSectionName = updatedSection.label
        
        existingSection.label = newSectionName;
        writeAnimuData(data);

        res.status(200).json({
            message: `Renamed section "${oldSectionName}" to "${newSectionName}"`,
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
        if (!data.sections.some(s => s.label === section)) {
            return res.status(404).json({ 
                message: `Section "${section}" not found` 
            });
        }

        data.sections = data.sections.filter(s => s.label !== section);
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

        const setOfIds = Object.values(data).flatMap(entries => entries.map(x => x.id));
        const newId = generateUniqueId(setOfIds);
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
