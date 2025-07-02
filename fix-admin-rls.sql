-- Fix RLS policies for admin access to project_talent table
-- This allows admin operations without requiring authentication

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON project_talent;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON project_talent;
DROP POLICY IF EXISTS "Enable update for users based on email" ON project_talent;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON project_talent;

-- Create new policies that allow admin access
CREATE POLICY "Enable read access for all users" ON project_talent
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for admin users" ON project_talent
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for admin users" ON project_talent
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for admin users" ON project_talent
    FOR DELETE USING (true);

-- Also fix projects table RLS
DROP POLICY IF EXISTS "Enable read access for all users" ON projects;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON projects;
DROP POLICY IF EXISTS "Enable update for users based on email" ON projects;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON projects;

CREATE POLICY "Enable read access for all users" ON projects
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for admin users" ON projects
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for admin users" ON projects
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for admin users" ON projects
    FOR DELETE USING (true);

-- Fix talent_profiles table RLS
DROP POLICY IF EXISTS "Enable read access for all users" ON talent_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON talent_profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON talent_profiles;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON talent_profiles;

CREATE POLICY "Enable read access for all users" ON talent_profiles
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for admin users" ON talent_profiles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for admin users" ON talent_profiles
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for admin users" ON talent_profiles
    FOR DELETE USING (true);

-- Verify the changes
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('project_talent', 'projects', 'talent_profiles')
ORDER BY tablename, policyname; 