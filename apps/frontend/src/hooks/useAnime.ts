import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAnimu, updateSectionEntries } from "../services/animuService";

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
