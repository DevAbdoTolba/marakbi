'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';


export default function VerifyCodePage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();

  // Timer for resend functionality
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    setError('');
  };

  const handleVerify = async () => {
    setError('');
    setLoading(true);

    try {
      // Check if code is entered
      if (!code) {
        setError('Please enter the verification code');
        setLoading(false);
        return;
      }

      // Call API
      const response = await authApi.verifyCode(code);

      if (response.success) {
        // Navigate to set password page on success
        router.push('/set-password');
      } else {
        setError(response.error || 'Invalid verification code. Please try again.');
      }

    } catch (err) {
      console.error('Verification error:', err);
      setError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setResendTimer(60);
    setCanResend(false);
    setError('');

    try {
      const response = await authApi.resendCode();

      if (!response.success) {
        setError(response.error || 'Failed to resend code. Please try again.');
      }

    } catch (err) {
      console.error('Resend error:', err);
      setError('Failed to resend code. Please try again.');
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
          src="/images/Rectangle 3463875.webp"
          alt="Verification background"
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
                alt="Marakbi Logo"
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
          {/* Navigation */}
          <div className="flex items-center mb-16">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="auth-back-button"
            >
              <i className="fas fa-angle-left text-lg"></i>
              Back to login
            </button>
          </div>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-black mb-3 text-left font-poppins">
              Verify code
            </h1>
            <p className="text-base text-black mb-10 text-left font-poppins">
              An authentication code has been sent to your email.
            </p>
          </div>

          {/* Verification Code Form */}
          <form noValidate>
            {/* Code Input */}
            <div className="mb-6">
              <label className="block text-black text-base mb-2">
                Enter Code
              </label>
              <input
                type="password"
                placeholder="**************"
                value={code}
                onChange={handleCodeChange}
                className="auth-input h-12 px-4"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="auth-error-message text-center">
                {error}
              </div>
            )}

            {/* Resend Section */}
            <div className="mb-6">
              {canResend ? (
                <p className="text-base text-black">
                  Didn&apos;t Receive A Code?{' '}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={loading}
                    className={`text-blue-600 font-medium bg-none border-none cursor-pointer text-base underline ${loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    Resend
                  </button>
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  Resend code in {resendTimer}s
                </p>
              )}
            </div>

            {/* Verify Button */}
            <button
              type="button"
              onClick={handleVerify}
              disabled={loading || !code}
              className={`w-[70%] h-12 bg-blue-800 rounded-lg border-none text-white text-base font-medium cursor-pointer transition-colors ${loading || !code ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-900'
                } ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
