-- Create a comprehensive RPC function to fetch shared profile data
-- This uses SECURITY DEFINER to bypass RLS for valid share tokens

CREATE OR REPLACE FUNCTION public.get_full_shared_profile(
  _user_id uuid, 
  _access_token uuid
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
  is_valid boolean;
  user_role_value text;
  profile_data jsonb;
  role_profile_data jsonb;
  profile_pitches_data jsonb;
  user_pitches_data jsonb;
  stats_data jsonb;
BEGIN
  -- First validate the token
  SELECT 
    CASE WHEN ps.is_enabled = true AND ps.access_token = _access_token THEN true ELSE false END,
    ur.role::TEXT
  INTO is_valid, user_role_value
  FROM public.profile_shares ps
  LEFT JOIN public.user_roles ur ON ur.user_id = ps.user_id
  WHERE ps.user_id = _user_id;
  
  -- If invalid, return early
  IF NOT is_valid OR is_valid IS NULL THEN
    RETURN jsonb_build_object('isValid', false);
  END IF;
  
  -- Fetch profile data
  SELECT to_jsonb(p.*) INTO profile_data
  FROM public.profiles p
  WHERE p.id = _user_id;
  
  -- Fetch role-specific profile
  IF user_role_value = 'innovator' THEN
    SELECT to_jsonb(ip.*) INTO role_profile_data
    FROM public.innovator_profiles ip
    WHERE ip.user_id = _user_id;
  ELSIF user_role_value = 'startup' THEN
    SELECT to_jsonb(sp.*) INTO role_profile_data
    FROM public.startup_profiles sp
    WHERE sp.user_id = _user_id;
  ELSIF user_role_value = 'investor' THEN
    SELECT to_jsonb(inv.*) INTO role_profile_data
    FROM public.investor_profiles inv
    WHERE inv.user_id = _user_id;
  ELSIF user_role_value = 'consultant' THEN
    SELECT to_jsonb(cp.*) INTO role_profile_data
    FROM public.consultant_profiles cp
    WHERE cp.user_id = _user_id;
  ELSIF user_role_value = 'ecosystem_partner' THEN
    SELECT to_jsonb(ep.*) INTO role_profile_data
    FROM public.ecosystem_partner_profiles ep
    WHERE ep.user_id = _user_id;
  END IF;
  
  -- Fetch published profile pitches
  SELECT COALESCE(jsonb_agg(to_jsonb(pp.*) ORDER BY pp.created_at DESC), '[]'::jsonb)
  INTO profile_pitches_data
  FROM public.profile_pitches pp
  WHERE pp.user_id = _user_id AND pp.status = 'published';
  
  -- Fetch active user pitches (feed pitches)
  SELECT COALESCE(jsonb_agg(to_jsonb(pt.*) ORDER BY pt.created_at DESC), '[]'::jsonb)
  INTO user_pitches_data
  FROM public.pitches pt
  WHERE pt.user_id = _user_id 
    AND pt.is_active = true 
    AND pt.expires_at > now();
  
  -- Calculate stats
  SELECT jsonb_build_object(
    'totalReactions', COALESCE(SUM(reaction_count), 0),
    'totalSaves', COALESCE(SUM(save_count), 0),
    'pitchCount', COUNT(*)
  ) INTO stats_data
  FROM public.pitches
  WHERE user_id = _user_id;
  
  -- Build and return the complete result
  RETURN jsonb_build_object(
    'isValid', true,
    'userRole', user_role_value,
    'profile', profile_data,
    'roleProfile', role_profile_data,
    'profilePitches', profile_pitches_data,
    'userPitches', user_pitches_data,
    'stats', stats_data
  );
END;
$$;