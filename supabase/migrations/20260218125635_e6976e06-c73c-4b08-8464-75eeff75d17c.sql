-- Drop the old restrictive SELECT policy that filters by is_active and expires_at
DROP POLICY IF EXISTS "Authenticated users can view active pitches" ON public.pitches;

-- Create a new policy that allows viewing all pitches
CREATE POLICY "Authenticated users can view all pitches"
ON public.pitches
FOR SELECT
USING (auth.uid() IS NOT NULL);