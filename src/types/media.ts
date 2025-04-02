export interface Genre {
  id: number;
  name: string;
}

export interface MediaItem {
  id: number;
  title: string;
  overview: string;
  posterPath: string;
  tmdbId: number;
  mediaType: string;
  releaseYear: string;
  existsInDb?: boolean;
}
