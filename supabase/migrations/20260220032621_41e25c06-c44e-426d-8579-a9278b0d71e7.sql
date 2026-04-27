
-- Add new structured post fields to pitches table
ALTER TABLE public.pitches 
ADD COLUMN IF NOT EXISTS post_title text,
ADD COLUMN IF NOT EXISTS external_link_url text,
ADD COLUMN IF NOT EXISTS external_link_title text,
ADD COLUMN IF NOT EXISTS external_link_description text,
ADD COLUMN IF NOT EXISTS cta_label text,
ADD COLUMN IF NOT EXISTS cta_url text,
ADD COLUMN IF NOT EXISTS cta_open_new_tab boolean DEFAULT true;
