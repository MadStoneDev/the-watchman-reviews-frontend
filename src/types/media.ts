export interface Genre {
    id: number;
    name: string;
}

export interface MediaItem {
    id: number;
    type: string;
    title: string;
    summary: string;
    poster: string;
    backdrop: string;
    genres: number[];
    rating: number;
    adult: boolean;
    releaseDate: string;
}
