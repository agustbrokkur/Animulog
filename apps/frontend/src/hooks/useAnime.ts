import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAnimu, updateEntry, updateSectionEntries } from "../services/animuService";
import type { Animu } from "../types/animu";
import type { Entry } from "../types/entry";

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
