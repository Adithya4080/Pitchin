-- Create profile_pitches table for Innovator/Startup pitch summaries
CREATE TABLE public.profile_pitches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profile_pitches ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view published profile pitches"
ON public.profile_pitches
FOR SELECT
USING (status = 'published' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view own profile pitches"
ON public.profile_pitches
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own profile pitches"
ON public.profile_pitches
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile pitches"
ON public.profile_pitches
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile pitches"
ON public.profile_pitches
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_profile_pitches_updated_at
BEFORE UPDATE ON public.profile_pitches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();