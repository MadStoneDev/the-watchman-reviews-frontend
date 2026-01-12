-- Create comment_reactions table
CREATE TABLE IF NOT EXISTS comment_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL,
  user_id UUID NOT NULL,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one user can only have one reaction per comment
  UNIQUE(comment_id, user_id)
);

-- Create indexes for performance
CREATE INDEX idx_comment_reactions_comment_id ON comment_reactions(comment_id);
CREATE INDEX idx_comment_reactions_user_id ON comment_reactions(user_id);

-- Add RLS policies
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;

-- Anyone can read reactions
CREATE POLICY "Anyone can view comment reactions"
  ON comment_reactions FOR SELECT
  USING (true);

-- Users can insert their own reactions
CREATE POLICY "Users can add their own reactions"
  ON comment_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reactions
CREATE POLICY "Users can delete their own reactions"
  ON comment_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Users can update their own reactions
CREATE POLICY "Users can update their own reactions"
  ON comment_reactions FOR UPDATE
  USING (auth.uid() = user_id);
