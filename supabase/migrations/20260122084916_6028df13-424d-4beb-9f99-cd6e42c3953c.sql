-- Add portfolio columns to startup_profiles table
ALTER TABLE public.startup_profiles
ADD COLUMN IF NOT EXISTS company_snapshot text,
ADD COLUMN IF NOT EXISTS market_type text,
ADD COLUMN IF NOT EXISTS founded_year text,
ADD COLUMN IF NOT EXISTS operating_status text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS company_background text,
ADD COLUMN IF NOT EXISTS vision_direction text,
ADD COLUMN IF NOT EXISTS current_focus text,
ADD COLUMN IF NOT EXISTS progress_highlights text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ecosystem_support jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS company_journey_timeline jsonb DEFAULT '[]';