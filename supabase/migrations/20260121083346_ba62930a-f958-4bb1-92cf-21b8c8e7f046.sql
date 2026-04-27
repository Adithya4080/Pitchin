-- Add portfolio fields to innovator_profiles table
ALTER TABLE public.innovator_profiles
ADD COLUMN IF NOT EXISTS professional_snapshot text,
ADD COLUMN IF NOT EXISTS focus_areas text[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS current_identity text,
ADD COLUMN IF NOT EXISTS experience_summary text,
ADD COLUMN IF NOT EXISTS background_journey text,
ADD COLUMN IF NOT EXISTS education jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS work_experience jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS skills_capabilities text[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS mentors_backers jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS journey_timeline jsonb DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.innovator_profiles.professional_snapshot IS 'Short paragraph describing who they are and what they work on';
COMMENT ON COLUMN public.innovator_profiles.focus_areas IS 'Tag-based skills or domains';
COMMENT ON COLUMN public.innovator_profiles.current_identity IS 'Optional label like Independent Innovator, Founder, Builder';
COMMENT ON COLUMN public.innovator_profiles.experience_summary IS '1-2 lines summarizing overall experience';
COMMENT ON COLUMN public.innovator_profiles.background_journey IS 'Free-text story, motivation, path into innovation';
COMMENT ON COLUMN public.innovator_profiles.education IS 'Array of {institution, field_of_study, duration}';
COMMENT ON COLUMN public.innovator_profiles.work_experience IS 'Array of {role, organization, description, time_period}';
COMMENT ON COLUMN public.innovator_profiles.skills_capabilities IS 'Skills, tools, domains as tags';
COMMENT ON COLUMN public.innovator_profiles.mentors_backers IS 'Array of {name, role, profile_link}';
COMMENT ON COLUMN public.innovator_profiles.journey_timeline IS 'Array of {year, milestone}';