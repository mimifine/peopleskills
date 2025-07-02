const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugDatabase() {
  console.log('🔍 Debugging database...\n');

  try {
    // Check ALL users (not just test ones)
    console.log('📊 Checking ALL users...');
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select('*');
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
    } else {
      console.log(`✅ Total users found: ${allUsers.length}`);
      allUsers.forEach(user => {
        console.log(`   - ${user.email} (${user.role}) - ${user.full_name}`);
      });
    }

    console.log('\n📊 Checking ALL projects...');
    const { data: allProjects, error: projectsError } = await supabase
      .from('projects')
      .select('*');
    
    if (projectsError) {
      console.error('❌ Error fetching projects:', projectsError);
    } else {
      console.log(`✅ Total projects found: ${allProjects.length}`);
      allProjects.forEach(project => {
        console.log(`   - ${project.title} (${project.status}) - ${project.talent_selection_status}`);
      });
    }

    console.log('\n📊 Checking ALL talent profiles...');
    const { data: allTalent, error: talentError } = await supabase
      .from('talent_profiles')
      .select('*')
      .limit(10);
    
    if (talentError) {
      console.error('❌ Error fetching talent:', talentError);
    } else {
      console.log(`✅ Total talent profiles found: ${allTalent.length}`);
      allTalent.forEach(talent => {
        console.log(`   - ${talent.full_name} (${talent.category}) - ${talent.status}`);
      });
    }

    console.log('\n📊 Checking ALL project-talent assignments...');
    const { data: allAssignments, error: assignmentsError } = await supabase
      .from('project_talent')
      .select('*');
    
    if (assignmentsError) {
      console.error('❌ Error fetching assignments:', assignmentsError);
    } else {
      console.log(`✅ Total assignments found: ${allAssignments.length}`);
      allAssignments.forEach(assignment => {
        console.log(`   - Project: ${assignment.project_id} | Talent: ${assignment.talent_profile_id} | Status: ${assignment.status}`);
      });
    }

    // Test if we can insert a simple test project
    console.log('\n🧪 Testing project insertion...');
    const testProject = {
      id: 'test-project-debug-001',
      brand_user_id: allUsers?.[0]?.id || '550e8400-e29b-41d4-a716-446655440001',
      title: 'Debug Test Project',
      description: 'This is a test project for debugging',
      budget_min: 1000,
      budget_max: 5000,
      deadline: '2024-12-31',
      status: 'active',
      talent_selection_status: 'needs_talent'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('projects')
      .insert(testProject)
      .select();

    if (insertError) {
      console.error('❌ Error inserting test project:', insertError);
    } else {
      console.log('✅ Successfully inserted test project:', insertData);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

debugDatabase(); 