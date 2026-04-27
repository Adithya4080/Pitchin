-- Fix remaining security issues

-- 1. Prevent contact_requests UPDATE manipulation by requesters
-- Add explicit policy that only allows pitch owners to update request status
DROP POLICY IF EXISTS "Pitch owners can update requests" ON public.contact_requests;
CREATE POLICY "Only pitch owners can update request status" ON public.contact_requests
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM pitches 
    WHERE pitches.id = contact_requests.pitch_id 
    AND pitches.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM pitches 
    WHERE pitches.id = contact_requests.pitch_id 
    AND pitches.user_id = auth.uid()
  )
);

-- 2. Create a view that hides contact info from pitches by default
-- Users will use the get_pitch_contact_info function to get contact info when they have access
CREATE OR REPLACE VIEW public.pitches_public AS
SELECT 
  id,
  user_id,
  pitch_statement,
  supporting_line,
  image_url,
  category,
  contact_visibility,
  created_at,
  expires_at,
  is_active,
  save_count,
  reaction_count
  -- Intentionally NOT including contact_email and contact_linkedin
FROM public.pitches;

-- Grant access to the view for authenticated users
GRANT SELECT ON public.pitches_public TO authenticated;