"use server";

import { createClient } from "@/src/utils/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

export interface Recommendation {
  id: string;
  tmdb_id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  release_year: number | null;
  rating: number | null;
  genres: string[];
  reason: string;
  confidence_score: number;
  created_at: string;
  dismissed: boolean;
  watched: boolean;
}

export interface ViewingProfile {
  total_series: number;
  total_movies: number;
  completed_series: number;
  favorite_genres: Array<{ genre: string; count: number; avg_rating: number }>;
  preferred_decades: Array<{ decade: string; count: number }>;
  avg_user_rating: number | null;
  top_rated_titles: Array<{ title: string; rating: number; type: string }>;
  recently_completed: Array<{ title: string; type: string }>;
  completion_rate: number;
}

/**
 * Check if user can request new recommendations
 * Returns days until next request (0 = can request now)
 */
export async function canRequestRecommendations(): Promise<{
  success: boolean;
  canRequest?: boolean;
  daysUntil?: number;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const { data, error } = await supabase.rpc("can_request_recommendations", {
      p_user_id: user.id,
    });

    if (error) {
      console.error("Error checking recommendation availability:", error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      canRequest: data === 0,
      daysUntil: data,
    };
  } catch (error) {
    console.error("Error in canRequestRecommendations:", error);
    return { success: false, error: "Failed to check recommendation status" };
  }
}

/**
 * Get user's viewing profile for display/analysis
 */
export async function getUserViewingProfile(): Promise<{
  success: boolean;
  profile?: ViewingProfile;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const { data, error } = await supabase.rpc("get_user_watching_profile", {
      p_user_id: user.id,
    });

    if (error) {
      console.error("Error fetching viewing profile:", error);
      return { success: false, error: error.message };
    }

    return { success: true, profile: data as ViewingProfile };
  } catch (error) {
    console.error("Error in getUserViewingProfile:", error);
    return { success: false, error: "Failed to fetch viewing profile" };
  }
}

/**
 * Get user's current recommendations
 */
export async function getUserRecommendations(filters?: {
  mediaType?: "movie" | "tv";
  decade?: string;
  minRating?: number;
}): Promise<{
  success: boolean;
  recommendations?: Recommendation[];
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    let query = supabase
      .from("user_recommendations")
      .select("*")
      .eq("user_id", user.id)
      .eq("dismissed", false)
      .order("confidence_score", { ascending: false })
      .order("created_at", { ascending: false });

    if (filters?.mediaType) {
      query = query.eq("media_type", filters.mediaType);
    }

    if (filters?.minRating) {
      query = query.gte("rating", filters.minRating);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching recommendations:", error);
      return { success: false, error: error.message };
    }

    // Filter by decade client-side since it's stored in release_year
    let recommendations = data || [];
    if (filters?.decade) {
      const decadeStart = parseInt(filters.decade);
      const decadeEnd = decadeStart + 9;
      recommendations = recommendations.filter(
        (r) => r.release_year && r.release_year >= decadeStart && r.release_year <= decadeEnd
      );
    }

    return { success: true, recommendations };
  } catch (error) {
    console.error("Error in getUserRecommendations:", error);
    return { success: false, error: "Failed to fetch recommendations" };
  }
}

/**
 * Dismiss a recommendation (user not interested)
 */
export async function dismissRecommendation(recommendationId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const { error } = await supabase
      .from("user_recommendations")
      .update({
        dismissed: true,
        dismissed_at: new Date().toISOString(),
      })
      .eq("id", recommendationId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error dismissing recommendation:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in dismissRecommendation:", error);
    return { success: false, error: "Failed to dismiss recommendation" };
  }
}

/**
 * Mark a recommendation as watched
 */
export async function markRecommendationWatched(recommendationId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const { error } = await supabase
      .from("user_recommendations")
      .update({
        watched: true,
        watched_at: new Date().toISOString(),
      })
      .eq("id", recommendationId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error marking recommendation watched:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in markRecommendationWatched:", error);
    return { success: false, error: "Failed to mark recommendation as watched" };
  }
}

/**
 * Search TMDB for a title to get full details
 */
