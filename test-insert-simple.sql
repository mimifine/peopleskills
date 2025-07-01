-- Simple test that works with current schema
-- Run this in Supabase SQL Editor

-- Test 1: Insert one user
INSERT INTO users (id, email, password_hash, role, full_name, company_name, created_at, updated_at) 
VALUES ('550e8400-e29b-41d4-a716-446655440999', 'test@example.com', '$2a$10$hashedpassword', 'BRAND', 'Test User', 'Test Company', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Test 2: Check user
SELECT * FROM users WHERE email = 'test@example.com';

-- Test 3: Insert one project (without talent_selection_status)
INSERT INTO projects (id, brand_user_id, title, description, budget_min, budget_max, deadline, status, created_at, updated_at) 
VALUES ('660e8400-e29b-41d4-a716-446655440999', '550e8400-e29b-41d4-a716-446655440999', 'Test Project', 'This is a test project', 1000, 5000, '2025-12-31', 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Test 4: Check project
SELECT * FROM projects WHERE id = '660e8400-e29b-41d4-a716-446655440999'; 