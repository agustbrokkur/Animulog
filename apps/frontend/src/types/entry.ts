import type { MediaType } from "./mediaType";
import type { Status } from "./status";

export type EntrySource = {
	provider: "mal" | "anilist" | "legacy";
	externalId: string;
	fetchedAt: number;

	englishTitle: string;
	japaneseTitle: string;
	synopsis: string;

	studios: string[];
	genres: string[];

	coverUrl: string | null;
	totalEpisodes: number | null;
	communityRating: number | null;

	airedFrom: number | null;
	airedTo: number | null;
};

export type EntryTimestamps = {
	added: number;
	updated: number;

	firstStarted: number | null;
	lastStarted: number | null;

	firstFinished: number | null;
	lastFinished: number | null;
	finishedCount: number;

	lastDropped: number | null;
};

export type Entry = {
	id: string;
	mediaType: MediaType;
	status: Status;
	favorite: boolean;
	note: string | null;

	score: number | null;
	progress: number | null;

	titleOverride: string | null;
	coverOverride: string | null;

	source: EntrySource | null;

	timestamps: EntryTimestamps;
};

export type ResolvedEntry = Entry & { displayTitle: string; displayCover: string | null };

export function resolveEntry(entry: Entry): ResolvedEntry {
	return {
		...entry,
		displayTitle: entry.titleOverride ?? entry.source?.englishTitle ?? "Untitled",
		displayCover: entry.coverOverride ?? entry.source?.coverUrl ?? null,
	};
}
