-- Add description and links columns to pitches table
ALTER TABLE public.pitches 
ADD COLUMN description text,
ADD COLUMN links jsonb DEFAULT '[]'::jsonb;

-- links will store array of {url: string, label: string} objects