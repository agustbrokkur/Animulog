import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createEntry,
	createSection,
	deleteEntry,
	deleteFranchise,
	deleteSection,
	getAnimu,
	patchEntry,
	reorderSections,
	updateEntryFranchise,
	updateFranchise,
	updateFranchiseEntries,
	updateSection,
	updateSectionEntries,
} from "../services/animuService";
import type { Animu } from "../types/animu";
import { resolveEntry, type CreateEntry, type Entry, type EntryPatch } from "../types/entry";
import type { UpdateFranchise } from "../types/franchise";
import type { MediaType } from "../types/mediaType";
import type { Status } from "../types/status";
import { isManualSection, type CreateSection, type Section, type UpdateSection } from "../types/section";

export const useAnimu = () => {
	return useQuery({
		queryKey: ["animu"],
		queryFn: getAnimu,
	});
};

export const useReorderSectionEntries = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ sectionId, entryIds }: { sectionId: string; entryIds: string[] }) => updateSectionEntries(sectionId, entryIds),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["animu"] }),
	});
};

/** Creates a new library entry. Resolves with the new entry's id, e.g. so a caller can add it to a section right after. */
export const useCreateEntry = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (entry: CreateEntry) => createEntry(entry),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["animu"] }),
	});
};

/** Moves an entry into `targetSectionId`, assuming an entry belongs to at most one manual section at a time — so it also removes the entry from whichever manual section currently holds it, if any. */
export const useMoveEntryToSection = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ entryId, targetSectionId, sections }: { entryId: string; targetSectionId: string; sections: Section[] }) => {
			const target = sections.find((s) => s.id === targetSectionId);
			if (!target || !isManualSection(target)) return;

			const source = sections.filter(isManualSection).find((s) => s.id !== targetSectionId && s.entryIds.includes(entryId));

			if (source)
				await updateSectionEntries(
					source.id,
					source.entryIds.filter((id) => id !== entryId),
				);
			if (!target.entryIds.includes(entryId)) await updateSectionEntries(target.id, [...target.entryIds, entryId]);
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["animu"] }),
	});
};

/** Creates a new manual section. */
export const useCreateSection = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (section: CreateSection) => createSection(section),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["animu"] }),
	});
};

/** Renames a section and/or changes its group. */
export const useUpdateSection = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ sectionId, patch }: { sectionId: string; patch: UpdateSection }) => updateSection(sectionId, patch),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["animu"] }),
	});
};

/** Permanently deletes a section. Entries that belonged to it simply lose that membership. */
export const useDeleteSection = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (sectionId: string) => deleteSection(sectionId),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["animu"] }),
	});
};

/** Reassigns every section's `order` to its index in `sectionIds` — callers pass the full, reordered id list. */
export const useReorderSections = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (sectionIds: string[]) => reorderSections(sectionIds),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["animu"] }),
	});
};

/** Renames a franchise and/or changes its cover. */
export const useUpdateFranchise = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ franchiseId, patch }: { franchiseId: string; patch: UpdateFranchise }) => updateFranchise(franchiseId, patch),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["animu"] }),
	});
};

/** Permanently deletes a franchise. Member entries simply lose that membership. */
export const useDeleteFranchise = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (franchiseId: string) => deleteFranchise(franchiseId),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["animu"] }),
	});
};

/** Reorders (or removes) entries within a franchise's watch order. */
export const useReorderFranchiseEntries = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ franchiseId, entryIds }: { franchiseId: string; entryIds: string[] }) => updateFranchiseEntries(franchiseId, entryIds),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["animu"] }),
	});
};

// Progress after a +/- step, never below 0, and never above the episode total when it's known.
function progressAfterStep(entry: Entry, delta: number): number {
	const steppedProgress = Math.max(0, (entry.progress ?? 0) + delta);
	const totalEpisodes = resolveEntry(entry).displayTotalEpisodes;
	return totalEpisodes != null ? Math.min(totalEpisodes, steppedProgress) : steppedProgress;
}

