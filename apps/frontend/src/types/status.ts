// types/status.ts
import type { Entry } from "./entry";

export type EntryStatus = "watching" | "finished" | "dropped" | "backlog";

export const ENTRY_STATUSES: EntryStatus[] = ["watching", "finished", "dropped", "backlog"];

export const STATUS_LABELS: Record<EntryStatus, string> = {
	watching: "Watching",
	finished: "Finished",
	dropped: "Dropped",
	backlog: "Backlog",
};

export const STATUS_COLORS: Record<EntryStatus, string> = {
	watching: "#2dd4bf",
	finished: "#60a5fa",
	dropped: "#f87171",
	backlog: "#fbbf24",
};

export function getEntryStatus(entry: Entry): EntryStatus {
	if (entry.droppedAt) return "dropped";
	if (entry.finishedAt) return "finished";
	if (entry.startedAt) return "watching";
	return "backlog";
}
