-- Test RLS bypass
-- Run this in Supabase SQL Editor

-- Temporarily disable RLS on users table
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Check if we can see users now
SELECT 'Users with RLS disabled:' as status, COUNT(*) as count FROM users;

-- Temporarily disable RLS on projects table  
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- Check if we can see projects now
SELECT 'Projects with RLS disabled:' as status, COUNT(*) as count FROM projects;

-- Show all users
SELECT id, email, role, full_name FROM users ORDER BY created_at DESC;

-- Show all projects
SELECT id, title, status, talent_selection_status FROM projects ORDER BY created_at DESC;

-- Re-enable RLS (important!)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY; 