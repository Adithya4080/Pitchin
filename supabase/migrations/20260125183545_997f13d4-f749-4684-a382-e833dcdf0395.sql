-- Add team_members column to innovator_profiles table
-- Structure: array of objects with name, role, title, background, avatar_url, and social links
ALTER TABLE public.innovator_profiles 
ADD COLUMN IF NOT EXISTS team_members JSONB DEFAULT '[]'::jsonb;

-- Update startup_profiles team_members to support the enhanced structure
-- The existing team_members column already exists but we'll add a comment for documentation
COMMENT ON COLUMN public.startup_profiles.team_members IS 'Team members with structure: [{name, role, background, avatar_url, linkedin_url, github_url, twitter_url, website_url}]';

COMMENT ON COLUMN public.innovator_profiles.team_members IS 'Team members with structure: [{name, role, background, avatar_url, linkedin_url, github_url, twitter_url, website_url}]';