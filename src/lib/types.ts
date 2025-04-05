export type MediaCollection = {
  id: string;
  title: string;
  owner: string;
  is_public: boolean;
  shared?: boolean;
};

export type MediaSearchResult = {
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  tmdbId: number;
  mediaType: string;
  releaseYear: string;
  tmdbRating: number;
  popularity: number;
};

export interface Genre {
  id: number;
  name: string;
}

export interface MediaItem {
  id: string;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  tmdbId: number;
  mediaType: string;
  releaseYear: string;
  existsInDb?: boolean;
}
