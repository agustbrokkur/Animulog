import fs from "fs";
import path from "node:path";
import { DATA_FILE, SETTINGS_FILE } from "./paths.ts";
import type { Animu } from "../models/animu.model";
import { DEFAULT_SETTINGS, type Settings } from "../models/settings.model.ts";
import { asEntryId, systemSectionId } from "../models/ids.ts";
import { isManual } from "../models/section.model.ts";

function createEmptyLibrary(): Animu {
	const unsortedSectionId = systemSectionId("unsorted");
	return {
		entries: {},
		sections: {
			[unsortedSectionId]: {
				id: unsortedSectionId,
				label: "Unsorted",
				description: null,
				group: "other",
				system: true,
				order: 0,
				kind: "manual",
				entryIds: [],
			},
		},
		franchises: {},
		relations: [],
	};
}

export function readAnimuData(): Animu {
	if (!fs.existsSync(DATA_FILE)) {
		const emptyLibrary = createEmptyLibrary();
		writeAnimuData(emptyLibrary);
		return emptyLibrary;
	}

	const data: Animu = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
	// Entries written before `tags`/`totalEpisodesOverride` existed on the model are missing them
	// entirely (undefined, not null) — validation rejects undefined, so any update on an unmigrated
	// entry would fail. Backfilling here self-heals the file the next time each entry is saved.
	for (const entry of Object.values(data.entries)) {
		entry.tags ??= [];
		entry.totalEpisodesOverride ??= null;
	}
	// Sections written before `description` existed on the model are missing it entirely (undefined,
	// not null) — validation rejects undefined, so any update on an unmigrated section would fail.
	for (const section of Object.values(data.sections)) {
		section.description ??= null;
	}

	return data;
}

export function writeAnimuData(data: Animu): void {
	writeFileAtomic(DATA_FILE, JSON.stringify(data, null, 2));
}

/**
 * Entries that don't belong to any manual section have nowhere to show up in the UI, so this folds
 * them into "Unsorted" (identified by label, same as textLog's status-name mapping) for display.
 *
 * Deliberately NOT part of `readAnimuData` — every write handler starts with a read, and mutating
 * `data.sections` there would get persisted as a side effect of an unrelated write. In particular,
 * moving an entry between sections is two sequential requests (remove from source, then add to
 * target); in the gap between them the entry briefly belongs to no section on disk, and a read during
 * that gap would sweep it into Unsorted — then the *target* write would persist that phantom
 * membership too, duplicating the entry. Callers must only use this on the response of a read-only
 * route, never on data that's about to be written back.
 */
export function withUnsortedFallback(data: Animu): Animu {
	const unsorted = Object.values(data.sections).find((s) => isManual(s) && s.label === "Unsorted");
	if (!unsorted || !isManual(unsorted)) return data;

	const sectioned = new Set<string>();
	for (const section of Object.values(data.sections)) {
		if (!isManual(section) || section.id === unsorted.id) continue;
		for (const id of section.entryIds) sectioned.add(id);
	}

	const unsortedSet = new Set(unsorted.entryIds);
	const missing = Object.keys(data.entries)
		.filter((id) => !sectioned.has(id) && !unsortedSet.has(asEntryId(id)))
		.map(asEntryId);

	if (missing.length === 0) return data;

	return {
		...data,
		sections: {
			...data.sections,
			[unsorted.id]: { ...unsorted, entryIds: [...unsorted.entryIds, ...missing] },
		},
	};
}

export function readSettings(): Settings {
	if (!fs.existsSync(SETTINGS_FILE)) {
		writeSettings(DEFAULT_SETTINGS);
		return DEFAULT_SETTINGS;
	}
	// Merge over DEFAULT_SETTINGS so settings.json files written before a new field existed still parse.
	return { ...DEFAULT_SETTINGS, ...JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8")) };
}

export function writeSettings(settings: Settings): void {
	writeFileAtomic(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

/**
 * Writes to a temp file next to the target, flushes it to disk, then renames it over the target.
 * A rename replaces the file in one step, so a crash leaves either the old file or the new one,
 * never a half-written file.
 */
export function writeFileAtomic(file: string, contents: string): void {
	fs.mkdirSync(path.dirname(file), { recursive: true });
	const tempFile = `${file}.tmp`;
	const tempFileDescriptor = fs.openSync(tempFile, "w");
	try {
		fs.writeFileSync(tempFileDescriptor, contents, "utf-8");
		fs.fsyncSync(tempFileDescriptor);
	} finally {
		fs.closeSync(tempFileDescriptor);
	}
	fs.renameSync(tempFile, file);
}
