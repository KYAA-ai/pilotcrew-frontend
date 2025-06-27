import React, { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';

export function ContextTest() {
  const { profile, setProfile, isEmployer, isEmployee } = useProfile();
  const [testCount, setTestCount] = useState(0);

  const testSetProfile = () => {
    const testProfile = {
      id: 'test-123',
      email: 'test@example.com',
      name: 'Test User',
      companyName: 'Test Company',
      isEmailVerified: true
    };
    console.log('🔧 ContextTest: Setting test profile:', testProfile);
    setProfile(testProfile);
    setTestCount(prev => prev + 1);
  };

  const testClearProfile = () => {
    console.log('🔧 ContextTest: Clearing profile');
    setProfile(null);
    setTestCount(prev => prev + 1);
  };

  console.log('🔧 ContextTest: Component render', { 
    profile, 
    testCount,
    isEmployer: isEmployer(),
    isEmployee: isEmployee()
  });

  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="font-bold mb-2">ProfileContext Test</h3>
      <div className="space-y-2 text-sm">
        <p><strong>Profile:</strong> {profile ? 'EXISTS' : 'NULL'}</p>
        <p><strong>Profile Data:</strong> {profile ? JSON.stringify(profile, null, 2) : 'null'}</p>
        <p><strong>Is Employer:</strong> {isEmployer() ? 'Yes' : 'No'}</p>
        <p><strong>Is Employee:</strong> {isEmployee() ? 'Yes' : 'No'}</p>
        <p><strong>Test Count:</strong> {testCount}</p>
        <div className="flex gap-2">
          <button 
            onClick={testSetProfile}
            className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
          >
            Set Test Profile
          </button>
          <button 
            onClick={testClearProfile}
            className="px-3 py-1 bg-red-500 text-white rounded text-xs"
          >
            Clear Profile
          </button>
        </div>
      </div>
    </div>
  );
} 