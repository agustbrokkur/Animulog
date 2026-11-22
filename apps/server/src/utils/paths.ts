import path from "node:path";

// Resolved from this file's location, not the current working directory, so the server
// finds its data no matter which folder it was started from
export const DATABASE_DIR = path.join(import.meta.dirname, "..", "database");
export const DATA_FILE = path.join(DATABASE_DIR, "animu.json");
export const SETTINGS_FILE = path.join(DATABASE_DIR, "settings.json");
export const BACKUP_DIR = path.join(DATABASE_DIR, "backups");
