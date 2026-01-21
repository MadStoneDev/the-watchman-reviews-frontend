-- Migration: Recommendations System
-- Description: Tables for AI-powered personalized recommendations

-- =====================================================
-- TABLE: recommendation_requests
-- Tracks when users request new recommendations (rate limiting)
-- =====================================================
CREATE TABLE public.recommendation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  processing_time_ms INTEGER
);

-- Index for rate limiting queries
CREATE INDEX idx_recommendation_requests_user_date
  ON public.recommendation_requests(user_id, requested_at DESC);

-- =====================================================
-- TABLE: user_recommendations
-- Stores AI-generated recommendations
-- =====================================================
CREATE TABLE public.user_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  request_id UUID REFERENCES public.recommendation_requests(id) ON DELETE SET NULL,
  tmdb_id INTEGER NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
  title TEXT NOT NULL,
  poster_path TEXT,
  release_year INTEGER,
  rating DECIMAL(3,1),
  genres TEXT[], -- Array of genre names
  reason TEXT, -- AI-generated reason for recommendation
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  created_at TIMESTAMPTZ DEFAULT NOW(),
  dismissed BOOLEAN DEFAULT FALSE,
  dismissed_at TIMESTAMPTZ,
  watched BOOLEAN DEFAULT FALSE,
  watched_at TIMESTAMPTZ
);

-- Index for fetching user's active recommendations
CREATE INDEX idx_user_recommendations_user_active
  ON public.user_recommendations(user_id, dismissed, created_at DESC);

-- Index for checking if recommendation already exists
CREATE UNIQUE INDEX idx_user_recommendations_unique
  ON public.user_recommendations(user_id, tmdb_id, media_type)
  WHERE dismissed = FALSE;

-- =====================================================
-- TABLE: user_viewing_preferences
-- Cached analysis of user's viewing patterns
-- =====================================================
CREATE TABLE public.user_viewing_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  favorite_genres JSONB DEFAULT '[]'::jsonb, -- [{genre: string, count: number, score: number}]
  preferred_decades JSONB DEFAULT '[]'::jsonb, -- [{decade: string, count: number}]
  avg_rating_given DECIMAL(3,1),
  preferred_runtime_min INTEGER,
  preferred_runtime_max INTEGER,
  binge_tendency DECIMAL(3,2), -- 0.00 to 1.00 (how likely to binge)
  completion_rate DECIMAL(3,2), -- 0.00 to 1.00 (how often they finish series)
  diversity_score DECIMAL(3,2), -- 0.00 to 1.00 (variety in watching)
  top_rated_titles JSONB DEFAULT '[]'::jsonb, -- Recent highly-rated titles
  recently_completed JSONB DEFAULT '[]'::jsonb, -- Recently finished series
  last_analyzed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.recommendation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_viewing_preferences ENABLE ROW LEVEL SECURITY;

-- Recommendation requests policies
CREATE POLICY "Users can view own recommendation requests"
  ON public.recommendation_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own recommendation requests"
  ON public.recommendation_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendation requests"
  ON public.recommendation_requests FOR UPDATE
  USING (auth.uid() = user_id);

-- User recommendations policies
CREATE POLICY "Users can view own recommendations"
  ON public.user_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations"
  ON public.user_recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations"
  ON public.user_recommendations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recommendations"
  ON public.user_recommendations FOR DELETE
  USING (auth.uid() = user_id);

-- User viewing preferences policies
CREATE POLICY "Users can view own viewing preferences"
  ON public.user_viewing_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own viewing preferences"
  ON public.user_viewing_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own viewing preferences"
  ON public.user_viewing_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTION: Check if user can request recommendations
