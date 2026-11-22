import { request } from "./api";
import type { Animu } from "../types/animu";
import type { CreateEntry, EntryPatch } from "../types/entry";
import type { CreateSection, UpdateSection } from "../types/section";
import type { UpdateFranchise } from "../types/franchise";

export const getAnimu = () => request<Animu>("/animu", "Couldn't load your library");

export const createEntry = async (entry: CreateEntry): Promise<string> => {
	const { id } = await request<{ id: string }>("/animu/entries", "Couldn't create the entry", {
		method: "POST",
		body: entry,
	});
	return id;
};

export const patchEntry = (id: string, patch: EntryPatch) => request(`/animu/entries/${id}`, "Couldn't save the entry", { method: "PATCH", body: patch });

export const deleteEntry = (id: string) => request(`/animu/entries/${id}`, "Couldn't delete the entry", { method: "DELETE" });

export const updateEntryFranchise = (id: string, title: string | null) =>
	request(`/animu/entries/${id}/franchise`, "Couldn't add entry to Franchise", { method: "PUT", body: { title } });

export const updateSectionEntries = (sectionId: string, entryIds: string[]) =>
	request<string[]>(`/animu/sections/${sectionId}/entries`, "Couldn't update section's entries", {
		method: "PUT",
		body: { entryIds },
	});

export const createSection = async (section: CreateSection): Promise<string> => {
	const { id } = await request<{ id: string }>(`/animu/sections`, "Couldn't add the section", { method: "POST", body: section });
	return id;
};

export const updateSection = (id: string, section: UpdateSection) => request(`/animu/sections/${id}`, "Couldn't update the section", { method: "PUT", body: section });

export const deleteSection = (id: string) => request(`/animu/sections/${id}`, "Couldn't delete the section", { method: "DELETE" });

export const reorderSections = (sectionIds: string[]) => request<string[]>("/animu/sections/reorder", "Couldn't reorder the sections", { method: "PUT", body: { sectionIds } });

export const updateFranchise = (id: string, franchise: UpdateFranchise) => request(`/animu/franchises/${id}`, "Couldn't update the Franchise", { method: "PUT", body: franchise });

export const deleteFranchise = (id: string) => request(`/animu/franchises/${id}`, "Couldn't delete the Franchise", { method: "DELETE" });

export const updateFranchiseEntries = (franchiseId: string, entryIds: string[]) =>
	request<string[]>(`/animu/franchises/${franchiseId}/entries`, "Couldn't update the Franchise entries", { method: "PUT", body: { entryIds } });
