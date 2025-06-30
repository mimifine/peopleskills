export default function TestEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Environment Variables Test</h1>
      <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {supabaseUrl ? '✅ Set' : '❌ Missing'}</p>
      <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {supabaseKey ? '✅ Set' : '❌ Missing'}</p>
      
      {!supabaseUrl || !supabaseKey ? (
        <div style={{ background: '#fee', padding: '10px', margin: '10px 0', border: '1px solid #fcc' }}>
          <h3>❌ Environment Variables Missing!</h3>
          <p>This is why talent addition isn&apos;t working on your domain.</p>
          <p>Please add the environment variables to your Vercel deployment.</p>
        </div>
      ) : (
        <div style={{ background: '#efe', padding: '10px', margin: '10px 0', border: '1px solid #cfc' }}>
          <h3>✅ Environment Variables Found!</h3>
          <p>Your Supabase connection should work correctly.</p>
        </div>
      )}
    </div>
  );
} 