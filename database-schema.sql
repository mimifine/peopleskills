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

-- Talent profiles
CREATE TABLE talent_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  bio TEXT,
  category VARCHAR(100),
  location VARCHAR(255),
  daily_rate INTEGER,
  half_day_rate INTEGER,
  usage_fee INTEGER,
  travel_accommodation INTEGER,
  agency_percent INTEGER DEFAULT 0,
  height VARCHAR(50),
  clothing_sizes JSONB,
  socials JSONB,
  rating DECIMAL(3,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

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
CREATE INDEX idx_talent_profiles_user_id ON talent_profiles(user_id);
CREATE INDEX idx_talent_profiles_status ON talent_profiles(status);
CREATE INDEX idx_talent_profiles_location ON talent_profiles(location);
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
CREATE TRIGGER update_talent_profiles_updated_at BEFORE UPDATE ON talent_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_talent ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Talent profiles are viewable by all authenticated users
CREATE POLICY "Talent profiles are viewable by authenticated users" ON talent_profiles FOR SELECT USING (auth.role() = 'authenticated');

-- Talent can manage their own profile
CREATE POLICY "Talent can manage own profile" ON talent_profiles FOR ALL USING (auth.uid() = user_id);

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

-- Users can create comments on projects they're involved with
CREATE POLICY "Users can create comments on involved projects" ON comments FOR INSERT WITH CHECK (
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