-- Migration: Additional Achievements
-- Description: Adds completion, binge, streak, and community achievements

-- =====================================================
-- INSERT ADDITIONAL ACHIEVEMENT DEFINITIONS
-- =====================================================
INSERT INTO public.achievement_definitions (id, name, description, icon, category, tier, threshold) VALUES
  -- Completion Milestones
  ('first_completion', 'The End', 'Completed your first series', 'flag', 'watching', 'bronze', 1),
  ('completed_10', 'Finisher', 'Completed 10 series', 'flag', 'watching', 'bronze', 10),
  ('completed_25', 'No Loose Ends', 'Completed 25 series', 'flag', 'watching', 'silver', 25),
  ('completed_50', 'Closure Seeker', 'Completed 50 series', 'flag', 'watching', 'gold', 50),
  ('completed_100', 'The Completionist', 'Completed 100 series', 'flag', 'watching', 'platinum', 100),

  -- Binge/Marathon Achievements
  ('daily_binge_10', 'Day Tripper', 'Watched 10+ episodes in a single day', 'flame', 'special', 'bronze', 10),
  ('daily_binge_20', 'Marathon Runner', 'Watched 20+ episodes in a single day', 'flame', 'special', 'silver', 20),
  ('season_in_day', 'One More Episode...', 'Completed an entire season in one day', 'flame', 'special', 'gold', NULL),

  -- Streak Achievements
  ('streak_7', 'Weekly Regular', 'Watched something 7 days in a row', 'trending-up', 'special', 'bronze', 7),
  ('streak_30', 'Monthly Dedication', 'Watched something 30 days in a row', 'trending-up', 'special', 'silver', 30),
  ('streak_100', 'Unstoppable', 'Watched something 100 days in a row', 'trending-up', 'special', 'gold', 100),

  -- Long-form Content Achievements
  ('long_series', 'In It For The Long Haul', 'Completed a series with 100+ episodes', 'award', 'watching', 'silver', 100),
  ('epic_series', 'Epic Journey', 'Completed a series with 200+ episodes', 'award', 'watching', 'gold', 200),

  -- Community/Social Additions
  ('reactions_given_50', 'Generous', 'Gave 50 reactions to others'' comments', 'thumbs-up', 'social', 'bronze', 50),
  ('reactions_given_100', 'Community Pillar', 'Gave 100 reactions to others'' comments', 'thumbs-up', 'social', 'silver', 100),
  ('following_25', 'Connector', 'Following 25 users', 'users', 'social', 'bronze', 25),
  ('mutuals_5', 'Squad', 'Have 5 mutual connections', 'heart', 'social', 'silver', 5),
  ('mutuals_10', 'Inner Circle', 'Have 10 mutual connections', 'heart', 'social', 'gold', 10),

  -- Engagement Depth
  ('superfan_critic', 'Superfan Critic', 'Left 10+ comments on a single show', 'message-circle', 'engagement', 'silver', 10),
  ('conversation_starter', 'Conversation Starter', 'Had 5+ replies on a single comment', 'message-circle', 'engagement', 'silver', 5),

  -- Special/Fun
  ('speed_demon', 'Speed Demon', 'Completed a series within 7 days of starting', 'zap', 'special', 'silver', NULL),
  ('slow_burn', 'Savoring It', 'Took 6+ months to complete a series', 'clock', 'special', 'bronze', NULL),
  ('diverse_tracker', 'Variety Viewer', 'Tracking 10+ shows simultaneously', 'layers', 'special', 'silver', 10),
  ('guilty_pleasure', 'Guilty Pleasure', 'Started rewatching within 7 days of completing', 'heart', 'special', 'gold', NULL),
  ('the_return', 'The Return', 'Came back to a show after 1+ year break', 'rotate-clockwise', 'special', 'silver', NULL)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- HELPER VIEW: Daily episode counts per user
-- Used for binge achievement detection
-- =====================================================
CREATE OR REPLACE VIEW user_daily_episode_counts AS
SELECT
  user_id,
  DATE(watched_at) as watch_date,
  COUNT(*) as episode_count
FROM public.episode_watches
GROUP BY user_id, DATE(watched_at);

-- =====================================================
-- HELPER VIEW: User watch streaks
-- Calculates consecutive days watched
-- =====================================================
CREATE OR REPLACE VIEW user_watch_streaks AS
WITH daily_watches AS (
  SELECT DISTINCT
    user_id,
    DATE(watched_at) as watch_date
  FROM public.episode_watches
),
date_groups AS (
  SELECT
    user_id,
    watch_date,
    watch_date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY watch_date))::int AS streak_group
  FROM daily_watches
)
SELECT
  user_id,
  MIN(watch_date) as streak_start,
  MAX(watch_date) as streak_end,
  COUNT(*) as streak_length
FROM date_groups
GROUP BY user_id, streak_group;

-- =====================================================
-- HELPER FUNCTION: Get user's current streak
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_current_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_streak INTEGER := 0;
  v_current_date DATE := CURRENT_DATE;
  v_check_date DATE;
  v_has_watch BOOLEAN;
BEGIN
  -- Check if user watched today or yesterday (to allow for timezone differences)
  SELECT EXISTS(
    SELECT 1 FROM public.episode_watches
    WHERE user_id = p_user_id
    AND DATE(watched_at) >= v_current_date - 1
  ) INTO v_has_watch;

  IF NOT v_has_watch THEN
    RETURN 0;
  END IF;

  -- Count backwards from today
  v_check_date := v_current_date;
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM public.episode_watches
      WHERE user_id = p_user_id
      AND DATE(watched_at) = v_check_date
    ) INTO v_has_watch;

    EXIT WHEN NOT v_has_watch;

    v_streak := v_streak + 1;
    v_check_date := v_check_date - 1;
  END LOOP;

  RETURN v_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- HELPER FUNCTION: Get user's longest streak
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_longest_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_longest INTEGER := 0;
BEGIN
  SELECT COALESCE(MAX(streak_length), 0) INTO v_longest
  FROM user_watch_streaks
  WHERE user_id = p_user_id;

  RETURN v_longest;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- HELPER FUNCTION: Get max episodes watched in a day
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_max_daily_episodes(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_max INTEGER := 0;
BEGIN
  SELECT COALESCE(MAX(episode_count), 0) INTO v_max
  FROM user_daily_episode_counts
  WHERE user_id = p_user_id;

  RETURN v_max;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- HELPER FUNCTION: Count mutuals for a user
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_mutual_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM public.user_follows f1
  INNER JOIN public.user_follows f2
    ON f1.following_id = f2.follower_id
    AND f1.follower_id = f2.following_id
  WHERE f1.follower_id = p_user_id;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
