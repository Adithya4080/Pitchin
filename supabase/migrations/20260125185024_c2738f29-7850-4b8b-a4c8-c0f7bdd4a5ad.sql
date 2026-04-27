-- Create storage bucket for team member avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-avatars', 'team-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for authenticated users to upload their own team avatars
CREATE POLICY "Users can upload team avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'team-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Create policy for authenticated users to update their own team avatars
CREATE POLICY "Users can update their own team avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'team-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Create policy for authenticated users to delete their own team avatars
CREATE POLICY "Users can delete their own team avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'team-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Create policy for public read access to team avatars
CREATE POLICY "Team avatars are publicly accessible"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'team-avatars');