import fs from "fs";

const DATA_FILE = "./src/database/animu.json";
const BACKUP_DIR = "./src/database/backups"

export function createBackup(): string {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 12);
    const backupPath = `${BACKUP_DIR}/animu-${timestamp}.json`;

    fs.copyFileSync(DATA_FILE, backupPath);
    return backupPath;
}