-- Add banner_url column to profiles table
ALTER TABLE public.profiles ADD COLUMN banner_url text;

-- Create storage bucket for profile banners
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-banners', 'profile-banners', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own banner
CREATE POLICY "Users can upload own banner"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-banners' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow anyone to view banners (public bucket)
CREATE POLICY "Anyone can view banners"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-banners');

-- Allow users to update their own banner
CREATE POLICY "Users can update own banner"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile-banners' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own banner
CREATE POLICY "Users can delete own banner"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile-banners' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);