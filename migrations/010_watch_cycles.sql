-- Migration: Watch Cycles System
-- Description: Creates watch_cycles table to track rewatches and viewing sessions
-- This enables tracking how many times a user has watched a series and their patterns

-- =====================================================
-- WATCH CYCLES TABLE
-- =====================================================
-- Tracks each viewing session/cycle of a series per user
-- cycle_number 1 = first watch, 2 = first rewatch, etc.

CREATE TABLE public.watch_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  series_id UUID NOT NULL REFERENCES public.series(id) ON DELETE CASCADE,
  cycle_number INTEGER NOT NULL DEFAULT 1,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ, -- NULL if in progress or abandoned
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  episodes_watched INTEGER DEFAULT 0,
  total_episodes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Each user can only have one cycle per number per series
  UNIQUE(user_id, series_id, cycle_number)
);

-- Indexes for common queries
CREATE INDEX idx_watch_cycles_user_id ON public.watch_cycles(user_id);
CREATE INDEX idx_watch_cycles_user_series ON public.watch_cycles(user_id, series_id);
CREATE INDEX idx_watch_cycles_status ON public.watch_cycles(user_id, status);
CREATE INDEX idx_watch_cycles_completed ON public.watch_cycles(user_id, completed_at DESC) WHERE completed_at IS NOT NULL;

-- Enable RLS
ALTER TABLE public.watch_cycles ENABLE ROW LEVEL SECURITY;

-- Users can view their own watch cycles
CREATE POLICY "Users can view own watch cycles"
  ON public.watch_cycles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own watch cycles
CREATE POLICY "Users can insert own watch cycles"
  ON public.watch_cycles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own watch cycles
CREATE POLICY "Users can update own watch cycles"
  ON public.watch_cycles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own watch cycles
CREATE POLICY "Users can delete own watch cycles"
  ON public.watch_cycles
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- ADD CYCLE_ID TO EPISODE_WATCHES
-- =====================================================
-- Links each episode watch to a specific viewing cycle
-- Nullable initially for backfill, future watches will have cycle_id

ALTER TABLE public.episode_watches
ADD COLUMN IF NOT EXISTS cycle_id UUID REFERENCES public.watch_cycles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_episode_watches_cycle_id ON public.episode_watches(cycle_id);

-- =====================================================
-- BACKFILL: Create cycle 1 for existing watch data
-- =====================================================
-- For every user/series combo that has episode watches,
-- create a watch_cycles record representing their first watch

INSERT INTO public.watch_cycles (
  user_id,
  series_id,
  cycle_number,
  started_at,
  episodes_watched,
  total_episodes,
  status,
  created_at,
  updated_at
)
SELECT
  ew.user_id,
  ew.series_id,
  1 as cycle_number,
  MIN(ew.watched_at) as started_at,
  COUNT(DISTINCT ew.episode_id) as episodes_watched,
  (SELECT COUNT(*) FROM public.episodes e WHERE e.series_id = ew.series_id) as total_episodes,
  CASE
    WHEN COUNT(DISTINCT ew.episode_id) = (SELECT COUNT(*) FROM public.episodes e WHERE e.series_id = ew.series_id)
    THEN 'completed'
    ELSE 'in_progress'
  END as status,
  MIN(ew.created_at) as created_at,
  MAX(ew.watched_at) as updated_at
FROM public.episode_watches ew
GROUP BY ew.user_id, ew.series_id
ON CONFLICT (user_id, series_id, cycle_number) DO NOTHING;

-- =====================================================
-- BACKFILL: Link existing episode watches to cycle 1
-- =====================================================

UPDATE public.episode_watches ew
SET cycle_id = wc.id
FROM public.watch_cycles wc
WHERE ew.user_id = wc.user_id
  AND ew.series_id = wc.series_id
  AND wc.cycle_number = 1
  AND ew.cycle_id IS NULL;

-- =====================================================
-- BACKFILL: Set completed_at for finished cycles
-- =====================================================

UPDATE public.watch_cycles wc
SET completed_at = (
  SELECT MAX(ew.watched_at)
  FROM public.episode_watches ew
  WHERE ew.user_id = wc.user_id
    AND ew.series_id = wc.series_id
)
WHERE wc.status = 'completed'
  AND wc.completed_at IS NULL;

-- =====================================================
-- HELPER FUNCTION: Get current cycle for user/series
-- =====================================================

