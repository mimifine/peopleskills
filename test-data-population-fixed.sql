-- =============================================================================
-- PEOPLE SKILLS PLATFORM - TEST DATA POPULATION (FIXED)
-- =============================================================================
-- 
-- This file contains test data to populate your Supabase database for testing
-- the core workflow: Projects → Select Talent → Save to Database → Update Status
--
-- INSTRUCTIONS:
-- 1. Go to your Supabase dashboard (https://supabase.com)
-- 2. Select your project
-- 3. Go to SQL Editor
-- 4. Copy and paste this entire file
-- 5. Click "Run" to execute all the SQL commands
-- 6. Verify the data was inserted in Table Editor
--
-- =============================================================================

-- Clear existing test data (optional - comment out if you want to keep existing data)
-- DELETE FROM project_talent WHERE project_id IN (SELECT id FROM projects WHERE title LIKE '%Test%');
-- DELETE FROM projects WHERE title LIKE '%Test%';
-- DELETE FROM users WHERE email LIKE '%test%';

-- =============================================================================
-- TEST USERS
-- =============================================================================

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

-- =============================================================================
-- TEST PROJECTS
-- =============================================================================

INSERT INTO projects (id, brand_user_id, title, description, budget_min, budget_max, deadline, status, talent_selection_status, created_at, updated_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Summer Fashion Campaign', 'Looking for diverse models for our summer collection photoshoot', 5000, 15000, '2024-08-15', 'active', 'needs_talent', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Tech Product Launch', 'Need tech-savvy influencers for product launch campaign', 3000, 8000, '2024-07-30', 'active', 'talent_assigned', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Beauty Tutorial Series', 'Seeking beauty influencers for tutorial video series', 2000, 6000, '2024-08-20', 'active', 'needs_talent', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'Lifestyle Content Creation', 'Looking for lifestyle content creators for brand partnership', 4000, 12000, '2024-09-10', 'active', 'completed', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'Corporate Event Hosting', 'Need professional hosts for corporate event', 1500, 4000, '2024-07-25', 'active', 'needs_talent', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- TEST TALENT PROFILES
-- =============================================================================

INSERT INTO talent_profiles (id, full_name, bio, category, location, height, bust, waist, hips, shoe_size, daily_rate, half_day_rate, usage_fee, travel_accommodation, agency_percent, socials, agency_link, models_com_link, photos, videos, status, created_at, updated_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Vittoria Ceretti', 'International fashion model with extensive runway and editorial experience. Featured in Vogue, Elle, and major fashion campaigns.', 'Fashion Model', 'Milan, Italy', '5 feet 10 inches', '34', '24', '34', '8', 5000, 3000, 2500, 1500, 15, '{"tiktok": {"url": "https://tiktok.com/@vittoriaceretti", "handle": "@vittoriaceretti", "followers": 2500000}, "instagram": {"url": "https://instagram.com/vittoriaceretti", "handle": "@vittoriaceretti", "followers": 3500000}}', 'https://elitemodel.com/vittoria-ceretti', 'https://models.com/vittoria-ceretti', '["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop"]', '["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4"]', 'pending', NOW(), NOW()),

('770e8400-e29b-41d4-a716-446655440002', 'Marcus Johnson', 'Versatile actor and model specializing in commercial and editorial work. Strong presence in both print and digital media.', 'Actor/Model', 'Los Angeles, CA', '6 feet 1 inch', '42', '32', '34', '10', 3500, 2000, 1800, 1000, 20, '{"instagram": {"url": "https://instagram.com/marcusjohnson", "handle": "@marcusjohnson", "followers": 180000}, "youtube": {"url": "https://youtube.com/@marcusjohnson", "handle": "@marcusjohnson", "followers": 95000}}', 'https://talentagency.com/marcus-johnson', 'https://models.com/marcus-johnson', '["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop"]', '["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_3mb.mp4"]', 'pending', NOW(), NOW()),

('770e8400-e29b-41d4-a716-446655440003', 'Emma Rodriguez', 'Fitness athlete and wellness influencer with a strong social media presence. Specializes in workout content and healthy living.', 'Fitness Influencer', 'Miami, FL', '5 feet 6 inches', '36', '26', '38', '8', 2500, 1500, 1200, 800, 25, '{"instagram": {"url": "https://instagram.com/emmafitness", "handle": "@emmafitness", "followers": 450000}, "tiktok": {"url": "https://tiktok.com/@emmafitness", "handle": "@emmafitness", "followers": 680000}, "youtube": {"url": "https://youtube.com/@emmafitness", "handle": "@emmafitness", "followers": 120000}}', 'https://influenceragency.com/emma-rodriguez', NULL, '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop"]', '["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_4mb.mp4", "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4"]', 'pending', NOW(), NOW()),

('770e8400-e29b-41d4-a716-446655440004', 'Sarah Chen', 'Professional model with 5+ years experience in fashion and commercial modeling. Featured in major campaigns and runway shows.', 'Model', 'New York, NY', '5 feet 8 inches', '34', '24', '36', '7', 3000, 1800, 1500, 900, 18, '{"instagram": {"url": "https://instagram.com/sarahchen", "handle": "@sarahchen", "followers": 120000}, "tiktok": {"url": "https://tiktok.com/@sarahchenmodel", "handle": "@sarahchenmodel", "followers": 180000}}', 'https://elitemodel.com/sarah-chen', 'https://models.com/sarah-chen', '["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop"]', '["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_6mb.mp4"]', 'pending', NOW(), NOW()),

('770e8400-e29b-41d4-a716-446655440005', 'Alex Thompson', 'Creative director and content creator specializing in lifestyle and fashion photography. Strong aesthetic vision and storytelling skills.', 'Content Creator', 'San Francisco, CA', '5 feet 7 inches', '35', '25', '37', '8', 2200, 1300, 1000, 700, 22, '{"instagram": {"url": "https://instagram.com/alexthompson", "handle": "@alexthompson", "followers": 280000}, "pinterest": {"url": "https://pinterest.com/alexthompson", "handle": "@alexthompson", "followers": 150000}}', NULL, NULL, '["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop"]', '["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_7mb.mp4"]', 'pending', NOW(), NOW()),

('770e8400-e29b-41d4-a716-446655440006', 'David Kim', 'Professional dancer and choreographer with experience in commercial, music video, and stage performances.', 'Dancer', 'Los Angeles, CA', '5 feet 10 inches', '38', '30', '36', '9', 2800, 1600, 1400, 850, 20, '{"instagram": {"url": "https://instagram.com/davidkimdance", "handle": "@davidkimdance", "followers": 95000}, "tiktok": {"url": "https://tiktok.com/@davidkimdance", "handle": "@davidkimdance", "followers": 220000}}', 'https://danceagency.com/david-kim', NULL, '["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop"]', '["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_8mb.mp4", "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_9mb.mp4"]', 'pending', NOW(), NOW()),

('770e8400-e29b-41d4-a716-446655440007', 'Maria Garcia', 'Beauty influencer and makeup artist with expertise in editorial and commercial beauty content. Strong engagement with beauty community.', 'Beauty Influencer', 'Miami, FL', '5 feet 5 inches', '34', '26', '36', '7', 2000, 1200, 1000, 600, 25, '{"instagram": {"url": "https://instagram.com/mariagarcia", "handle": "@mariagarcia", "followers": 320000}, "tiktok": {"url": "https://tiktok.com/@mariagarcia", "handle": "@mariagarcia", "followers": 450000}, "youtube": {"url": "https://youtube.com/@mariagarcia", "handle": "@mariagarcia", "followers": 180000}}', NULL, NULL, '["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop"]', '["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_10mb.mp4"]', 'pending', NOW(), NOW()),

('770e8400-e29b-41d4-a716-446655440008', 'James Wilson', 'Professional photographer and videographer specializing in fashion, lifestyle, and commercial content creation.', 'Photographer', 'New York, NY', '6 feet 0 inches', '40', '32', '38', '10', 3500, 2000, 1800, 1000, 15, '{"instagram": {"url": "https://instagram.com/jameswilson", "handle": "@jameswilson", "followers": 85000}, "behance": {"url": "https://behance.net/jameswilson", "handle": "@jameswilson", "followers": 45000}}', 'https://photographyagency.com/james-wilson', NULL, '["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop"]', '["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_11mb.mp4"]', 'pending', NOW(), NOW()),

('770e8400-e29b-41d4-a716-446655440009', 'Lisa Park', 'Fashion stylist and creative consultant with experience in editorial shoots, commercial campaigns, and personal styling.', 'Stylist', 'Los Angeles, CA', '5 feet 6 inches', '35', '26', '37', '8', 2500, 1500, 1200, 800, 20, '{"instagram": {"url": "https://instagram.com/lisapark", "handle": "@lisapark", "followers": 150000}, "pinterest": {"url": "https://pinterest.com/lisapark", "handle": "@lisapark", "followers": 75000}}', 'https://stylingagency.com/lisa-park', NULL, '["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop"]', '["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_12mb.mp4"]', 'pending', NOW(), NOW()),

('770e8400-e29b-41d4-a716-446655440010', 'Ryan Brown', 'Professional voice actor and narrator with experience in commercials, audiobooks, and corporate presentations.', 'Voice Actor', 'Chicago, IL', '5 feet 11 inches', '42', '34', '40', '11', 1800, 1000, 800, 500, 30, '{"linkedin": {"url": "https://linkedin.com/in/ryanbrown", "handle": "@ryanbrown", "followers": 25000}, "twitter": {"url": "https://twitter.com/ryanbrownvoice", "handle": "@ryanbrownvoice", "followers": 35000}}', 'https://voiceagency.com/ryan-brown', NULL, '["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop"]', '["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_13mb.mp4"]', 'pending', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- TEST PROJECT-TALENT ASSIGNMENTS
-- =============================================================================

-- Some existing assignments for testing
INSERT INTO project_talent (project_id, talent_profile_id, status, admin_notes, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 'selected', 'Perfect fit for tech campaign', NOW()),
('660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440003', 'selected', 'Great social media presence', NOW()),
('660e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440005', 'booked', 'Content creation completed', NOW()),
('660e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440007', 'booked', 'Beauty content delivered', NOW())
ON CONFLICT (project_id, talent_profile_id) DO NOTHING;

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Check inserted data
SELECT 'Users' as table_name, COUNT(*) as count FROM users WHERE email LIKE '%test%' OR email = 'admin@peopleskills.co'
UNION ALL
SELECT 'Projects' as table_name, COUNT(*) as count FROM projects WHERE title LIKE '%Test%' OR title LIKE '%Campaign%' OR title LIKE '%Launch%'
UNION ALL
SELECT 'Talent Profiles' as table_name, COUNT(*) as count FROM talent_profiles WHERE full_name IN ('Vittoria Ceretti', 'Marcus Johnson', 'Emma Rodriguez', 'Sarah Chen', 'Alex Thompson', 'David Kim', 'Maria Garcia', 'James Wilson', 'Lisa Park', 'Ryan Brown')
UNION ALL
SELECT 'Project-Talent Assignments' as table_name, COUNT(*) as count FROM project_talent WHERE project_id IN (SELECT id FROM projects WHERE title LIKE '%Test%' OR title LIKE '%Campaign%' OR title LIKE '%Launch%');

-- Show sample projects
SELECT id, title, status, talent_selection_status, created_at FROM projects WHERE title LIKE '%Test%' OR title LIKE '%Campaign%' OR title LIKE '%Launch%' ORDER BY created_at DESC;

-- Show sample talent
SELECT id, full_name, category, location, status FROM talent_profiles WHERE full_name IN ('Vittoria Ceretti', 'Marcus Johnson', 'Emma Rodriguez') ORDER BY created_at DESC; 