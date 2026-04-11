'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api';
import Image from 'next/image';

export default function SetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  useEffect(() => {
    if (!token) {
      router.push('/forgot-password');
    }
  }, [token, router]);

  const handleSetPassword = async () => {
    setError('');
    setLoading(true);

    try {
      if (!password || !confirmPassword) {
        setError('Please fill in all password fields');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      const response = await authApi.resetPassword(token, password);

      if (response.success) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(response.error || 'Failed to set password. Please try again.');
      }
    } catch {
      setError('Failed to set password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Left Side - Image */}
      <div className="auth-left-side">
        <Image
          className="auth-left-image"
          src="/images/Rectangle 3463876.webp"
          alt="Set password background"
          fill
          sizes="(max-width: 768px) 100vw, 43vw"
          priority
        />
        <div className="auth-logo-container">
          <Image
            src="/icons/Ellipse 46.svg"
            alt=""
            width={174}
            height={174}
            className="auth-circle-bg"
          />
          <div className="auth-logo">
            <Image src="/logo.png" alt="Marakbi Logo" width={200} height={110} />
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-form-container">
        <div className="auth-form-content">
          {/* Navigation */}
          <div className="flex items-center mb-10 md:mb-16">
            <button
              type="button"
              onClick={() => router.back()}
              className="auth-back-button"
            >
              <i className="fas fa-angle-left text-lg"></i>
              Back
            </button>
          </div>

          {/* Header */}
          <div className="mb-8 md:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3 text-left font-poppins">
              Set a password
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mb-6 md:mb-10 text-left leading-relaxed font-poppins">
              Your previous password has been reset. Please set a new password for your account.
            </p>
          </div>

          {/* Password Form */}
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              handleSetPassword();
            }}
          >
            {/* Create Password Field */}
            <div className="mb-6">
              <label className="block text-black text-base mb-2">Create Password</label>
              <input
                type="password"
                placeholder="**************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input h-12 px-4"
                required
              />
            </div>

            {/* Re-Enter Password Field */}
            <div className="mb-6">
              <label className="block text-black text-base mb-2">Re-Enter Password</label>
              <input
                type="password"
                placeholder="**************"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-input h-12 px-4"
                required
              />
            </div>

            {/* Error Message */}
            {error && <div className="auth-error-message">{error}</div>}

            {/* Success Message */}
            {success && <div className="auth-success-message">{success}</div>}

            {/* Set Password Button */}
            <button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className="auth-submit-button"
            >
              {loading ? 'Setting Password...' : 'Set Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
