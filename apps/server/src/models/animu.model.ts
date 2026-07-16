export type Animu = {
    sections: Section[],
    entries: Entry[]
}; 

export type Entry = {
    id: string,
    title: string,
    mediaType: MediaType,
    favorite: boolean,
    studios: string[],
    genres: string[],
    coverUrl: string | null,
    currentEpisode: number | null,
    totalEpisodes: number | null,
    note: string | null,
    addedAt: number,
    releasedAt: number | null,
    startedAt: number | null,
    finishedAt: number | null,
    droppedAt: number | null,
    rating: number | null
};

export type Section = {
    id: string,
    label: string,
    group: GroupType,
    system: boolean,
    entryIds: string[]
}

export type GroupType = 'watching' | 'watched' | 'backlog' | 'other';
export const GROUP_TYPES: GroupType[] = ['watching', 'watched', 'backlog', 'other'] as const;

export type MediaType = 'movie' | "tv" | "ova" | "special" | "other";
export const MEDIA_TYPES: MediaType[] = ['movie', "tv", "ova", "special", "other"] as const;

export type CreateEntry = Omit<Entry, "id" | "addedAt">;

export type UpdateEntry = Omit<Entry, "id">;

export type CreateSection = Omit<Section, "id" | "entryIds">;

export type UpdateSection = Pick<Section, "label" | "group">;

export type SectionEntries = {
    entryIds: string[]
} 
