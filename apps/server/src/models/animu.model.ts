export type Animu = {
    section: Section
};

export type Section = {
    id: string,
    title: string,
    favorite: boolean,
    coverUrl: string,
    episodeCurrent: number,
    episodeTotal: number,
    note: string,
    addedAt: number,
    order: number
};