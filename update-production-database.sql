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

-- Add project_talent table for project-specific talent selection
CREATE TABLE IF NOT EXISTS project_talent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  talent_id uuid REFERENCES talent_profiles(id) ON DELETE CASCADE,
  selected_by uuid REFERENCES users(id),
  notes text,
  status text DEFAULT 'selected' CHECK (status IN ('selected', 'approved', 'rejected')),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_talent_project_id ON project_talent(project_id);
CREATE INDEX IF NOT EXISTS idx_project_talent_talent_id ON project_talent(talent_id);
CREATE INDEX IF NOT EXISTS idx_project_talent_status ON project_talent(status);

-- Add unique constraint to prevent duplicate selections
ALTER TABLE project_talent ADD CONSTRAINT unique_project_talent UNIQUE (project_id, talent_id);

-- Update projects table to include talent selection status
ALTER TABLE projects ADD COLUMN IF NOT EXISTS talent_selection_status text DEFAULT 'needs_talent' CHECK (talent_selection_status IN ('needs_talent', 'talent_assigned', 'talent_approved', 'completed'));

-- Add RLS policies for project_talent table
ALTER TABLE project_talent ENABLE ROW LEVEL SECURITY;

-- Admins can see all project-talent relationships
CREATE POLICY "Admins can view all project talent" ON project_talent
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'ADMIN'
    )
  );

-- Admins can insert project-talent relationships
CREATE POLICY "Admins can insert project talent" ON project_talent
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'ADMIN'
    )
  );

-- Admins can update project-talent relationships
CREATE POLICY "Admins can update project talent" ON project_talent
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'ADMIN'
    )
  );

-- Brand users can see talent selected for their projects
CREATE POLICY "Brand users can view their project talent" ON project_talent
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN users u ON p.created_by = u.id
      WHERE p.id = project_talent.project_id
      AND u.id = auth.uid()
      AND u.role = 'BRAND'
    )
  );

-- Talent users can see projects they're selected for
CREATE POLICY "Talent users can view their project selections" ON project_talent
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM talent_profiles tp
      JOIN users u ON tp.user_id = u.id
      WHERE tp.id = project_talent.talent_id
      AND u.id = auth.uid()
      AND u.role = 'DIRECT_TALENT'
    )
  );

-- Add trigger to update project status when talent is assigned
CREATE OR REPLACE FUNCTION update_project_talent_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update project status when talent is assigned
  IF TG_OP = 'INSERT' THEN
    UPDATE projects 
    SET talent_selection_status = 'talent_assigned',
        updated_at = now()
    WHERE id = NEW.project_id;
  END IF;
  
  -- Update project status when talent is removed
  IF TG_OP = 'DELETE' THEN
    -- Check if there are any remaining talent for this project
    IF NOT EXISTS (SELECT 1 FROM project_talent WHERE project_id = OLD.project_id) THEN
      UPDATE projects 
      SET talent_selection_status = 'needs_talent',
          updated_at = now()
      WHERE id = OLD.project_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_project_talent_status ON project_talent;
CREATE TRIGGER trigger_update_project_talent_status
  AFTER INSERT OR DELETE ON project_talent
  FOR EACH ROW
  EXECUTE FUNCTION update_project_talent_status(); 