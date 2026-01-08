-- Migration: Create user_series_stats view for optimized Reel Deck queries
-- This replaces heavy client-side episode processing with a database view

-- Drop both regular view and materialized view if they exist
DROP VIEW IF EXISTS user_series_stats CASCADE;
DROP MATERIALIZED VIEW IF EXISTS user_series_stats CASCADE;

-- Create the view
CREATE VIEW user_series_stats AS
SELECT
  rd.user_id,
  rd.media_id as series_id,
  COUNT(e.id)::INTEGER as total_episodes,
  COUNT(CASE WHEN e.air_date <= CURRENT_DATE THEN 1 END)::INTEGER as aired_episodes_count,
  COUNT(ew.episode_id)::INTEGER as watched_episodes,
  COUNT(CASE WHEN e.air_date <= CURRENT_DATE AND ew.episode_id IS NOT NULL THEN 1 END)::INTEGER as watched_aired_episodes,
  MAX(CASE WHEN e.air_date <= CURRENT_DATE THEN e.air_date END) as latest_aired_episode_date,
  MIN(CASE WHEN e.air_date > CURRENT_DATE THEN e.air_date END) as next_upcoming_episode_date,
  (COUNT(CASE WHEN e.air_date > CURRENT_DATE THEN 1 END) > 0) as has_upcoming_episodes
FROM reel_deck rd
JOIN episodes e ON e.series_id = rd.media_id
LEFT JOIN episode_watches ew ON ew.episode_id = e.id AND ew.user_id = rd.user_id
WHERE rd.media_type = 'tv'
GROUP BY rd.user_id, rd.media_id;

-- Add comment for documentation
COMMENT ON VIEW user_series_stats IS 'Pre-calculated episode statistics for each user''s series in their reel deck. Used to optimize Reel Deck dashboard performance.';

-- Optional: Create indexes on underlying tables for better view performance
CREATE INDEX IF NOT EXISTS idx_episodes_series_air_date
ON episodes(series_id, air_date);

CREATE INDEX IF NOT EXISTS idx_episode_watches_user_series
ON episode_watches(user_id, series_id, episode_id);

CREATE INDEX IF NOT EXISTS idx_reel_deck_user_media
ON reel_deck(user_id, media_id)
WHERE media_type = 'tv';
