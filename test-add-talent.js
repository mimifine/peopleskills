import { db } from './lib/supabase.js'

console.log('🧪 Testing Add Talent Functionality...')
console.log('')

async function testAddTalent() {
  try {
    console.log('1️⃣ Testing talent profile creation...')
    
    // Sample talent data
    const testTalentData = {
      full_name: 'Test Talent User',
      bio: 'This is a test talent profile created via the admin interface',
      category: 'Model',
      location: 'Los Angeles, CA',
      daily_rate: 2500,
      half_day_rate: 1500,
      usage_fee: 1500,
      travel_accommodation: 800,
      agency_percent: 20,
      height: '5\'8"',
      socials: {
        instagram: {
          handle: '@testtalent',
          url: 'https://instagram.com/testtalent',
          followers: 50000
        }
      },
      status: 'approved'
    }
    
    console.log('📝 Creating talent profile with data:', JSON.stringify(testTalentData, null, 2))
    console.log('')
    
    // Create the talent profile
    const newTalent = await db.talentProfiles.create(testTalentData)
    
    console.log('✅ Talent profile created successfully!')
    console.log('📋 New talent details:')
    console.log(`   - ID: ${newTalent.id}`)
    console.log(`   - Name: ${newTalent.full_name}`)
    console.log(`   - Category: ${newTalent.category}`)
    console.log(`   - Status: ${newTalent.status}`)
    console.log(`   - Created: ${newTalent.created_at}`)
    console.log('')
    
    // Verify the talent was created by fetching it
    console.log('2️⃣ Verifying talent profile retrieval...')
    const fetchedTalent = await db.talentProfiles.getById(newTalent.id)
    
    console.log('✅ Talent profile retrieved successfully!')
    console.log(`   - Retrieved ID: ${fetchedTalent.id}`)
    console.log(`   - Retrieved Name: ${fetchedTalent.full_name}`)
    console.log('')
    
    // Get all talent profiles to see the count
    console.log('3️⃣ Checking total talent profiles...')
    const allTalent = await db.talentProfiles.getAll()
    console.log(`✅ Total talent profiles: ${allTalent.length}`)
    console.log('')
    
    console.log('🎉 Add Talent functionality test completed successfully!')
    console.log('')
    console.log('📋 Summary:')
    console.log(`   - Database connection: ✅ Working`)
    console.log(`   - Talent creation: ✅ Working`)
    console.log(`   - Talent retrieval: ✅ Working`)
    console.log(`   - Total talent profiles: ${allTalent.length}`)
    console.log('')
    console.log('💡 The admin "Add Talent" form should now work correctly!')
    
  } catch (error) {
    console.error('❌ Error testing Add Talent functionality:', error.message)
    console.error('Stack trace:', error.stack)
  }
}

testAddTalent() 