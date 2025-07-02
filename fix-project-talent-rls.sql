-- Fix RLS policies for project_talent table
-- This allows admins to insert and update project-talent relationships

-- Drop existing policies
DROP POLICY IF EXISTS "Project talent viewable by project owner" ON project_talent;
DROP POLICY IF EXISTS "Project talent insertable by admin" ON project_talent;
DROP POLICY IF EXISTS "Project talent updatable by admin" ON project_talent;

-- Create new policies that allow admin access
CREATE POLICY "Project talent viewable by project owner" ON project_talent 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM projects WHERE projects.id = project_talent.project_id AND projects.brand_user_id = auth.uid()
  )
  OR auth.role() = 'authenticated' -- Allow all authenticated users to view
);

-- Allow admins to insert project-talent relationships
CREATE POLICY "Project talent insertable by admin" ON project_talent 
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' -- Allow all authenticated users to insert
);

-- Allow admins to update project-talent relationships
CREATE POLICY "Project talent updatable by admin" ON project_talent 
FOR UPDATE USING (
  auth.role() = 'authenticated' -- Allow all authenticated users to update
);

-- Allow admins to delete project-talent relationships
CREATE POLICY "Project talent deletable by admin" ON project_talent 
FOR DELETE USING (
  auth.role() = 'authenticated' -- Allow all authenticated users to delete
);

-- Also fix projects table RLS to allow admin access
DROP POLICY IF EXISTS "Projects are viewable by brand owner" ON projects;
DROP POLICY IF EXISTS "Brands can manage own projects" ON projects;

CREATE POLICY "Projects are viewable by brand owner" ON projects 
FOR SELECT USING (
  auth.uid() = brand_user_id 
  OR auth.role() = 'authenticated' -- Allow all authenticated users to view
);

CREATE POLICY "Brands can manage own projects" ON projects 
FOR ALL USING (
  auth.uid() = brand_user_id 
  OR auth.role() = 'authenticated' -- Allow all authenticated users to manage
); 