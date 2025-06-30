"use client";

import React, { useState } from 'react';

export default function DebugPage() {
  const [authForm, setAuthForm] = useState({
    email: '',
    password: ''
  });
  const [debugInfo, setDebugInfo] = useState({});

  // Mock users for authentication (same as main app)
  const mockUsers = [
    {
      email: 'admin@peopleskills.com',
      password: 'admin123',
      role: 'ADMIN',
      name: 'Admin User',
      id: 'admin-1'
    },
    {
      email: 'brand@company.com',
      password: 'brand123',
      role: 'BRAND',
      name: 'Brand Manager',
      id: 'brand-1',
      favorites: [1]
    },
    {
      email: 'talent@model.com',
      password: 'talent123',
      role: 'DIRECT_TALENT',
      name: 'Sarah Chen',
      id: 'talent-1'
    }
  ];

  const handleAuthFormChange = (field, value) => {
    setAuthForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const testLogin = () => {
    const user = mockUsers.find(u => 
      u.email === authForm.email && u.password === authForm.password
    );
    
    if (user) {
      setDebugInfo({
        success: true,
        user: user,
        message: `Login successful! Role: ${user.role}`
      });
    } else {
      setDebugInfo({
        success: false,
        message: 'Login failed - user not found'
      });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 Authentication Debug Page</h1>
      
      <div style={{ margin: '20px 0', padding: '15px', background: '#f0f0f0', borderRadius: '5px' }}>
        <h3>Test Admin Login:</h3>
        <p><strong>Email:</strong> admin@peopleskills.com</p>
        <p><strong>Password:</strong> admin123</p>
        <p><strong>Expected Role:</strong> ADMIN</p>
      </div>

      <div style={{ margin: '20px 0' }}>
        <h3>Try Login:</h3>
        <div style={{ margin: '10px 0' }}>
          <label>Email: </label>
          <input
            type="email"
            value={authForm.email}
            onChange={(e) => handleAuthFormChange('email', e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
            placeholder="admin@peopleskills.com"
          />
        </div>
        <div style={{ margin: '10px 0' }}>
          <label>Password: </label>
          <input
            type="password"
            value={authForm.password}
            onChange={(e) => handleAuthFormChange('password', e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
            placeholder="admin123"
          />
        </div>
        <button 
          onClick={testLogin}
          style={{ marginTop: '10px', padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Test Login
        </button>
      </div>

      {debugInfo.message && (
        <div style={{ 
          margin: '20px 0', 
          padding: '15px', 
          background: debugInfo.success ? '#d4edda' : '#f8d7da', 
          border: `1px solid ${debugInfo.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '5px',
          color: debugInfo.success ? '#155724' : '#721c24'
        }}>
          <h4>{debugInfo.success ? '✅ Success' : '❌ Error'}</h4>
          <p>{debugInfo.message}</p>
          {debugInfo.user && (
            <div>
              <p><strong>User ID:</strong> {debugInfo.user.id}</p>
              <p><strong>Name:</strong> {debugInfo.user.name}</p>
              <p><strong>Role:</strong> {debugInfo.user.role}</p>
            </div>
          )}
        </div>
      )}

      <div style={{ margin: '20px 0', padding: '15px', background: '#e7f3ff', borderRadius: '5px' }}>
        <h3>🔧 Troubleshooting Steps:</h3>
        <ol>
          <li>Try the admin login above</li>
          <li>If it works here but not in the main app, there's a UI issue</li>
          <li>If it doesn't work here, there's a logic issue</li>
          <li>Check the browser console for any JavaScript errors</li>
        </ol>
      </div>
    </div>
  );
} 