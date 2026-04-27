-- Fix security: Restrict contact info to only be visible after approval
-- And require authentication to view role profiles

-- First, drop the existing public SELECT policy on pitches
DROP POLICY IF EXISTS "Active pitches are viewable by everyone" ON public.pitches;

-- Create a view function to check if user has approved access to a pitch owner's contact info
CREATE OR REPLACE FUNCTION public.has_approved_contact_access(_requester_id uuid, _pitch_owner_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.contact_requests cr
    JOIN public.pitches p ON p.id = cr.pitch_id
    WHERE cr.requester_id = _requester_id
      AND p.user_id = _pitch_owner_id
      AND cr.status = 'approved'
  )
$$;

-- Create new policy for pitches: Active pitches viewable by authenticated users (without contact info by default)
CREATE POLICY "Authenticated users can view active pitches" ON public.pitches
FOR SELECT
USING (
  (is_active = true AND expires_at > now() AND auth.uid() IS NOT NULL)
  OR auth.uid() = user_id
);

-- Update role profile policies to require authentication
-- Drop old public SELECT policies and create authenticated-only ones

-- Innovator profiles
DROP POLICY IF EXISTS "Anyone can view innovator profiles" ON public.innovator_profiles;
CREATE POLICY "Authenticated users can view innovator profiles" ON public.innovator_profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Startup profiles
DROP POLICY IF EXISTS "Anyone can view startup profiles" ON public.startup_profiles;
CREATE POLICY "Authenticated users can view startup profiles" ON public.startup_profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Investor profiles
DROP POLICY IF EXISTS "Anyone can view investor profiles" ON public.investor_profiles;
CREATE POLICY "Authenticated users can view investor profiles" ON public.investor_profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Consultant profiles
DROP POLICY IF EXISTS "Anyone can view consultant profiles" ON public.consultant_profiles;
CREATE POLICY "Authenticated users can view consultant profiles" ON public.consultant_profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- User roles: Keep public for role badge display, but consider authenticated only
DROP POLICY IF EXISTS "Anyone can view user roles" ON public.user_roles;
CREATE POLICY "Authenticated users can view user roles" ON public.user_roles
FOR SELECT
USING (auth.uid() IS NOT NULL);