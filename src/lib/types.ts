// Profiles
export type ProfileRole = {
  [key: number]: string;
};

// Media
export interface MediaCollection {
  id: string;
  title: string;
  owner: string;
  is_public: boolean;
  shared: boolean;
  backdrop_path?: string | null;
  item_count?: number;
}

export type MediaSearchResult = {
  id: string;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  tmdbId: number;
  mediaType: "movie" | "tv";
  releaseYear: string;
  tmdbRating: number;
  popularity: number;
};

export interface Genre {
  id: number;
  name: string;
}

export interface MediaItem {
  id: number;
  title: string;
  overview?: string;
  posterPath?: string;
  backdropPath?: string;
  tmdbId: number;
  mediaType: "movie" | "tv";
  releaseYear?: number;
  collectionEntryId?: string;
  mediaId?: number;
  position?: number; // Add this
  existsInDb?: boolean;
}
