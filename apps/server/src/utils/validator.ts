
import { validate as uuidValidate } from "uuid";
import type { CreateEntry, Entry } from "../models/animu.model";

export function isValidSection(section: string): boolean {
    return !section || section.trim().length === 0;
}

export function isValidUrl(url: string | null): boolean {
    if (url !== null) {
        try {
            new URL(url);
        } catch {
            return false;
        }
    }
    return true;
}

export function isValidNumber(value: number): boolean {
    return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export function isValidOptionalNumber(value: number | null): boolean {
    if (value === null) {
        return true;
    }

    return Number.isFinite(value) && value >= 0;
}

export function validateCreateEntry(entry: CreateEntry): string | null {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
        return "Invalid entry";
    }
    if (!entry.title || typeof entry.title !== "string") {
        return "Invalid title";
    }
    if (typeof entry.favorite !== "boolean") {
        return "Invalid favorite";
    }
    if (!isValidUrl(entry.coverUrl)) {
        return "Invalid coverUrl";
    }
    if (!isValidOptionalNumber(entry.episodeCurrent)) {
        return "Invalid episodeCurrent";
    }
    if (!isValidOptionalNumber(entry.episodeTotal)) {
        return "Invalid episodeTotal";
    }
    if (typeof entry.episodeCurrent === "number" && typeof entry.episodeTotal === "number" && entry.episodeCurrent > entry.episodeTotal) {
        return "Value episodeCurrent cannot exceed episodeTotal";
    }
    if (entry.note !== null 
        && typeof entry.note !== "string") {
        return "Invalid note";
    }
    if (!isValidNumber(entry.order)) {
        return "Invalid order";
    }
    return null;
}

export function validateEntry(entry: Entry): string | null {
    const validationMessage = validateCreateEntry(entry);

    if (validationMessage !== null) {
        return validationMessage;
    }
    if (!uuidValidate(entry.id)) {
        return "Invalid id";
    }
    if (!isValidNumber(entry.addedAt)) {
        return "Invalid addedAt";
    }

    return null;
}