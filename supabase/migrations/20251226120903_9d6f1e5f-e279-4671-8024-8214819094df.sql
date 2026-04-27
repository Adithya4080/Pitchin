-- Add missing DELETE policies for user data control

-- Users can delete their own role profiles
CREATE POLICY "Users can delete own innovator profile" ON public.innovator_profiles
FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own startup profile" ON public.startup_profiles
FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own investor profile" ON public.investor_profiles
FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own consultant profile" ON public.consultant_profiles
FOR DELETE
USING (auth.uid() = user_id);

-- Allow users to delete their own contact requests (withdraw pending requests)
CREATE POLICY "Users can delete own contact requests" ON public.contact_requests
FOR DELETE
USING (auth.uid() = requester_id);

-- Allow users to delete their own notifications
CREATE POLICY "Users can delete own notifications" ON public.notifications
FOR DELETE
USING (auth.uid() = user_id);

-- Create a secure function to get pitch contact info only if user has approved access
CREATE OR REPLACE FUNCTION public.get_pitch_contact_info(_pitch_id uuid, _requester_id uuid)
RETURNS TABLE(contact_email text, contact_linkedin text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    CASE 
      WHEN p.contact_visibility = 'direct' THEN p.contact_email
      WHEN EXISTS (
        SELECT 1 FROM contact_requests cr 
        WHERE cr.pitch_id = p.id 
        AND cr.requester_id = _requester_id 
        AND cr.status = 'approved'
      ) THEN p.contact_email
      WHEN p.user_id = _requester_id THEN p.contact_email
      ELSE NULL
    END as contact_email,
    CASE 
      WHEN p.contact_visibility = 'direct' THEN p.contact_linkedin
      WHEN EXISTS (
        SELECT 1 FROM contact_requests cr 
        WHERE cr.pitch_id = p.id 
        AND cr.requester_id = _requester_id 
        AND cr.status = 'approved'
      ) THEN p.contact_linkedin
      WHEN p.user_id = _requester_id THEN p.contact_linkedin
      ELSE NULL
    END as contact_linkedin
  FROM pitches p
  WHERE p.id = _pitch_id
$$;