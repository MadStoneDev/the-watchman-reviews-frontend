-- Migration: Activity Feed and Messaging System
-- Description: Creates tables for activity feed and direct messaging
-- Run this AFTER 007_cleanup_movie_achievements.sql

-- =====================================================
-- STEP 1: CREATE ALL TABLES FIRST (before policies)
-- =====================================================

-- ACTIVITY FEED TABLE
CREATE TABLE public.activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'episode_watched', 'series_started', 'series_completed',
    'comment_posted', 'achievement_unlocked'
  )),
  data JSONB NOT NULL DEFAULT '{}',
  series_id UUID,
  episode_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for efficient feed queries
CREATE INDEX idx_activity_feed_user_id ON public.activity_feed(user_id);
CREATE INDEX idx_activity_feed_created_at ON public.activity_feed(created_at DESC);
CREATE INDEX idx_activity_feed_user_created ON public.activity_feed(user_id, created_at DESC);
CREATE INDEX idx_activity_feed_type ON public.activity_feed(activity_type);
CREATE INDEX idx_activity_feed_series ON public.activity_feed(series_id) WHERE series_id IS NOT NULL;

-- CONVERSATIONS TABLE
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT
);

-- Index for sorting by recent activity
CREATE INDEX idx_conversations_last_message ON public.conversations(last_message_at DESC NULLS LAST);

-- CONVERSATION PARTICIPANTS TABLE
CREATE TABLE public.conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (conversation_id, user_id)
);

-- Indexes for efficient lookups
CREATE INDEX idx_conversation_participants_user ON public.conversation_participants(user_id);
CREATE INDEX idx_conversation_participants_conversation ON public.conversation_participants(conversation_id);

-- MESSAGES TABLE
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient message retrieval
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_conversation_created ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);

-- =====================================================
-- STEP 2: ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 3: CREATE ALL POLICIES (after all tables exist)
-- =====================================================

-- Activity Feed Policies
CREATE POLICY "Users can view followed users activity"
  ON public.activity_feed
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.user_follows
      WHERE follower_id = auth.uid()
      AND following_id = user_id
    )
  );

CREATE POLICY "System can insert activity"
  ON public.activity_feed
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete own activity"
  ON public.activity_feed
  FOR DELETE
  USING (auth.uid() = user_id);

-- Conversations Policies
CREATE POLICY "Participants can view conversations"
  ON public.conversations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants
      WHERE conversation_id = id
      AND user_id = auth.uid()
    )
  );

-- Conversation Participants Policies
CREATE POLICY "Users can view own participant records"
  ON public.conversation_participants
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view conversation participants"
  ON public.conversation_participants
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = conversation_participants.conversation_id
      AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own participant record"
  ON public.conversation_participants
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert participants"
  ON public.conversation_participants
  FOR INSERT
  WITH CHECK (true);

-- Messages Policies
CREATE POLICY "Participants can view messages"
  ON public.messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants
      WHERE conversation_id = messages.conversation_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Participants can send messages"
  ON public.messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.conversation_participants
      WHERE conversation_id = messages.conversation_id
      AND user_id = auth.uid()
    )
  );

-- =====================================================
-- STEP 4: CREATE HELPER FUNCTIONS
-- =====================================================

-- Check if users can message each other (mutuals)
CREATE OR REPLACE FUNCTION can_message_user(sender_id UUID, recipient_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if they are mutual followers
  RETURN EXISTS (
    SELECT 1 FROM public.user_follows f1
    INNER JOIN public.user_follows f2
      ON f1.follower_id = f2.following_id
      AND f1.following_id = f2.follower_id
    WHERE f1.follower_id = sender_id
    AND f1.following_id = recipient_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get or create conversation between two users
CREATE OR REPLACE FUNCTION get_or_create_conversation(user1_id UUID, user2_id UUID)
RETURNS UUID AS $$
DECLARE
  v_conversation_id UUID;
BEGIN
  -- Try to find existing conversation
  SELECT cp1.conversation_id INTO v_conversation_id
  FROM public.conversation_participants cp1
  INNER JOIN public.conversation_participants cp2
    ON cp1.conversation_id = cp2.conversation_id
  WHERE cp1.user_id = user1_id
  AND cp2.user_id = user2_id
  LIMIT 1;

  -- If not found, create new conversation
  IF v_conversation_id IS NULL THEN
    INSERT INTO public.conversations DEFAULT VALUES
    RETURNING id INTO v_conversation_id;

    -- Add both participants
    INSERT INTO public.conversation_participants (conversation_id, user_id)
    VALUES
      (v_conversation_id, user1_id),
      (v_conversation_id, user2_id);
  END IF;

  RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 5: CREATE TRIGGERS
-- =====================================================

-- Update conversation on new message
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET
    updated_at = NOW(),
    last_message_at = NEW.created_at,
    last_message_preview = LEFT(NEW.content, 100)
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_conversation_on_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_on_message();

-- Create activity entry helper function
CREATE OR REPLACE FUNCTION create_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_data JSONB DEFAULT '{}',
  p_series_id UUID DEFAULT NULL,
  p_episode_id UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_activity_id UUID;
BEGIN
  INSERT INTO public.activity_feed (user_id, activity_type, data, series_id, episode_id)
  VALUES (p_user_id, p_activity_type, p_data, p_series_id, p_episode_id)
  RETURNING id INTO v_activity_id;

  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
