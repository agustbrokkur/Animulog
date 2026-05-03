export type Animu = {
    [section: string]: Entry[]
}; 

export type Entry = {
    id: string,
    title: string,
    favorite: boolean,
    coverUrl: string | null,
    episodeCurrent: number | null,
    episodeTotal: number | null,
    note: string | null,
    addedAt: number,
    order: number
};

export type CreateEntry = Omit<Entry, "id" | "addedAt">;