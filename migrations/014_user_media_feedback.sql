-- Migration: User Media Feedback System
-- Description: Allows users to rate media with Seen/Liked/Loved/Did Not Like

-- =====================================================
-- TABLE: user_media_feedback
-- Stores user feedback on movies and TV shows
-- =====================================================
CREATE TABLE public.user_media_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tmdb_id INTEGER NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('seen', 'liked', 'loved', 'disliked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one feedback per user per media item
  CONSTRAINT user_media_feedback_unique UNIQUE (user_id, tmdb_id, media_type)
);

-- Index for fetching user's feedback
CREATE INDEX idx_user_media_feedback_user
  ON public.user_media_feedback(user_id, created_at DESC);

-- Index for checking feedback on specific media
CREATE INDEX idx_user_media_feedback_media
  ON public.user_media_feedback(tmdb_id, media_type);

-- Index for analytics queries (feedback type distribution)
CREATE INDEX idx_user_media_feedback_type
  ON public.user_media_feedback(user_id, feedback_type);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.user_media_feedback ENABLE ROW LEVEL SECURITY;

-- Users can view their own feedback
CREATE POLICY "Users can view own feedback"
  ON public.user_media_feedback FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own feedback
CREATE POLICY "Users can insert own feedback"
  ON public.user_media_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own feedback
CREATE POLICY "Users can update own feedback"
  ON public.user_media_feedback FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own feedback
CREATE POLICY "Users can delete own feedback"
  ON public.user_media_feedback FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTION: Get user's feedback summary
-- Returns counts by feedback type
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_feedback_summary(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total', COUNT(*),
    'seen', COUNT(*) FILTER (WHERE feedback_type = 'seen'),
    'liked', COUNT(*) FILTER (WHERE feedback_type = 'liked'),
    'loved', COUNT(*) FILTER (WHERE feedback_type = 'loved'),
    'disliked', COUNT(*) FILTER (WHERE feedback_type = 'disliked')
  ) INTO v_result
  FROM public.user_media_feedback
  WHERE user_id = p_user_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Get media feedback for AI recommendations
-- Returns all positive feedback (liked/loved) for recommendation algorithm
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_positive_feedback(p_user_id UUID)
RETURNS TABLE (
  tmdb_id INTEGER,
  media_type TEXT,
  feedback_type TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT umf.tmdb_id, umf.media_type, umf.feedback_type
  FROM public.user_media_feedback umf
  WHERE umf.user_id = p_user_id
  AND umf.feedback_type IN ('liked', 'loved');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Get titles user has seen (to exclude from recommendations)
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_seen_media(p_user_id UUID)
RETURNS TABLE (
  tmdb_id INTEGER,
  media_type TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT umf.tmdb_id, umf.media_type
  FROM public.user_media_feedback umf
  WHERE umf.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
