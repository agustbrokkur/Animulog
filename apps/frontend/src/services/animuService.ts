import type { Animu } from "../types/animu";

const BASE_API_URL = import.meta.env.VITE_API_URL;

export const getAnimu = async (): Promise<Animu> => {
	const res = await fetch(`${BASE_API_URL}/animu`);

	if (!res.ok) throw new Error("Failed to fetch animu");

	return res.json();
};

export const updateSectionEntries = async (sectionId: string, entryIds: string[]): Promise<string[]> => {
	const res = await fetch(`${BASE_API_URL}/animu/sections/${sectionId}/entries`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ entryIds }),
	});

	if (!res.ok) throw new Error("Failed to update section entries");

	return res.json();
};
