-- Fix the security definer view issue
DROP VIEW IF EXISTS public.pitches_public;

-- Create view with SECURITY INVOKER (respects the caller's permissions)
CREATE VIEW public.pitches_public
WITH (security_invoker = true)
AS
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
FROM public.pitches;

-- Grant access to the view for authenticated users
GRANT SELECT ON public.pitches_public TO authenticated;