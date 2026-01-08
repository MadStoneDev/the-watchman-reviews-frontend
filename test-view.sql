-- Run this in Supabase SQL Editor to verify the view is working

-- Test 1: Check if view exists and has data
SELECT COUNT(*) as total_rows FROM user_series_stats;

-- Test 2: Check a sample of data
SELECT * FROM user_series_stats LIMIT 5;

-- Test 3: Check for your user specifically (replace with your actual user ID)
SELECT
  user_id,
  series_id,
  total_episodes,
  aired_episodes_count,
  watched_episodes,
  watched_aired_episodes,
  latest_aired_episode_date,
  next_upcoming_episode_date,
  has_upcoming_episodes
FROM user_series_stats
WHERE user_id = 'YOUR_USER_ID_HERE'
LIMIT 10;

-- Test 4: Verify the view joins correctly
SELECT
  rd.media_id,
  COUNT(e.id) as episode_count,
  COUNT(ew.episode_id) as watched_count
FROM reel_deck rd
JOIN episodes e ON e.series_id = rd.media_id
LEFT JOIN episode_watches ew ON ew.episode_id = e.id AND ew.user_id = rd.user_id
WHERE rd.media_type = 'tv'
GROUP BY rd.media_id
LIMIT 5;