/** Adjusts an entry's episode progress by `delta`. Missing progress starts from 0, so incrementing lands on 1; progress never drops below 0. */
export const useAdjustEntryProgress = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ entry, delta }: { entry: Entry; delta: number }) => patchEntry(entry.id, { progress: progressAfterStep(entry, delta) }),
		onMutate: async ({ entry, delta }) => {
			await queryClient.cancelQueries({ queryKey: ["animu"] });
			const previous = queryClient.getQueryData<Animu>(["animu"]);

			if (previous?.entries[entry.id]) {
				const progress = progressAfterStep(entry, delta);
				queryClient.setQueryData<Animu>(["animu"], {
					...previous,
					entries: {
						...previous.entries,
						[entry.id]: { ...previous.entries[entry.id], progress },
					},
				});
			}

			return { previous };
		},
		onError: (_error, _vars, context) => {
			if (context?.previous) queryClient.setQueryData(["animu"], context.previous);
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["animu"] }),
	});
};

/** Changes an entry's media type. */
export const useUpdateEntryMediaType = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ entry, mediaType }: { entry: Entry; mediaType: MediaType }) => patchEntry(entry.id, { mediaType }),
		onMutate: async ({ entry, mediaType }) => {
			await queryClient.cancelQueries({ queryKey: ["animu"] });
			const previous = queryClient.getQueryData<Animu>(["animu"]);

			if (previous?.entries[entry.id]) {
				queryClient.setQueryData<Animu>(["animu"], {
					...previous,
					entries: { ...previous.entries, [entry.id]: { ...previous.entries[entry.id], mediaType } },
				});
			}

			return { previous };
		},
		onError: (_error, _vars, context) => {
			if (context?.previous) queryClient.setQueryData(["animu"], context.previous);
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["animu"] }),
	});
};

/** Generic field patch — merges `patch` onto `entry` and sends the whole entry back (the API is a full replace, not a partial patch). Bumps `timestamps.updated` unless the caller already set it. */
export const useUpdateEntry = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ entryId, patch }: { entryId: string; patch: EntryPatch }) => patchEntry(entryId, patch),
		onMutate: async ({ entryId, patch }) => {
			await queryClient.cancelQueries({ queryKey: ["animu"] });
			const previous = queryClient.getQueryData<Animu>(["animu"]);
			const existingEntry = previous?.entries[entryId];

			if (previous && existingEntry) {
				queryClient.setQueryData<Animu>(["animu"], {
					...previous,
					entries: {
						...previous.entries,
						[entryId]: { ...existingEntry, ...patch, timestamps: { ...existingEntry.timestamps, ...patch.timestamps } },
					},
				});
			}

			return { previous };
		},
		onError: (_error, _vars, context) => {
			if (context?.previous) queryClient.setQueryData(["animu"], context.previous);
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["animu"] }),
	});
};

/** Permanently deletes an entry. Does not clean up references in sections/franchises client-side — the server invalidation refetch reflects whatever the backend leaves behind. */
export const useDeleteEntry = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (entryId: string) => deleteEntry(entryId),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["animu"] }),
	});
};

/** Assigns an entry to the franchise matching `title` (case-insensitive), creating one if needed; pass `null` to clear membership. Franchise membership lives outside `entries`, so this always refetches rather than patching optimistically. */
export const useUpdateEntryFranchise = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ entryId, title }: { entryId: string; title: string | null }) => updateEntryFranchise(entryId, title),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["animu"] }),
	});
};

/** Changes an entry's status. */
export const useUpdateEntryStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ entry, status }: { entry: Entry; status: Status }) => patchEntry(entry.id, { status }),
		onMutate: async ({ entry, status }) => {
			await queryClient.cancelQueries({ queryKey: ["animu"] });
			const previous = queryClient.getQueryData<Animu>(["animu"]);

			if (previous?.entries[entry.id]) {
				queryClient.setQueryData<Animu>(["animu"], {
					...previous,
					entries: { ...previous.entries, [entry.id]: { ...previous.entries[entry.id], status } },
				});
			}

			return { previous };
		},
		onError: (_error, _vars, context) => {
			if (context?.previous) queryClient.setQueryData(["animu"], context.previous);
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["animu"] }),
	});
};
