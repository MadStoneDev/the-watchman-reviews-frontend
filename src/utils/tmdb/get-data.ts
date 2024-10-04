export const searchMedia = async (searchTerm: string) => {};

export const getMovieDetails = async (id: string) => {
  // https://api.themoviedb.org/3/movie/{movie_id}
};

export const getSeriesDetails = async (id: string) => {
  // https://api.themoviedb.org/3/tv/{series_id}
};

export const getSeasonDetails = async (seriesId: string, season: number) => {
  // https://api.themoviedb.org/3/tv/{series_id}/season/{season_number}
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/tv/${seriesId}/season/${season}`,
    params: {
      language: `en-US`,
    },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
    },
  };

  try {
  } catch (error) {
    console.error(error);
  }
};

export const getEpisodeDetails = async (
  seriesId: string,
  season: number,
  episode: number
) => {
  // https://api.themoviedb.org/3/tv/{series_id}/season/{season_number}/episode/{episode_number}
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/tv/${seriesId}/season/${season}/episode/${episode}`,
    params: {
      language: `en-US`,
    },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
    },
  };
};