async function searchTMDB(
  title: string,
  mediaType: "movie" | "tv",
  year?: number
): Promise<{
  tmdb_id: number;
  title: string;
  poster_path: string | null;
  release_year: number | null;
  rating: number | null;
  genres: string[];
} | null> {
  try {
    const tmdbApiKey = process.env.TMDB_API_KEY;
    if (!tmdbApiKey) {
      console.error("TMDB API key not configured");
      return null;
    }

    const searchUrl = `https://api.themoviedb.org/3/search/${mediaType}?api_key=${tmdbApiKey}&query=${encodeURIComponent(title)}${year ? `&year=${year}` : ""}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.results || searchData.results.length === 0) {
      return null;
    }

    const result = searchData.results[0];
    const releaseDate = mediaType === "movie" ? result.release_date : result.first_air_date;

    // Get genre names
    const genreUrl = `https://api.themoviedb.org/3/genre/${mediaType}/list?api_key=${tmdbApiKey}`;
    const genreResponse = await fetch(genreUrl);
    const genreData = await genreResponse.json();
    const genreMap = new Map(genreData.genres?.map((g: any) => [g.id, g.name]) || []);
    const genres = result.genre_ids?.map((id: number) => genreMap.get(id)).filter(Boolean) || [];

    return {
      tmdb_id: result.id,
      title: mediaType === "movie" ? result.title : result.name,
      poster_path: result.poster_path,
      release_year: releaseDate ? parseInt(releaseDate.split("-")[0]) : null,
      rating: result.vote_average,
      genres,
    };
  } catch (error) {
    console.error("Error searching TMDB:", error);
    return null;
  }
}

/**
 * Force generate recommendations (admin only, bypasses rate limit)
 */
export async function forceGenerateRecommendations(): Promise<{
  success: boolean;
  recommendations?: Recommendation[];
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Check if user is admin (role >= 10)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role < 10) {
      return { success: false, error: "Admin access required" };
    }

    // Clear existing recommendations for fresh results
    await supabase
      .from("user_recommendations")
      .delete()
      .eq("user_id", user.id);

    // Generate without rate limit check
    return await generateRecommendationsInternal(user.id, true);
  } catch (error) {
    console.error("Error in forceGenerateRecommendations:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate recommendations",
    };
  }
}

/**
 * Generate new recommendations using Claude AI
 */
export async function generateRecommendations(): Promise<{
  success: boolean;
  recommendations?: Recommendation[];
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Check rate limiting
    const canRequest = await canRequestRecommendations();
    if (!canRequest.success || !canRequest.canRequest) {
      return {
        success: false,
        error: `You can request new recommendations in ${canRequest.daysUntil} days`,
      };
    }

    return await generateRecommendationsInternal(user.id, false);
  } catch (error) {
    console.error("Error in generateRecommendations:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate recommendations",
    };
  }
}

/**
 * Internal function to generate recommendations
 */
