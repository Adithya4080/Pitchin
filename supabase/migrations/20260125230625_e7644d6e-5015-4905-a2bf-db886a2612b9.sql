-- Create table for storing shared profile visitor feedback
CREATE TABLE public.shared_profile_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_profile_id UUID NOT NULL,
  visitor_role TEXT,
  usefulness_response TEXT,
  feedback_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shared_profile_feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert feedback (no auth required for shared profiles)
CREATE POLICY "Anyone can submit feedback"
ON public.shared_profile_feedback
FOR INSERT
WITH CHECK (true);

-- Only profile owners can view feedback about their profile
CREATE POLICY "Profile owners can view their feedback"
ON public.shared_profile_feedback
FOR SELECT
USING (auth.uid() = source_profile_id);