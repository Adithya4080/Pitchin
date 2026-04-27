-- Add thumbnail URL columns to innovator_profiles and startup_profiles
ALTER TABLE public.innovator_profiles
ADD COLUMN intro_video_thumbnail_url TEXT;

ALTER TABLE public.startup_profiles
ADD COLUMN intro_video_thumbnail_url TEXT;