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
    groups: GroupTypes[],
    system: boolean,
    entryIds: string[]
}

export type GroupTypes = 'watching' | 'watched' | 'backlog' | 'other';
export const GROUP_TYPES: GroupTypes[] = ['watching', 'backlog', 'watched', 'other'] as const;

export type MediaType = 'movie' | "tv" | "ova" | "special" | "other";
export const MEDIA_TYPES: MediaType[] = [ 'movie', "tv", "ova", "special", "other"] as const;