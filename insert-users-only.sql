-- Insert users only
-- Run this in Supabase SQL Editor

-- Brand Users
INSERT INTO users (id, email, password_hash, role, full_name, company_name, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'brand1@test.com', '$2a$10$hashedpassword', 'BRAND', 'Sarah Johnson', 'Fashion Forward Inc.', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'brand2@test.com', '$2a$10$hashedpassword', 'BRAND', 'Michael Chen', 'Tech Startup Co.', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'brand3@test.com', '$2a$10$hashedpassword', 'BRAND', 'Emma Rodriguez', 'Beauty Brands Ltd.', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'brand4@test.com', '$2a$10$hashedpassword', 'BRAND', 'David Kim', 'Lifestyle Media', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'brand5@test.com', '$2a$10$hashedpassword', 'BRAND', 'Lisa Thompson', 'Creative Agency XYZ', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Admin User
INSERT INTO users (id, email, password_hash, role, full_name, company_name, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440006', 'admin@peopleskills.co', '$2a$10$hashedpassword', 'ADMIN', 'Admin User', 'People Skills Platform', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Check if users were inserted
SELECT 'Users inserted successfully!' as status, COUNT(*) as total_users FROM users WHERE email LIKE '%test%' OR email = 'admin@peopleskills.co'; 