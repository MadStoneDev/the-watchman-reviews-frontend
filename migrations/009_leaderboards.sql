-- Migration: Leaderboards System
-- Description: Creates materialized views for leaderboards with periodic refresh
-- Run this AFTER 008_activity_feed_and_messaging.sql

-- =====================================================
-- LEADERBOARD: EPISODES WATCHED
-- =====================================================
CREATE MATERIALIZED VIEW public.leaderboard_episodes AS
SELECT
  ew.user_id,
  p.username,
  p.avatar_path,
  COUNT(*) as total_episodes,
  COUNT(*) FILTER (WHERE ew.watched_at >= date_trunc('week', NOW())) as weekly_episodes,
  COUNT(*) FILTER (WHERE ew.watched_at >= date_trunc('month', NOW())) as monthly_episodes
FROM public.episode_watches ew
JOIN public.profiles p ON p.id = ew.user_id
GROUP BY ew.user_id, p.username, p.avatar_path;

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX idx_leaderboard_episodes_user ON public.leaderboard_episodes(user_id);

-- Additional indexes for sorting
CREATE INDEX idx_leaderboard_episodes_total ON public.leaderboard_episodes(total_episodes DESC);
CREATE INDEX idx_leaderboard_episodes_weekly ON public.leaderboard_episodes(weekly_episodes DESC);
CREATE INDEX idx_leaderboard_episodes_monthly ON public.leaderboard_episodes(monthly_episodes DESC);

-- =====================================================
-- LEADERBOARD: SHOWS COMPLETED
-- =====================================================
CREATE MATERIALIZED VIEW public.leaderboard_shows AS
WITH completed_shows AS (
  -- Find users who have watched all aired episodes of a series
  SELECT
    ew.user_id,
    ew.series_id,
    COUNT(DISTINCT ew.episode_id) as watched_count,
    (
      SELECT COUNT(*)
      FROM public.episodes e
      WHERE e.series_id = ew.series_id
      AND e.air_date IS NOT NULL
      AND e.air_date <= CURRENT_DATE
    ) as total_aired
  FROM public.episode_watches ew
  GROUP BY ew.user_id, ew.series_id
  HAVING COUNT(DISTINCT ew.episode_id) >= (
    SELECT COUNT(*)
    FROM public.episodes e
    WHERE e.series_id = ew.series_id
    AND e.air_date IS NOT NULL
    AND e.air_date <= CURRENT_DATE
  )
  AND (
    SELECT COUNT(*)
    FROM public.episodes e
    WHERE e.series_id = ew.series_id
    AND e.air_date IS NOT NULL
    AND e.air_date <= CURRENT_DATE
  ) > 0
)
SELECT
  cs.user_id,
  p.username,
  p.avatar_path,
  COUNT(DISTINCT cs.series_id) as total_shows
FROM completed_shows cs
JOIN public.profiles p ON p.id = cs.user_id
GROUP BY cs.user_id, p.username, p.avatar_path;

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX idx_leaderboard_shows_user ON public.leaderboard_shows(user_id);

-- Additional index for sorting
CREATE INDEX idx_leaderboard_shows_total ON public.leaderboard_shows(total_shows DESC);

-- =====================================================
-- LEADERBOARD: ACHIEVEMENT POINTS
-- =====================================================
CREATE MATERIALIZED VIEW public.leaderboard_achievements AS
WITH achievement_points AS (
  SELECT
    ua.user_id,
    ua.achievement_id,
    CASE ad.tier
      WHEN 'bronze' THEN 10
      WHEN 'silver' THEN 25
      WHEN 'gold' THEN 50
      WHEN 'platinum' THEN 100
      ELSE 10
    END as points
  FROM public.user_achievements ua
  JOIN public.achievement_definitions ad ON ad.id = ua.achievement_id
  WHERE ua.unlocked_at IS NOT NULL
)
SELECT
  ap.user_id,
  p.username,
  p.avatar_path,
  COALESCE(SUM(ap.points), 0) as total_points,
  COUNT(DISTINCT ap.achievement_id) as achievements_count
FROM achievement_points ap
JOIN public.profiles p ON p.id = ap.user_id
GROUP BY ap.user_id, p.username, p.avatar_path;

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX idx_leaderboard_achievements_user ON public.leaderboard_achievements(user_id);

-- Additional indexes for sorting
CREATE INDEX idx_leaderboard_achievements_points ON public.leaderboard_achievements(total_points DESC);
CREATE INDEX idx_leaderboard_achievements_count ON public.leaderboard_achievements(achievements_count DESC);

