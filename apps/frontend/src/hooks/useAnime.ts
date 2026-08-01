import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteEntry, getAnimu, updateEntry, updateEntryFranchise, updateSectionEntries } from "../services/animuService";
import type { Animu } from "../types/animu";
import type { Entry, UpdateEntry } from "../types/entry";
import type { MediaType } from "../types/mediaType";
import type { Status } from "../types/status";
import { isManualSection, type Section } from "../types/section";

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

/** Moves an entry into `targetSectionId`, assuming an entry belongs to at most one manual section at a time — so it also removes the entry from whichever manual section currently holds it, if any. */
export const useMoveEntryToSection = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ entryId, targetSectionId, sections }: { entryId: string; targetSectionId: string; sections: Section[] }) => {
			const target = sections.find((s) => s.id === targetSectionId);
			if (!target || !isManualSection(target)) return;

			const source = sections.filter(isManualSection).find((s) => s.id !== targetSectionId && s.entryIds.includes(entryId));

			if (source) await updateSectionEntries(source.id, source.entryIds.filter((id) => id !== entryId));
			if (!target.entryIds.includes(entryId)) await updateSectionEntries(target.id, [...target.entryIds, entryId]);
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["animu"] }),
	});
};

/** Adjusts an entry's episode progress by `delta`. Missing progress starts from 0, so incrementing lands on 1; progress never drops below 0. */
export const useAdjustEntryProgress = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ entry, delta }: { entry: Entry; delta: number }) => {
			const { id, source, ...rest } = entry;
			const progress = Math.max(0, (entry.progress ?? 0) + delta);
			return updateEntry(id, { ...rest, progress, timestamps: { ...entry.timestamps, updated: Date.now() } });
		},
		onMutate: async ({ entry, delta }) => {
			await queryClient.cancelQueries({ queryKey: ["animu"] });
			const previous = queryClient.getQueryData<Animu>(["animu"]);

			if (previous?.entries[entry.id]) {
				const progress = Math.max(0, (entry.progress ?? 0) + delta);
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
		mutationFn: ({ entry, mediaType }: { entry: Entry; mediaType: MediaType }) => {
			const { id, source, ...rest } = entry;
			return updateEntry(id, { ...rest, mediaType, timestamps: { ...entry.timestamps, updated: Date.now() } });
		},
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
		mutationFn: ({ entry, patch }: { entry: Entry; patch: Partial<UpdateEntry> }) => {
			const { id, source, ...rest } = entry;
			return updateEntry(id, { ...rest, ...patch, timestamps: patch.timestamps ?? { ...entry.timestamps, updated: Date.now() } });
		},
		onMutate: async ({ entry, patch }) => {
			await queryClient.cancelQueries({ queryKey: ["animu"] });
			const previous = queryClient.getQueryData<Animu>(["animu"]);

			if (previous?.entries[entry.id]) {
				queryClient.setQueryData<Animu>(["animu"], {
					...previous,
					entries: { ...previous.entries, [entry.id]: { ...previous.entries[entry.id], ...patch } },
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
		mutationFn: ({ entry, status }: { entry: Entry; status: Status }) => {
			const { id, source, ...rest } = entry;
			return updateEntry(id, { ...rest, status, timestamps: { ...entry.timestamps, updated: Date.now() } });
		},
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
