
CREATE OR REPLACE FUNCTION public.is_pitchin_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email = 'pitchin.admn@gmail.com'
  )
$$;

CREATE OR REPLACE FUNCTION public.get_admin_shared_profiles()
RETURNS TABLE (
  share_id uuid,
  user_id uuid,
  full_name text,
  avatar_url text,
  user_email text,
  access_token uuid,
  is_enabled boolean,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_pitchin_admin() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
  SELECT
    ps.id as share_id,
    ps.user_id,
    p.full_name,
    p.avatar_url,
    u.email as user_email,
    ps.access_token,
    ps.is_enabled,
    ps.created_at,
    ps.updated_at
  FROM public.profile_shares ps
  JOIN public.profiles p ON p.id = ps.user_id
  JOIN auth.users u ON u.id = ps.user_id
  ORDER BY ps.created_at DESC;
END;
$$;
