import type { GroupType } from "./groupType";

export type Section = {
	id: string;
	label: string;
	group: GroupType;
	system: boolean;
	entryIds: string[];
};
