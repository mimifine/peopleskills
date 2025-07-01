"use client";

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase.js';

export default function TestTalentAdd() {
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testTalentAddition = async () => {
    setIsLoading(true);
    setTestResult('Testing...');

    try {
      console.log('🔍 Testing Supabase connection...');
      
      // Test data
      const testTalent = {
        full_name: 'Test Talent - ' + new Date().toISOString(),
        bio: 'This is a test talent created to verify the connection.',
        category: 'Test',
        location: 'Test City',
        status: 'pending',
        created_at: new Date().toISOString()
      };

      console.log('📤 Submitting test talent:', testTalent);

      const { data, error } = await supabase
        .from('talent_profiles')
        .insert([testTalent])
        .select();

      if (error) {
        console.error('❌ Error:', error);
        setTestResult(`❌ FAILED: ${error.message}`);
        return;
      }

      console.log('✅ Success:', data);
      setTestResult(`✅ SUCCESS! Created talent: ${data[0].full_name}`);

      // Clean up - delete the test talent
      const { error: deleteError } = await supabase
        .from('talent_profiles')
        .delete()
        .eq('id', data[0].id);

      if (deleteError) {
        console.error('⚠️ Warning: Could not delete test data:', deleteError);
      } else {
        console.log('✅ Test data cleaned up');
      }

    } catch (error) {
      console.error('❌ Unexpected error:', error);
      setTestResult(`❌ ERROR: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🧪 Test Talent Addition</h1>
      
      <div style={{ margin: '20px 0', padding: '15px', background: '#f0f0f0', borderRadius: '5px' }}>
        <h3>This will test:</h3>
        <ul>
          <li>Supabase connection</li>
          <li>Talent profile creation</li>
          <li>Database insertion</li>
          <li>Cleanup (deletes test data)</li>
        </ul>
      </div>

      <button 
        onClick={testTalentAddition}
        disabled={isLoading}
        style={{ 
          padding: '15px 30px', 
          background: isLoading ? '#ccc' : '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          fontSize: '16px',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Testing...' : 'Test Talent Addition'}
      </button>

      {testResult && (
        <div style={{ 
          margin: '20px 0', 
          padding: '15px', 
          background: testResult.includes('✅') ? '#d4edda' : '#f8d7da', 
          border: `1px solid ${testResult.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '5px',
          color: testResult.includes('✅') ? '#155724' : '#721c24',
          fontFamily: 'monospace'
        }}>
          <h4>Test Result:</h4>
          <p>{testResult}</p>
        </div>
      )}

      <div style={{ margin: '20px 0', padding: '15px', background: '#e7f3ff', borderRadius: '5px' }}>
        <h3>🔧 Next Steps:</h3>
        <ol>
          <li>Click the test button above</li>
          <li>If it shows ✅ SUCCESS, the main form should work</li>
          <li>If it shows ❌ FAILED, we need to fix the connection</li>
          <li>Check the browser console (F12) for detailed logs</li>
        </ol>
      </div>
    </div>
  );
} 