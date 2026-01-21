-- Migration: Feedback Achievements
-- Description: Adds achievement definitions for user feedback milestones

-- =====================================================
-- INSERT FEEDBACK ACHIEVEMENTS
-- =====================================================

-- First feedback achievement
INSERT INTO public.achievement_definitions (id, name, description, icon, category, tier, threshold)
VALUES
  ('first_feedback', 'Critic''s Voice', 'Rated your first movie or TV show', 'IconStar', 'engagement', 'bronze', 1)
ON CONFLICT (id) DO NOTHING;

-- Feedback count milestones
INSERT INTO public.achievement_definitions (id, name, description, icon, category, tier, threshold)
VALUES
  ('feedback_10', 'Taste Maker', 'Rated 10 movies or TV shows', 'IconThumbUp', 'engagement', 'bronze', 10),
  ('feedback_25', 'Opinion Leader', 'Rated 25 movies or TV shows', 'IconThumbUp', 'engagement', 'silver', 25),
  ('feedback_50', 'Culture Curator', 'Rated 50 movies or TV shows', 'IconThumbUp', 'engagement', 'silver', 50),
  ('feedback_100', 'Master Critic', 'Rated 100 movies or TV shows', 'IconThumbUp', 'engagement', 'gold', 100),
  ('feedback_250', 'Entertainment Expert', 'Rated 250 movies or TV shows', 'IconThumbUp', 'engagement', 'platinum', 250)
ON CONFLICT (id) DO NOTHING;

-- Love-specific achievements
INSERT INTO public.achievement_definitions (id, name, description, icon, category, tier, threshold)
VALUES
  ('first_love', 'Found a Gem', 'Marked your first title as "Loved"', 'IconHeart', 'engagement', 'bronze', 1),
  ('loved_10', 'Passionate Fan', 'Loved 10 movies or TV shows', 'IconHeart', 'engagement', 'silver', 10),
  ('loved_25', 'True Romantic', 'Loved 25 movies or TV shows', 'IconHeart', 'engagement', 'gold', 25)
ON CONFLICT (id) DO NOTHING;

-- Seen/watched achievements
INSERT INTO public.achievement_definitions (id, name, description, icon, category, tier, threshold)
VALUES
  ('seen_50', 'Experienced Viewer', 'Marked 50 titles as seen', 'IconEye', 'watching', 'silver', 50),
  ('seen_100', 'Seasoned Watcher', 'Marked 100 titles as seen', 'IconEye', 'watching', 'gold', 100),
  ('seen_250', 'Cinema Veteran', 'Marked 250 titles as seen', 'IconEye', 'watching', 'platinum', 250)
ON CONFLICT (id) DO NOTHING;

-- Balanced feedback achievement
INSERT INTO public.achievement_definitions (id, name, description, icon, category, tier, threshold)
VALUES
  ('balanced_critic', 'Balanced Critic', 'Gave both positive and negative feedback (at least 5 each)', 'IconScale', 'engagement', 'silver', NULL)
ON CONFLICT (id) DO NOTHING;
