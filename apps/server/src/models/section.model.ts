import type { GroupType } from "./animu.model";

export type Section = {
    id: string;
    label: string;
    group: GroupType;
    system: boolean;
    entryIds: string[];
}

export type CreateSection = Omit<Section, "id" | "entryIds">;

export type UpdateSection = Pick<Section, "label" | "group">;

export type SectionEntries = {
    entryIds: string[]
} 