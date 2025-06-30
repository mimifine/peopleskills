require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Test Supabase connection and talent addition
async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...');
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('📋 Environment Check:');
  console.log('  - Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('  - Supabase Key:', supabaseKey ? '✅ Set' : '❌ Missing');
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables!');
    console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return;
  }
  
  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client created successfully');
    
    // Test connection by querying the talent_profiles table
    console.log('🔍 Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('talent_profiles')
      .select('id, full_name')
      .limit(1);
    
    if (testError) {
      console.error('❌ Database connection failed:', testError);
      return;
    }
    
    console.log('✅ Database connection successful!');
    console.log('📊 Current talent count:', testData?.length || 0);
    
    // Test inserting a talent profile
    console.log('🧪 Testing talent profile creation...');
    const testTalent = {
      full_name: 'Test Talent - ' + new Date().toISOString(),
      bio: 'This is a test talent profile created by the connection test script.',
      category: 'Test',
      location: 'Test City',
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('talent_profiles')
      .insert([testTalent])
      .select();
    
    if (insertError) {
      console.error('❌ Talent insertion failed:', insertError);
      console.error('Error details:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      });
      return;
    }
    
    console.log('✅ Talent profile created successfully!');
    console.log('📝 Created talent:', insertData[0]);
    
    // Clean up - delete the test talent
    console.log('🧹 Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('talent_profiles')
      .delete()
      .eq('id', insertData[0].id);
    
    if (deleteError) {
      console.error('⚠️ Warning: Could not delete test data:', deleteError);
    } else {
      console.log('✅ Test data cleaned up successfully');
    }
    
    console.log('🎉 All tests passed! Your Supabase connection is working correctly.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    console.error('Error stack:', error.stack);
  }
}

// Run the test
testSupabaseConnection(); 