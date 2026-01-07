import { Redis } from "@upstash/redis";
import { createClient } from "@/src/utils/supabase/server";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Keys for Upstash
const TRENDING_MOVIES_KEY = "trending_movies";
const TRENDING_SERIES_KEY = "trending_series";

export interface TrendingItem {
    tmdb_id: number;
    db_id: string;
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_year: string | null;
    vote_average: number | null;
    media_type: "movie" | "series";
}

interface TrendingCache {
    week_start: string; // ISO date string of the Sunday this data is valid for
    items: TrendingItem[];
}

/**
 * Get the Sunday that starts the current week
 * Week starts on Sunday (day 0)
 */
function getCurrentWeekSunday(): string {
    const now = new Date();
    const dayOfWeek = now.getUTCDay(); // 0 = Sunday, 1 = Monday, etc.
    const sunday = new Date(now);
    sunday.setUTCDate(now.getUTCDate() - dayOfWeek);
    sunday.setUTCHours(0, 0, 0, 0);
    return sunday.toISOString().split("T")[0]; // Returns "YYYY-MM-DD"
}

/**
 * Check if the cached data is still valid for this week
 */
function isCacheValidForThisWeek(cache: TrendingCache | null): boolean {
    if (!cache || !cache.week_start) return false;
    const currentWeekSunday = getCurrentWeekSunday();
    return cache.week_start === currentWeekSunday;
}

/**
 * Fetch trending movies
 */
async function fetchTrendingMoviesFromTMDB(): Promise<any[]> {
    const url = "https://api.themoviedb.org/3/trending/movie/week?language=en-US";

    const response = await fetch(url, {
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
        },
    });

    if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
}

/**
 * Fetch trending TV series
 */
async function fetchTrendingSeriesFromTMDB(): Promise<any[]> {
    const url = "https://api.themoviedb.org/3/trending/tv/week?language=en-US";

    const response = await fetch(url, {
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
        },
    });

    if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
}

/**
 * Extract release year from a date string
 */
function extractYear(dateString: string | null | undefined): string | null {
    if (!dateString) return null;
    const match = dateString.match(/^(\d{4})/);
    return match ? match[1] : null;
}

/**
 * Upsert a movie into the database and return its db_id
 */
