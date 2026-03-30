'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { customerApi, storage } from '@/lib/api';
import { FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const user = storage.getUser();

  const fetchProfile = useCallback(async () => {
    try {
      const res = await customerApi.getProfile();
      if (res.success && res.data) {
        const data = res.data;
        const nameParts = (data.username || '').split(' ');
        setFirstName(nameParts[0] || '');
        setLastName(nameParts.slice(1).join(' ') || '');
        setEmail(data.email || '');
        setAddress(data.address || '');
      }
    } catch {
      if (user) {
        const nameParts = (user.username || '').split(' ');
        setFirstName(nameParts[0] || '');
        setLastName(nameParts.slice(1).join(' ') || '');
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await customerApi.updateProfile({ bio: '', phone: '', address });
      if (res.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        toast.error(res.error || 'Failed to update profile');
      }
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#093b77]" />
      </div>
    );
  }

  const displayName = `${firstName} ${lastName}`.trim() || user?.username || 'User';

  const TABS = [
    { key: 'profile', label: 'Profile' },
    { key: 'account', label: 'Manage My Account' },
    { key: 'payment', label: 'My Payment Options' },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Left Sidebar */}
        <div className="w-full lg:w-[290px] flex-shrink-0">
          <div className="lg:sticky lg:top-24">
            {/* Welcome */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-[42px] font-bold text-black leading-tight">
                Welcome!{' '}
                <span className="text-[#106bd8] block">{firstName || user?.username}</span>
              </h1>
            </div>

            {/* Profile Card */}
            <div className="border-b border-black/10 rounded-b-2xl pb-6 mb-4">
              <div className="flex flex-col items-center gap-4">
                <div className="w-[90px] h-[90px] rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-3xl font-semibold">
                  {firstName.charAt(0).toUpperCase() || 'U'}
                </div>
                <p className="text-xl font-semibold text-[#0f172a]">{displayName}</p>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-6 py-2.5 border border-[#e2e8f0] rounded-lg text-sm font-medium text-[#0f172a] hover:bg-gray-50 transition"
                >
                  Edit Profile
                  <FiEdit2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`text-left px-4 py-3 text-sm border-b whitespace-nowrap transition w-full ${
                    activeTab === tab.key
                      ? 'bg-[#093b77] text-white border-[#093b77]'
                      : 'bg-[#fbfbfb] text-[#334155] border-[#fbfbfb] hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-white rounded shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] p-5 sm:p-8 md:p-10 lg:px-[80px] lg:py-10">
              <h2 className="text-xl font-medium text-[#106bd8] mb-6 sm:mb-8">Edit Your Profile</h2>

              {/* Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-[50px] mb-5 sm:mb-6">
                <div>
                  <label className="block text-sm font-semibold text-[#616161] capitalize mb-2">First Name</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={!isEditing}
                    className="auth-input disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#616161] capitalize mb-2">Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={!isEditing}
                    className="auth-input disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Email + Address Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-[50px] mb-5 sm:mb-6">
                <div>
                  <label className="block text-sm font-semibold text-[#616161] capitalize mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    disabled
                    className="auth-input opacity-50 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#616161] capitalize mb-2">Address</label>
                  <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={!isEditing}
                    className="auth-input disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Password Section */}
              <div className="space-y-4 mb-8">
                <label className="block text-sm font-semibold text-[#616161] capitalize">Password Changes</label>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={!isEditing}
                  className="auth-input w-full disabled:opacity-60"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={!isEditing}
                  className="auth-input w-full disabled:opacity-60"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={!isEditing}
                  className="auth-input w-full disabled:opacity-60"
                />
              </div>

              {/* Buttons */}
              {isEditing && (
                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 sm:gap-8">
                  <button
                    onClick={handleCancel}
                    className="text-base text-black hover:text-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full sm:w-auto bg-[#093b77] text-white px-8 sm:px-12 py-3 sm:py-4 rounded-lg text-base hover:bg-[#0a4a94] transition disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'account' && (
            <div className="bg-white rounded shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] p-5 sm:p-8 md:p-10">
              <h2 className="text-xl font-medium text-[#106bd8] mb-4">Manage My Account</h2>
              <p className="text-gray-500">Account management features coming soon.</p>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="bg-white rounded shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] p-5 sm:p-8 md:p-10">
              <h2 className="text-xl font-medium text-[#106bd8] mb-4">My Payment Options</h2>
              <p className="text-gray-500">Payment management features coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
