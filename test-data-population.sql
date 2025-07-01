-- =============================================================================
-- PEOPLE SKILLS PLATFORM - TEST DATA POPULATION
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

-- First, let's create some test users (brands) for the projects
-- Note: These will be used as brand_user_id references in projects

INSERT INTO users (id, email, password_hash, role, full_name, company_name, created_at, updated_at) VALUES
-- Brand Users for Projects
('550e8400-e29b-41d4-a716-446655440001', 'emma.davis@sephora.com', '$2a$10$hashedpassword', 'BRAND', 'Emma Davis', 'Sephora', '2024-12-01 10:00:00', '2024-12-01 10:00:00'),
('550e8400-e29b-41d4-a716-446655440002', 'mike.chen@apple.com', '$2a$10$hashedpassword', 'BRAND', 'Mike Chen', 'Apple', '2024-12-01 11:00:00', '2024-12-01 11:00:00'),
('550e8400-e29b-41d4-a716-446655440003', 'lisa.wang@nike.com', '$2a$10$hashedpassword', 'BRAND', 'Lisa Wang', 'Nike', '2024-12-01 12:00:00', '2024-12-01 12:00:00'),
('550e8400-e29b-41d4-a716-446655440004', 'sarah.kim@glossier.com', '$2a$10$hashedpassword', 'BRAND', 'Sarah Kim', 'Glossier', '2024-12-01 13:00:00', '2024-12-01 13:00:00'),
('550e8400-e29b-41d4-a716-446655440005', 'james.smith@lululemon.com', '$2a$10$hashedpassword', 'BRAND', 'James Smith', 'Lululemon', '2024-12-01 14:00:00', '2024-12-01 14:00:00'),
-- Admin User
('550e8400-e29b-41d4-a716-446655440006', 'admin@peopleskills.com', '$2a$10$hashedpassword', 'ADMIN', 'Admin User', 'People Skills', '2024-12-01 09:00:00', '2024-12-01 09:00:00')
ON CONFLICT (email) DO NOTHING;

-- =============================================================================
-- INSERT TEST PROJECTS
-- =============================================================================

INSERT INTO projects (id, brand_user_id, title, description, budget_min, budget_max, deadline, shoot_start_date, shoot_end_date, location, usage_rights, number_of_talent, status, created_at, updated_at) VALUES
-- Project 1: Needs Talent
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Summer Beauty Campaign 2025', 
'Looking for diverse models for our summer beauty collection launch. Focus on natural beauty, authentic lifestyle moments, and inclusive representation. We need talent who can showcase our new skincare and makeup products in both studio and outdoor settings.', 
15000, 25000, '2025-07-15', '2025-07-20', '2025-07-22', 'Los Angeles, CA', 
'Digital advertising, social media, website use for 12 months. Includes Instagram, TikTok, and YouTube content.', 
3, 'needs_talent', '2025-01-02 10:30:00', '2025-01-02 10:30:00'),

-- Project 2: Talent Assigned
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'iPhone 16 Pro Launch Campaign', 
'Seeking tech-savvy talent for our new iPhone 16 Pro launch. Professional, modern aesthetic with diverse representation. Talent should be comfortable with technology and able to showcase the phone''s features naturally.', 
8000, 15000, '2025-06-30', '2025-07-05', '2025-07-05', 'San Francisco, CA', 
'All media rights for 6 months including TV commercial, digital ads, and social media content.', 
2, 'talent_assigned', '2025-01-01 14:20:00', '2025-01-01 14:20:00'),

-- Project 3: Completed
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Nike Air Max Campaign', 
'High-energy fitness commercial featuring real athletes and fitness enthusiasts. Authenticity is key - we want talent who actually live an active lifestyle and can showcase our new Air Max shoes in action.', 
20000, 35000, '2025-08-01', '2025-08-10', '2025-08-12', 'Miami, FL', 
'Worldwide rights for 24 months across all platforms including TV, digital, and social media.', 
5, 'completed', '2024-12-28 09:15:00', '2024-12-28 09:15:00'),

