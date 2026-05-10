

export type Animu = {
    sections: Section[],
    entries: Entry[]
}; 

export type Entry = {
    id: string,
    title: string,
    mediaType: MediaType,
    favorite: boolean,
    coverUrl: string | null,
    current: number | null,
    total: number | null,
    note: string | null,
    addedAt: number,
    startedAt: number | null,
    finishedAt: number | null,
    droppedAt: number | null,
    rating: number | null
};

export type Section = {
    id: string,
    label: string,
    system: boolean,
    entryIds: string[]
}

export type MediaType = 'movie' | "tv" | "ova" | "special" | "other";

export type CreateEntry = Omit<Entry, "id" | "addedAt">;

export type CreateSection = Omit<Section, "id" | "entryIds">;

export type UpdateSection = Pick<Section, "label">;