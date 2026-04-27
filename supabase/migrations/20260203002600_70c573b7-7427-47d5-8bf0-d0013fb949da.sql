-- Add new fields to ecosystem_partner_profiles for Organization Overview section
ALTER TABLE public.ecosystem_partner_profiles
ADD COLUMN IF NOT EXISTS founded_year TEXT,
ADD COLUMN IF NOT EXISTS headquarters TEXT,
ADD COLUMN IF NOT EXISTS mission_statement TEXT,
ADD COLUMN IF NOT EXISTS focus_areas TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS sectors TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS engagement_type TEXT,
ADD COLUMN IF NOT EXISTS program_duration TEXT,
ADD COLUMN IF NOT EXISTS equity_model TEXT,
ADD COLUMN IF NOT EXISTS partnerships JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS startups_supported_count INTEGER,
ADD COLUMN IF NOT EXISTS years_active INTEGER,
ADD COLUMN IF NOT EXISTS global_alumni_reach TEXT;