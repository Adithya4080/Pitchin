-- Create profile_shares table for managing share links
CREATE TABLE public.profile_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  access_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profile_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Owners can view their own share settings
CREATE POLICY "Users can view own share settings"
ON public.profile_shares
FOR SELECT
USING (auth.uid() = user_id);

-- Owners can insert their own share settings
CREATE POLICY "Users can insert own share settings"
ON public.profile_shares
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Owners can update their own share settings
CREATE POLICY "Users can update own share settings"
ON public.profile_shares
FOR UPDATE
USING (auth.uid() = user_id);

-- Public can validate tokens (security definer function handles this)
-- No direct public SELECT policy needed

-- Create validation function for public access
CREATE OR REPLACE FUNCTION public.validate_profile_share_token(
  _user_id UUID,
  _access_token UUID
) RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profile_shares
    WHERE user_id = _user_id
      AND access_token = _access_token
      AND is_enabled = true
  )
$$;

-- Create function to get shared profile data (for public access)
CREATE OR REPLACE FUNCTION public.get_shared_profile(
  _user_id UUID,
  _access_token UUID
) RETURNS TABLE (
  is_valid BOOLEAN,
  user_role TEXT
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    CASE 
      WHEN ps.is_enabled = true AND ps.access_token = _access_token THEN true
      ELSE false
    END as is_valid,
    ur.role::TEXT as user_role
  FROM public.profile_shares ps
  LEFT JOIN public.user_roles ur ON ur.user_id = ps.user_id
  WHERE ps.user_id = _user_id
$$;

-- Add trigger for updated_at
CREATE TRIGGER update_profile_shares_updated_at
BEFORE UPDATE ON public.profile_shares
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();