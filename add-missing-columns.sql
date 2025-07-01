-- Add missing columns to projects table
-- Run this in Supabase SQL Editor

-- Add talent_selection_status column if it doesn't exist
ALTER TABLE projects ADD COLUMN IF NOT EXISTS talent_selection_status text DEFAULT 'needs_talent' CHECK (talent_selection_status IN ('needs_talent', 'talent_assigned', 'talent_approved', 'completed'));

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name = 'talent_selection_status';

-- Show all columns in projects table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'projects' 
ORDER BY ordinal_position; 