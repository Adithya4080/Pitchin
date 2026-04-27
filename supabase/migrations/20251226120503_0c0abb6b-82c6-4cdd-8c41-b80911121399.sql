-- Fix remaining security issues

-- 1. Restrict profiles table to require authentication
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles" ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- 2. Fix notifications INSERT policy - only allow service role or authenticated users for their own notifications
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

-- Allow service role (edge functions) to create notifications for any user
-- This is achieved by the edge function using SUPABASE_SERVICE_ROLE_KEY which bypasses RLS

-- But we should NOT allow direct client inserts without restrictions
-- For now, let's just not have a public INSERT policy - edge functions bypass RLS with service role
-- This effectively prevents direct client-side notification creation