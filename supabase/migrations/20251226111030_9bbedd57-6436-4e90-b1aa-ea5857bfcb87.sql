-- Add common fields to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_views INTEGER DEFAULT 0;

-- Create innovator_profiles table
CREATE TABLE public.innovator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  skills TEXT[] DEFAULT '{}',
  achievements TEXT,
  featured_project_title TEXT,
  featured_project_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create startup_profiles table
CREATE TABLE public.startup_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  company_name TEXT,
  company_overview TEXT,
  industry_tags TEXT[] DEFAULT '{}',
  stage TEXT,
  looking_for TEXT,
  team_members JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create investor_profiles table
CREATE TABLE public.investor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  investor_type TEXT,
  investment_range TEXT,
  preferred_sectors TEXT[] DEFAULT '{}',
  region_focus TEXT,
  investment_criteria TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create consultant_profiles table
CREATE TABLE public.consultant_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  expertise_areas TEXT[] DEFAULT '{}',
  experience_summary TEXT,
  services_offered TEXT,
  availability TEXT DEFAULT 'available',
  hourly_rate TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.innovator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultant_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for innovator_profiles
CREATE POLICY "Anyone can view innovator profiles" ON public.innovator_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own innovator profile" ON public.innovator_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own innovator profile" ON public.innovator_profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for startup_profiles
CREATE POLICY "Anyone can view startup profiles" ON public.startup_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own startup profile" ON public.startup_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own startup profile" ON public.startup_profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for investor_profiles
CREATE POLICY "Anyone can view investor profiles" ON public.investor_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own investor profile" ON public.investor_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own investor profile" ON public.investor_profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for consultant_profiles
CREATE POLICY "Anyone can view consultant profiles" ON public.consultant_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own consultant profile" ON public.consultant_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own consultant profile" ON public.consultant_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_innovator_profiles_updated_at BEFORE UPDATE ON public.innovator_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_startup_profiles_updated_at BEFORE UPDATE ON public.startup_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_investor_profiles_updated_at BEFORE UPDATE ON public.investor_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_consultant_profiles_updated_at BEFORE UPDATE ON public.consultant_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();