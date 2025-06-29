const { createClient } = require('@supabase/supabase-js')

// Your Supabase configuration
const supabaseUrl = 'https://sxwosbgeimjkedmivojo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4d29zYmdlaW1qa2VkbWl2b2pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzY3MDIsImV4cCI6MjA2NjcxMjcwMn0.v8Mkg7iyh3fHae4Jc7ZlUbaudOQWkPIygRKWi1Ewp_8'

console.log('🔍 Verifying People Skills Database Connection...')
console.log('URL:', supabaseUrl)
console.log('Project ID:', supabaseUrl.split('//')[1].split('.')[0])
console.log('')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verifyConnection() {
  try {
    console.log('1️⃣ Testing database connection...')
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.log('❌ Database connection failed:', testError.message)
      console.log('')
      console.log('💡 This usually means:')
      console.log('   - Database tables haven\'t been created yet')
      console.log('   - You need to run the schema in Supabase SQL Editor')
      console.log('   - Run: node setup-database.js to get the schema')
      return
    }
    
    console.log('✅ Database connection successful!')
    console.log('')
    
    // Test all tables
    const tables = ['users', 'talent_profiles', 'projects', 'project_talent', 'brand_favorites', 'media_files', 'comments']
    
    console.log('2️⃣ Checking table accessibility...')
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1)
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`)
      } else {
        console.log(`✅ ${table}: Accessible`)
      }
    }
    console.log('')
    
    // Get record counts
    console.log('3️⃣ Getting record counts...')
    const counts = {}
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        counts[table] = 'Error'
      } else {
        counts[table] = count || 0
      }
    }
    
    console.log('📊 Current Database State:')
    console.log('   Users:', counts.users)
    console.log('   Talent Profiles:', counts.talent_profiles)
    console.log('   Projects:', counts.projects)
    console.log('   Project-Talent Relationships:', counts.project_talent)
    console.log('   Brand Favorites:', counts.brand_favorites)
    console.log('   Media Files:', counts.media_files)
    console.log('   Comments:', counts.comments)
    console.log('')
    
    // Show sample data if available
    if (counts.users > 0) {
      console.log('4️⃣ Sample Users:')
      const { data: users } = await supabase
        .from('users')
        .select('id, email, role, full_name, company_name')
        .limit(3)
      
      users?.forEach(user => {
        console.log(`   - ${user.email} (${user.role}) - ${user.full_name}`)
      })
      console.log('')
    }
    
    if (counts.talent_profiles > 0) {
      console.log('5️⃣ Sample Talent Profiles:')
      const { data: talent } = await supabase
        .from('talent_profiles')
        .select('id, full_name, category, location, status')
        .limit(3)
      
      talent?.forEach(profile => {
        console.log(`   - ${profile.full_name} (${profile.category}) - ${profile.location} - ${profile.status}`)
      })
      console.log('')
    }
    
    console.log('🎉 Database verification completed!')
    console.log('')
    console.log('📋 Summary:')
    console.log(`   - Supabase URL: ${supabaseUrl}`)
    console.log(`   - Project ID: ${supabaseUrl.split('//')[1].split('.')[0]}`)
    console.log(`   - Connection: ✅ Working`)
    console.log(`   - Total Records: ${Object.values(counts).reduce((sum, count) => sum + (typeof count === 'number' ? count : 0), 0)}`)
    console.log('')
    
    if (Object.values(counts).every(count => count === 0)) {
      console.log('💡 Database is empty. To add sample data, run:')
      console.log('   node scripts/migrate-data.js')
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

verifyConnection() 