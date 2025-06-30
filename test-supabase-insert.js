const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('=== Supabase Connection Test ===');
console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  try {
    console.log('\n=== Testing INSERT Operation ===');
    
    // Test data with only the columns that exist in the table
    const testData = {
      full_name: 'Test Talent',
      category: 'Actor',
      location: 'Los Angeles, CA',
      age: 25,
      height: "5'8\"",
      bio: 'Test bio for talent profile',
      social_media: {
        instagram: {
          handle: '@testtalent',
          url: 'https://instagram.com/testtalent',
          followers: 1000
        }
      },
      specialties: ['Drama', 'Comedy'],
      rate: 500,
      experience_level: 'Intermediate'
    };

    console.log('Attempting to insert:', JSON.stringify(testData, null, 2));

    const { data, error } = await supabase
      .from('talent_profiles')
      .insert([testData])
      .select();

    if (error) {
      console.error('❌ INSERT Error:');
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      console.error('Full error object:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ INSERT Success!');
      console.log('Inserted data:', data);
    }

  } catch (err) {
    console.error('❌ Exception during insert:', err);
  }
}

async function checkTableStructure() {
  try {
    console.log('\n=== Checking Table Structure ===');
    
    const { data, error } = await supabase
      .from('talent_profiles')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Table access error:', error);
    } else {
      console.log('✅ Table accessible');
      if (data && data.length > 0) {
        console.log('Sample row columns:', Object.keys(data[0]));
      } else {
        console.log('Table is empty');
      }
    }
  } catch (err) {
    console.error('❌ Exception checking table:', err);
  }
}

async function checkPolicies() {
  try {
    console.log('\n=== Checking RLS Policies ===');
    
    // Try to get policy information
    const { data, error } = await supabase
      .rpc('get_policies', { table_name: 'talent_profiles' })
      .select();

    if (error) {
      console.log('Could not get policies via RPC, checking manually...');
      console.log('You need to check policies in Supabase Dashboard');
    } else {
      console.log('Policies:', data);
    }
  } catch (err) {
    console.log('Policy check not available, check Supabase Dashboard manually');
  }
}

async function runTests() {
  await checkTableStructure();
  await checkPolicies();
  await testInsert();
}

runTests().then(() => {
  console.log('\n=== Test Complete ===');
  process.exit(0);
}).catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
}); 