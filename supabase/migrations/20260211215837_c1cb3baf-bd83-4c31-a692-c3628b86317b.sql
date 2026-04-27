CREATE OR REPLACE FUNCTION public.get_shared_pitch_detail(
  _access_token text,
  _user_id uuid,
  _pitch_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _result json;
  _is_valid boolean;
BEGIN
  -- Validate the share token (cast text to uuid for comparison)
  SELECT EXISTS (
    SELECT 1 FROM public.profile_shares
    WHERE user_id = _user_id
      AND access_token = _access_token::uuid
      AND is_enabled = true
  ) INTO _is_valid;

  IF NOT _is_valid THEN
    RETURN json_build_object('isValid', false);
  END IF;

  -- Fetch the pitch (must belong to the user and be published)
  SELECT json_build_object(
    'isValid', true,
    'pitch', row_to_json(pp),
    'author', (
      SELECT json_build_object(
        'id', p.id,
        'full_name', p.full_name,
        'avatar_url', p.avatar_url
      )
      FROM public.profiles p
      WHERE p.id = _user_id
    ),
    'authorRole', (
      SELECT ur.role
      FROM public.user_roles ur
      WHERE ur.user_id = _user_id
      LIMIT 1
    )
  )
  INTO _result
  FROM public.profile_pitches pp
  WHERE pp.id = _pitch_id
    AND pp.user_id = _user_id
    AND pp.status = 'published';

  IF _result IS NULL THEN
    RETURN json_build_object('isValid', false);
  END IF;

  RETURN _result;
END;
$function$;