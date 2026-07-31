// types/filters.ts
import type { MediaType } from "./mediaType";
import type { EntryStatus } from "./status";

export interface NumberRange {
	min: number | null;
	max: number | null;
}

export interface DateRange {
	from: number | null;
	to: number | null;
}

export interface EntryFilters {
	mediaTypes: MediaType[];
	statuses: EntryStatus[];
	genres: string[];
	studios: string[];
	favoriteOnly: boolean;

	episodeRange: NumberRange;
	ratingRange: NumberRange; // your own rating (entry.rating)

	airedRange: DateRange; // entry.source.airedFrom
	startedRange: DateRange; // entry.startedAt
	finishedRange: DateRange; // entry.finishedAt
	droppedRange: DateRange; // entry.droppedAt
}

export const EMPTY_RANGE: NumberRange = { min: null, max: null };
export const EMPTY_DATE_RANGE: DateRange = { from: null, to: null };

export const EMPTY_FILTERS: EntryFilters = {
	mediaTypes: [],
	statuses: [],
	genres: [],
	studios: [],
	favoriteOnly: false,
	episodeRange: EMPTY_RANGE,
	ratingRange: EMPTY_RANGE,
	airedRange: EMPTY_DATE_RANGE,
	startedRange: EMPTY_DATE_RANGE,
	finishedRange: EMPTY_DATE_RANGE,
	droppedRange: EMPTY_DATE_RANGE,
};

export const isRangeActive = (r: NumberRange) => r.min != null || r.max != null;
export const isDateRangeActive = (r: DateRange) => r.from != null || r.to != null;

export function isFiltersActive(filters: EntryFilters): boolean {
	return (
		filters.mediaTypes.length > 0 ||
		filters.statuses.length > 0 ||
		filters.genres.length > 0 ||
		filters.studios.length > 0 ||
		filters.favoriteOnly ||
		isRangeActive(filters.episodeRange) ||
		isRangeActive(filters.ratingRange) ||
		isDateRangeActive(filters.airedRange) ||
		isDateRangeActive(filters.startedRange) ||
		isDateRangeActive(filters.finishedRange) ||
		isDateRangeActive(filters.droppedRange)
	);
}