-- Returns days until next request allowed (0 = can request now)
-- =====================================================
CREATE OR REPLACE FUNCTION can_request_recommendations(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_last_request TIMESTAMPTZ;
  v_days_since INTEGER;
BEGIN
  SELECT MAX(requested_at) INTO v_last_request
  FROM public.recommendation_requests
  WHERE user_id = p_user_id
  AND status = 'completed';

  IF v_last_request IS NULL THEN
    RETURN 0; -- Never requested before
  END IF;

  v_days_since := EXTRACT(DAY FROM NOW() - v_last_request);

  IF v_days_since >= 7 THEN
    RETURN 0; -- Can request
  ELSE
    RETURN 7 - v_days_since; -- Days until can request
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Get user's watching profile for AI analysis
-- Returns comprehensive data about user's viewing habits
-- Uses reel_deck table for tracking
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_watching_profile(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  WITH
  -- Get tracked series from reel_deck
  tracked_series AS (
    SELECT
      s.id,
      s.title,
      s.first_air_date,
      s.vote_average as tmdb_rating,
      rd.status,
      EXTRACT(YEAR FROM s.first_air_date)::INTEGER as release_year
    FROM public.reel_deck rd
    JOIN public.series s ON rd.media_id = s.id
    WHERE rd.user_id = p_user_id
    AND rd.media_type = 'tv'
  ),
  -- Get tracked movies from reel_deck
  tracked_movies AS (
    SELECT
      m.id,
      m.title,
      m.release_year::INTEGER as release_year,
      m.vote_average as tmdb_rating,
      rd.status
    FROM public.reel_deck rd
    JOIN public.movies m ON rd.media_id = m.id
    WHERE rd.user_id = p_user_id
    AND rd.media_type = 'movie'
  ),
  -- Get series genres via junction table
  series_genre_data AS (
    SELECT
      ts.id as series_id,
      ts.title,
      ts.tmdb_rating,
      ts.status,
      g.name as genre
    FROM tracked_series ts
    JOIN public.series_genres sg ON ts.id = sg.series_id
    JOIN public.genres g ON sg.genre_id = g.id
  ),
  -- Get movie genres via junction table
  movie_genre_data AS (
    SELECT
      tm.id as movie_id,
      tm.title,
      tm.tmdb_rating,
      tm.status,
      g.name as genre
    FROM tracked_movies tm
    JOIN public.movie_genres mg ON tm.id = mg.movie_id
    JOIN public.genres g ON mg.genre_id = g.id
  ),
  -- Aggregate genre preferences from series
  series_genres_agg AS (
    SELECT
      genre,
      COUNT(DISTINCT series_id) as count,
      AVG(tmdb_rating) as avg_rating
    FROM series_genre_data
    GROUP BY genre
  ),
  -- Aggregate genre preferences from movies
  movie_genres_agg AS (
    SELECT
      genre,
      COUNT(DISTINCT movie_id) as count,
      AVG(tmdb_rating) as avg_rating
    FROM movie_genre_data
    GROUP BY genre
  ),
  -- Combined genres
  combined_genres AS (
    SELECT
      genre,
      SUM(count) as total_count,
      AVG(avg_rating) as avg_rating
    FROM (
      SELECT * FROM series_genres_agg
      UNION ALL
      SELECT * FROM movie_genres_agg
    ) all_genres
    GROUP BY genre
    ORDER BY total_count DESC, avg_rating DESC
    LIMIT 10
  ),
  -- Decade preferences
  decade_prefs AS (
    SELECT
      (release_year / 10 * 10)::TEXT || 's' as decade,
      COUNT(*) as count
    FROM (
      SELECT release_year FROM tracked_series WHERE release_year IS NOT NULL
      UNION ALL
      SELECT release_year FROM tracked_movies WHERE release_year IS NOT NULL
    ) years
    WHERE release_year IS NOT NULL
    GROUP BY release_year / 10
    ORDER BY count DESC
    LIMIT 5
  ),
  -- Top rated titles (TMDB rating 8+)
  top_rated AS (
    SELECT jsonb_agg(jsonb_build_object(
      'title', title,
      'rating', tmdb_rating,
      'type', type
    )) as titles
    FROM (
      SELECT title, tmdb_rating, 'tv' as type
      FROM tracked_series
      WHERE tmdb_rating >= 8
      ORDER BY tmdb_rating DESC
      LIMIT 10
      UNION ALL
      SELECT title, tmdb_rating, 'movie' as type
      FROM tracked_movies
      WHERE tmdb_rating >= 8
      ORDER BY tmdb_rating DESC
      LIMIT 10
    ) rated
    LIMIT 20
  ),
  -- Recently completed series
  recent_completed AS (
    SELECT jsonb_agg(jsonb_build_object(
      'title', title,
      'type', 'tv'
    )) as titles
    FROM tracked_series
    WHERE status = 'completed'
    LIMIT 10
  )
  SELECT jsonb_build_object(
    'total_series', (SELECT COUNT(*) FROM tracked_series),
    'total_movies', (SELECT COUNT(*) FROM tracked_movies),
    'completed_series', (SELECT COUNT(*) FROM tracked_series WHERE status = 'completed'),
    'favorite_genres', (SELECT COALESCE(jsonb_agg(jsonb_build_object('genre', genre, 'count', total_count, 'avg_rating', ROUND(avg_rating::numeric, 1))), '[]'::jsonb) FROM combined_genres),
    'preferred_decades', (SELECT COALESCE(jsonb_agg(jsonb_build_object('decade', decade, 'count', count)), '[]'::jsonb) FROM decade_prefs),
    'avg_user_rating', NULL,
    'top_rated_titles', (SELECT COALESCE(titles, '[]'::jsonb) FROM top_rated),
    'recently_completed', (SELECT COALESCE(titles, '[]'::jsonb) FROM recent_completed),
    'completion_rate', (
      SELECT ROUND(
        CASE
          WHEN COUNT(*) = 0 THEN 0
          ELSE COUNT(*) FILTER (WHERE status = 'completed')::numeric / COUNT(*)::numeric
        END, 2
      )
      FROM tracked_series
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
