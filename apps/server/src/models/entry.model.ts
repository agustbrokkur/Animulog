import type { MediaType } from "./animu.model";

export const EMPTY_SOURCE: EntrySource = {
  englishTitle: '',
  japaneseTitle: '',
  synopsis: '',
  studios: [],
  genres: [],
  coverUrl: null,
  totalEpisodes: null,
  rating: null,
  airedFrom: null,
  airedTo: null,
  fetchedAt: null,
};

export type EntrySource = {
    englishTitle: string;
    japaneseTitle: string;
    synopsis: string;

    studios: string[];
    genres: string[];

    coverUrl: string | null;
    totalEpisodes: number | null;
    rating: number | null;

    airedFrom: number | null;
    airedTo: number | null;
    fetchedAt: number | null;
}

export type Entry = {
  id: string;
  title: string;
  mediaType: MediaType;
  favorite: boolean;
  note: string | null;

  rating: number | null;
  coverUrl: string | null;
  relatedEntryIds: string[];
  currentEpisode: number | null;

  addedAt: number;
  startedAt: number | null;
  finishedAt: number | null;
  droppedAt: number | null;

  source: EntrySource;
};

export type EntryOld = {
    id: string;
    title: string;
    mediaType: MediaType;
    favorite: boolean;
    studios: string[];
    genres: string[];
    coverUrl: string | null;
    currentEpisode: number | null;
    totalEpisodes: number | null;
    note: string | null;
    addedAt: number;
    releasedAt: number | null;
    endedAt: number | null;
    startedAt: number | null;
    finishedAt: number | null;
    droppedAt: number | null;
    rating: number | null;
};

export type CreateEntry = Omit<Entry, "id" | "addedAt" | "source">;

export type UpdateEntry = Omit<Entry, "id" | "source">;