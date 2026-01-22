-- Migration: Add media_id to user_media_feedback
-- Description: Links feedback to our internal database IDs (movies/series tables)

-- Add media_id column (nullable initially to allow migration of existing data)
ALTER TABLE public.user_media_feedback
ADD COLUMN IF NOT EXISTS media_id UUID;

-- Create index for looking up feedback by media_id
CREATE INDEX IF NOT EXISTS idx_user_media_feedback_media_id
  ON public.user_media_feedback(media_id);

-- Note: media_id references either movies.id or series.id depending on media_type
-- We don't add a foreign key constraint since it references two different tables
-- The application layer ensures referential integrity
