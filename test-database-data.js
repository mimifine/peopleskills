const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseData() {
  console.log('🔍 Checking database data...\n');

  try {
    // Check users table
    console.log('📊 Checking users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
    } else {
      console.log(`✅ Users found: ${users.length}`);
      if (users.length > 0) {
        console.log('   Sample users:');
        users.forEach(user => {
          console.log(`   - ${user.full_name} (${user.email}) - ${user.role}`);
        });
      }
    }

    // Check projects table
    console.log('\n📊 Checking projects table...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(5);
    
    if (projectsError) {
      console.error('❌ Error fetching projects:', projectsError);
    } else {
      console.log(`✅ Projects found: ${projects.length}`);
      if (projects.length > 0) {
        console.log('   Sample projects:');
        projects.forEach(project => {
          console.log(`   - ${project.title} (${project.status})`);
        });
      }
    }

    // Check talent_profiles table
    console.log('\n📊 Checking talent_profiles table...');
    const { data: talents, error: talentsError } = await supabase
      .from('talent_profiles')
      .select('*')
      .limit(5);
    
    if (talentsError) {
      console.error('❌ Error fetching talent profiles:', talentsError);
    } else {
      console.log(`✅ Talent profiles found: ${talents.length}`);
      if (talents.length > 0) {
        console.log('   Sample talent:');
        talents.forEach(talent => {
          console.log(`   - ${talent.full_name} (${talent.category})`);
        });
      }
    }

    // Check project_talent table
    console.log('\n📊 Checking project_talent table...');
    const { data: assignments, error: assignmentsError } = await supabase
      .from('project_talent')
      .select('*')
      .limit(5);
    
    if (assignmentsError) {
      console.error('❌ Error fetching project_talent:', assignmentsError);
    } else {
      console.log(`✅ Project-talent assignments found: ${assignments.length}`);
      if (assignments.length > 0) {
        console.log('   Sample assignments:');
        assignments.forEach(assignment => {
          console.log(`   - Project ${assignment.project_id} -> Talent ${assignment.talent_profile_id} (${assignment.status})`);
        });
      }
    }

    console.log('\n🎯 Summary:');
    console.log(`   Users: ${users?.length || 0}`);
    console.log(`   Projects: ${projects?.length || 0}`);
    console.log(`   Talent Profiles: ${talents?.length || 0}`);
    console.log(`   Assignments: ${assignments?.length || 0}`);

    if ((users?.length || 0) === 0) {
      console.log('\n⚠️  No users found! The SQL data may not have been inserted.');
      console.log('   Please check:');
      console.log('   1. Did you run the SQL in Supabase SQL Editor?');
      console.log('   2. Were there any error messages?');
      console.log('   3. Check the Table Editor in Supabase dashboard');
    } else {
      console.log('\n✅ Database appears to have data!');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkDatabaseData(); 