-- Create follows table for user-to-user follow relationships
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL,
  following_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  responded_at TIMESTAMP WITH TIME ZONE,
  message TEXT,
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Enable RLS
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own follow requests"
  ON public.follows FOR SELECT
  USING (auth.uid() = follower_id OR auth.uid() = following_id);

CREATE POLICY "Users can create follow requests"
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Target user can update follow request status"
  ON public.follows FOR UPDATE
  USING (auth.uid() = following_id);

CREATE POLICY "Users can delete their own follow requests"
  ON public.follows FOR DELETE
  USING (auth.uid() = follower_id OR auth.uid() = following_id);

-- Add new notification types
ALTER TYPE public.notification_type ADD VALUE 'follow_request';
ALTER TYPE public.notification_type ADD VALUE 'follow_approved';

-- Create function to check if user has approved follow access
CREATE OR REPLACE FUNCTION public.has_follow_access(_follower_id uuid, _following_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.follows
    WHERE follower_id = _follower_id
      AND following_id = _following_id
      AND status = 'approved'
  )
$$;

-- Create trigger to update followers_count when follow is approved or deleted
CREATE OR REPLACE FUNCTION public.update_followers_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status = 'approved' AND OLD.status = 'pending' THEN
    UPDATE public.profiles SET followers_count = COALESCE(followers_count, 0) + 1 WHERE id = NEW.following_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'approved' THEN
    UPDATE public.profiles SET followers_count = GREATEST(COALESCE(followers_count, 0) - 1, 0) WHERE id = OLD.following_id;
    RETURN OLD;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER on_follow_change
  AFTER UPDATE OR DELETE ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.update_followers_count();