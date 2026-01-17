"use server";

import { createClient } from "@/src/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { isValidReactionType, type ReactionType } from "@/src/lib/reactions-config";
import { checkCommentAchievements } from "./achievements";

export type CommentMediaType = "movie" | "series" | "season" | "episode";

export interface CommentReactions {
  [key: string]: number | ReactionType | null;
  positive: number;
  negative: number;
  popcorn: number;
  userReaction: ReactionType | null;
}

interface CommentWithUser {
  id: string;
  content: string;
  created_at: string | null;
  updated_at: string | null;
  parent_comment_id: string | null;
  user: {
    id: string;
    username: string;
    avatar_path: string | null;
  };
  reactions?: CommentReactions;
  replies?: CommentWithUser[];
}

// Get table name based on media type
function getCommentTable(mediaType: CommentMediaType): string {
  return `${mediaType}_comments`;
}

// Get foreign key field name based on media type
function getMediaIdField(mediaType: CommentMediaType): string {
  return `${mediaType}_id`;
}

/**
 * Fetch comments for a specific media item
 */
export async function getComments(
  mediaType: CommentMediaType,
  mediaId: string,
): Promise<{ success: boolean; comments?: CommentWithUser[]; error?: string }> {
  try {
    const supabase = await createClient();
    const table = getCommentTable(mediaType);
    const mediaIdField = getMediaIdField(mediaType);

    // Get current user for reactions
    const { data: userData } = await supabase.auth.getClaims();
    const currentUserId = userData?.claims?.sub || null;

    const { data: comments, error } = await supabase
      .from(table)
      .select(
        `
        id,
        ${mediaIdField},
        user_id,
        parent_comment_id,
        content,
        created_at,
        updated_at
      `,
      )
      .eq(mediaIdField, mediaId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
      return { success: false, error: error.message };
    }

    if (!comments || comments.length === 0) {
      return { success: true, comments: [] };
    }

    // Fetch user data for all comments - Fix Set spread operator
    const userIds = Array.from(new Set(comments.map((c: any) => c.user_id)));
    const { data: users } = await supabase
      .from("profiles")
      .select("id, username, avatar_path")
      .in("id", userIds);

    // Create user lookup map
    const userMap = new Map(users?.map((u) => [u.id, u]) || []);

    // Fetch reactions for all comments
    const commentIds = comments.map((c: any) => c.id);
    const reactionsResult = await getCommentReactions(commentIds, currentUserId);
    const reactionsMap = reactionsResult.reactions || {};

    // Build comment tree with user data - Add explicit typing
    const commentsWithUsers: CommentWithUser[] = comments.map(
      (comment: any) => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        updated_at: comment.updated_at,
        parent_comment_id: comment.parent_comment_id,
        user: userMap.get(comment.user_id) || {
          id: comment.user_id,
          username: "Unknown User",
          avatar_path: null,
        },
        reactions: reactionsMap[comment.id],
        replies: [],
      }),
    );

    // Organize into tree structure
    const commentMap = new Map<string, CommentWithUser>();
    const topLevelComments: CommentWithUser[] = [];

    commentsWithUsers.forEach((comment) => {
      commentMap.set(comment.id, comment);
    });

    commentsWithUsers.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = commentMap.get(comment.parent_comment_id);
        if (parent) {
          if (!parent.replies) parent.replies = [];
          parent.replies.push(comment);
        }
      } else {
        topLevelComments.push(comment);
      }
    });

    return { success: true, comments: topLevelComments };
  } catch (error) {
    console.error("Error in getComments:", error);
    return { success: false, error: "Failed to fetch comments" };
  }
}

/**
 * Add a new comment
 */
export async function addComment(
  mediaType: CommentMediaType,
  mediaId: string,
  content: string,
  parentCommentId?: string | null,
): Promise<{ success: boolean; comment?: CommentWithUser; error?: string }> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in to comment" };
    }

    const table = getCommentTable(mediaType);
    const mediaIdField = getMediaIdField(mediaType);

    // Insert comment
    const { data: comment, error } = await supabase
      .from(table)
      .insert({
        [mediaIdField]: mediaId,
        user_id: user.id,
        content: content.trim(),
        parent_comment_id: parentCommentId || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding comment:", error);
      return { success: false, error: error.message };
    }

    // Fetch user data
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, username, avatar_path")
      .eq("id", user.id)
      .single();

    const commentWithUser: CommentWithUser = {
      id: comment.id,
      content: comment.content,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      parent_comment_id: comment.parent_comment_id,
      user: profile || {
        id: user.id,
        username: "Unknown User",
        avatar_path: null,
      },
      replies: [],
    };

    // Check comment achievements (don't await to avoid slowing down the response)
    checkCommentAchievements(user.id).catch(console.error);

    // Revalidate the page
    revalidatePath(`/${mediaType}s/${mediaId}`);

    return { success: true, comment: commentWithUser };
  } catch (error) {
    console.error("Error in addComment:", error);
    return { success: false, error: "Failed to add comment" };
  }
}

