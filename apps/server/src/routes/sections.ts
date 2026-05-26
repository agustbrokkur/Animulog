import { type Request, type Response, Router } from "express";
import type { CreateSection, UpdateSection, Section, SectionEntries } from "../models/animu.model.ts";
import { isValidUUID, validateCreateSection, validateSectionEntries, validateUpdateSection } from "../utils/validators.ts";
import { generateUniqueId } from "../utils/generators.ts";
import { handleError } from "../utils/errorUtils.ts";
import { readAnimuData, writeAnimuData } from "../utils/fileUtils.ts";

const sectionRouter = Router();

// GET /api/animu/sections
// list all sections
sectionRouter.get("/", (_: Request, res: Response) => {
    try {
        const data = readAnimuData();
        const sections = data.sections;

        res.status(200).json(sections);
    } catch (error: unknown) {
        handleError(res, error, "Error fetching sections");
    }
});

// POST /api/animu/sections
// create section
sectionRouter.post("/", (req: Request<any, any, CreateSection>, res: Response) => {
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

// Get /api/animu/sections/:id
// Get section
sectionRouter.get("/:id", (req: Request<{ id: string }>, res: Response) => {
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

// PUT /api/animu/sections/:id
// Update section label
sectionRouter.put("/sections/:id", (req: Request<{ id: string }, any, UpdateSection>, res: Response) => {
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
        const existingSection = data.sections.find(s => s.id === id);

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

// DELETE /api/animu/sections/:id
// Delete section
sectionRouter.delete("/sections/:id", (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).json({ 
                message: "Invalid section id" 
            });
        }

        const data = readAnimuData();
        const existingSection = data.sections.find(s => s.id === id)

        if (!existingSection) {
            return res.status(404).json({ 
                message: `Section id "${id}" not found` 
            });
        }

        data.sections = data.sections.filter(s => s.id !== id);
        writeAnimuData(data);

        res.status(200).json({
            message: `Section "${existingSection.label}" (${existingSection.id}) was deleted`,
            ok: true,
        });
    } catch (error: unknown) {
        handleError(res, error, "Error deleting section");
    }
});

// PUT /api/animu/sections/:id/entries
// add entry to section
sectionRouter.put("/sections/:id/entries", (req: Request<{ id: string }, any, SectionEntries>, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).json({ 
                message: "Invalid section id" 
            });
        }

        const sectionEntries = req.body;
        const validated = validateSectionEntries(sectionEntries.entryIds);
        if (validated) {
            return res.status(400).json({ 
                message: validated 
            });
        }

        const data = readAnimuData();
        const existingSection = data.sections.find(s => s.id === id);

        if (!existingSection) {
            return res.status(404).json({ 
                message: `Section id "${id}" not found` 
            });
        }

        existingSection.entryIds = [... new Set([...sectionEntries.entryIds])];
        writeAnimuData(data);

        res.status(200).json(existingSection.entryIds);
    } catch (error: unknown) {
        handleError(res, error, "Error fetching section");
    }
});

export { sectionRouter };