-- Add ecosystem_partner to user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'ecosystem_partner';

-- Create ecosystem_partner_profiles table
CREATE TABLE IF NOT EXISTS public.ecosystem_partner_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Basic Info
  organization_name TEXT,
  organization_type TEXT, -- accelerator, incubator, community, government, corporate
  overview TEXT,
  primary_website_url TEXT,
  
  -- Verification (admin-controlled)
  is_verified BOOLEAN DEFAULT FALSE,
  
  -- Focus Areas & Stage Support
  focus_industries TEXT[] DEFAULT '{}',
  supported_stages TEXT[] DEFAULT '{}',
  geographic_focus TEXT[] DEFAULT '{}',
  
  -- What They Offer
  offerings TEXT[] DEFAULT '{}',
  
  -- Programs & Initiatives
  programs JSONB DEFAULT '[]',
  
  -- Featured Highlights
  featured_highlights JSONB DEFAULT '[]',
  
  -- Backed/Supported Startups
  supported_startups JSONB DEFAULT '[]',
  
  -- Testimonials
  testimonials JSONB DEFAULT '[]',
  
  -- Engagement Info
  engagement_description TEXT,
  
  -- Intro Video
  intro_video_url TEXT,
  intro_video_title TEXT DEFAULT 'Introduction',
  intro_video_description TEXT,
  intro_video_thumbnail_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ecosystem_partner_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can view ecosystem partner profiles"
  ON public.ecosystem_partner_profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert own ecosystem partner profile"
  ON public.ecosystem_partner_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ecosystem partner profile"
  ON public.ecosystem_partner_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ecosystem partner profile"
  ON public.ecosystem_partner_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_ecosystem_partner_profiles_updated_at
  BEFORE UPDATE ON public.ecosystem_partner_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();