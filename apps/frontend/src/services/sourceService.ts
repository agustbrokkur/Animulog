import { request } from "./api";
import type { EntrySource } from "../types/entry";
import type { SourceCandidate } from "../types/source";
import type { SourceJob } from "../types/sourceJob";

export const searchSources = (query: string) => request<SourceCandidate[]>("/sources/search", "Couldn't search sources", { method: "POST", body: { query } });

export const applyEntrySource = (entryId: string, source: EntrySource) =>
	request(`/animu/entries/${entryId}/source`, "Couldn't update entry source", { method: "PUT", body: source });

export const startBatchFetch = (mode: "all" | "missing", entryIds: string[] | null = null) =>
	request<{ jobId: string }>("/sources/batch", "Couldn't batch fetch sources", { method: "POST", body: { mode, entryIds } });

export const getBatchJob = (jobId: string) => request<SourceJob>(`/sources/batch/${jobId}`, "Couldn't get batch job");

export const cancelBatchJob = (jobId: string) => request(`/sources/batch/${jobId}/cancel`, "Couldn't cancel batch job", { method: "POST" });
