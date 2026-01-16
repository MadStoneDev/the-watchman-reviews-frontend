-- Migration: Remove movie achievements (we only track TV shows)
-- Run this AFTER 006_notifications_and_achievements.sql

-- Delete movie achievement definitions (this will cascade delete any user_achievements)
DELETE FROM public.achievement_definitions
WHERE id IN (
  'first_movie',
  'watched_10_movies',
  'watched_50_movies',
  'watched_100_movies',
  'watched_500_movies'
);

-- Add any missing TV achievements (in case 006 was run before this update)
INSERT INTO public.achievement_definitions (id, name, description, icon, category, tier, threshold) VALUES
  ('watched_250_shows', 'TV Legend', 'Watched 250 TV shows', 'tv', 'watching', 'platinum', 250),
  ('watched_5000_episodes', 'Screen Legend', 'Watched 5000 episodes', 'play', 'watching', 'platinum', 5000)
ON CONFLICT (id) DO NOTHING;
