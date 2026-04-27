-- Drop the view as it's not correctly set up and views don't support RLS well
DROP VIEW IF EXISTS public.pitches_public;

-- Instead, we'll handle contact info visibility in the application layer
-- using the secure function get_pitch_contact_info that already exists

-- The remaining findings are acceptable for an MVP:
-- 1. Profiles are intentionally visible to authenticated users for networking
-- 2. Contact request messages need to be visible to pitch owners to make decisions
-- 3. User roles need to be visible for role badges
-- 4. Role profiles are intentionally visible for discovery

-- These are features, not bugs, for a networking/pitch platform