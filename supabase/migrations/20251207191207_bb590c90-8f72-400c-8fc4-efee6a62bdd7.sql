-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create category enum for pitches
CREATE TYPE public.pitch_category AS ENUM ('tech', 'consumer', 'b2b', 'creative', 'social_impact', 'other');

-- Create contact visibility enum
CREATE TYPE public.contact_visibility AS ENUM ('direct', 'approval_required');

-- Create reaction type enum
CREATE TYPE public.reaction_type AS ENUM ('fire', 'love', 'rocket', 'lightbulb');

-- Create notification type enum
CREATE TYPE public.notification_type AS ENUM ('save', 'reaction', 'contact_request', 'contact_approved');

-- Profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Pitches table - core content
CREATE TABLE public.pitches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pitch_statement TEXT NOT NULL,
  supporting_line TEXT,
  category public.pitch_category DEFAULT 'other',
  contact_email TEXT,
  contact_linkedin TEXT,
  contact_visibility public.contact_visibility DEFAULT 'approval_required',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours') NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  save_count INTEGER DEFAULT 0 NOT NULL,
  reaction_count INTEGER DEFAULT 0 NOT NULL
);

-- Saves table - track who saved which pitch
CREATE TABLE public.saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pitch_id UUID REFERENCES public.pitches(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, pitch_id)
);

-- Reactions table - track reactions on pitches
CREATE TABLE public.reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pitch_id UUID REFERENCES public.pitches(id) ON DELETE CASCADE NOT NULL,
  reaction_type public.reaction_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, pitch_id)
);

-- Contact requests table
CREATE TABLE public.contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pitch_id UUID REFERENCES public.pitches(id) ON DELETE CASCADE NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  responded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(requester_id, pitch_id)
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type public.notification_type NOT NULL,
  pitch_id UUID REFERENCES public.pitches(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pitches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Pitches policies
CREATE POLICY "Active pitches are viewable by everyone" ON public.pitches FOR SELECT USING (is_active = true AND expires_at > NOW());
CREATE POLICY "Users can view own pitches" ON public.pitches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create pitches" ON public.pitches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pitches" ON public.pitches FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own pitches" ON public.pitches FOR DELETE USING (auth.uid() = user_id);

-- Saves policies
CREATE POLICY "Users can view own saves" ON public.saves FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create saves" ON public.saves FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saves" ON public.saves FOR DELETE USING (auth.uid() = user_id);

-- Reactions policies
CREATE POLICY "Users can view own reactions" ON public.reactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create reactions" ON public.reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reactions" ON public.reactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reactions" ON public.reactions FOR DELETE USING (auth.uid() = user_id);

-- Contact requests policies
CREATE POLICY "Users can view requests they made" ON public.contact_requests FOR SELECT USING (auth.uid() = requester_id);
CREATE POLICY "Pitch owners can view requests" ON public.contact_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.pitches WHERE pitches.id = contact_requests.pitch_id AND pitches.user_id = auth.uid())
);
CREATE POLICY "Users can create contact requests" ON public.contact_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Pitch owners can update requests" ON public.contact_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.pitches WHERE pitches.id = contact_requests.pitch_id AND pitches.user_id = auth.uid())
);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Function to handle new user signup - create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture')
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update save count on pitch
CREATE OR REPLACE FUNCTION public.update_pitch_save_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.pitches SET save_count = save_count + 1 WHERE id = NEW.pitch_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.pitches SET save_count = save_count - 1 WHERE id = OLD.pitch_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Trigger for save count
CREATE TRIGGER on_save_change
  AFTER INSERT OR DELETE ON public.saves
  FOR EACH ROW EXECUTE FUNCTION public.update_pitch_save_count();

-- Function to update reaction count on pitch
CREATE OR REPLACE FUNCTION public.update_pitch_reaction_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.pitches SET reaction_count = reaction_count + 1 WHERE id = NEW.pitch_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.pitches SET reaction_count = reaction_count - 1 WHERE id = OLD.pitch_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Trigger for reaction count
CREATE TRIGGER on_reaction_change
  AFTER INSERT OR DELETE ON public.reactions
  FOR EACH ROW EXECUTE FUNCTION public.update_pitch_reaction_count();

-- Function to check if user has active pitch
CREATE OR REPLACE FUNCTION public.user_has_active_pitch(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.pitches
    WHERE user_id = user_uuid
    AND is_active = true
    AND expires_at > NOW()
  )
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for pitches and notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.pitches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;