import { type Request, type Response, Router } from "express";
import { handleError } from "../utils/errorUtils.ts";
import { readAnimuData } from "../utils/fileUtils.ts";
import { sectionRouter } from "./sections.ts";
import { entryRouter } from "./entries.ts";
import { createBackup } from "../utils/backup.ts";

const animuRouter = Router();

animuRouter.use("/sections", sectionRouter);
animuRouter.use("/entries", entryRouter);

// Global
animuRouter.get("/", (_: Request, res: Response) => {
    try {
        const data = readAnimuData();

        res.status(200).json(data);
    } catch (error: unknown) {
        handleError(res, error, "Error fetching animulog");
    }
});

animuRouter.get("/backup", (_: Request, res: Response) => {
    try {
        const backupPath = createBackup();

        res.status(200).json({ backupPath });
    } catch (error: unknown) {
        handleError(res, error, "Error backing up animulog data");
    }
});

export { animuRouter };
