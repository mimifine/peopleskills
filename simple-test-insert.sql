-- Simple test to check if inserts work
-- Run this in Supabase SQL Editor

-- Test 1: Try to insert one user with proper UUID
INSERT INTO users (id, email, password_hash, role, full_name, company_name, created_at, updated_at) 
VALUES ('550e8400-e29b-41d4-a716-446655440999', 'test@example.com', '$2a$10$hashedpassword', 'BRAND', 'Test User', 'Test Company', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Test 2: Check if it was inserted
SELECT * FROM users WHERE email = 'test@example.com';

-- Test 3: Try to insert one project with proper UUID and valid status
INSERT INTO projects (id, brand_user_id, title, description, budget_min, budget_max, deadline, status, talent_selection_status, created_at, updated_at) 
VALUES ('660e8400-e29b-41d4-a716-446655440999', '550e8400-e29b-41d4-a716-446655440999', 'Test Project', 'This is a test project', 1000, 5000, '2025-12-31', 'active', 'needs_talent', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Test 4: Check if project was inserted
SELECT * FROM projects WHERE id = '660e8400-e29b-41d4-a716-446655440999'; 