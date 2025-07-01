"use client";

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase.js';

export default function TestSchema() {
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testSchema = async () => {
    setIsLoading(true);
    setTestResult('Testing database schema...');

    try {
      console.log('🔍 Testing database schema...');
      
      // Try to get table info
      const { data, error } = await supabase
        .from('talent_profiles')
        .select('*')
        .limit(1);

      if (error) {
        console.error('❌ Schema error:', error);
        setTestResult(`❌ SCHEMA ERROR: ${error.message}`);
        return;
      }

      console.log('✅ Schema test successful');
      console.log('📊 Sample data structure:', data);
      
      // Try to insert minimal test data
      const testTalent = {
        full_name: 'Schema Test - ' + new Date().toISOString(),
        bio: 'Testing schema compatibility',
        status: 'pending'
      };

      console.log('📤 Testing insert with minimal data:', testTalent);

      const { data: insertData, error: insertError } = await supabase
        .from('talent_profiles')
        .insert([testTalent])
        .select();

      if (insertError) {
        console.error('❌ Insert error:', insertError);
        setTestResult(`❌ INSERT ERROR: ${insertError.message}`);
        return;
      }

      console.log('✅ Insert successful:', insertData);
      setTestResult(`✅ SUCCESS! Schema is compatible. Created: ${insertData[0].full_name}`);

      // Clean up
      const { error: deleteError } = await supabase
        .from('talent_profiles')
        .delete()
        .eq('id', insertData[0].id);

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
      <h1>🔍 Database Schema Test</h1>
      
      <div style={{ margin: '20px 0', padding: '15px', background: '#f0f0f0', borderRadius: '5px' }}>
        <h3>This will test:</h3>
        <ul>
          <li>Database connection</li>
          <li>Table structure</li>
          <li>Minimal data insertion</li>
          <li>Schema compatibility</li>
        </ul>
      </div>

      <button 
        onClick={testSchema}
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
        {isLoading ? 'Testing...' : 'Test Database Schema'}
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

      <div style={{ margin: '20px 0', padding: '15px', background: '#fff3cd', borderRadius: '5px', border: '1px solid #ffeaa7' }}>
        <h3>🔄 Cache Refresh Instructions:</h3>
        <ol>
          <li>Press <strong>Ctrl + Shift + R</strong> (or <strong>Cmd + Shift + R</strong> on Mac) to hard refresh</li>
          <li>Or open a new incognito/private window</li>
          <li>Then try the talent addition again</li>
        </ol>
      </div>
    </div>
  );
} 