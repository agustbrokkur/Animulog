import type { MediaType } from "./mediaType";

export type EntrySource = {
	englishTitle: string;
	japaneseTitle: string;
	synopsis: string;

	studios: string[];
	genres: string[];

	coverUrl: string | null;
	totalEpisodes: number | null;
	rating: number | null;

	airedFrom: number | null;
	airedTo: number | null;
	fetchedAt: number | null;
};

export type Entry = {
	id: string;
	title: string;
	mediaType: MediaType;
	favorite: boolean;
	note: string | null;

	rating: number | null;
	coverUrl: string | null;
	relatedEntryIds: string[];
	currentEpisode: number | null;

	addedAt: number;
	startedAt: number | null;
	finishedAt: number | null;
	droppedAt: number | null;

	source: EntrySource;
};
