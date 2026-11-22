import { request } from "./api";
import type { Backup, ImportRow, Settings } from "../types/settings";

export const getSettings = () => request<Settings>("/settings", "Couldn't get settings");

export const updateSettings = (settings: Settings) => request<Settings>("/settings", "Couldn't update settings", { method: "PUT", body: settings });

export const getBackups = () => request<Backup[]>("/animu/backups", "Couldn't get backups");

export const createBackup = () => request(`/animu/backups`, "Couldn't create a backup", { method: "POST" });

export const restoreBackup = (filename: string) => request(`/animu/backups/${filename}/restore`, "Couldn't restore backup", { method: "POST" });

export const exportLog = () => request<string>(`/animu/export`, "Couldn't export the library", { responseType: "text" });

export const previewImport = (text: string) => request<ImportRow[]>("/animu/import/preview", "Couldn't preview import", { method: "POST", body: { text } });

export const commitImport = (rows: ImportRow[]) => request("/animu/import/commit", "Couldn't commit import", { method: "POST", body: rows });
