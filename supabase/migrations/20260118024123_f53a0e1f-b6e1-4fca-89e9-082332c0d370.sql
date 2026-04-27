-- Add introduction video fields to innovator_profiles
ALTER TABLE public.innovator_profiles
ADD COLUMN IF NOT EXISTS intro_video_url TEXT,
ADD COLUMN IF NOT EXISTS intro_video_title TEXT DEFAULT 'Introduction',
ADD COLUMN IF NOT EXISTS intro_video_description TEXT;

-- Add introduction video fields to startup_profiles
ALTER TABLE public.startup_profiles
ADD COLUMN IF NOT EXISTS intro_video_url TEXT,
ADD COLUMN IF NOT EXISTS intro_video_title TEXT DEFAULT 'Introduction',
ADD COLUMN IF NOT EXISTS intro_video_description TEXT;

-- Create storage bucket for introduction videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'intro-videos',
  'intro-videos',
  true,
  52428800, -- 50MB limit
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for intro-videos bucket
CREATE POLICY "Users can upload their own intro videos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'intro-videos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own intro videos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'intro-videos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own intro videos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'intro-videos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Intro videos are publicly viewable"
ON storage.objects
FOR SELECT
USING (bucket_id = 'intro-videos');