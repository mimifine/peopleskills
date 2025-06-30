-- People Skills Database Schema
-- Supabase PostgreSQL Database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (authentication + roles)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'BRAND', 'DIRECT_TALENT')),
  full_name VARCHAR(255),
  company_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- PEOPLE SKILLS PLATFORM - UPDATED DATABASE SCHEMA
-- =============================================================================
-- 
-- This file contains the complete SQL to set up your People Skills Platform
-- database in Supabase with all the new fields for talent sizes, agency links,
-- and media uploads.
--
-- SETUP INSTRUCTIONS:
-- 1. Go to your Supabase dashboard (https://supabase.com)
-- 2. Select your project
-- 3. Go to SQL Editor
-- 4. Copy and paste this entire file
-- 5. Click "Run" to execute all the SQL commands
-- 6. Verify the table was created in Table Editor
--
-- =============================================================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing table if it exists (BE CAREFUL - this will delete all data!)
-- DROP TABLE IF EXISTS talent_profiles CASCADE;

-- Create the talent_profiles table with all required fields
CREATE TABLE IF NOT EXISTS talent_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Basic Information (only full_name is required)
    full_name TEXT NOT NULL,
    bio TEXT,
    category TEXT,
    location TEXT,
    
    -- Talent Sizes (all optional)
    height TEXT,
    bust TEXT,
    waist TEXT,
    hips TEXT,
    shoe_size TEXT,
    
    -- Rate Information (all optional)
    daily_rate INTEGER,
    half_day_rate INTEGER,
    usage_fee INTEGER,
    travel_accommodation INTEGER,
    agency_percent INTEGER,
    
    -- Social Media (stored as JSONB for flexibility)
    socials JSONB DEFAULT '{}',
    
    -- Agency Links (all optional)
    agency_link TEXT,
    models_com_link TEXT,
    
    -- Media URLs (stored as JSONB arrays)
    photos JSONB DEFAULT '[]'::jsonb,
    videos JSONB DEFAULT '[]'::jsonb,
    
    -- Status and Timestamps
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_talent_profiles_full_name ON talent_profiles(full_name);
CREATE INDEX IF NOT EXISTS idx_talent_profiles_category ON talent_profiles(category);
CREATE INDEX IF NOT EXISTS idx_talent_profiles_location ON talent_profiles(location);
CREATE INDEX IF NOT EXISTS idx_talent_profiles_status ON talent_profiles(status);
CREATE INDEX IF NOT EXISTS idx_talent_profiles_created_at ON talent_profiles(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE talent_profiles ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Allow public insert" ON talent_profiles;
DROP POLICY IF EXISTS "Allow public select" ON talent_profiles;
DROP POLICY IF EXISTS "Allow public update" ON talent_profiles;
DROP POLICY IF EXISTS "Allow public delete" ON talent_profiles;

-- Create RLS policies for public access (simple setup)
-- Allow anyone to insert new talent profiles
CREATE POLICY "Allow public insert" ON talent_profiles
    FOR INSERT WITH CHECK (true);

-- Allow anyone to read talent profiles
CREATE POLICY "Allow public select" ON talent_profiles
    FOR SELECT USING (true);

-- Allow anyone to update talent profiles (optional - remove if you want more control)
CREATE POLICY "Allow public update" ON talent_profiles
    FOR UPDATE USING (true);

-- Allow anyone to delete talent profiles (optional - remove if you want more control)
CREATE POLICY "Allow public delete" ON talent_profiles
    FOR DELETE USING (true);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_talent_profiles_updated_at 
    BEFORE UPDATE ON talent_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
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
) VALUES 
(
    'Sarah Chen',
    'Professional model with 5+ years experience in fashion and commercial modeling.',
    'Model',
    'New York, NY',
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
    '{"instagram": {"handle": "@sarahchen", "url": "https://instagram.com/sarahchen", "followers": 50000}, "tiktok": {"handle": "@sarahchenmodel", "url": "https://tiktok.com/@sarahchenmodel", "followers": 100000}}',
    'https://elitemodel.com/sarah-chen',
    'https://models.com/sarah-chen',
    'active'
),
(
    'Marcus Johnson',
    'Versatile artist and performer specializing in commercial and editorial work.',
    'Artist',
    'Los Angeles, CA',
    '6\'0"',
    '42',
    '32',
    '34',
    '10',
    3000,
    1800,
    2000,
    1000,
    15,
    '{"instagram": {"handle": "@marcusjohnson", "url": "https://instagram.com/marcusjohnson", "followers": 75000}}',
    'https://talentagency.com/marcus-johnson',
    'https://models.com/marcus-johnson',
    'active'
),
(
    'Emma Rodriguez',
    'Fitness athlete and model with strong social media presence.',
    'Athlete',
    'Miami, FL',
    '5\'6"',
    '36',
    '26',
    '38',
    '8',
    2000,
    1200,
    1200,
    600,
    25,
    '{"instagram": {"handle": "@emmafitness", "url": "https://instagram.com/emmafitness", "followers": 150000}, "tiktok": {"handle": "@emmafitness", "url": "https://tiktok.com/@emmafitness", "followers": 200000}}',
    'https://influenceragency.com/emma-rodriguez',
    NULL,
    'active'
);

-- Verify the table was created successfully
SELECT 
    'Table created successfully!' as status,
    COUNT(*) as total_records
FROM talent_profiles;

-- Show sample data
SELECT 
    full_name,
    category,
    location,
    status,
    created_at
FROM talent_profiles
ORDER BY created_at DESC;

-- =============================================================================
-- TROUBLESHOOTING COMMANDS
-- =============================================================================

-- If you get RLS errors, run these commands:
-- ALTER TABLE talent_profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE talent_profiles ENABLE ROW LEVEL SECURITY;

-- To check if policies are working:
-- SELECT * FROM talent_profiles LIMIT 5;

-- To see all policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
-- FROM pg_policies 
-- WHERE tablename = 'talent_profiles';

-- To reset everything (DANGEROUS - deletes all data):
-- DROP TABLE IF EXISTS talent_profiles CASCADE;
-- Then run this entire script again.

-- =============================================================================
-- NOTES FOR DEVELOPERS
-- =============================================================================

-- 1. All fields except full_name are optional and can be NULL
-- 2. Social media data is stored as JSONB for flexibility
-- 3. Photos and videos are stored as JSONB arrays of URLs
-- 4. RLS policies allow public access for simplicity
-- 5. The table includes automatic timestamps
-- 6. Indexes are created for common query fields

-- =============================================================================

-- Projects/Briefs
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  budget_min INTEGER,
  budget_max INTEGER,
  deadline DATE,
  shoot_start_date DATE,
  shoot_end_date DATE,
  location VARCHAR(255),
  usage_rights TEXT,
  number_of_talent INTEGER DEFAULT 1,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'in_review', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Project-talent relationships (admin curated packages)
CREATE TABLE project_talent (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  talent_profile_id UUID REFERENCES talent_profiles(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('submitted', 'selected', 'rejected', 'booked')),
  admin_notes TEXT,
  brand_votes JSONB DEFAULT '{"up": [], "down": []}',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, talent_profile_id)
);

