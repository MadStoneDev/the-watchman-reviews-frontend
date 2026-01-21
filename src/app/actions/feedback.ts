"use server";

import { createClient } from "@/src/utils/supabase/server";
import { checkFeedbackAchievements } from "./achievements";

export type ReactionType = "liked" | "loved" | "disliked";

export interface MediaFeedback {
  id: string;
  tmdb_id: number;
  media_type: "movie" | "tv";
  is_seen: boolean;
  reaction: ReactionType | null;
  created_at: string;
  updated_at: string;
}

export interface FeedbackSummary {
  total: number;
  seen: number;
  liked: number;
  loved: number;
  disliked: number;
}

/**
 * Set or toggle the "seen" status for a media item
 */
export async function setSeenStatus(
  tmdbId: number,
  mediaType: "movie" | "tv",
  isSeen: boolean
): Promise<{
  success: boolean;
  feedback?: MediaFeedback;
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

    // If setting to not seen and no reaction exists, delete the row
    if (!isSeen) {
      const { data: existing } = await supabase
        .from("user_media_feedback")
        .select("reaction")
        .eq("user_id", user.id)
        .eq("tmdb_id", tmdbId)
        .eq("media_type", mediaType)
        .maybeSingle();

      if (existing && !existing.reaction) {
        // No reaction, delete the entire row
        const { error } = await supabase
          .from("user_media_feedback")
          .delete()
          .eq("user_id", user.id)
          .eq("tmdb_id", tmdbId)
          .eq("media_type", mediaType);

        if (error) {
          console.error("Error removing feedback:", error);
          return { success: false, error: error.message };
        }
        return { success: true };
      }
    }

    const { data, error } = await supabase
      .from("user_media_feedback")
      .upsert(
        {
          user_id: user.id,
          tmdb_id: tmdbId,
          media_type: mediaType,
          is_seen: isSeen,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,tmdb_id,media_type",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Error setting seen status:", error);
      return { success: false, error: error.message };
    }

    // Check for achievements (don't await - run in background)
    if (isSeen) {
      checkFeedbackAchievements(user.id, "seen").catch(console.error);
    }

    return { success: true, feedback: data };
  } catch (error) {
    console.error("Error in setSeenStatus:", error);
    return { success: false, error: "Failed to set seen status" };
  }
}

/**
 * Set or remove a reaction for a media item
 */
export async function setReaction(
  tmdbId: number,
  mediaType: "movie" | "tv",
  reaction: ReactionType | null
): Promise<{
  success: boolean;
  feedback?: MediaFeedback;
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

    // If removing reaction, check if is_seen is also false
    if (reaction === null) {
      const { data: existing } = await supabase
        .from("user_media_feedback")
        .select("is_seen")
        .eq("user_id", user.id)
        .eq("tmdb_id", tmdbId)
        .eq("media_type", mediaType)
        .maybeSingle();

      if (existing && !existing.is_seen) {
        // Not seen and no reaction, delete the entire row
        const { error } = await supabase
          .from("user_media_feedback")
          .delete()
          .eq("user_id", user.id)
          .eq("tmdb_id", tmdbId)
          .eq("media_type", mediaType);

        if (error) {
          console.error("Error removing feedback:", error);
          return { success: false, error: error.message };
        }
        return { success: true };
      }

      // Update to remove reaction
      const { data, error } = await supabase
        .from("user_media_feedback")
        .update({
          reaction: null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("tmdb_id", tmdbId)
        .eq("media_type", mediaType)
        .select()
        .single();

      if (error) {
        console.error("Error removing reaction:", error);
        return { success: false, error: error.message };
      }
      return { success: true, feedback: data };
    }

    // Setting a reaction - also marks as seen (you can't react without seeing it)
    const { data, error } = await supabase
      .from("user_media_feedback")
      .upsert(
        {
          user_id: user.id,
          tmdb_id: tmdbId,
          media_type: mediaType,
          is_seen: true, // If you're reacting, you've seen it
          reaction: reaction,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,tmdb_id,media_type",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Error setting reaction:", error);
      return { success: false, error: error.message };
    }

    // Check for achievements (don't await - run in background)
    checkFeedbackAchievements(user.id, reaction).catch(console.error);

    return { success: true, feedback: data };
  } catch (error) {
    console.error("Error in setReaction:", error);
    return { success: false, error: "Failed to set reaction" };
  }
}

/**
 * Get feedback for a specific media item
 */
export async function getMediaFeedback(
  tmdbId: number,
  mediaType: "movie" | "tv"
): Promise<{
  success: boolean;
  feedback?: MediaFeedback | null;
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

    const { data, error } = await supabase
      .from("user_media_feedback")
      .select("*")
      .eq("user_id", user.id)
      .eq("tmdb_id", tmdbId)
      .eq("media_type", mediaType)
      .maybeSingle();

    if (error) {
      console.error("Error getting feedback:", error);
      return { success: false, error: error.message };
    }

    return { success: true, feedback: data };
  } catch (error) {
    console.error("Error in getMediaFeedback:", error);
    return { success: false, error: "Failed to get feedback" };
  }
}