async function upsertMovie(
    supabase: Awaited<ReturnType<typeof createClient>>,
    tmdbMovie: any
): Promise<string> {
    const movieData = {
        tmdb_id: tmdbMovie.id,
        title: tmdbMovie.title,
        overview: tmdbMovie.overview,
        poster_path: tmdbMovie.poster_path,
        backdrop_path: tmdbMovie.backdrop_path,
        release_year: extractYear(tmdbMovie.release_date),
        popularity: Math.round(tmdbMovie.popularity || 0),
        tmdb_popularity: String(tmdbMovie.popularity),
        last_fetched: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from("movies")
        .upsert(movieData, {
            onConflict: "tmdb_id",
            ignoreDuplicates: false,
        })
        .select("id")
        .single();

    if (error) {
        console.error(`Error upserting movie ${tmdbMovie.title}:`, error);
        throw error;
    }

    return data.id;
}

/**
 * Upsert a series into the database and return its db_id
 */
async function upsertSeries(
    supabase: Awaited<ReturnType<typeof createClient>>,
    tmdbSeries: any
): Promise<string> {
    const seriesData = {
        tmdb_id: tmdbSeries.id,
        title: tmdbSeries.name,
        overview: tmdbSeries.overview,
        poster_path: tmdbSeries.poster_path,
        backdrop_path: tmdbSeries.backdrop_path,
        release_year: extractYear(tmdbSeries.first_air_date),
        first_air_date: tmdbSeries.first_air_date,
        last_fetched: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from("series")
        .upsert(seriesData, {
            onConflict: "tmdb_id",
            ignoreDuplicates: false,
        })
        .select("id")
        .single();

    if (error) {
        console.error(`Error upserting series ${tmdbSeries.name}:`, error);
        throw error;
    }

    return data.id;
}

/**
 * Get trending movies - checks cache first, fetches from TMDB if needed
 */
export async function getTrendingMovies(): Promise<TrendingItem[]> {
    // Check Upstash cache first
    const cached = await redis.get<TrendingCache>(TRENDING_MOVIES_KEY);

    if (isCacheValidForThisWeek(cached)) {
        console.log("📦 Returning cached trending movies");
        return cached!.items;
    }

    console.log("🔄 Fetching fresh trending movies...");

    const supabase = await createClient();
    const tmdbMovies = await fetchTrendingMoviesFromTMDB();

    // Get all TMDB IDs to check which exist in our DB
    const tmdbIds = tmdbMovies.map((m) => m.id);

    // Batch lookup existing movies
    const { data: existingMovies } = await supabase
        .from("movies")
        .select("id, tmdb_id")
        .in("tmdb_id", tmdbIds);

    const existingMap = new Map(
        (existingMovies || []).map((m) => [m.tmdb_id, m.id])
    );

    // Process each trending movie
    const trendingItems: TrendingItem[] = [];

    for (const tmdbMovie of tmdbMovies.slice(0, 20)) {
        let dbId = existingMap.get(tmdbMovie.id);

        // If doesn't exist, upsert it
        if (!dbId) {
            console.log(`   ➕ Adding new movie: ${tmdbMovie.title}`);
            dbId = await upsertMovie(supabase, tmdbMovie);
        }

        trendingItems.push({
            tmdb_id: tmdbMovie.id,
            db_id: dbId,
            title: tmdbMovie.title,
            poster_path: tmdbMovie.poster_path,
            backdrop_path: tmdbMovie.backdrop_path,
            release_year: extractYear(tmdbMovie.release_date),
            vote_average: tmdbMovie.vote_average,
            media_type: "movie",
        });
    }

    // Cache in Upstash
    const cachePayload: TrendingCache = {
        week_start: getCurrentWeekSunday(),
        items: trendingItems,
    };

    await redis.set(TRENDING_MOVIES_KEY, cachePayload);
    console.log(`✅ Cached ${trendingItems.length} trending movies`);

    return trendingItems;
}

/**
 * Get trending series - checks cache first, fetches from TMDB if needed
 */
export async function getTrendingSeries(): Promise<TrendingItem[]> {
    // Check Upstash cache first
    const cached = await redis.get<TrendingCache>(TRENDING_SERIES_KEY);

    if (isCacheValidForThisWeek(cached)) {
        console.log("📦 Returning cached trending series");
        return cached!.items;
    }

    console.log("🔄 Fetching fresh trending series...");

    const supabase = await createClient();
    const tmdbSeries = await fetchTrendingSeriesFromTMDB();

    // Get all TMDB IDs to check which exist in our DB
    const tmdbIds = tmdbSeries.map((s) => s.id);

    // Batch lookup existing series
    const { data: existingSeries } = await supabase
        .from("series")
        .select("id, tmdb_id")
        .in("tmdb_id", tmdbIds);

    const existingMap = new Map(
        (existingSeries || []).map((s) => [s.tmdb_id, s.id])
    );

    // Process each trending series
    const trendingItems: TrendingItem[] = [];

    for (const tmdbShow of tmdbSeries.slice(0, 20)) {
        let dbId = existingMap.get(tmdbShow.id);

        // If doesn't exist, upsert it
        if (!dbId) {
            console.log(`   ➕ Adding new series: ${tmdbShow.name}`);
            dbId = await upsertSeries(supabase, tmdbShow);
        }

        trendingItems.push({
            tmdb_id: tmdbShow.id,
            db_id: dbId,
            title: tmdbShow.name,
            poster_path: tmdbShow.poster_path,
            backdrop_path: tmdbShow.backdrop_path,
            release_year: extractYear(tmdbShow.first_air_date),
            vote_average: tmdbShow.vote_average,
            media_type: "series",
        });
    }

    // Cache in Upstash
    const cachePayload: TrendingCache = {
        week_start: getCurrentWeekSunday(),
        items: trendingItems,
    };

    await redis.set(TRENDING_SERIES_KEY, cachePayload);
    console.log(`✅ Cached ${trendingItems.length} trending series`);

    return trendingItems;
}

/**
 * Force refresh trending data (useful for admin/manual refresh)
 */
export async function refreshTrendingData(): Promise<{
    movies: TrendingItem[];
    series: TrendingItem[];
}> {
    // Clear existing cache
    await redis.del(TRENDING_MOVIES_KEY);
    await redis.del(TRENDING_SERIES_KEY);

    // Fetch fresh data
    const [movies, series] = await Promise.all([
        getTrendingMovies(),
        getTrendingSeries(),
    ]);

    return { movies, series };
}