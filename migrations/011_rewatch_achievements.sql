-- Migration: Rewatch Achievements
-- Description: Adds achievement definitions for series rewatch milestones

-- =====================================================
-- INSERT REWATCH ACHIEVEMENT DEFINITIONS
-- =====================================================
INSERT INTO public.achievement_definitions (id, name, description, icon, category, tier, threshold) VALUES
  -- Rewatch Achievements (per series rewatches)
  ('first_rewatch', 'Encore!', 'Started your first rewatch of a series', 'refresh', 'watching', 'bronze', 1),
  ('rewatches_5', 'Repeat Viewer', 'Started 5 rewatches across all series', 'refresh', 'watching', 'bronze', 5),
  ('rewatches_10', 'Comfort Seeker', 'Started 10 rewatches across all series', 'refresh', 'watching', 'silver', 10),
  ('rewatches_25', 'Nostalgic', 'Started 25 rewatches across all series', 'refresh', 'watching', 'gold', 25),
  ('rewatches_50', 'Eternal Fan', 'Started 50 rewatches across all series', 'refresh', 'watching', 'platinum', 50),

  -- Dedicated fan achievements (same series rewatched multiple times)
  ('series_rewatch_3', 'Dedicated Fan', 'Rewatched the same series 3 times', 'heart', 'watching', 'silver', 3),
  ('series_rewatch_5', 'Superfan', 'Rewatched the same series 5 times', 'heart', 'watching', 'gold', 5),
  ('series_rewatch_10', 'Obsessed', 'Rewatched the same series 10 times', 'heart', 'watching', 'platinum', 10)
ON CONFLICT (id) DO NOTHING;
