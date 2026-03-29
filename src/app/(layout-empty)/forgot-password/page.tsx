'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { authApi } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Simple validation
      if (!email) {
        setError('Please enter your email address');
        setLoading(false);
        return;
      }

      // Call API
      const response = await authApi.forgotPassword(email);

      if (response.success) {
        setSuccess(response.data?.message || 'Password reset code has been sent to your email');

        // Navigate to verification page after showing success message
        setTimeout(() => {
          router.push('/verify-code');
        }, 1500);
      } else {
        setError(response.error || 'Failed to send reset code. Please try again.');
      }

    } catch (err) {
      console.error('Password reset error:', err);
      setError('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = () => {
    console.log('Facebook login clicked');
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  const handleAppleLogin = () => {
    console.log('Apple login clicked');
  };

  return (
    <div className="auth-page-container">
      {/* Left Side - Image */}
      <div className="auth-left-side">
        <Image
          className="auth-left-image"
          src="/images/Rectangle 3463879.png"
          alt="Boat background"
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
            <Image
              src="/logo.png"
              alt="Marakbi Logo"
              width={200}
              height={110}
            />
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-form-container">
        <div className="auth-form-content">
          {/* Back to Login Link */}
          <div className="mb-10">
            <button
              onClick={() => router.push('/login')}
              className="auth-back-button"
            >
              <i className="fas fa-angle-left text-lg"></i>
              Back to login
            </button>
          </div>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-5xl font-bold text-black mb-5 text-left leading-tight font-poppins">
              Forgot your password?
            </h1>
            <p className="text-base text-black mb-10 leading-relaxed font-poppins">
              Don&apos;t worry, happens to all of us. Enter your email below to recover your password
            </p>
          </div>

          {/* Form */}
          <form noValidate>
            {/* Email Field */}
            <div className="mb-8">
              <label className="block text-black text-base mb-3">
                Email
              </label>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input h-15 px-4"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="auth-error-message">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="auth-submit-button mb-10"
            >
              {loading ? 'Sending...' : 'Submit'}
            </button>

            {/* Separator */}
            <div className="flex items-center my-10">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="px-4 text-base text-gray-400 font-normal">
                Or login with
              </span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* Social Login Icons */}
            <div className="flex justify-between items-center w-full px-20">
              {/* Facebook */}
              <button
                type="button"
                onClick={handleFacebookLogin}
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
                onClick={handleGoogleLogin}
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
                onClick={handleAppleLogin}
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
