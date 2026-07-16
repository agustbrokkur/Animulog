import { validate as uuidValidate } from "uuid";
import { MEDIA_TYPES, GROUP_TYPES, type CreateEntry, type CreateSection, type Entry, type Section, type UpdateEntry, type UpdateSection, type GroupType } from "../models/animu.model.ts";

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

export function validateSectionEntries(sectionEntryList: string[]): string | null {
    if (!isValidStringArray(sectionEntryList)) {
        return "Invalid section entry list";
    }
    return null;
}

export function validateUpdateSection(section: UpdateSection): string | null {
    if (!section || typeof section !== "object" || Array.isArray(section)) {
        return "Invalid section";
    }
    if (!isValidString(section.label)) {
        return "Invalid section label"
    }
    if (!GROUP_TYPES.includes(section.group)) {
        return "Invalid group type";
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
    if (!MEDIA_TYPES.includes(entry.mediaType)) {
        return "Invalid media type";
    }
    if (typeof entry.favorite !== "boolean") {
        return "Invalid favorite";
    }
    if (!isValidStringArray(entry.studios)) {
        return "Invalid array of studios";
    }
    if (!isValidStringArray(entry.genres)) {
        return "Invalid array of genres";
    }
    if (!isValidUrl(entry.coverUrl)) {
        return "Invalid coverUrl";
    }
    if (!isValidOptionalNumber(entry.currentEpisode)) {
        return "Invalid current episode";
    }
    if (!isValidOptionalNumber(entry.totalEpisodes)) {
        return "Invalid total episodes";
    }
    if (typeof entry.currentEpisode === "number" && typeof entry.totalEpisodes === "number" 
        && entry.currentEpisode > entry.totalEpisodes) {
        return "Value current episode cannot exceed total episodes";
    }
    if (entry.note !== null && !isValidString(entry.note)) {
        return "Invalid note";
    }
    if (!isValidOptionalNumber(entry.releasedAt)) {
        return "Invalid releasedAt";
    }
    if (!isValidOptionalNumber(entry.startedAt)) {
        return "Invalid startedAt";
    }
    if (!isValidOptionalNumber(entry.droppedAt)) {
        return "Invalid droppedAt";
    }
    if (!isValidOptionalNumber(entry.rating)) {
        return "Invalid rating";
    }
    if (typeof entry.rating === "number" && entry.rating >= 0 && entry.rating <= 10) {
        return "Value rating must must be a value from 0 to 10";
    }
    return null;
}


export function validateUpdateEntry(entry: UpdateEntry): string | null {
    const validationMessage = validateCreateEntry(entry);

    if (validationMessage !== null) {
        return validationMessage;
    }
    if (!isValidNumber(entry.addedAt)) {
        return "Invalid addedAt";
    }

    return null;
}

export function validateEntry(entry: Entry): string | null {
    const validationMessage = validateUpdateEntry(entry);

    if (validationMessage !== null) {
        return validationMessage;
    }
    if (!uuidValidate(entry.id)) {
        return "Invalid id";
    }

    return null;
}