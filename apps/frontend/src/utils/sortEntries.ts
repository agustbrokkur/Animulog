// utils/sortEntries.ts
import type { Entry } from "../types/entry";
import type { EntrySort, SortKey } from "../types/sort";

const getSortValue = (entry: Entry, key: SortKey): number | string | null => {
	switch (key) {
		case "title":
			return entry.title.toLowerCase();
		case "myRating":
			return entry.rating;
		case "communityRating":
			return entry.source.rating;
		case "episodesWatched":
			return entry.currentEpisode;
		case "totalEpisodes":
			return entry.source.totalEpisodes;
		case "addedAt":
			return entry.addedAt;
		case "startedAt":
			return entry.startedAt;
		case "finishedAt":
			return entry.finishedAt;
		case "aired":
			return entry.source.airedFrom;
		default:
			return null;
	}
};

export function sortEntries(entries: Entry[], sort: EntrySort): Entry[] {
	if (sort.key === "custom") return sort.direction === "asc" ? entries : [...entries].reverse();

	const sign = sort.direction === "asc" ? 1 : -1;

	return [...entries].sort((a, b) => {
		const va = getSortValue(a, sort.key);
		const vb = getSortValue(b, sort.key);

		// entries missing the sorted value always sink to the bottom
		if (va == null && vb == null) return 0;
		if (va == null) return 1;
		if (vb == null) return -1;

		if (typeof va === "string" && typeof vb === "string") return va.localeCompare(vb) * sign;
		return ((va as number) - (vb as number)) * sign;
	});
}
