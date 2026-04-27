-- Add leadership_voices column to ecosystem_partner_profiles table
ALTER TABLE public.ecosystem_partner_profiles
ADD COLUMN leadership_voices JSONB DEFAULT '[]'::jsonb;