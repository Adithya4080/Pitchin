-- Add alumni_startups column to ecosystem_partner_profiles
ALTER TABLE public.ecosystem_partner_profiles
ADD COLUMN IF NOT EXISTS alumni_startups jsonb DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.ecosystem_partner_profiles.alumni_startups IS 'Array of notable alumni startups: [{startup_name, logo_url, short_description, status_tag, external_link}]';