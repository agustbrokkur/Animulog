import type { EntryId, FranchiseId } from "./ids.ts";

export type Franchise = {
    id: FranchiseId;
    title: string;
    coverUrl: string | null;
    /** Watch order — must be stored, not derivable. */
    entryIds: EntryId[];
};
