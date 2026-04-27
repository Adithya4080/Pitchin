-- Create storage bucket for pitch/product attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pitch-attachments', 'pitch-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for the storage bucket
CREATE POLICY "Anyone can view pitch attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'pitch-attachments');

CREATE POLICY "Users can upload their own pitch attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pitch-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own pitch attachments"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'pitch-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own pitch attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pitch-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create attachments table to store metadata
CREATE TABLE public.pitch_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pitch_id UUID NOT NULL REFERENCES public.profile_pitches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'pdf')),
  title TEXT NOT NULL,
  description TEXT,
  file_size INTEGER NOT NULL,
  original_filename TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pitch_attachments ENABLE ROW LEVEL SECURITY;

-- Users can view attachments of published pitches or their own
CREATE POLICY "Users can view attachments of published pitches or own"
ON public.pitch_attachments FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND (
    -- Owner can always see
    auth.uid() = user_id
    OR
    -- Others can see if pitch is published
    EXISTS (
      SELECT 1 FROM public.profile_pitches 
      WHERE id = pitch_id AND status = 'published'
    )
  )
);

-- Users can create attachments for their own pitches
CREATE POLICY "Users can create attachments for own pitches"
ON public.pitch_attachments FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.profile_pitches 
    WHERE id = pitch_id AND user_id = auth.uid()
  )
);

-- Users can update their own attachments
CREATE POLICY "Users can update own attachments"
ON public.pitch_attachments FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own attachments
CREATE POLICY "Users can delete own attachments"
ON public.pitch_attachments FOR DELETE
USING (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE TRIGGER update_pitch_attachments_updated_at
BEFORE UPDATE ON public.pitch_attachments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();