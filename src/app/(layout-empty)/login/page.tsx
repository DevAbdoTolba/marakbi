'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, storage } from '@/lib/api';
import Image from 'next/image';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      if (!username || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (username.length < 3) {
        setError('Username must be at least 3 characters long');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      const response = await authApi.login({ username, password });

      if (response.success && response.data) {
        storage.setTokens({
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
        });

        storage.setUser({
          id: response.data.user_id,
          username: response.data.username,
          role: 'user',
        });

        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('savedUsername', username);
          localStorage.setItem('savedPassword', password);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('savedUsername');
          localStorage.removeItem('savedPassword');
        }

        document.cookie = `access_token=${response.data.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

        const intendedUrl = localStorage.getItem('intended_url');
        if (intendedUrl) {
          localStorage.removeItem('intended_url');
          router.push(intendedUrl);
        } else {
          router.push('/');
        }
      } else {
        setError(
          response.error ||
            'Login failed. Please check your username and password.'
        );
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
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
          src="/images/Rectangle 3463861.png"
          alt="Sailboat"
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
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-3xl md:text-[42px] font-bold text-black mb-2 text-center">
              Welcome Back
            </h1>
            <p className="text-base md:text-[22px] font-medium text-[#7d7d7d] text-center capitalize">
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
            className="mt-8 md:mt-16"
          >
            {/* Email Field */}
            <div className="mb-5 md:mb-7">
              <label className="block text-[#616161] text-sm font-semibold mb-2 capitalize">
                Email
              </label>
              <input
                type="text"
                placeholder="Email address"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="auth-input"
                required
                minLength={3}
              />
            </div>

            {/* Password Field */}
            <div className="mb-4 md:mb-5">
              <label className="block text-[#616161] text-sm font-semibold mb-2 capitalize">
                Password
              </label>
              <div className="auth-input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="**************"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input pr-12"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-eye-icon"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forget Password */}
            <div className="flex justify-between items-center mb-8 md:mb-12">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    rememberMe
                      ? 'bg-[#093b77] border-[#093b77]'
                      : 'bg-white border-[#7d7d7d]'
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
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-[#7d7d7d] text-base capitalize">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                onClick={() => router.push('/forgot-password')}
                className="auth-link-button capitalize text-sm md:text-base"
              >
                Forget Password?
              </button>
            </div>

            {/* Error Message */}
            {error && <div className="auth-error-message">{error}</div>}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="auth-submit-button"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-base text-[#7d7d7d] capitalize">
              you don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/signup')}
                className="auth-link-button"
              >
                Sign up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
