-- Update Production Database Schema
-- Run this in your Supabase SQL Editor to add missing columns

-- Add missing columns to talent_profiles table
ALTER TABLE talent_profiles 
ADD COLUMN IF NOT EXISTS height TEXT,
ADD COLUMN IF NOT EXISTS bust TEXT,
ADD COLUMN IF NOT EXISTS waist TEXT,
ADD COLUMN IF NOT EXISTS hips TEXT,
ADD COLUMN IF NOT EXISTS shoe_size TEXT,
ADD COLUMN IF NOT EXISTS agency_link TEXT,
ADD COLUMN IF NOT EXISTS models_com_link TEXT;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'talent_profiles' 
ORDER BY ordinal_position;

-- Test insert with all columns
INSERT INTO talent_profiles (
    full_name,
    bio,
    category,
    location,
    height,
    bust,
    waist,
    hips,
    shoe_size,
    daily_rate,
    half_day_rate,
    usage_fee,
    travel_accommodation,
    agency_percent,
    socials,
    agency_link,
    models_com_link,
    status
) VALUES (
    'Test Talent - Schema Update',
    'Testing all columns after schema update',
    'Test',
    'Test City',
    '5\'8"',
    '34',
    '24',
    '36',
    '7',
    2500,
    1500,
    1500,
    800,
    20,
    '{"instagram": {"handle": "@test", "url": "https://instagram.com/test", "followers": 1000}}',
    'https://testagency.com/test',
    'https://models.com/test',
    'pending'
);

-- Clean up test data
DELETE FROM talent_profiles WHERE full_name = 'Test Talent - Schema Update';

-- Show final table structure
SELECT 
    'Schema update completed successfully!' as status,
    COUNT(*) as total_columns
FROM information_schema.columns 
WHERE table_name = 'talent_profiles';

-- Add template functionality to talent_packages table
ALTER TABLE talent_packages ADD COLUMN is_template boolean DEFAULT false;
ALTER TABLE talent_packages ADD COLUMN template_name text;

-- Add comments for documentation
COMMENT ON COLUMN talent_packages.is_template IS 'Indicates if this package is a reusable template';
COMMENT ON COLUMN talent_packages.template_name IS 'Name of the template for easy identification';

-- Create index for template queries
CREATE INDEX idx_talent_packages_templates ON talent_packages(is_template) WHERE is_template = true; 