/**
 * Get multiple feedback entries by TMDB IDs
 */
export async function getMultipleMediaFeedback(
  items: Array<{ tmdbId: number; mediaType: "movie" | "tv" }>
): Promise<{
  success: boolean;
  feedbackMap?: Map<string, { is_seen: boolean; reaction: ReactionType | null }>;
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

    // Build query with OR conditions for each item
    const movieIds = items.filter((i) => i.mediaType === "movie").map((i) => i.tmdbId);
    const tvIds = items.filter((i) => i.mediaType === "tv").map((i) => i.tmdbId);

    const conditions: string[] = [];
    if (movieIds.length > 0) {
      conditions.push(`(media_type.eq.movie,tmdb_id.in.(${movieIds.join(",")}))`);
    }
    if (tvIds.length > 0) {
      conditions.push(`(media_type.eq.tv,tmdb_id.in.(${tvIds.join(",")}))`);
    }

    if (conditions.length === 0) {
      return { success: true, feedbackMap: new Map() };
    }

    const { data, error } = await supabase
      .from("user_media_feedback")
      .select("tmdb_id, media_type, is_seen, reaction")
      .eq("user_id", user.id)
      .or(conditions.join(","));

    if (error) {
      console.error("Error getting multiple feedback:", error);
      return { success: false, error: error.message };
    }

    const feedbackMap = new Map<string, { is_seen: boolean; reaction: ReactionType | null }>();
    data?.forEach((item) => {
      feedbackMap.set(`${item.media_type}:${item.tmdb_id}`, {
        is_seen: item.is_seen,
        reaction: item.reaction as ReactionType | null,
      });
    });

    return { success: true, feedbackMap };
  } catch (error) {
    console.error("Error in getMultipleMediaFeedback:", error);
    return { success: false, error: "Failed to get feedback" };
  }
}

/**
 * Get user's feedback summary (counts by type)
 */
export async function getUserFeedbackSummary(): Promise<{
  success: boolean;
  summary?: FeedbackSummary;
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

    // Get all feedback and count manually (since we changed the schema)
    const { data, error } = await supabase
      .from("user_media_feedback")
      .select("is_seen, reaction")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error getting feedback summary:", error);
      return { success: false, error: error.message };
    }

    const summary: FeedbackSummary = {
      total: data?.length || 0,
      seen: data?.filter((f) => f.is_seen).length || 0,
      liked: data?.filter((f) => f.reaction === "liked").length || 0,
      loved: data?.filter((f) => f.reaction === "loved").length || 0,
      disliked: data?.filter((f) => f.reaction === "disliked").length || 0,
    };

    return { success: true, summary };
  } catch (error) {
    console.error("Error in getUserFeedbackSummary:", error);
    return { success: false, error: "Failed to get feedback summary" };
  }
}

/**
 * Get all user's feedback (paginated)
 */
export async function getUserFeedback(options?: {
  isSeen?: boolean;
  reaction?: ReactionType;
  mediaType?: "movie" | "tv";
  limit?: number;
  offset?: number;
}): Promise<{
  success: boolean;
  feedback?: MediaFeedback[];
  total?: number;
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
      .from("user_media_feedback")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (options?.isSeen !== undefined) {
      query = query.eq("is_seen", options.isSeen);
    }

    if (options?.reaction) {
      query = query.eq("reaction", options.reaction);
    }

    if (options?.mediaType) {
      query = query.eq("media_type", options.mediaType);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error getting user feedback:", error);
      return { success: false, error: error.message };
    }

    return { success: true, feedback: data, total: count || 0 };
  } catch (error) {
    console.error("Error in getUserFeedback:", error);
    return { success: false, error: "Failed to get feedback" };
  }
}
