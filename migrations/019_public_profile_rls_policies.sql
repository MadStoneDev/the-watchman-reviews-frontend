-- Migration: Public Profile RLS Policies
-- Description: Adds RLS policies to allow public viewing of episode_watches and reel_deck
-- for users with public profiles. This fixes the issue where stats show 0 for
-- unauthenticated users viewing public profiles.
--
-- Run this AFTER 018_feedback_add_media_id.sql

-- =====================================================
-- EPISODE_WATCHES: Allow public viewing for public profiles
-- =====================================================
-- This policy allows anyone (including anonymous users) to view episode_watches
-- for users who have set their profile_visibility to 'public' or not set at all (default public)

CREATE POLICY "Anyone can view episode watches for public profiles"
ON public.episode_watches
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = episode_watches.user_id
    AND (
      p.settings IS NULL
      OR p.settings->>'profile_visibility' IS NULL
      OR p.settings->>'profile_visibility' = 'public'
    )
  )
);

-- =====================================================
-- REEL_DECK: Allow public viewing for public profiles
-- =====================================================
-- This policy allows anyone to view reel_deck items for users with public profiles

CREATE POLICY "Anyone can view reel deck for public profiles"
ON public.reel_deck
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = reel_deck.user_id
    AND (
      p.settings IS NULL
      OR p.settings->>'profile_visibility' IS NULL
      OR p.settings->>'profile_visibility' = 'public'
    )
  )
);

-- =====================================================
-- Notes:
-- =====================================================
-- 1. These policies only allow SELECT (read) access, not INSERT/UPDATE/DELETE
-- 2. Data is only visible for users with public profiles (default behavior)
-- 3. Users with 'followers_only' or 'private' profiles will NOT have their
--    episode_watches or reel_deck visible to the public
-- 4. The user_series_stats VIEW will automatically work once these policies
--    are in place, since it joins reel_deck and episode_watches
