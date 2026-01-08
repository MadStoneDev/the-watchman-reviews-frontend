-- Migration: Create collection_summaries view for optimized Collections page
-- This eliminates fetching all media items just to get first poster and count

-- Drop view if it exists (for idempotency)
DROP VIEW IF EXISTS collection_summaries CASCADE;

-- Create the view
CREATE VIEW collection_summaries AS
SELECT DISTINCT ON (mc.collection_id)
  mc.collection_id,
  COUNT(*) OVER (PARTITION BY mc.collection_id) as item_count,
  mc.media_id as first_media_id,
  mc.media_type as first_media_type
FROM medias_collections mc
ORDER BY mc.collection_id, mc.position ASC;

-- Add comment for documentation
COMMENT ON VIEW collection_summaries IS 'Pre-calculated collection summaries with first media item and total count. Used to optimize Collections page performance.';

-- Optional: Create index for better view performance
CREATE INDEX IF NOT EXISTS idx_medias_collections_position
ON medias_collections(collection_id, position);

-- Optional: Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_medias_collections_media
ON medias_collections(media_id, media_type);
