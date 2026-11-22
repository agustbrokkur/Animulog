import fs from "fs";
import path from "node:path";
import { readSettings, writeFileAtomic } from "./fileUtils.ts";
import { BACKUP_DIR, DATA_FILE } from "./paths.ts";

// animu-YYYYMMDDHHMMSSmmm.json - the creation time in UTC, down to the millisecond
const BACKUP_FILENAME_PATTERN = /^animu-\d{17}\.json$/;

export type BackupInfo = { filename: string; createdAt: number; sizeBytes: number };

export function createBackup(): string {
	if (!fs.existsSync(DATA_FILE)) {
		throw new Error("There is no library data to backup yet");
	}
	fs.mkdirSync(BACKUP_DIR, { recursive: true });

	// All digits of the ISO time: 17 digits down to the millisecond, e.g. 20261122140307123
	const timestampDigits = new Date().toISOString().replace(/\D/g, "");
	const backupFileName = `animu-${timestampDigits}.json`;
	const backupPath = path.join(BACKUP_DIR, backupFileName);

	// COPYFILE_EXCL: throw instead of overwriting if a backup with this name already exists.
	fs.copyFileSync(DATA_FILE, backupPath, fs.constants.COPYFILE_EXCL);

	// On Windows, copying keeps the source file's modified time, so set it to now.
	// listBackups uses this time as the backup's creation date.
	const now = new Date();
	fs.utimesSync(backupPath, now, now);

	return backupFileName;
}

export function listBackups(): BackupInfo[] {
	if (!fs.existsSync(BACKUP_DIR)) {
		return [];
	}

	return fs
		.readdirSync(BACKUP_DIR)
		.filter((filename) => BACKUP_FILENAME_PATTERN.test(filename))
		.map((filename) => {
			const fileStats = fs.statSync(path.join(BACKUP_DIR, filename));
			return { filename, createdAt: fileStats.mtimeMs, sizeBytes: fileStats.size };
		})
		.sort((a, b) => b.createdAt - a.createdAt); // newest first
}

// Restoring is destructive to the current animu.json, so a safety backup of the current
// state is always taken first — restoring never has a one-way-door outcome.
export function restoreBackup(filename: string): void {
	if (!BACKUP_FILENAME_PATTERN.test(filename)) {
		throw new Error(`Invalid backup filename "${filename}"`);
	}

	const backupPath = path.join(BACKUP_DIR, filename);
	if (!fs.existsSync(backupPath)) {
		throw new Error(`Backup "${filename}" not found`);
	}

	createBackup();
	const backupContents = fs.readFileSync(backupPath, "utf-8");
	writeFileAtomic(DATA_FILE, backupContents);
}

export function checkAutoBackup(): void {
	try {
		if (!fs.existsSync(DATA_FILE)) return; // Nothing to backup yet

		const { autoBackup } = readSettings();
		if (!autoBackup.enabled) return;

		const backups = listBackups();
		const newestBackup = backups[0];
		const dueAt = (newestBackup?.createdAt ?? 0) + autoBackup.intervalHours * 60 * 60 * 1000;

		if (Date.now() >= dueAt) {
			createBackup();
		}
	} catch (autoBackupError) {
		console.error("Auto-backup check failed:", autoBackupError);
	}
}