/**
 * Update an existing comment
 */
export async function updateComment(
  mediaType: CommentMediaType,
  commentId: string,
  content: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to edit comments",
      };
    }

    const table = getCommentTable(mediaType);

    // Check if user owns the comment
    const { data: existingComment } = await supabase
      .from(table)
      .select("user_id")
      .eq("id", commentId)
      .single();

    if (!existingComment || existingComment.user_id !== user.id) {
      return { success: false, error: "You can only edit your own comments" };
    }

    // Update comment
    const { error } = await supabase
      .from(table)
      .update({
        content: content.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", commentId);

    if (error) {
      console.error("Error updating comment:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in updateComment:", error);
    return { success: false, error: "Failed to update comment" };
  }
}

/**
 * Delete a comment
 */
export async function deleteComment(
  mediaType: CommentMediaType,
  commentId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to delete comments",
      };
    }

    const table = getCommentTable(mediaType);

    // Check if user owns the comment
    const { data: existingComment } = await supabase
      .from(table)
      .select("user_id")
      .eq("id", commentId)
      .single();

    if (!existingComment || existingComment.user_id !== user.id) {
      return { success: false, error: "You can only delete your own comments" };
    }

    // Delete comment (this will also delete replies if you have CASCADE set up)
    const { error } = await supabase.from(table).delete().eq("id", commentId);

    if (error) {
      console.error("Error deleting comment:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deleteComment:", error);
    return { success: false, error: "Failed to delete comment" };
  }
}

/**
 * Get reactions for specific comments
 */
export async function getCommentReactions(
  commentIds: string[],
  currentUserId?: string | null,
): Promise<{ success: boolean; reactions?: Record<string, CommentReactions>; error?: string }> {
  try {
    if (commentIds.length === 0) {
      return { success: true, reactions: {} };
    }

    const supabase = await createClient();

    // Fetch all reactions for these comments
    const { data: reactions, error } = await supabase
      .from("comment_reactions")
      .select("comment_id, reaction_type, user_id")
      .in("comment_id", commentIds);

    if (error) {
      console.error("Error fetching reactions:", error);
      return { success: false, error: error.message };
    }

    // Aggregate reactions by comment
    const reactionsByComment: Record<string, CommentReactions> = {};

    commentIds.forEach((id) => {
      reactionsByComment[id] = {
        positive: 0,
        negative: 0,
        popcorn: 0,
        userReaction: null,
      };
    });

    reactions?.forEach((reaction) => {
      const commentReactions = reactionsByComment[reaction.comment_id];
      if (commentReactions) {
        commentReactions[reaction.reaction_type as ReactionType]++;
        if (currentUserId && reaction.user_id === currentUserId) {
          commentReactions.userReaction = reaction.reaction_type as ReactionType;
        }
      }
    });

    return { success: true, reactions: reactionsByComment };
  } catch (error) {
    console.error("Error in getCommentReactions:", error);
    return { success: false, error: "Failed to fetch reactions" };
  }
}

/**
 * Toggle a reaction on a comment
 */
export async function toggleCommentReaction(
  commentId: string,
  reactionType: ReactionType,
): Promise<{ success: boolean; reactions?: CommentReactions; error?: string }> {
  try {
    // Validate reaction type
    if (!isValidReactionType(reactionType)) {
      return {
        success: false,
        error: "Invalid reaction type",
      };
    }

    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to react",
      };
    }

    // Check if user already has a reaction on this comment
    const { data: existingReaction } = await supabase
      .from("comment_reactions")
      .select("reaction_type")
      .eq("comment_id", commentId)
      .eq("user_id", user.id)
      .single();

    if (existingReaction) {
      // If same reaction type, remove it (toggle off)
      if (existingReaction.reaction_type === reactionType) {
        const { error } = await supabase
          .from("comment_reactions")
          .delete()
          .eq("comment_id", commentId)
          .eq("user_id", user.id);

        if (error) {
          console.error("Error removing reaction:", error);
          return { success: false, error: error.message };
        }
      } else {
        // Different reaction type, update it
        const { error } = await supabase
          .from("comment_reactions")
          .update({ reaction_type: reactionType })
          .eq("comment_id", commentId)
          .eq("user_id", user.id);

        if (error) {
          console.error("Error updating reaction:", error);
          return { success: false, error: error.message };
        }
      }
    } else {
      // No existing reaction, insert new one
      const { error } = await supabase
        .from("comment_reactions")
        .insert({
          comment_id: commentId,
          user_id: user.id,
          reaction_type: reactionType,
        });

      if (error) {
        console.error("Error adding reaction:", error);
        return { success: false, error: error.message };
      }
    }

    // Fetch updated reactions for this comment
    const result = await getCommentReactions([commentId], user.id);

    if (result.success && result.reactions) {
      return { success: true, reactions: result.reactions[commentId] };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in toggleCommentReaction:", error);
    return { success: false, error: "Failed to toggle reaction" };
  }
}
