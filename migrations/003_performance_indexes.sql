-- Migration: Add performance indexes for authenticated pages
-- These indexes optimize common query patterns

-- Index for faster profile lookups by username
CREATE INDEX IF NOT EXISTS idx_profiles_username
ON profiles(username);

-- Index for faster reel deck queries
CREATE INDEX IF NOT EXISTS idx_reel_deck_user_status
ON reel_deck(user_id, status, last_watched_at DESC);

CREATE INDEX IF NOT EXISTS idx_reel_deck_media_type
ON reel_deck(user_id, media_type);

-- Index for faster collection queries
CREATE INDEX IF NOT EXISTS idx_collections_owner_public
ON collections(owner, is_public);

CREATE INDEX IF NOT EXISTS idx_shared_collection_user
ON shared_collection(user_id, collection_id);

-- Index for faster episode lookups
CREATE INDEX IF NOT EXISTS idx_episodes_series_id
ON episodes(series_id);

-- Composite index for episode watches
CREATE INDEX IF NOT EXISTS idx_episode_watches_composite
ON episode_watches(user_id, episode_id, series_id);

-- Index for movies and series by ID (for batch queries)
CREATE INDEX IF NOT EXISTS idx_movies_id
ON movies(id);

CREATE INDEX IF NOT EXISTS idx_series_id
ON series(id);

-- Add statistics refresh for better query planning
ANALYZE profiles;
ANALYZE reel_deck;
ANALYZE collections;
ANALYZE episodes;
ANALYZE episode_watches;
ANALYZE medias_collections;