-- Project 4: Needs Talent
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'Glossier Skin Perfecting Campaign', 
'Natural beauty campaign showcasing our new skin perfecting products in everyday scenarios. Looking for talent with diverse skin types and natural beauty who can authentically represent our brand values.', 
12000, 18000, '2025-07-30', '2025-08-05', '2025-08-06', 'New York, NY', 
'Digital and print advertising for 18 months. Includes social media content and influencer partnerships.', 
4, 'needs_talent', '2025-01-03 16:45:00', '2025-01-03 16:45:00'),

-- Project 5: Needs Talent
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'Lululemon Athleisure Collection', 
'Lifestyle shoot for our new athleisure collection. We need talent who embody the "sweat life" and can showcase our clothing in both workout and casual settings. Focus on movement and comfort.', 
18000, 28000, '2025-08-15', '2025-08-20', '2025-08-22', 'Vancouver, BC', 
'Global rights for 12 months across all channels. Includes e-commerce, social media, and retail displays.', 
3, 'needs_talent', '2025-01-04 11:20:00', '2025-01-04 11:20:00');

-- =============================================================================
-- INSERT TEST TALENT PROFILES
-- =============================================================================

INSERT INTO talent_profiles (id, full_name, bio, category, location, height, bust, waist, hips, shoe_size, daily_rate, half_day_rate, usage_fee, travel_accommodation, agency_percent, socials, agency_link, models_com_link, photos, videos, status, created_at, updated_at) VALUES
-- Fashion Models
('770e8400-e29b-41d4-a716-446655440001', 'Vittoria Ceretti', 
'International fashion model with extensive runway and editorial experience. Featured in Vogue, Harper''s Bazaar, and campaigns for major luxury brands. Known for her versatility and strong runway presence.', 
'Fashion Model', 'Milan, Italy', '5\'10"', '34', '24', '34', '8', 
5000, 3000, 2500, 1500, 15, 
'{"instagram": {"handle": "@vittoria", "url": "https://instagram.com/vittoria", "followers": 850000}, "tiktok": {"handle": "@vittoriaceretti", "url": "https://tiktok.com/@vittoriaceretti", "followers": 120000}}', 
'https://elitemodel.com/vittoria-ceretti', 'https://models.com/vittoria-ceretti', 
'["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=400&fit=crop", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop"]', 
'["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"]', 
'active', '2024-12-01 10:00:00', '2024-12-01 10:00:00'),

('770e8400-e29b-41d4-a716-446655440002', 'Sarah Chen', 
'Professional model with 5+ years experience in fashion and commercial modeling. Specializing in lifestyle, beauty, and fashion photography. Strong social media presence with engaged following.', 
'Model', 'Los Angeles, CA', '5\'8"', '34', '24', '36', '7', 
2500, 1500, 1500, 800, 20, 
'{"instagram": {"handle": "@sarahchen", "url": "https://instagram.com/sarahchen", "followers": 125000}, "tiktok": {"handle": "@sarahchenofficial", "url": "https://tiktok.com/@sarahchenofficial", "followers": 89000}}', 
'https://elitemodel.com/sarah-chen', 'https://models.com/sarah-chen', 
'["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop", "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=400&fit=crop"]', 
'["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"]', 
'active', '2024-12-01 11:00:00', '2024-12-01 11:00:00'),

-- Fitness Models
('770e8400-e29b-41d4-a716-446655440003', 'Marcus Johnson', 
'Professional fitness model and personal trainer with 8+ years experience. Specializes in athletic wear, fitness equipment, and lifestyle photography. Certified personal trainer with strong social media following.', 
'Fitness Model', 'Miami, FL', '6\'0"', '42', '32', '34', '10', 
3000, 1800, 2000, 1000, 15, 
'{"instagram": {"handle": "@marcusjohnson", "url": "https://instagram.com/marcusjohnson", "followers": 200000}, "tiktok": {"handle": "@marcusjohnsonfit", "url": "https://tiktok.com/@marcusjohnsonfit", "followers": 150000}}', 
'https://talentagency.com/marcus-johnson', 'https://models.com/marcus-johnson', 
'["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop"]', 
'["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4"]', 
'active', '2024-12-01 12:00:00', '2024-12-01 12:00:00'),

