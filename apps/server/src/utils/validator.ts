
import { validate as uuidValidate } from "uuid";
import type { CreateEntry, CreateSection, UpdateSection, Entry, Section } from "../models/animu.model";

export function isValidUUID(value: string): boolean {
    return uuidValidate(value);
}

export function isValidString(value: string): boolean {
    return value !== null && value !== undefined && value.trim().length > 0;
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

export function isValidStringArray(value: string[]): boolean {
    return Array.isArray(value) && value.every(item => typeof item === "string");
}

export function validateUpdateSection(section: UpdateSection): string | null {
    if (!section || typeof section !== "object" || Array.isArray(section)) {
        return "Invalid section";
    }
    if (!isValidString(section.label)) {
        return "Invalid section label"
    }
    return null;
}

export function validateCreateSection(section: CreateSection): string | null {
    const validationMessage = validateUpdateSection(section);

    if (validationMessage !== null) {
        return validationMessage;
    }
    if (typeof section.system !== 'boolean') {
        return "Invalid section label"
    }
    return null;
}

export function validateSection(section: Section): string | null {
    const validationMessage = validateCreateSection(section);

    if (validationMessage !== null) {
        return validationMessage;
    }
    if (!isValidStringArray(section.entryIds)) {
        return "Invalid array of Entry Ids";
    }
    return null;
}

export function validateCreateEntry(entry: CreateEntry): string | null {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
        return "Invalid entry";
    }
    if (!isValidString(entry.title)) {
        return "Invalid title";
    }
    if (typeof entry.favorite !== "boolean") {
        return "Invalid favorite";
    }
    if (!isValidUrl(entry.coverUrl)) {
        return "Invalid coverUrl";
    }
    if (!isValidOptionalNumber(entry.current)) {
        return "Invalid current";
    }
    if (!isValidOptionalNumber(entry.total)) {
        return "Invalid total";
    }
    if (typeof entry.current === "number" && typeof entry.total === "number" && entry.current > entry.total) {
        return "Value current cannot exceed total";
    }
    if (entry.note !== null && !isValidString(entry.note)) {
        return "Invalid note";
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