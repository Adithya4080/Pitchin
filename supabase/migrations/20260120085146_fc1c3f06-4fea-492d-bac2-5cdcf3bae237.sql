-- Create storage bucket for intro thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('intro-thumbnails', 'intro-thumbnails', true);

-- Allow authenticated users to upload thumbnails
CREATE POLICY "Authenticated users can upload intro thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'intro-thumbnails' 
  AND auth.uid() IS NOT NULL
);

-- Allow public access to view thumbnails
CREATE POLICY "Public can view intro thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'intro-thumbnails');

-- Allow users to update their own thumbnails
CREATE POLICY "Users can update own intro thumbnails"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'intro-thumbnails' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own thumbnails
CREATE POLICY "Users can delete own intro thumbnails"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'intro-thumbnails' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);