-- Brand favorites
CREATE TABLE brand_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  talent_profile_id UUID REFERENCES talent_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(brand_user_id, talent_profile_id)
);

-- Media files
CREATE TABLE media_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  talent_profile_id UUID REFERENCES talent_profiles(id) ON DELETE CASCADE,
  file_type VARCHAR(50) CHECK (file_type IN ('image', 'video')),
  file_url VARCHAR(500) NOT NULL,
  filename VARCHAR(255),
  title VARCHAR(255),
  is_primary BOOLEAN DEFAULT false,
  platform VARCHAR(50), -- for youtube/vimeo
  created_at TIMESTAMP DEFAULT NOW()
);

-- Comments
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_talent_id UUID REFERENCES project_talent(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_projects_brand_user_id ON projects(brand_user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_project_talent_project_id ON project_talent(project_id);
CREATE INDEX idx_project_talent_talent_profile_id ON project_talent(talent_profile_id);
CREATE INDEX idx_brand_favorites_brand_user_id ON brand_favorites(brand_user_id);
CREATE INDEX idx_brand_favorites_talent_profile_id ON brand_favorites(talent_profile_id);
CREATE INDEX idx_media_files_talent_profile_id ON media_files(talent_profile_id);
CREATE INDEX idx_media_files_file_type ON media_files(file_type);
CREATE INDEX idx_comments_project_talent_id ON comments(project_talent_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_talent ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Projects are viewable by brand owner and admins
CREATE POLICY "Projects are viewable by brand owner" ON projects FOR SELECT USING (auth.uid() = brand_user_id);

-- Brands can manage their own projects
CREATE POLICY "Brands can manage own projects" ON projects FOR ALL USING (auth.uid() = brand_user_id);

-- Project talent relationships are viewable by project owner and admins
CREATE POLICY "Project talent viewable by project owner" ON project_talent FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM projects WHERE projects.id = project_talent.project_id AND projects.brand_user_id = auth.uid()
  )
);

-- Brand favorites are viewable by brand owner
CREATE POLICY "Brand favorites viewable by brand owner" ON brand_favorites FOR SELECT USING (auth.uid() = brand_user_id);

-- Brands can manage their own favorites
CREATE POLICY "Brands can manage own favorites" ON brand_favorites FOR ALL USING (auth.uid() = brand_user_id);

-- Media files are viewable by all authenticated users
CREATE POLICY "Media files are viewable by authenticated users" ON media_files FOR SELECT USING (auth.role() = 'authenticated');

-- Talent can manage their own media
CREATE POLICY "Talent can manage own media" ON media_files FOR ALL USING (
  EXISTS (
    SELECT 1 FROM talent_profiles WHERE talent_profiles.id = media_files.talent_profile_id AND talent_profiles.user_id = auth.uid()
  )
);

-- Comments are viewable by project participants
CREATE POLICY "Comments viewable by project participants" ON comments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM project_talent 
    WHERE project_talent.id = comments.project_talent_id
    AND (
      EXISTS (
        SELECT 1 FROM projects WHERE projects.id = project_talent.project_id AND projects.brand_user_id = auth.uid()
      )
      OR project_talent.talent_profile_id IN (
        SELECT id FROM talent_profiles WHERE user_id = auth.uid()
      )
    )
  )
); 