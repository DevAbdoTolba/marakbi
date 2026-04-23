'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { authApi } from '@/lib/api';


export default function SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validation
      if (!fullName || !email || !password || !confirmPassword) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (!agreeTerms) {
        setError('Please agree to the Terms of Service and Privacy Policy');
        setLoading(false);
        return;
      }

      // Call API
      const response = await authApi.register({
        username: fullName, // Map fullName to username
        email,
        password
      });

      if (response.success) {
        setSuccess('Account created successfully! Redirecting to login...');

        // Navigate to login page after successful registration
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(response.error || 'Sign up failed. Please try again.');
      }

    } catch (err: unknown) {
      console.error('Sign up error:', err);
      setError(err instanceof Error ? err.message : 'Sign up failed. Please try again.');
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
          src="/images/Rectangle 3463873.webp"
          alt="Yacht background"
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
            <h1 className="text-4xl font-bold text-black mb-2 text-center font-poppins">
              Welcome Back
            </h1>
            <p className="text-lg font-medium text-gray-500 mb-8 text-center font-poppins">
              Join us and start your next adventure
            </p>
          </div>

          {/* Form */}
          <form noValidate>
            {/* Full Name Field */}
            <div className="mb-5">
              <label className="block text-gray-600 text-sm font-semibold mb-2 capitalize">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="auth-input h-12 px-4"
                required
              />
            </div>

            {/* Email Field */}
            <div className="mb-5">
              <label className="block text-gray-600 text-sm font-semibold mb-2 capitalize">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Your@Example.Com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input h-12 px-4"
                required
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
                className="auth-input h-12 px-4"
                required
              />
            </div>

            {/* Confirm Password Field */}
            <div className="mb-5">
              <label className="block text-gray-600 text-sm font-semibold mb-2 capitalize">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="**************"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-input h-12 px-4"
                required
              />
            </div>

            {/* Terms Agreement */}
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer text-sm text-gray-500 leading-5">
                <div
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 mt-0.5 ${agreeTerms
                      ? 'bg-[#093b77] border-[#093b77]'
                      : 'bg-white border-gray-400 hover:border-gray-500'
                    }`}
                >
                  {agreeTerms && (
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
                <span>
                  I Agree To The{' '}
                  <a
                    href="#"
                    className="text-blue-600 no-underline"
                  >
                    Terms Of Service
                  </a>
                  {' '}And{' '}
                  <a
                    href="#"
                    className="text-blue-600 no-underline"
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="auth-error-message">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4">
                {success}
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              className="auth-submit-button h-12 mb-5"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-500 mb-5">
              You Have An Account?{' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="auth-link-button"
              >
                Sign In
              </button>
            </p>

            {/* Separator */}
            <div className="flex items-center my-5">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="px-4 text-sm text-gray-400 font-normal">
                Or continue with
              </span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* Social Login Icons */}
            <div className="flex justify-between items-center w-full px-12">
              {/* Facebook */}
              <button
                type="button"
                onClick={() => console.log('Facebook login clicked')}
                className="w-12 h-12 rounded-full border-none cursor-pointer bg-transparent flex items-center justify-center p-2"
              >
                <Image
                  src="/icons/flat-color-icons_fb.svg"
                  alt="Facebook"
                  width={32}
                  height={32}
                />
              </button>

              {/* Google */}
              <button
                type="button"
                onClick={() => console.log('Google login clicked')}
                className="w-12 h-12 rounded-full border-none cursor-pointer bg-transparent flex items-center justify-center p-2"
              >
                <Image
                  src="/icons/flat-color-icons_google.svg"
                  alt="Google"
                  width={32}
                  height={32}
                />
              </button>

              {/* Apple */}
              <button
                type="button"
                onClick={() => console.log('Apple login clicked')}
                className="w-12 h-12 rounded-full border-none cursor-pointer bg-transparent flex items-center justify-center p-2"
              >
                <Image
                  src="/icons/flat-color-icons_apple.svg"
                  alt="Apple"
                  width={32}
                  height={32}
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
