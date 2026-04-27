-- Add RLS policy to allow reading profiles via valid share token
CREATE POLICY "Allow public read via valid share token"
ON public.profiles
FOR SELECT
USING (
  -- Check if there's a valid share token for this profile
  -- Uses the security definer function to bypass profile_shares RLS
  public.validate_profile_share_token(id, (current_setting('request.headers', true)::json->>'x-share-token')::uuid)
);

-- Add policy for innovator_profiles
CREATE POLICY "Allow public read via valid share token"
ON public.innovator_profiles
FOR SELECT
USING (
  public.validate_profile_share_token(user_id, (current_setting('request.headers', true)::json->>'x-share-token')::uuid)
);

-- Add policy for startup_profiles
CREATE POLICY "Allow public read via valid share token"
ON public.startup_profiles
FOR SELECT
USING (
  public.validate_profile_share_token(user_id, (current_setting('request.headers', true)::json->>'x-share-token')::uuid)
);

-- Add policy for investor_profiles
CREATE POLICY "Allow public read via valid share token"
ON public.investor_profiles
FOR SELECT
USING (
  public.validate_profile_share_token(user_id, (current_setting('request.headers', true)::json->>'x-share-token')::uuid)
);

-- Add policy for consultant_profiles
CREATE POLICY "Allow public read via valid share token"
ON public.consultant_profiles
FOR SELECT
USING (
  public.validate_profile_share_token(user_id, (current_setting('request.headers', true)::json->>'x-share-token')::uuid)
);

-- Add policy for user_roles (needed to get user role)
CREATE POLICY "Allow public read via valid share token"
ON public.user_roles
FOR SELECT
USING (
  public.validate_profile_share_token(user_id, (current_setting('request.headers', true)::json->>'x-share-token')::uuid)
);

-- Add policy for profile_pitches (published ones for shared view)
CREATE POLICY "Allow public read published pitches via share token"
ON public.profile_pitches
FOR SELECT
USING (
  status = 'published' AND
  public.validate_profile_share_token(user_id, (current_setting('request.headers', true)::json->>'x-share-token')::uuid)
);

-- Add policy for pitches (active ones for shared view)
CREATE POLICY "Allow public read active pitches via share token"
ON public.pitches
FOR SELECT
USING (
  is_active = true AND expires_at > now() AND
  public.validate_profile_share_token(user_id, (current_setting('request.headers', true)::json->>'x-share-token')::uuid)
);