
-- RPC to fetch shared profile feedback for admin
CREATE OR REPLACE FUNCTION public.get_admin_shared_feedback()
RETURNS TABLE (
  feedback_id uuid,
  source_profile_id uuid,
  profile_name text,
  profile_avatar text,
  visitor_role text,
  usefulness_response text,
  feedback_text text,
  created_at timestamptz
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
    f.id as feedback_id,
    f.source_profile_id,
    p.full_name as profile_name,
    p.avatar_url as profile_avatar,
    f.visitor_role,
    f.usefulness_response,
    f.feedback_text,
    f.created_at
  FROM public.shared_profile_feedback f
  LEFT JOIN public.profiles p ON p.id = f.source_profile_id
  ORDER BY f.created_at DESC;
END;
$$;