CREATE OR REPLACE FUNCTION get_current_watch_cycle(
  p_user_id UUID,
  p_series_id UUID
) RETURNS TABLE (
  cycle_id UUID,
  cycle_number INTEGER,
  status TEXT,
  started_at TIMESTAMPTZ,
  episodes_watched INTEGER,
  total_episodes INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    wc.id,
    wc.cycle_number,
    wc.status,
    wc.started_at,
    wc.episodes_watched,
    wc.total_episodes
  FROM public.watch_cycles wc
  WHERE wc.user_id = p_user_id
    AND wc.series_id = p_series_id
  ORDER BY wc.cycle_number DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- HELPER FUNCTION: Start a new rewatch cycle
-- =====================================================

CREATE OR REPLACE FUNCTION start_rewatch_cycle(
  p_user_id UUID,
  p_series_id UUID
) RETURNS UUID AS $$
DECLARE
  v_current_cycle_number INTEGER;
  v_new_cycle_id UUID;
  v_total_episodes INTEGER;
BEGIN
  -- Get current max cycle number
  SELECT COALESCE(MAX(cycle_number), 0) INTO v_current_cycle_number
  FROM public.watch_cycles
  WHERE user_id = p_user_id AND series_id = p_series_id;

  -- Get total episodes for the series
  SELECT COUNT(*) INTO v_total_episodes
  FROM public.episodes
  WHERE series_id = p_series_id;

  -- Mark current cycle as completed if it exists and is in progress
  UPDATE public.watch_cycles
  SET status = 'completed',
      completed_at = NOW(),
      updated_at = NOW()
  WHERE user_id = p_user_id
    AND series_id = p_series_id
    AND status = 'in_progress';

  -- Create new cycle
  INSERT INTO public.watch_cycles (
    user_id,
    series_id,
    cycle_number,
    started_at,
    status,
    episodes_watched,
    total_episodes
  )
  VALUES (
    p_user_id,
    p_series_id,
    v_current_cycle_number + 1,
    NOW(),
    'in_progress',
    0,
    v_total_episodes
  )
  RETURNING id INTO v_new_cycle_id;

  -- Delete old episode watches (user starts fresh)
  DELETE FROM public.episode_watches
  WHERE user_id = p_user_id AND series_id = p_series_id;

  RETURN v_new_cycle_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGER: Update watch cycle on episode watch
-- =====================================================
-- When an episode is marked as watched, update the cycle's episode count

CREATE OR REPLACE FUNCTION update_watch_cycle_on_episode_watch()
RETURNS TRIGGER AS $$
DECLARE
  v_cycle_id UUID;
  v_total_episodes INTEGER;
  v_watched_count INTEGER;
BEGIN
  -- Get or create current cycle
  SELECT id INTO v_cycle_id
  FROM public.watch_cycles
  WHERE user_id = NEW.user_id
    AND series_id = NEW.series_id
    AND status = 'in_progress'
  ORDER BY cycle_number DESC
  LIMIT 1;

  -- If no active cycle exists, create cycle 1
  IF v_cycle_id IS NULL THEN
    SELECT COUNT(*) INTO v_total_episodes
    FROM public.episodes
    WHERE series_id = NEW.series_id;

    INSERT INTO public.watch_cycles (user_id, series_id, cycle_number, total_episodes)
    VALUES (NEW.user_id, NEW.series_id, 1, v_total_episodes)
    RETURNING id INTO v_cycle_id;
  END IF;

  -- Update the episode watch with the cycle_id
  NEW.cycle_id := v_cycle_id;

  -- Update episode count on the cycle
  SELECT COUNT(DISTINCT episode_id) INTO v_watched_count
  FROM public.episode_watches
  WHERE user_id = NEW.user_id
    AND series_id = NEW.series_id
    AND cycle_id = v_cycle_id;

  -- Add 1 for the current insert
  v_watched_count := v_watched_count + 1;

  -- Get total episodes
  SELECT total_episodes INTO v_total_episodes
  FROM public.watch_cycles
  WHERE id = v_cycle_id;

  -- Update the cycle
  UPDATE public.watch_cycles
  SET episodes_watched = v_watched_count,
      updated_at = NOW(),
      status = CASE WHEN v_watched_count >= v_total_episodes THEN 'completed' ELSE 'in_progress' END,
      completed_at = CASE WHEN v_watched_count >= v_total_episodes THEN NOW() ELSE NULL END
  WHERE id = v_cycle_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_watch_cycle
  BEFORE INSERT ON public.episode_watches
  FOR EACH ROW
  EXECUTE FUNCTION update_watch_cycle_on_episode_watch();

-- =====================================================
-- TRIGGER: Decrement count when episode unwatched
-- =====================================================

CREATE OR REPLACE FUNCTION update_watch_cycle_on_episode_unwatch()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrement episode count on the cycle
  IF OLD.cycle_id IS NOT NULL THEN
    UPDATE public.watch_cycles
    SET episodes_watched = GREATEST(0, episodes_watched - 1),
        updated_at = NOW(),
        status = 'in_progress',
        completed_at = NULL
    WHERE id = OLD.cycle_id;
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_watch_cycle_on_delete
  AFTER DELETE ON public.episode_watches
  FOR EACH ROW
  EXECUTE FUNCTION update_watch_cycle_on_episode_unwatch();
