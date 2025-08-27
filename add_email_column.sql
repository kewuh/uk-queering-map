-- Add email column to moments table
-- Run this in your Supabase SQL Editor
ALTER TABLE public.moments ADD COLUMN IF NOT EXISTS email text null;
