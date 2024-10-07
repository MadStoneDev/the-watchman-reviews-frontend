import axios from "axios";

export const searchMedia = async (searchTerm: string) => {
  // https://api.themoviedb.org/3/search/multi
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/search/multi`,
    headers: {
      accept: "application/json",
    },
    params: {
      query: searchTerm,
      include_adult: false,
      language: `en-US`,
      page: 1,
    },
  };

  try {
    const response = await axios.request(options);

    // Return only movies and series
    return response.data.results.filter(
      (item: any) => item.media_type === "movie" || item.media_type === "tv"
    );
  } catch (error) {
    console.error(error);
  }
};

export const getMovieDetails = async (id: string) => {
  // https://api.themoviedb.org/3/movie/{movie_id}
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/movie/${id}`,
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
