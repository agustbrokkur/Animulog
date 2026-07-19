import type { Entry } from "./entry.model";
import type { Section } from "./section.model";

export type Animu = {
    sections: Section[];
    entries: Entry[];
}; 

export type GroupType = 'watching' | 'watched' | 'backlog' | 'other';
export const GROUP_TYPES: GroupType[] = ['watching', 'watched', 'backlog', 'other'] as const;

export type MediaType = 'movie' | "tv" | "ova" | "special" | "other";
export const MEDIA_TYPES: MediaType[] = ['movie', "tv", "ova", "special", "other"] as const;