async function generateRecommendationsInternal(
  userId: string,
  skipExistingCheck: boolean
): Promise<{
  success: boolean;
  recommendations?: Recommendation[];
  error?: string;
}> {
  const supabase = await createClient();

  // Create a request record
  const { data: requestRecord, error: requestError } = await supabase
    .from("recommendation_requests")
    .insert({
      user_id: userId,
      status: "processing",
    })
    .select("id")
    .single();

  if (requestError) {
    console.error("Error creating request record:", requestError);
    return { success: false, error: "Failed to initiate recommendation request" };
  }

  const startTime = Date.now();

  try {
    // Get user's viewing profile
    const profileResult = await getUserViewingProfile();
    if (!profileResult.success || !profileResult.profile) {
      throw new Error("Failed to get viewing profile");
    }

    const profile = profileResult.profile;

    // Get existing recommendations to avoid duplicates
    let existingSet = new Set<string>();
    if (!skipExistingCheck) {
      const { data: existingRecs } = await supabase
        .from("user_recommendations")
        .select("tmdb_id, media_type")
        .eq("user_id", userId);

      existingSet = new Set(
        existingRecs?.map((r) => `${r.media_type}:${r.tmdb_id}`) || []
      );
    }

    // Get user's already watched titles from reel_deck
    const { data: reelDeckItems } = await supabase
      .from("reel_deck")
      .select("media_id, media_type")
      .eq("user_id", userId);

    // Separate series and movie IDs
    const seriesIds = reelDeckItems
      ?.filter((item) => item.media_type === "tv")
      .map((item) => item.media_id) || [];
    const movieIds = reelDeckItems
      ?.filter((item) => item.media_type === "movie")
      .map((item) => item.media_id) || [];

    // Fetch titles in parallel
    const [seriesResult, moviesResult] = await Promise.all([
      seriesIds.length > 0
        ? supabase.from("series").select("title").in("id", seriesIds)
        : Promise.resolve({ data: [] }),
      movieIds.length > 0
        ? supabase.from("movies").select("title").in("id", movieIds)
        : Promise.resolve({ data: [] }),
    ]);

    const watchedTitles = [
      ...(seriesResult.data?.map((s: any) => s.title).filter(Boolean) || []),
      ...(moviesResult.data?.map((m: any) => m.title).filter(Boolean) || []),
    ];

    // Fetch user feedback data for personalization (new schema: is_seen + reaction)
    // This is optional - if the table/columns don't exist, we just skip personalization
    let feedbackData: Array<{ tmdb_id: number; media_type: string; is_seen: boolean; reaction: string | null }> | null = null;
    try {
      const { data, error } = await supabase
        .from("user_media_feedback")
        .select("tmdb_id, media_type, is_seen, reaction")
        .eq("user_id", userId);

      if (!error) {
        feedbackData = data;
      } else {
        console.log("Feedback query skipped (table may not be migrated yet):", error.message);
      }
    } catch (e) {
      console.log("Feedback query not available:", e);
    }

    // Separate feedback by type
    const likedTitles: string[] = [];
    const lovedTitles: string[] = [];
    const dislikedTitles: string[] = [];
    const seenTmdbIds = new Set<string>();

    if (feedbackData && feedbackData.length > 0) {
      // Get TMDB IDs for each reaction type
      const feedbackByReaction = {
        liked: feedbackData.filter((f) => f.reaction === "liked").map((f) => ({ tmdb_id: f.tmdb_id, type: f.media_type })),
        loved: feedbackData.filter((f) => f.reaction === "loved").map((f) => ({ tmdb_id: f.tmdb_id, type: f.media_type })),
        disliked: feedbackData.filter((f) => f.reaction === "disliked").map((f) => ({ tmdb_id: f.tmdb_id, type: f.media_type })),
      };

      // Add all seen items to exclusion set (is_seen = true)
      feedbackData.forEach((f) => {
        if (f.is_seen) {
          seenTmdbIds.add(`${f.media_type}:${f.tmdb_id}`);
        }
      });

      // Fetch titles for liked/loved/disliked to include in prompt
      const allFeedbackMovieIds = [...feedbackByReaction.liked, ...feedbackByReaction.loved, ...feedbackByReaction.disliked]
        .filter((f) => f.type === "movie")
        .map((f) => f.tmdb_id);
      const allFeedbackSeriesIds = [...feedbackByReaction.liked, ...feedbackByReaction.loved, ...feedbackByReaction.disliked]
        .filter((f) => f.type === "tv")
        .map((f) => f.tmdb_id);

      // Fetch titles from our database by tmdb_id
      const [feedbackMovies, feedbackSeries] = await Promise.all([
        allFeedbackMovieIds.length > 0
          ? supabase.from("movies").select("tmdb_id, title").in("tmdb_id", allFeedbackMovieIds)
          : Promise.resolve({ data: [] }),
        allFeedbackSeriesIds.length > 0
          ? supabase.from("series").select("tmdb_id, title").in("tmdb_id", allFeedbackSeriesIds)
          : Promise.resolve({ data: [] }),
      ]);

      // Create a map of tmdb_id to title
      const movieTitleMap = new Map((feedbackMovies.data || []).map((m: any) => [m.tmdb_id, m.title]));
      const seriesTitleMap = new Map((feedbackSeries.data || []).map((s: any) => [s.tmdb_id, s.title]));

      // Populate title arrays
      feedbackByReaction.liked.forEach((f) => {
        const title = f.type === "movie" ? movieTitleMap.get(f.tmdb_id) : seriesTitleMap.get(f.tmdb_id);
        if (title) likedTitles.push(title);
      });
      feedbackByReaction.loved.forEach((f) => {
        const title = f.type === "movie" ? movieTitleMap.get(f.tmdb_id) : seriesTitleMap.get(f.tmdb_id);
        if (title) lovedTitles.push(title);
      });
      feedbackByReaction.disliked.forEach((f) => {
        const title = f.type === "movie" ? movieTitleMap.get(f.tmdb_id) : seriesTitleMap.get(f.tmdb_id);
        if (title) dislikedTitles.push(title);
      });
    }

    // Build prompt for Claude with feedback data
    const prompt = buildRecommendationPrompt(profile, watchedTitles, {
      liked: likedTitles,
      loved: lovedTitles,
      disliked: dislikedTitles,
    });

    // Call Claude API
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Parse Claude's response
    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("Invalid response from AI");
    }

    console.log("AI Response received, length:", textContent.text.length);

    const aiRecommendations = parseAIRecommendations(textContent.text);
    console.log("Parsed recommendations count:", aiRecommendations.length);

    if (aiRecommendations.length === 0) {
      console.error("No recommendations parsed from AI response:", textContent.text.substring(0, 500));
    }

    // Look up each recommendation on TMDB and save
    const savedRecommendations: Recommendation[] = [];

    for (const rec of aiRecommendations) {
      // Skip if already recommended (unless skipping existing check)
      if (!skipExistingCheck && existingSet.has(`${rec.mediaType}:${rec.tmdbId}`)) {
        continue;
      }

      // Search TMDB for the title
      const tmdbResult = await searchTMDB(rec.title, rec.mediaType, rec.year);
      if (!tmdbResult) {
        console.log(`TMDB search failed for: ${rec.title} (${rec.mediaType})`);
        continue;
      }

      // Skip if already recommended (by TMDB ID after search)
      if (!skipExistingCheck && existingSet.has(`${rec.mediaType}:${tmdbResult.tmdb_id}`)) {
        continue;
      }

      // Skip if user has already seen/rated this title
      if (seenTmdbIds.has(`${rec.mediaType}:${tmdbResult.tmdb_id}`)) {
        continue;
      }

      // Save to database
      const { data: saved, error: saveError } = await supabase
        .from("user_recommendations")
        .insert({
          user_id: userId,
          request_id: requestRecord.id,
          tmdb_id: tmdbResult.tmdb_id,
          media_type: rec.mediaType,
          title: tmdbResult.title,
          poster_path: tmdbResult.poster_path,
          release_year: tmdbResult.release_year,
          rating: tmdbResult.rating,
          genres: tmdbResult.genres,
          reason: rec.reason,
          confidence_score: rec.confidence,
        })
        .select()
        .single();

      if (!saveError && saved) {
        savedRecommendations.push(saved);
        existingSet.add(`${rec.mediaType}:${tmdbResult.tmdb_id}`);
      }
    }

    console.log(`Saved ${savedRecommendations.length} recommendations out of ${aiRecommendations.length} from AI`);

    // Update request record
    const processingTime = Date.now() - startTime;
    await supabase
      .from("recommendation_requests")
      .update({
        status: "completed",
        processing_time_ms: processingTime,
      })
      .eq("id", requestRecord.id);

    return { success: true, recommendations: savedRecommendations };
  } catch (error) {
    // Update request record with error
    await supabase
      .from("recommendation_requests")
      .update({
        status: "failed",
        error_message: error instanceof Error ? error.message : "Unknown error",
      })
      .eq("id", requestRecord.id);

    throw error;
  }
}

