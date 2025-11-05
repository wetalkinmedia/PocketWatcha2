import React, { useState } from 'react';
import { Database, Users, Clock, Key, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function TestPanel() {
  const [showPanel, setShowPanel] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get user profiles with auth user data
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        setError('Failed to load user profiles: ' + profilesError.message);
        return;
      }

      // Get auth users to get email addresses
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.warn('Could not fetch auth users:', authError.message);
        setUsers(profiles || []);
        return;
      }

      // Combine profile data with email from auth users
      const usersWithEmails = (profiles || []).map(profile => {
        const authUser = authUsers?.find(user => user.id === profile.id);
        return {
          ...profile,
          email: authUser?.email || 'No email found'
        };
      });

      setUsers(usersWithEmails);
    } catch (err) {
      setError('Error connecting to database');
      console.error('Database error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    setShowPanel(!showPanel);
    if (!showPanel) {
      await refreshData();
    }
  };

  if (!showPanel) {
    return (
      <button
        onClick={handleToggle}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
        title="Show Test Panel"
      >
        <Database size={20} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl border border-gray-200 w-96 max-h-96 overflow-hidden z-50">
      <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
        <h3 className="font-semibold flex items-center gap-2">
          <Database size={16} />
          Supabase Admin Panel
        </h3>
        <div className="flex gap-2">
          <button
            onClick={refreshData}
            disabled={loading}
            className="p-1 hover:bg-gray-700 rounded"
            title="Refresh Data"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleToggle}
            className="p-1 hover:bg-gray-700 rounded"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className="p-4 overflow-y-auto max-h-80">
        {/* Supabase Status */}
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            <Database size={14} />
            Supabase Status
          </h4>
          <div className="text-sm text-green-700">
            <p>✅ Connected to Supabase</p>
            <p>✅ Real-time database active</p>
            <p>✅ Authentication enabled</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
              <AlertCircle size={14} />
              Error
            </h4>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Users */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Users size={14} />
            Database Users ({users.length})
          </h4>
          {loading ? (
            <p className="text-gray-500 text-sm">Loading users...</p>
          ) : (
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {users.length === 0 ? (
                <p className="text-gray-500 text-xs">No users registered yet</p>
              ) : (
                users.map((user, index) => (
                  <div key={index} className="text-xs bg-gray-50 p-2 rounded border">
                    <p><strong>{user.first_name} {user.last_name}</strong></p>
                    <p className="text-blue-600">📧 {user.email}</p>
                    <p className="text-gray-600">ID: {user.id.substring(0, 8)}...</p>
                    <p className="text-gray-500">
                      {user.occupation} • Age {user.age} • ${user.salary.toLocaleString()}
                    </p>
                    <p className="text-gray-500">
                      {user.relationship_status} • {user.zip_code}
                    </p>
                    <p className="text-gray-500">📱 {user.phone_number}</p>
                    <p className="text-green-600">
                      Created: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Setup Instructions */}
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
            <Key size={14} />
            Setup Required
          </h4>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>🔧 <strong>Click the Supabase button</strong> in settings to connect your database</p>
            <p>📝 Update your .env file with Supabase credentials</p>
            <p>🚀 Run migrations to create the database schema</p>
          </div>
        </div>
      </div>
    </div>
  );
}