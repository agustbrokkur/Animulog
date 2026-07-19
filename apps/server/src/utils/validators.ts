import { validate as uuidValidate } from "uuid";
import { MEDIA_TYPES, GROUP_TYPES } from "../models/animu.model.ts";
import type { CreateEntry, UpdateEntry, Entry, EntrySource } from "../models/entry.model.ts";
import type { UpdateSection, CreateSection, Section } from "../models/section.model.ts";

export function isValidUUID(value: string): boolean {
    return uuidValidate(value);
}

export function isValidUUIDArray(value: string[]): boolean {
    return Array.isArray(value) && value.every(item => typeof item === "string" && isValidUUID(item));
}

export function isValidString(value: string): boolean {
    return value !== null && value !== undefined && value.trim().length > 0;
}

export function isValidStringArray(value: string[]): boolean {
    return Array.isArray(value) && value.every(item => typeof item === "string");
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

export function validateSectionEntries(sectionEntryList: string[]): string | null {
    if (!isValidUUIDArray(sectionEntryList)) {
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
    if (!isValidUUIDArray(section.entryIds)) {
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
    if (entry.note !== null && !isValidString(entry.note)) {
        return "Invalid note";
    }
    
    if (!isValidOptionalNumber(entry.rating)) {
        return "Invalid rating";
    }
    if (typeof entry.rating === "number" && entry.rating >= 0 && entry.rating <= 10) {
        return "Value rating must must be a value from 0 to 10";
    }
    if (!isValidUrl(entry.coverUrl)) {
        return "Invalid coverUrl";
    }
    if (!isValidUUIDArray(entry.relatedEntryIds)) {
        return "Invalid array of Entry Ids";
    }
    if (!isValidOptionalNumber(entry.currentEpisode)) {
        return "Invalid current episode";
    }
    
    if (!isValidOptionalNumber(entry.startedAt)) {
        return "Invalid startedAt";
    }
    if (!isValidOptionalNumber(entry.finishedAt)) {
        return "Invalid finishedAt";
    }
    if (!isValidOptionalNumber(entry.droppedAt)) {
        return "Invalid droppedAt";
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

export function validateEntrySource(entrySource: EntrySource): string | null {
    if (!isValidString(entrySource.englishTitle)) {
        return "Invalid English Title";
    }
    if (!isValidString(entrySource.japaneseTitle)) {
        return "Invalid Japanese Title";
    }
    if (!isValidString(entrySource.synopsis)) {
        return "Invalid Synopsis";
    }
    
    if (!isValidStringArray(entrySource.studios)) {
        return "Invalid studios list";
    }
    if (!isValidStringArray(entrySource.genres)) {
        return "Invalid genres list";
    }
    
    if (!isValidUrl(entrySource.coverUrl)) {
        return "Invalid coverUrl";
    }
    if (!isValidOptionalNumber(entrySource.totalEpisodes)) {
        return "Invalid current episode";
    }
    if (!isValidOptionalNumber(entrySource.rating)) {
        return "Invalid rating";
    }

    if (!isValidOptionalNumber(entrySource.airedFrom)) {
        return "Invalid startedAt";
    }
    if (!isValidOptionalNumber(entrySource.airedTo)) {
        return "Invalid finishedAt";
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