-- Influencers
('770e8400-e29b-41d4-a716-446655440004', 'Emma Rodriguez', 
'Lifestyle influencer and content creator with 6+ years experience. Specializes in beauty, fashion, and lifestyle content. Strong engagement rates and authentic brand partnerships.', 
'Influencer', 'New York, NY', '5\'6"', '36', '26', '38', '8', 
2000, 1200, 1200, 600, 25, 
'{"instagram": {"handle": "@emmafitness", "url": "https://instagram.com/emmafitness", "followers": 150000}, "tiktok": {"handle": "@emmafitness", "url": "https://tiktok.com/@emmafitness", "followers": 200000}}', 
'https://influenceragency.com/emma-rodriguez', NULL, 
'["https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop", "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=400&fit=crop"]', 
'["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"]', 
'active', '2024-12-01 13:00:00', '2024-12-01 13:00:00'),

-- Commercial Models
('770e8400-e29b-41d4-a716-446655440005', 'Alex Thompson', 
'Versatile commercial model with experience in tech, automotive, and lifestyle campaigns. Known for approachable, trustworthy presence perfect for corporate and consumer brands.', 
'Commercial Model', 'San Francisco, CA', '5\'9"', '38', '30', '40', '9', 
1800, 1000, 1000, 500, 20, 
'{"instagram": {"handle": "@alexthompson", "url": "https://instagram.com/alexthompson", "followers": 75000}}', 
'https://commercialagency.com/alex-thompson', NULL, 
'["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop"]', 
'[]', 
'active', '2024-12-01 14:00:00', '2024-12-01 14:00:00'),

-- Beauty Models
('770e8400-e29b-41d4-a716-446655440006', 'Zara Patel', 
'Beauty and skincare specialist with 4+ years experience. Known for flawless skin and ability to showcase beauty products effectively. Strong social media presence in beauty community.', 
'Beauty Model', 'Toronto, ON', '5\'7"', '35', '25', '37', '7.5', 
2200, 1300, 1400, 700, 18, 
'{"instagram": {"handle": "@zarabeauty", "url": "https://instagram.com/zarabeauty", "followers": 180000}, "tiktok": {"handle": "@zarabeauty", "url": "https://tiktok.com/@zarabeauty", "followers": 120000}}', 
'https://beautyagency.com/zara-patel', NULL, 
'["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=400&fit=crop", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop"]', 
'["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"]', 
'active', '2024-12-01 15:00:00', '2024-12-01 15:00:00'),

-- Athletes
('770e8400-e29b-41d4-a716-446655440007', 'Jordan Lee', 
'Professional athlete and fitness model. Former collegiate athlete with strong background in sports marketing. Perfect for athletic wear and sports equipment campaigns.', 
'Athlete', 'Austin, TX', '6\'2"', '44', '32', '36', '11', 
3500, 2000, 2500, 1200, 12, 
'{"instagram": {"handle": "@jordanlee", "url": "https://instagram.com/jordanlee", "followers": 95000}}', 
'https://sportsagency.com/jordan-lee', NULL, 
'["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop"]', 
'["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4"]', 
'active', '2024-12-01 16:00:00', '2024-12-01 16:00:00'),

-- Lifestyle Models
('770e8400-e29b-41d4-a716-446655440008', 'Maya Johnson', 
'Lifestyle and wellness model with authentic approach to health and wellness content. Perfect for organic, natural, and wellness brand campaigns.', 
'Lifestyle Model', 'Portland, OR', '5\'8"', '36', '26', '38', '8', 
1900, 1100, 1100, 600, 22, 
'{"instagram": {"handle": "@mayawellness", "url": "https://instagram.com/mayawellness", "followers": 110000}, "tiktok": {"handle": "@mayawellness", "url": "https://tiktok.com/@mayawellness", "followers": 85000}}', 
'https://lifestyleagency.com/maya-johnson', NULL, 
'["https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop", "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=400&fit=crop"]', 
'["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"]', 
'active', '2024-12-01 17:00:00', '2024-12-01 17:00:00'),

