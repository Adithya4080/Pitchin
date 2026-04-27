-- Add image_url column to pitches table
ALTER TABLE public.pitches ADD COLUMN image_url text;

-- Create storage bucket for pitch images
INSERT INTO storage.buckets (id, name, public) VALUES ('pitch-images', 'pitch-images', true);

-- Allow authenticated users to upload images
CREATE POLICY "Users can upload pitch images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'pitch-images' AND auth.uid() IS NOT NULL);

-- Allow public read access to pitch images
CREATE POLICY "Pitch images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'pitch-images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete own pitch images"
ON storage.objects FOR DELETE
USING (bucket_id = 'pitch-images' AND auth.uid()::text = (storage.foldername(name))[1]);