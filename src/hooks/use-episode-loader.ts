// /src/hooks/use-episode-loader.ts
import { useState, useCallback } from "react";

interface Episode {
  id: string;
  episode_number: number;
  title: string;
  isWatched: boolean;
  air_date: string | null;
  hasAired: boolean;
}

interface Season {
  id: string;
  season_number: number;
  title: string | null;
  poster_path: string | null;
  episodes: Episode[];
  watchedCount: number;
  totalCount: number;
  percentage: number;
  isLoading?: boolean;
}

interface UseEpisodeLoaderReturn {
  loadedSeasons: Set<string>;
  loadingSeasons: Set<string>;
  loadSeasonEpisodes: (
    seasonId: string,
    seriesId: string,
    seasonNumber: number,
  ) => Promise<Episode[]>;
}

/**
 * Custom hook for progressive episode loading
 * Handles loading state and caching of episode data
 */
export function useEpisodeLoader(): UseEpisodeLoaderReturn {
  const [loadedSeasons, setLoadedSeasons] = useState<Set<string>>(new Set());
  const [loadingSeasons, setLoadingSeasons] = useState<Set<string>>(new Set());

  const loadSeasonEpisodes = useCallback(
    async (
      seasonId: string,
      seriesId: string,
      seasonNumber: number,
    ): Promise<Episode[]> => {
      // Don't reload if already loaded
      if (loadedSeasons.has(seasonId)) {
        return [];
      }

      // Don't load if already loading
      if (loadingSeasons.has(seasonId)) {
        return [];
      }

      try {
        // Mark as loading
        setLoadingSeasons((prev) => new Set(prev).add(seasonId));

        const response = await fetch(
          `/api/series/${seriesId}/season/${seasonNumber}/episodes`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const episodes: any[] = await response.json();

        // Process episodes
        const today = new Date().toISOString().split("T")[0];
        const processedEpisodes: Episode[] = episodes.map((ep) => ({
          id: ep.id,
          episode_number: ep.episode_number,
          title: ep.title || `Episode ${ep.episode_number}`,
          isWatched: false, // Will be set by parent component
          air_date: ep.air_date,
          hasAired: ep.air_date ? ep.air_date <= today : false,
        }));

        // Mark as loaded
        setLoadedSeasons((prev) => new Set(prev).add(seasonId));

        return processedEpisodes;
      } catch (error) {
        console.error("Error loading episodes:", error);
        throw error;
      } finally {
        // Remove from loading
        setLoadingSeasons((prev) => {
          const next = new Set(prev);
          next.delete(seasonId);
          return next;
        });
      }
    },
    [loadedSeasons, loadingSeasons],
  );

  return {
    loadedSeasons,
    loadingSeasons,
    loadSeasonEpisodes,
  };
}

/**
 * Custom hook for managing episode watch state
 */
interface UseEpisodeWatchStateReturn {
  watchedIds: Set<string>;
  addWatchedEpisode: (episodeId: string) => void;
  removeWatchedEpisode: (episodeId: string) => void;
  addMultipleWatched: (episodeIds: string[]) => void;
  removeMultipleWatched: (episodeIds: string[]) => void;
  clearAllWatched: () => void;
}

export function useEpisodeWatchState(
  initialWatchedIds: string[],
): UseEpisodeWatchStateReturn {
  const [watchedIds, setWatchedIds] = useState(
    () => new Set(initialWatchedIds),
  );

  const addWatchedEpisode = useCallback((episodeId: string) => {
    setWatchedIds((prev) => new Set(prev).add(episodeId));
  }, []);

  const removeWatchedEpisode = useCallback((episodeId: string) => {
    setWatchedIds((prev) => {
      const next = new Set(prev);
      next.delete(episodeId);
      return next;
    });
  }, []);

  const addMultipleWatched = useCallback((episodeIds: string[]) => {
    setWatchedIds((prev) => {
      const next = new Set(prev);
      episodeIds.forEach((id) => next.add(id));
      return next;
    });
  }, []);

  const removeMultipleWatched = useCallback((episodeIds: string[]) => {
    setWatchedIds((prev) => {
      const next = new Set(prev);
      episodeIds.forEach((id) => next.delete(id));
      return next;
    });
  }, []);

  const clearAllWatched = useCallback(() => {
    setWatchedIds(new Set());
  }, []);

  return {
    watchedIds,
    addWatchedEpisode,
    removeWatchedEpisode,
    addMultipleWatched,
    removeMultipleWatched,
    clearAllWatched,
  };
}

/**
 * Custom hook for season open/close state
 */
interface UseSeasonToggleReturn {
  openSeasons: Set<number>;
  toggleSeason: (seasonNumber: number) => void;
  openSeason: (seasonNumber: number) => void;
  closeSeason: (seasonNumber: number) => void;
  openAllSeasons: () => void;
  closeAllSeasons: () => void;
}

export function useSeasonToggle(
  defaultOpenSeason?: number,
): UseSeasonToggleReturn {
  const [openSeasons, setOpenSeasons] = useState<Set<number>>(() => {
    if (defaultOpenSeason !== undefined) {
      return new Set([defaultOpenSeason]);
    }
    return new Set();
  });

  const toggleSeason = useCallback((seasonNumber: number) => {
    setOpenSeasons((prev) => {
      const next = new Set(prev);
      if (next.has(seasonNumber)) {
        next.delete(seasonNumber);
      } else {
        next.add(seasonNumber);
      }
      return next;
    });
  }, []);

  const openSeason = useCallback((seasonNumber: number) => {
    setOpenSeasons((prev) => new Set(prev).add(seasonNumber));
  }, []);

  const closeSeason = useCallback((seasonNumber: number) => {
    setOpenSeasons((prev) => {
      const next = new Set(prev);
      next.delete(seasonNumber);
      return next;
    });
  }, []);

  const openAllSeasons = useCallback(() => {
    // This would need all season numbers passed in
    // Implementation depends on use case
  }, []);

  const closeAllSeasons = useCallback(() => {
    setOpenSeasons(new Set());
  }, []);

  return {
    openSeasons,
    toggleSeason,
    openSeason,
    closeSeason,
    openAllSeasons,
    closeAllSeasons,
  };
}

/**
 * Calculate progress statistics for seasons
 */
export function calculateSeasonProgress(
  episodes: Episode[],
  watchedIds: Set<string>,
): { watchedCount: number; totalCount: number; percentage: number } {
  const airedEpisodes = episodes.filter((ep) => ep.hasAired);
  const watchedEpisodes = airedEpisodes.filter((ep) => watchedIds.has(ep.id));

  const watchedCount = watchedEpisodes.length;
  const totalCount = airedEpisodes.length;
  const percentage =
    totalCount > 0 ? Math.round((watchedCount / totalCount) * 100) : 0;

  return { watchedCount, totalCount, percentage };
}

/**
 * Calculate overall series progress
 */
export function calculateOverallProgress(seasons: Season[]): {
  watchedEpisodes: number;
  totalEpisodes: number;
  percentage: number;
} {
  let watchedEpisodes = 0;
  let totalEpisodes = 0;

  seasons.forEach((season) => {
    watchedEpisodes += season.watchedCount;
    totalEpisodes += season.totalCount;
  });

  const percentage =
    totalEpisodes > 0 ? Math.round((watchedEpisodes / totalEpisodes) * 100) : 0;

  return { watchedEpisodes, totalEpisodes, percentage };
}