-- Editorial Models
('770e8400-e29b-41d4-a716-446655440009', 'Sophia Chen', 
'Editorial and high fashion model with unique look and strong runway presence. Featured in international fashion weeks and editorial spreads.', 
'Editorial Model', 'Paris, France', '5\'11"', '33', '23', '33', '8.5', 
4000, 2400, 2000, 1500, 18, 
'{"instagram": {"handle": "@sophiachen", "url": "https://instagram.com/sophiachen", "followers": 65000}}', 
'https://fashionagency.com/sophia-chen', 'https://models.com/sophia-chen', 
'["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop", "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=400&fit=crop"]', 
'["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"]', 
'active', '2024-12-01 18:00:00', '2024-12-01 18:00:00'),

-- Commercial Actors
('770e8400-e29b-41d4-a716-446655440010', 'David Park', 
'Commercial actor and spokesperson with 10+ years experience. Known for approachable, trustworthy presence perfect for corporate and consumer brands.', 
'Commercial Actor', 'Chicago, IL', '5\'10"', '40', '32', '38', '9.5', 
2800, 1600, 1800, 900, 15, 
'{"instagram": {"handle": "@davidpark", "url": "https://instagram.com/davidpark", "followers": 45000}}', 
'https://actingagency.com/david-park', NULL, 
'["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop"]', 
'["https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4"]', 
'active', '2024-12-01 19:00:00', '2024-12-01 19:00:00');

-- =============================================================================
-- INSERT SOME PROJECT-TALENT ASSIGNMENTS (for testing)
-- =============================================================================

-- Assign some talent to the "talent_assigned" project (iPhone 16 Pro)
INSERT INTO project_talent (project_id, talent_profile_id, status, admin_notes, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440005', 'selected', 'Perfect for tech campaign - approachable and tech-savvy', '2025-01-15 10:00:00'),
('660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440004', 'selected', 'Great social media presence for digital campaign', '2025-01-15 10:00:00');

-- Assign talent to the "completed" project (Nike Air Max)
INSERT INTO project_talent (project_id, talent_profile_id, status, admin_notes, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', 'booked', 'Perfect athlete for Nike campaign', '2024-12-30 09:00:00'),
('660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440007', 'booked', 'Former collegiate athlete - authentic fit', '2024-12-30 09:00:00'),
('660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440008', 'booked', 'Lifestyle athlete - great for lifestyle shots', '2024-12-30 09:00:00'),
('660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', 'booked', 'High-profile model for campaign visibility', '2024-12-30 09:00:00'),
('660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440002', 'booked', 'Versatile model for multiple campaign elements', '2024-12-30 09:00:00');

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Check that all data was inserted correctly
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Projects' as table_name, COUNT(*) as count FROM projects
UNION ALL
SELECT 'Talent Profiles' as table_name, COUNT(*) as count FROM talent_profiles
UNION ALL
SELECT 'Project Talent' as table_name, COUNT(*) as count FROM project_talent;

-- Show projects with their status and talent counts
SELECT 
    p.title,
    p.status,
    p.number_of_talent,
    COUNT(pt.talent_profile_id) as assigned_talent,
    u.company_name as brand
FROM projects p
LEFT JOIN project_talent pt ON p.id = pt.project_id
LEFT JOIN users u ON p.brand_user_id = u.id
GROUP BY p.id, p.title, p.status, p.number_of_talent, u.company_name
ORDER BY p.created_at DESC;

-- Show talent by category
SELECT 
    category,
    COUNT(*) as count,
    AVG(daily_rate) as avg_daily_rate
FROM talent_profiles
GROUP BY category
ORDER BY count DESC; 