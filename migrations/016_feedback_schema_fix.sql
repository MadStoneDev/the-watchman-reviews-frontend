-- Migration: Feedback Schema Fix
-- Description: Separates "seen" status from reactions (liked/loved/disliked)
-- Seen is a status, reactions are opinions - they should be independent

-- Add is_seen column
ALTER TABLE public.user_media_feedback
ADD COLUMN IF NOT EXISTS is_seen BOOLEAN DEFAULT FALSE;

-- Add reaction column (nullable - user may mark as seen without giving a reaction)
ALTER TABLE public.user_media_feedback
ADD COLUMN IF NOT EXISTS reaction TEXT CHECK (reaction IN ('liked', 'loved', 'disliked'));

-- Migrate existing data: if feedback_type was 'seen', set is_seen = true
UPDATE public.user_media_feedback
SET is_seen = TRUE
WHERE feedback_type = 'seen';

-- Migrate existing data: copy non-'seen' feedback_type to reaction
UPDATE public.user_media_feedback
SET reaction = feedback_type
WHERE feedback_type IN ('liked', 'loved', 'disliked');

-- For reactions (liked/loved/disliked), also mark as seen since they watched it
UPDATE public.user_media_feedback
SET is_seen = TRUE
WHERE reaction IS NOT NULL;

-- Drop the old feedback_type column
ALTER TABLE public.user_media_feedback
DROP COLUMN IF EXISTS feedback_type;

-- Update the unique constraint to be on user + media (not including feedback type anymore)
DROP INDEX IF EXISTS user_media_feedback_unique;
-- The constraint was defined as: CONSTRAINT user_media_feedback_unique UNIQUE (user_id, tmdb_id, media_type)
-- This should still work since we're just changing columns, not the unique key
