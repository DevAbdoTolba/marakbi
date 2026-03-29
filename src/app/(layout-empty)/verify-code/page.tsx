'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api';
import Image from 'next/image';

export default function VerifyCodePage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  useEffect(() => {
    if (!email) {
      router.push('/forgot-password');
    }
  }, [email, router]);

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

  const handleVerify = async () => {
    setError('');
    setLoading(true);

    try {
      if (!code) {
        setError('Please enter the verification code');
        setLoading(false);
        return;
      }

      const response = await authApi.verifyCode(email, code);

      if (response.success && response.data?.reset_token) {
        router.push(`/set-password?token=${encodeURIComponent(response.data.reset_token)}`);
      } else {
        setError(response.error || 'Invalid verification code. Please try again.');
      }
    } catch {
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
      const response = await authApi.resendCode(email);
      if (!response.success) {
        setError(response.error || 'Failed to resend code. Please try again.');
      }
    } catch {
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
          src="/images/Rectangle 3463875.png"
          alt="Verification background"
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
              onClick={() => router.push('/login')}
              className="auth-back-button"
            >
              <i className="fas fa-angle-left text-lg"></i>
              Back to login
            </button>
          </div>

          {/* Header */}
          <div className="mb-8 md:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3 text-left font-poppins">
              Verify code
            </h1>
            <p className="text-sm sm:text-base text-black mb-6 md:mb-10 text-left font-poppins">
              An authentication code has been sent to your email.
            </p>
          </div>

          {/* Verification Code Form */}
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
          >
            {/* Code Input */}
            <div className="mb-6">
              <label className="block text-black text-base mb-2">Enter Code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setError('');
                }}
                className="auth-input h-12 px-4 tracking-[4px] text-center text-lg"
                required
              />
            </div>

            {/* Error Message */}
            {error && <div className="auth-error-message">{error}</div>}

            {/* Resend Section */}
            <div className="mb-6">
              {canResend ? (
                <p className="text-sm sm:text-base text-black">
                  Didn&apos;t receive a code?{' '}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={loading}
                    className="text-[#106bd8] font-medium bg-transparent border-none cursor-pointer text-sm sm:text-base underline disabled:opacity-50"
                  >
                    Resend
                  </button>
                </p>
              ) : (
                <p className="text-sm text-gray-500">Resend code in {resendTimer}s</p>
              )}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="auth-submit-button"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
