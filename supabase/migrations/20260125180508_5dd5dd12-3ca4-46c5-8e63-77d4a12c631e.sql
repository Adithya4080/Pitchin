-- Add new fields to profile_pitches table for comprehensive pitch details
ALTER TABLE public.profile_pitches
ADD COLUMN IF NOT EXISTS short_summary TEXT,
ADD COLUMN IF NOT EXISTS problem_statement TEXT,
ADD COLUMN IF NOT EXISTS solution_overview TEXT,
ADD COLUMN IF NOT EXISTS target_users TEXT,
ADD COLUMN IF NOT EXISTS current_stage TEXT DEFAULT 'idea',
ADD COLUMN IF NOT EXISTS supporting_materials JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS open_considerations TEXT,
ADD COLUMN IF NOT EXISTS looking_for TEXT[];

-- Add a comment explaining the current_stage enum values
COMMENT ON COLUMN public.profile_pitches.current_stage IS 'Values: idea, research, mvp, early_validation';