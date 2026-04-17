'use client';

import { useEffect, useState } from 'react';
// Removed API imports - using local state only
import Header from '../../components/Header';

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: string; fullName: string; email: string; role: string } | null>(null);

  useEffect(() => {
    // Static data - no API calls
    const mockUser = {
      id: '1',
      fullName: 'John Doe',
      email: 'john@example.com',
      role: 'user'
    };
    
    setUser(mockUser);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="solid" currentPage="dashboard" />
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-poppins">Marakbi Dashboard</h1>
              <p className="text-gray-600 font-poppins">Welcome back, {user.fullName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Account Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 font-poppins">Your Account</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <p className="text-gray-900">{user.fullName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="text-gray-900 capitalize">{user.role.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 font-poppins">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <h3 className="font-medium text-gray-900">Browse Boats</h3>
              <p className="text-gray-600 text-sm mt-1">Find your perfect boat rental</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <h3 className="font-medium text-gray-900">My Bookings</h3>
              <p className="text-gray-600 text-sm mt-1">View your reservation history</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <h3 className="font-medium text-gray-900">Profile Settings</h3>
              <p className="text-gray-600 text-sm mt-1">Update your account details</p>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}