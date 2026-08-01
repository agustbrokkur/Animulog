// types/status.ts

export type Status = "unsorted" | "backlog" | "watching" | "on_hold" | "watched" | "dropped";

export const ENTRY_STATUSES: Status[] = ["unsorted", "backlog", "watching", "on_hold", "watched", "dropped"];

export const STATUS_LABELS: Record<Status, string> = {
	unsorted: "Unsorted",
	backlog: "Backlog",
	watching: "Watching",
	on_hold: "On Hold",
	watched: "Watched",
	dropped: "Dropped",
};

export const STATUS_COLORS: Record<Status, string> = {
	unsorted: "#9ca3af",
	backlog: "#fbbf24",
	watching: "#2dd4bf",
	on_hold: "#c084fc",
	watched: "#60a5fa",
	dropped: "#f87171",
};
