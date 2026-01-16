-- Migration: Notifications and Achievements System
-- Description: Creates tables for notifications and achievements with triggers

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'follow', 'achievement', 'comment_reaction', 'message', etc.
  title TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}', -- Flexible data for different notification types
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Actor who triggered the notification (optional, e.g., who followed you)
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, read) WHERE read = FALSE;
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON public.notifications(type);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON public.notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- System can insert notifications (via service role or triggers)
CREATE POLICY "System can insert notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- ACHIEVEMENTS DEFINITIONS TABLE
-- =====================================================
CREATE TABLE public.achievement_definitions (
  id TEXT PRIMARY KEY, -- e.g., 'first_movie', 'watched_50_movies', 'first_comment'
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT, -- Icon name or emoji
  category TEXT NOT NULL, -- 'watching', 'social', 'engagement', 'special'
  tier TEXT DEFAULT 'bronze', -- 'bronze', 'silver', 'gold', 'platinum'
  threshold INTEGER, -- For milestone achievements (e.g., 50 for 'watched_50_movies')
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (read-only for all)
ALTER TABLE public.achievement_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievement definitions"
  ON public.achievement_definitions
  FOR SELECT
  USING (true);

-- =====================================================
-- USER ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES public.achievement_definitions(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  progress INTEGER DEFAULT 0, -- Current progress toward threshold
  metadata JSONB DEFAULT '{}', -- Extra data (e.g., which show triggered it)

  UNIQUE(user_id, achievement_id)
);

-- Indexes
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_user_achievements_unlocked ON public.user_achievements(user_id, unlocked_at DESC);

-- Enable RLS
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Anyone can view achievements (public)
CREATE POLICY "Anyone can view user achievements"
  ON public.user_achievements
  FOR SELECT
  USING (true);

-- System can insert/update achievements
CREATE POLICY "System can manage user achievements"
  ON public.user_achievements
  FOR ALL
  WITH CHECK (true);

-- =====================================================
-- INSERT DEFAULT ACHIEVEMENT DEFINITIONS
-- =====================================================
INSERT INTO public.achievement_definitions (id, name, description, icon, category, tier, threshold) VALUES
  -- Watching Achievements (TV Shows only)
  ('first_show', 'TV Debut', 'Started watching your first TV show', 'tv', 'watching', 'bronze', 1),
  ('watched_10_shows', 'Binge Starter', 'Watched 10 TV shows', 'tv', 'watching', 'bronze', 10),
  ('watched_50_shows', 'Series Addict', 'Watched 50 TV shows', 'tv', 'watching', 'silver', 50),
  ('watched_100_shows', 'TV Master', 'Watched 100 TV shows', 'tv', 'watching', 'gold', 100),
  ('watched_250_shows', 'TV Legend', 'Watched 250 TV shows', 'tv', 'watching', 'platinum', 250),

  ('first_episode', 'Episode One', 'Watched your first episode', 'play', 'watching', 'bronze', 1),
  ('watched_100_episodes', 'Episode Hunter', 'Watched 100 episodes', 'play', 'watching', 'bronze', 100),
  ('watched_500_episodes', 'Binge Master', 'Watched 500 episodes', 'play', 'watching', 'silver', 500),
  ('watched_1000_episodes', 'Couch Champion', 'Watched 1000 episodes', 'play', 'watching', 'gold', 1000),
  ('watched_5000_episodes', 'Screen Legend', 'Watched 5000 episodes', 'play', 'watching', 'platinum', 5000),

  -- Social Achievements
  ('first_follower', 'Getting Started', 'Gained your first follower', 'user-plus', 'social', 'bronze', 1),
  ('followers_10', 'Rising Star', 'Gained 10 followers', 'users', 'social', 'bronze', 10),
  ('followers_50', 'Popular', 'Gained 50 followers', 'users', 'social', 'silver', 50),
  ('followers_100', 'Influencer', 'Gained 100 followers', 'users', 'social', 'gold', 100),

  ('first_follow', 'Social Butterfly', 'Followed your first user', 'user-check', 'social', 'bronze', 1),
  ('first_mutual', 'New Friend', 'Made your first mutual connection', 'heart', 'social', 'bronze', 1),

  -- Engagement Achievements
  ('first_comment', 'Voice Heard', 'Left your first comment', 'message-circle', 'engagement', 'bronze', 1),
  ('comments_10', 'Conversationalist', 'Left 10 comments', 'message-circle', 'engagement', 'bronze', 10),
  ('comments_50', 'Critic', 'Left 50 comments', 'message-circle', 'engagement', 'silver', 50),
  ('comments_100', 'Renowned Critic', 'Left 100 comments', 'message-circle', 'engagement', 'gold', 100),

  ('first_responder', 'First Responder', 'First to comment on a show/movie', 'zap', 'engagement', 'silver', 1),

  ('reactions_received_10', 'Liked', 'Received 10 reactions on your comments', 'thumbs-up', 'engagement', 'bronze', 10),
  ('reactions_received_50', 'Well Liked', 'Received 50 reactions on your comments', 'thumbs-up', 'engagement', 'silver', 50),
  ('reactions_received_100', 'Beloved', 'Received 100 reactions on your comments', 'thumbs-up', 'engagement', 'gold', 100),

  -- Collection Achievements
  ('first_collection', 'Curator', 'Created your first collection', 'folder', 'engagement', 'bronze', 1),
  ('collections_5', 'Organizer', 'Created 5 collections', 'folder', 'engagement', 'bronze', 5),
  ('public_collection', 'Sharing is Caring', 'Made a collection public', 'share', 'engagement', 'bronze', 1),

  -- Special Achievements
  ('early_adopter', 'Early Adopter', 'Joined during the early days', 'star', 'special', 'gold', NULL),
  ('night_owl', 'Night Owl', 'Active after midnight', 'moon', 'special', 'bronze', NULL),
  ('weekend_warrior', 'Weekend Warrior', 'Watched 10+ episodes in a weekend', 'calendar', 'special', 'silver', 10)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- HELPER FUNCTION: Create Notification
-- =====================================================
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT DEFAULT NULL,
  p_data JSONB DEFAULT '{}',
  p_actor_id UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, data, actor_id)
  VALUES (p_user_id, p_type, p_title, p_message, p_data, p_actor_id)
  RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGER: Notify on New Follow
-- =====================================================
CREATE OR REPLACE FUNCTION notify_on_follow()
RETURNS TRIGGER AS $$
DECLARE
  v_follower_username TEXT;
BEGIN
  -- Get follower's username
  SELECT username INTO v_follower_username
  FROM public.profiles
  WHERE id = NEW.follower_id;

  -- Create notification for the user being followed
  PERFORM create_notification(
    NEW.following_id,
    'follow',
    'New Follower',
    v_follower_username || ' started following you',
    jsonb_build_object('follower_id', NEW.follower_id, 'follower_username', v_follower_username),
    NEW.follower_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_on_follow
  AFTER INSERT ON public.user_follows
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_follow();
