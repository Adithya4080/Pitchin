-- Add contact_email column to profiles table for optional contact email display
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS contact_email text;