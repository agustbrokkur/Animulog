import type { GroupType } from "./groupType";
import type { MediaType } from "./mediaType";

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