/**
 * Build the prompt for Claude based on user's viewing profile
 */
function buildRecommendationPrompt(
  profile: ViewingProfile,
  watchedTitles: string[],
  feedback?: {
    liked: string[];
    loved: string[];
    disliked: string[];
  }
): string {
  const topGenres = profile.favorite_genres
    .slice(0, 5)
    .map((g) => `${g.genre} (${g.count} titles, avg rating ${g.avg_rating})`)
    .join(", ");

  const decades = profile.preferred_decades
    .slice(0, 3)
    .map((d) => d.decade)
    .join(", ");

  const topRated = profile.top_rated_titles
    .slice(0, 10)
    .map((t) => `"${t.title}" (${t.type}, rated ${t.rating}/10)`)
    .join(", ");

  // Build feedback section for prompt
  let feedbackSection = "";
  if (feedback) {
    if (feedback.loved.length > 0) {
      feedbackSection += `\nTITLES USER LOVED (prioritize similar content):\n${feedback.loved.slice(0, 15).join(", ")}`;
    }
    if (feedback.liked.length > 0) {
      feedbackSection += `\n\nTITLES USER LIKED (good signal for preferences):\n${feedback.liked.slice(0, 15).join(", ")}`;
    }
    if (feedback.disliked.length > 0) {
      feedbackSection += `\n\nTITLES USER DISLIKED (avoid similar content):\n${feedback.disliked.slice(0, 10).join(", ")}`;
    }
  }

  const recentlyCompleted = profile.recently_completed
    .slice(0, 5)
    .map((t) => t.title)
    .join(", ");

  const watchedSample = watchedTitles.slice(0, 50).join(", ");

  return `You are a TV and movie recommendation expert. Based on the following viewing profile, you MUST suggest EXACTLY 30 movies and TV shows the user would enjoy. Do not suggest fewer than 30.

USER VIEWING PROFILE:
- Total shows watched: ${profile.total_series}
- Total movies watched: ${profile.total_movies}
- Series completion rate: ${(profile.completion_rate * 100).toFixed(0)}%
- Average rating given: ${profile.avg_user_rating || "N/A"}/10
- Favorite genres: ${topGenres || "Not enough data"}
- Preferred decades: ${decades || "Mixed"}
- Highly rated titles: ${topRated || "Not enough data"}
- Recently completed: ${recentlyCompleted || "None"}
${feedbackSection}

ALREADY WATCHED (do not recommend these):
${watchedSample || "None provided"}

INSTRUCTIONS:
1. You MUST provide EXACTLY 30 recommendations - no fewer
2. Recommend a mix of movies and TV shows (about 18 TV shows, 12 movies)
3. Focus on their favorite genres but include 2-3 discoveries outside their comfort zone
4. Include both classic and recent releases based on their decade preferences
5. Prioritize critically acclaimed titles that match their taste profile
6. DO NOT recommend anything from the "already watched" list
7. Pay special attention to titles they LOVED - recommend similar content with high confidence
8. If they disliked certain titles, avoid recommending similar content

Respond in this exact JSON format (no markdown, just raw JSON):
{
  "recommendations": [
    {
      "title": "Title of Show/Movie",
      "mediaType": "tv" or "movie",
      "year": release year (number),
      "reason": "Brief personalized explanation why they'd enjoy this (1-2 sentences)",
      "confidence": 0.85 (confidence score between 0.5 and 1.0)
    }
  ]
}`;
}

/**
 * Parse Claude's JSON response into structured recommendations
 */
function parseAIRecommendations(
  responseText: string
): Array<{
  title: string;
  mediaType: "movie" | "tv";
  year?: number;
  reason: string;
  confidence: number;
  tmdbId?: number;
}> {
  try {
    // Try to extract JSON from the response
    let jsonStr = responseText.trim();

    // Handle case where response might have markdown code blocks
    if (jsonStr.includes("```")) {
      const match = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        jsonStr = match[1].trim();
      }
    }

    const parsed = JSON.parse(jsonStr);

    if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
      throw new Error("Invalid response structure");
    }

    return parsed.recommendations
      .filter(
        (r: any) =>
          r.title &&
          (r.mediaType === "movie" || r.mediaType === "tv") &&
          r.reason &&
          typeof r.confidence === "number"
      )
      .map((r: any) => ({
        title: r.title,
        mediaType: r.mediaType as "movie" | "tv",
        year: r.year,
        reason: r.reason,
        confidence: Math.min(1, Math.max(0.5, r.confidence)),
      }));
  } catch (error) {
    console.error("Error parsing AI recommendations:", error);
    return [];
  }
}
