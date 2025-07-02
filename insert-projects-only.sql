-- Insert projects only
-- Run this in Supabase SQL Editor

INSERT INTO projects (id, brand_user_id, title, description, budget_min, budget_max, deadline, status, talent_selection_status, created_at, updated_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Summer Fashion Campaign', 'Looking for diverse models for our summer collection photoshoot', 5000, 15000, '2024-08-15', 'active', 'needs_talent', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Tech Product Launch', 'Need tech-savvy influencers for product launch campaign', 3000, 8000, '2024-07-30', 'active', 'talent_assigned', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Beauty Tutorial Series', 'Seeking beauty influencers for tutorial video series', 2000, 6000, '2024-08-20', 'active', 'needs_talent', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'Lifestyle Content Creation', 'Looking for lifestyle content creators for brand partnership', 4000, 12000, '2024-09-10', 'active', 'completed', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'Corporate Event Hosting', 'Need professional hosts for corporate event', 1500, 4000, '2024-07-25', 'active', 'needs_talent', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Check if projects were inserted
SELECT 'Projects inserted successfully!' as status, COUNT(*) as total_projects FROM projects WHERE title LIKE '%Campaign%' OR title LIKE '%Launch%' OR title LIKE '%Series%' OR title LIKE '%Content%' OR title LIKE '%Event%';

-- Show all projects
SELECT id, title, status, talent_selection_status, created_at FROM projects ORDER BY created_at DESC; 