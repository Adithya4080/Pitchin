-- Create storage bucket for supported startup logos
INSERT INTO storage.buckets (id, name, public) VALUES ('startup-logos', 'startup-logos', true);

-- Allow public read access
CREATE POLICY "Startup logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'startup-logos');

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload their own startup logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'startup-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update their own startup logos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'startup-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete their own startup logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'startup-logos' AND auth.uid()::text = (storage.foldername(name))[1]);