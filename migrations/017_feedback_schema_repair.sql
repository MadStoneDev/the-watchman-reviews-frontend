-- Migration: Feedback Schema Repair
-- Description: Complete repair for feedback table - adds is_seen and reaction columns

-- Add is_seen column if it doesn't exist
ALTER TABLE public.user_media_feedback
ADD COLUMN IF NOT EXISTS is_seen BOOLEAN DEFAULT FALSE;

-- Add reaction column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'user_media_feedback'
        AND column_name = 'reaction'
    ) THEN
        ALTER TABLE public.user_media_feedback
        ADD COLUMN reaction TEXT CHECK (reaction IN ('liked', 'loved', 'disliked'));
    END IF;
END $$;

-- Migrate existing data if feedback_type column exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'user_media_feedback'
        AND column_name = 'feedback_type'
    ) THEN
        -- Set is_seen = true for 'seen' feedback
        UPDATE public.user_media_feedback
        SET is_seen = TRUE
        WHERE feedback_type = 'seen';

        -- Copy reactions
        UPDATE public.user_media_feedback
        SET reaction = feedback_type
        WHERE feedback_type IN ('liked', 'loved', 'disliked');

        -- Mark items with reactions as seen
        UPDATE public.user_media_feedback
        SET is_seen = TRUE
        WHERE reaction IS NOT NULL;

        -- Drop the old column
        ALTER TABLE public.user_media_feedback
        DROP COLUMN feedback_type;
    END IF;
END $$;

-- Fix constraint - drop old one if exists and ensure new one exists
ALTER TABLE public.user_media_feedback
DROP CONSTRAINT IF EXISTS user_media_feedback_unique;

-- Ensure unique constraint exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'user_media_feedback_user_media_unique'
        AND conrelid = 'public.user_media_feedback'::regclass
    ) THEN
        ALTER TABLE public.user_media_feedback
        ADD CONSTRAINT user_media_feedback_user_media_unique
        UNIQUE (user_id, tmdb_id, media_type);
    END IF;
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END $$;
