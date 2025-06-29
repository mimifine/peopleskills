import { db } from '../lib/supabase.js'

// Sample data migration script
// This will help you migrate your hardcoded data to Supabase

const sampleUsers = [
  {
    email: 'admin@peopleskills.com',
    password_hash: '$2a$10$hashed_password_here', // You'll need to hash passwords
    role: 'ADMIN',
    full_name: 'Admin User',
    company_name: 'People Skills'
  },
  {
    email: 'brand@company.com',
    password_hash: '$2a$10$hashed_password_here',
    role: 'BRAND',
    full_name: 'Brand Manager',
    company_name: 'Sample Company'
  },
  {
    email: 'talent@model.com',
    password_hash: '$2a$10$hashed_password_here',
    role: 'DIRECT_TALENT',
    full_name: 'Sarah Chen',
    company_name: null
  }
]

const sampleTalentProfiles = [
  {
    full_name: 'Sarah Chen',
    bio: 'Experienced model and influencer with strong engagement rates',
    category: 'Model/Influencer',
    location: 'Los Angeles, CA',
    daily_rate: 2500,
    half_day_rate: 1500,
    usage_fee: 1500,
    travel_accommodation: 800,
    agency_percent: 20,
    height: '5\'8"',
    clothing_sizes: {
      dress: '4-6',
      pants: '26-28',
      shoes: '7.5'
    },
    socials: {
      instagram: {
        handle: '@sarahchen_model',
        url: 'https://instagram.com/sarahchen_model',
        followers: 125000
      },
      tiktok: {
        handle: '@sarahchenofficial',
        url: 'https://tiktok.com/@sarahchenofficial',
        followers: 89000
      }
    },
    rating: 4.8,
    status: 'approved'
  },
  {
    full_name: 'Marcus Rodriguez',
    bio: 'Experienced commercial actor with strong camera presence',
    category: 'Actor/Model',
    location: 'New York, NY',
    daily_rate: 3200,
    half_day_rate: 2000,
    usage_fee: 2000,
    travel_accommodation: 1200,
    agency_percent: 15,
    height: '6\'0"',
    clothing_sizes: {
      shirt: 'L',
      pants: '32-34',
      shoes: '10'
    },
    socials: {
      instagram: {
        handle: '@marcusrodriguez',
        url: 'https://instagram.com/marcusrodriguez',
        followers: 67000
      },
      tiktok: {
        handle: '@marcusactor',
        url: 'https://tiktok.com/@marcusactor',
        followers: 42000
      }
    },
    rating: 4.9,
    status: 'approved'
  }
]

const sampleProjects = [
  {
    title: 'Summer Campaign 2025',
    description: 'Lifestyle campaign for summer clothing line',
    budget_min: 50000,
    budget_max: 75000,
    deadline: '2025-03-15',
    shoot_start_date: '2025-02-01',
    shoot_end_date: '2025-02-15',
    location: 'Los Angeles, CA',
    usage_rights: 'Social media and print for 1 year',
    number_of_talent: 2,
    status: 'active'
  },
  {
    title: 'Fall Fashion Collection',
    description: 'High-end fashion campaign for fall collection',
    budget_min: 80000,
    budget_max: 120000,
    deadline: '2025-04-30',
    shoot_start_date: '2025-03-01',
    shoot_end_date: '2025-03-10',
    location: 'New York, NY',
    usage_rights: 'Global print and digital for 2 years',
    number_of_talent: 1,
    status: 'draft'
  }
]

async function migrateData() {
  try {
    console.log('Starting data migration...')

    // 1. Create users
    console.log('Creating users...')
    const createdUsers = []
    for (const userData of sampleUsers) {
      const user = await db.users.create(userData)
      createdUsers.push(user)
      console.log(`Created user: ${user.email}`)
    }

    // 2. Create talent profiles
    console.log('Creating talent profiles...')
    const createdTalentProfiles = []
    for (let i = 0; i < sampleTalentProfiles.length; i++) {
      const talentData = {
        ...sampleTalentProfiles[i],
        user_id: createdUsers[i + 1].id // Skip admin user
      }
      const talent = await db.talentProfiles.create(talentData)
      createdTalentProfiles.push(talent)
      console.log(`Created talent profile: ${talent.full_name}`)
    }

    // 3. Create projects
    console.log('Creating projects...')
    const createdProjects = []
    for (const projectData of sampleProjects) {
      const project = await db.projects.create({
        ...projectData,
        brand_user_id: createdUsers[1].id // Brand user
      })
      createdProjects.push(project)
      console.log(`Created project: ${project.title}`)
    }

    // 4. Create project-talent relationships
    console.log('Creating project-talent relationships...')
    for (const project of createdProjects) {
      for (const talent of createdTalentProfiles) {
        await db.projectTalent.create({
          project_id: project.id,
          talent_profile_id: talent.id,
          status: 'submitted',
          admin_notes: 'Automatically added during migration'
        })
      }
    }

    // 5. Create brand favorites
    console.log('Creating brand favorites...')
    await db.brandFavorites.add(createdUsers[1].id, createdTalentProfiles[0].id)

    // 6. Create sample media files
    console.log('Creating sample media files...')
    for (const talent of createdTalentProfiles) {
      await db.mediaFiles.create({
        talent_profile_id: talent.id,
        file_type: 'image',
        file_url: 'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Headshot',
        filename: 'headshot.jpg',
        title: 'Headshot',
        is_primary: true
      })

      await db.mediaFiles.create({
        talent_profile_id: talent.id,
        file_type: 'video',
        file_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        filename: 'portfolio.mp4',
        title: 'Portfolio Video',
        is_primary: false,
        platform: 'youtube'
      })
    }

    console.log('Data migration completed successfully!')
    console.log(`Created ${createdUsers.length} users`)
    console.log(`Created ${createdTalentProfiles.length} talent profiles`)
    console.log(`Created ${createdProjects.length} projects`)

  } catch (error) {
    console.error('Migration failed:', error)
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateData()
}

export { migrateData } 