-- Fix RLS policies to allow app to read data
-- Run this in Supabase SQL Editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Projects are viewable by brand owner" ON projects;
DROP POLICY IF EXISTS "Brands can manage own projects" ON projects;

-- Create new policies that allow public read access for testing
-- Allow anyone to read projects (for testing)
CREATE POLICY "Allow public read projects" ON projects
    FOR SELECT USING (true);

-- Allow authenticated users to insert projects
CREATE POLICY "Allow authenticated insert projects" ON projects
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow project owners to update their projects
CREATE POLICY "Allow project owner update" ON projects
    FOR UPDATE USING (auth.uid() = brand_user_id);

-- Also fix users table policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Allow public read access to users (for testing)
CREATE POLICY "Allow public read users" ON users
    FOR SELECT USING (true);

-- Allow authenticated users to insert users
CREATE POLICY "Allow authenticated insert users" ON users
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own profile
CREATE POLICY "Allow user update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Test if we can now read the data
SELECT 'Testing projects access:' as test, COUNT(*) as count FROM projects;
SELECT 'Testing users access:' as test, COUNT(*) as count FROM users;

-- Show sample data
SELECT 'Sample projects:' as info;
SELECT id, title, status, talent_selection_status FROM projects LIMIT 3;

SELECT 'Sample users:' as info;
SELECT id, email, role, full_name FROM users LIMIT 3; 