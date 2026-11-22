import { MEDIA_TYPES, GROUP_TYPES, STATUSES, type MediaType, type Status } from "../models/animu.model.ts";
import type { EntrySource, EditableEntryField, EditableTimestampField } from "../models/entry.model.ts";
import type { CreateSection, UpdateSection } from "../models/section.model.ts";
import type { UpdateFranchise } from "../models/franchise.model.ts";
import type { Settings } from "../models/settings.model.ts";

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isValidId(value: unknown): boolean {
	return typeof value === "string" && value.length > 0;
}

export function isValidIdArray(value: unknown): boolean {
	return Array.isArray(value) && value.every(isValidId);
}

export function isValidString(value: unknown): value is string {
	return typeof value === "string" && value.trim().length > 0;
}

export function isValidStringArray(value: unknown): boolean {
	return Array.isArray(value) && value.every((item) => typeof item === "string");
}

// null counts as valid (no URL set).
export function isValidUrl(url: unknown): boolean {
	if (url === null) return true;
	if (typeof url !== "string") return false;
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}

export function isValidNumber(value: unknown): boolean {
	return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export function isValidOptionalNumber(value: unknown): boolean {
	return value === null || isValidNumber(value);
}

export function isValidWholeNumber(value: unknown): boolean {
	return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

export function isValidOptionalWholeNumber(value: unknown): boolean {
	return value === null || isValidWholeNumber(value);
}

// Personal rating, null (unrated), or 1-10
export function isValidOptionalScore(value: unknown): boolean {
	return value === null || (typeof value === "number" && Number.isFinite(value) && value >= 1 && value <= 10);
}

export function validateSectionEntries(sectionEntryList: string[]): string | null {
	if (!isValidIdArray(sectionEntryList)) {
		return "Invalid section entry list";
	}
	return null;
}

export function validateUpdateSection(section: UpdateSection): string | null {
	if (!section || typeof section !== "object" || Array.isArray(section)) {
		return "Invalid section";
	}
	if (!isValidString(section.label)) {
		return "Invalid section label";
	}
	if (section.description !== null && typeof section.description !== "string") {
		return "Invalid section description";
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
	if (typeof section.system !== "boolean") {
		return "Invalid system flag";
	}

	if (section.kind === "manual") {
		return null;
	}
	if (section.kind === "smart") {
		if (!section.filter || typeof section.filter !== "object" || Array.isArray(section.filter)) {
			return "Invalid filter";
		}
		if (!section.sort || typeof section.sort !== "object") {
			return "Invalid sort";
		}
		if (section.sort.direction !== "asc" && section.sort.direction !== "desc") {
			return "Invalid sort direction";
		}
		return null;
	}
	return "Invalid section kind";
}

export function validateFranchiseEntries(franchiseEntryList: string[]): string | null {
	if (!isValidIdArray(franchiseEntryList)) {
		return "Invalid franchise entry list";
	}
	return null;
}

export function validateUpdateFranchise(franchise: UpdateFranchise): string | null {
	if (!franchise || typeof franchise !== "object" || Array.isArray(franchise)) {
		return "Invalid franchise";
	}
	if (!isValidString(franchise.title)) {
		return "Invalid franchise title";
	}
	if (!isValidUrl(franchise.coverUrl)) {
		return "Invalid coverUrl";
	}
	return null;
}

export function validateCreateEntry(entry: unknown): string | null {
	if (!isPlainObject(entry)) {
		return "Invalid entry";
	}

	for (const fieldName of Object.keys(ENTRY_FIELD_CHECKS) as EditableEntryField[]) {
		// status may be left out on create, the route then uses the default from Settings
		if (fieldName === "status" && entry.status === undefined) continue;
		if (!ENTRY_FIELD_CHECKS[fieldName](entry[fieldName])) {
			return `Invalid ${fieldName}`;
		}
	}
	return null;
}

export function validateSettings(settings: Settings): string | null {
	if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
		return "Invalid settings";
	}
	if (!STATUSES.includes(settings.defaultEntryStatus)) {
		return "Invalid defaultEntryStatus";
	}
	if (!settings.defaultSort || typeof settings.defaultSort !== "object") {
		return "Invalid defaultSort";
	}
	if (!isValidString(settings.defaultSort.key)) {
		return "Invalid defaultSort.key";
	}
	if (settings.defaultSort.direction !== "asc" && settings.defaultSort.direction !== "desc") {
		return "Invalid defaultSort.direction";
	}
	if (!["detail", "list", "grid"].includes(settings.defaultViewMode)) {
		return "Invalid defaultViewMode";
	}
	if (!settings.autoBackup || typeof settings.autoBackup !== "object") {
		return "Invalid autoBackup";
	}
	if (typeof settings.autoBackup.enabled !== "boolean") {
		return "Invalid autoBackup.enabled";
	}
	if (!Number.isFinite(settings.autoBackup.intervalHours) || settings.autoBackup.intervalHours <= 0) {
		return "Invalid autoBackup.intervalHours";
	}
	if (!Number.isFinite(settings.anilistRequestsPerMinute) || settings.anilistRequestsPerMinute <= 0) {
		return "Invalid anilistRequestsPerMinute";
	}
	return null;
}

export function validateEntrySource(entrySource: EntrySource): string | null {
	if (!isPlainObject(entrySource)) {
		return "Invalid source";
	}
	if (entrySource.provider !== "mal" && entrySource.provider !== "anilist" && entrySource.provider !== "legacy") {
		return "Invalid provider";
	}
	if (!isValidString(entrySource.externalId)) {
		return "Invalid externalId";
	}
	if (!isValidNumber(entrySource.fetchedAt)) {
		return "Invalid fetchedAt";
	}
	if (!isValidString(entrySource.englishTitle)) {
		return "Invalid English Title";
	}
	if (typeof entrySource.japaneseTitle !== "string") {
		return "Invalid Japanese Title";
	}
	if (typeof entrySource.synopsis !== "string") {
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
		return "Invalid totalEpisodes";
	}
	if (!isValidOptionalNumber(entrySource.communityRating)) {
		return "Invalid communityRating";
	}
	if (!isValidOptionalNumber(entrySource.airedFrom)) {
		return "Invalid airedFrom";
	}
	if (!isValidOptionalNumber(entrySource.airedTo)) {
		return "Invalid airedTo";
	}

	return null;
}

export function validateEntryPatch(patch: unknown): string | null {
	if (!isPlainObject(patch)) return "Invalid entry patch";

	for (const [fieldName, value] of Object.entries(patch)) {
		if (fieldName === "timestamps") {
			const timestampsMessage = validateTimestampsPatch(value);
			if (timestampsMessage !== null) return timestampsMessage;
		} else if (!isEditableEntryField(fieldName)) {
			return `Unknown field "${fieldName}"`;
		} else if (!ENTRY_FIELD_CHECKS[fieldName](value)) {
			return `Invalid ${fieldName}`;
		}
	}
	return null;
}

function validateTimestampsPatch(timestampsPatch: unknown): string | null {
	if (!isPlainObject(timestampsPatch)) return "Invalid timestamps";

	for (const [fieldName, value] of Object.entries(timestampsPatch)) {
		if (!isEditableTimestampField(fieldName)) return `Unknown field "timestamps.${fieldName}"`;
		if (!TIMESTAMP_FIELD_CHECKS[fieldName](value)) return `Invalid "timestamps.${fieldName}"`;
	}
	return null;
}

// The allowed-fields list for entries
// A key that isn't here can't be saved through the API.
const ENTRY_FIELD_CHECKS: Record<EditableEntryField, (value: unknown) => boolean> = {
	title: isValidString,
	mediaType: (value) => MEDIA_TYPES.includes(value as MediaType),
	status: (value) => STATUSES.includes(value as Status),
	favorite: (value) => typeof value === "boolean",
	note: (value) => value === null || isValidString(value),
	score: isValidOptionalScore,
	progress: isValidOptionalWholeNumber,
	coverOverride: isValidUrl,
	totalEpisodesOverride: isValidOptionalWholeNumber,
	tags: isValidStringArray,
};

const TIMESTAMP_FIELD_CHECKS: Record<EditableTimestampField, (value: unknown) => boolean> = {
	added: isValidNumber,
	firstStarted: isValidOptionalNumber,
	lastStarted: isValidOptionalNumber,
	firstFinished: isValidOptionalNumber,
	lastFinished: isValidOptionalNumber,
	finishedCount: isValidWholeNumber,
	lastDropped: isValidOptionalNumber,
};

function isEditableEntryField(fieldName: string): fieldName is EditableEntryField {
	return Object.hasOwn(ENTRY_FIELD_CHECKS, fieldName);
}

function isEditableTimestampField(fieldName: string): fieldName is EditableTimestampField {
	return Object.hasOwn(TIMESTAMP_FIELD_CHECKS, fieldName);
}