-- =====================================================
-- LEADERBOARD: COMMENT ACTIVITY
-- =====================================================
CREATE MATERIALIZED VIEW public.leaderboard_comments AS
WITH all_comments AS (
  SELECT user_id, created_at FROM public.movie_comments
  UNION ALL
  SELECT user_id, created_at FROM public.series_comments
  UNION ALL
  SELECT user_id, created_at FROM public.season_comments
  UNION ALL
  SELECT user_id, created_at FROM public.episode_comments
)
SELECT
  ac.user_id,
  p.username,
  p.avatar_path,
  COUNT(*) as total_comments,
  COUNT(*) FILTER (WHERE ac.created_at >= date_trunc('week', NOW())) as weekly_comments,
  COUNT(*) FILTER (WHERE ac.created_at >= date_trunc('month', NOW())) as monthly_comments
FROM all_comments ac
JOIN public.profiles p ON p.id = ac.user_id
GROUP BY ac.user_id, p.username, p.avatar_path;

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX idx_leaderboard_comments_user ON public.leaderboard_comments(user_id);

-- Additional indexes for sorting
CREATE INDEX idx_leaderboard_comments_total ON public.leaderboard_comments(total_comments DESC);
CREATE INDEX idx_leaderboard_comments_weekly ON public.leaderboard_comments(weekly_comments DESC);
CREATE INDEX idx_leaderboard_comments_monthly ON public.leaderboard_comments(monthly_comments DESC);

-- =====================================================
-- REFRESH FUNCTION
-- =====================================================
-- This function can be called by a cron job or external scheduler
-- Recommended: every 15 minutes
CREATE OR REPLACE FUNCTION refresh_leaderboards()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.leaderboard_episodes;
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.leaderboard_shows;
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.leaderboard_achievements;
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.leaderboard_comments;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- HELPER FUNCTION: Get user rank in leaderboard
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_rank(
  p_user_id UUID,
  p_leaderboard_type TEXT,
  p_time_period TEXT DEFAULT 'all_time'
)
RETURNS INTEGER AS $$
DECLARE
  v_rank INTEGER;
BEGIN
  CASE p_leaderboard_type
    WHEN 'episodes' THEN
      CASE p_time_period
        WHEN 'weekly' THEN
          SELECT rank INTO v_rank
          FROM (
            SELECT user_id, RANK() OVER (ORDER BY weekly_episodes DESC) as rank
            FROM public.leaderboard_episodes
          ) sub
          WHERE user_id = p_user_id;
        WHEN 'monthly' THEN
          SELECT rank INTO v_rank
          FROM (
            SELECT user_id, RANK() OVER (ORDER BY monthly_episodes DESC) as rank
            FROM public.leaderboard_episodes
          ) sub
          WHERE user_id = p_user_id;
        ELSE
          SELECT rank INTO v_rank
          FROM (
            SELECT user_id, RANK() OVER (ORDER BY total_episodes DESC) as rank
            FROM public.leaderboard_episodes
          ) sub
          WHERE user_id = p_user_id;
      END CASE;

    WHEN 'shows' THEN
      SELECT rank INTO v_rank
      FROM (
        SELECT user_id, RANK() OVER (ORDER BY total_shows DESC) as rank
        FROM public.leaderboard_shows
      ) sub
      WHERE user_id = p_user_id;

    WHEN 'achievements' THEN
      SELECT rank INTO v_rank
      FROM (
        SELECT user_id, RANK() OVER (ORDER BY total_points DESC) as rank
        FROM public.leaderboard_achievements
      ) sub
      WHERE user_id = p_user_id;

    WHEN 'comments' THEN
      CASE p_time_period
        WHEN 'weekly' THEN
          SELECT rank INTO v_rank
          FROM (
            SELECT user_id, RANK() OVER (ORDER BY weekly_comments DESC) as rank
            FROM public.leaderboard_comments
          ) sub
          WHERE user_id = p_user_id;
        WHEN 'monthly' THEN
          SELECT rank INTO v_rank
          FROM (
            SELECT user_id, RANK() OVER (ORDER BY monthly_comments DESC) as rank
            FROM public.leaderboard_comments
          ) sub
          WHERE user_id = p_user_id;
        ELSE
          SELECT rank INTO v_rank
          FROM (
            SELECT user_id, RANK() OVER (ORDER BY total_comments DESC) as rank
            FROM public.leaderboard_comments
          ) sub
          WHERE user_id = p_user_id;
      END CASE;

    ELSE
      v_rank := NULL;
  END CASE;

  RETURN v_rank;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
