-- Run this in your Supabase SQL editor to add clothing_type and size columns

ALTER TABLE brands
  ADD COLUMN IF NOT EXISTS clothing_type text,
  ADD COLUMN IF NOT EXISTS size text;
