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

export interface SearchFormProps {
  onSearch: (results: MediaSearchResult[], isNewSearch: boolean) => void;
  onLoading?: (loading: boolean) => void;
  setMessage: (message: string) => void;
  setAnimateMessage: (animateMessage: boolean) => void;
  onMoreResultsAvailable: (
    hasMore: boolean,
    loadMoreFn: () => Promise<void>,
  ) => void;
}

export interface LoadMoreButtonProps {
  loading: boolean;
  onLoadMore: () => Promise<void>;
}
