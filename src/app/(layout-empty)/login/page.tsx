'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi, storage } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '';

  // Load saved credentials on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
      if (savedRememberMe) {
        const savedUsername = localStorage.getItem('savedUsername') || '';
        const savedPassword = localStorage.getItem('savedPassword') || '';
        setUsername(savedUsername);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    }
  }, []);

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // Simple validation
      if (!username || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      // Username validation
      if (username.length < 3) {
        setError('Username must be at least 3 characters long');
        setLoading(false);
        return;
      }

      // Password validation
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      // Call API
      const response = await authApi.login({
        username,
        password
      });

      if (response.success && response.data) {
        // Save tokens and user data
        storage.setTokens({
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token
        });

        storage.setUser({
          id: response.data.user_id,
          username: response.data.username,
          role: 'user'
        });

        // Save credentials if remember me is checked
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('savedUsername', username);
          localStorage.setItem('savedPassword', password);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('savedUsername');
          localStorage.removeItem('savedPassword');
        }

        // Also set cookie for middleware
        document.cookie = `access_token=${response.data.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

        // Priority: explicit ?redirect= query param > stored intended_url > home
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          const intendedUrl = localStorage.getItem('intended_url');
          if (intendedUrl) {
            localStorage.removeItem('intended_url');
            router.push(intendedUrl);
          } else {
            router.push('/');
          }
        }
      } else {
        // Show specific error message from API
        const errorMsg = response.error || 'Login failed. Please check your username and password.';
        setError(errorMsg);
      }

    } catch (err: unknown) {
      console.error('Login error:', err);
      // Don't show technical error messages to user
      setError('Login failed. Please check your username and password.');
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
          src="/images/Rectangle 3463861.webp"
          alt="Sailboat"
          width={500}
          height={700}
        />

        {/* Circle Background */}
        <div className="auth-logo-container">
          <Image
            src="/icons/Ellipse 46.svg"
            alt="Circle Background"
            width={200}
            height={200}
            className="auth-circle-bg"
          />

          {/* Logo */}
          <div className="auth-logo">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Daffa Logo"
                width={200}
                height={110}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-form-container">
        <div className="auth-form-content">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-black mb-2 text-center font-poppins">
              Welcome Back
            </h1>
            <p className="text-xl font-medium text-gray-500 mb-24 text-center capitalize">
              log in to continue your adventure
            </p>
          </div>

          {/* Form */}
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            {/* Username Field */}
            <div className="mb-8">
              <label className="block text-gray-600 text-sm font-semibold mb-2 capitalize">
                Username
              </label>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="auth-input"
                required
                minLength={3}
              />
            </div>

            {/* Password Field */}
            <div className="mb-5">
              <label className="block text-gray-600 text-sm font-semibold mb-2 capitalize">
                Password
              </label>
              <input
                type="password"
                placeholder="**************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                required
                minLength={6}
              />
            </div>

            {/* Remember Me & Forget Password */}
            <div className="flex justify-between items-center mb-10">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${rememberMe
                    ? 'bg-[#093b77] border-[#093b77]'
                    : 'bg-white border-gray-400 hover:border-gray-500'
                    }`}
                >
                  {rememberMe && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
                <span className="text-gray-500 capitalize">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                onClick={() => router.push('/forgot-password')}
                className="auth-link-button capitalize"
              >
                Forget Password?
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="auth-error-message">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="auth-submit-button"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-base text-gray-500 capitalize">
              You Don&apos;t Have An Account?{' '}
              <button
                type="button"
                onClick={() => router.push(redirectTo ? `/signup?redirect=${encodeURIComponent(redirectTo)}` : '/signup')}
                className="auth-link-button"
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
