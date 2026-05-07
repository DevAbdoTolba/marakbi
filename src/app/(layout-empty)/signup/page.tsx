'use client';

import { useState } from 'react';

export const dynamic = 'force-dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { authApi } from '@/lib/api';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const VALID_TLDS = new Set([
  "com","org","net","edu","gov","mil","int","co","io","dev","app","me",
  "info","biz","name","pro","museum","coop","aero","xyz","online","store",
  "site","tech","space","fun","website","cloud","ai","uk","us","ca","au",
  "de","fr","it","es","nl","be","at","ch","ru","cn","jp","kr","in","br",
  "mx","ar","za","eg","sa","ae","qa","kw","om","bh","jo","lb","ps","iq",
  "ly","tn","ma","dz","sd","sy","ye","tr","pk","bd","lk","mm","th","vn",
  "id","ph","my","sg","hk","tw","nz","se","no","dk","fi","pl","cz","pt",
  "gr","ie","ro","hu","bg","hr","sk","si","lt","lv","ee","is","lu","mt",
  "cy","ua","by","md","ge","am","az","kz","uz","cl","pe","ve","ec",
  "uy","py","bo","cr","pa","do","gt","hn","sv","ni","cu","tt","jm","ht",
]);

function validateEmailClient(email: string): string | null {
  if (!EMAIL_REGEX.test(email)) {
    return "Please enter a valid email address";
  }
  const parts = email.toLowerCase().split("@")[1].split(".");
  const tld = parts[parts.length - 1];
  if (!VALID_TLDS.has(tld)) {
    return "Please enter an email with a valid domain";
  }
  return null;
}

type FieldErrors = Record<string, string>;

export default function SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '';

  const clearFieldError = (field: string) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const inputClass = (field: string) =>
    `auth-input h-12 px-4 ${fieldErrors[field] ? 'border border-red-500 !bg-red-50/30' : ''}`;

  const handleSignUp = async () => {
    setFieldErrors({});
    setSuccess('');
    setLoading(true);

    const errors: FieldErrors = {};

    if (!fullName.trim()) {
      errors.username = 'Full name is required';
    } else if (fullName.trim().length < 3) {
      errors.username = 'Full name must be at least 3 characters';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else {
      const emailErr = validateEmailClient(email);
      if (emailErr) errors.email = emailErr;
    }

    if (!password) {
      errors.password_hash = 'Password is required';
    } else if (password.length < 6) {
      errors.password_hash = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password && password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      errors.terms = 'You must agree to the Terms of Service and Privacy Policy';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.register({
        username: fullName,
        email,
        password,
      });

      if (response.success) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          router.push(redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : '/login');
        }, 2000);
      } else {
        if (response.fieldErrors && Object.keys(response.fieldErrors).length > 0) {
          const mapped: FieldErrors = {};
          for (const [field, messages] of Object.entries(response.fieldErrors)) {
            if (Array.isArray(messages) && messages.length > 0) {
              mapped[field] = messages[0];
            }
          }
          setFieldErrors(mapped);
        } else {
          setFieldErrors({ _general: response.error || 'Sign up failed. Please try again.' });
        }
      }
    } catch (err: unknown) {
      console.error('Sign up error:', err);
      setFieldErrors({
        _general: err instanceof Error ? err.message : 'Sign up failed. Please try again.',
      });
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
                src="/logo_daffa.png"
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

          {/* General Error */}
          {fieldErrors._general && (
            <div className="auth-error-message">{fieldErrors._general}</div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {/* Form */}
          <form noValidate>
            {/* Full Name Field */}
            <div className="mb-3">
              <label className="block text-gray-600 text-sm font-semibold mb-2 capitalize">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your Name"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); clearFieldError('username'); }}
                className={inputClass('username')}
                required
              />
              <p className={`text-xs mt-1 min-h-[16px] ${fieldErrors.username ? 'text-red-500' : 'text-transparent'}`}>
                {fieldErrors.username || ' '}
              </p>
            </div>

            {/* Email Field */}
            <div className="mb-3">
              <label className="block text-gray-600 text-sm font-semibold mb-2 capitalize">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Your@Example.Com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); }}
                className={inputClass('email')}
                required
              />
              <p className={`text-xs mt-1 min-h-[16px] ${fieldErrors.email ? 'text-red-500' : 'text-transparent'}`}>
                {fieldErrors.email || ' '}
              </p>
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <label className="block text-gray-600 text-sm font-semibold mb-2 capitalize">
                Password
              </label>
              <input
                type="password"
                placeholder="**************"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearFieldError('password_hash'); clearFieldError('confirmPassword'); }}
                className={inputClass('password_hash')}
                required
              />
              <p className={`text-xs mt-1 min-h-[16px] ${fieldErrors.password_hash ? 'text-red-500' : 'text-transparent'}`}>
                {fieldErrors.password_hash || ' '}
              </p>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-3">
              <label className="block text-gray-600 text-sm font-semibold mb-2 capitalize">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="**************"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError('confirmPassword'); }}
                className={inputClass('confirmPassword')}
                required
              />
              <p className={`text-xs mt-1 min-h-[16px] ${fieldErrors.confirmPassword ? 'text-red-500' : 'text-transparent'}`}>
                {fieldErrors.confirmPassword || ' '}
              </p>
            </div>

            {/* Terms Agreement */}
            <div className="mb-4">
              <label className="flex items-start gap-3 cursor-pointer text-sm text-gray-500 leading-5">
                <div
                  onClick={() => { setAgreeTerms(!agreeTerms); clearFieldError('terms'); }}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 mt-0.5 ${fieldErrors.terms
                      ? 'border-red-500 bg-red-50/30'
                      : agreeTerms
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
                <span className={fieldErrors.terms ? 'text-red-500' : ''}>
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
              <p className={`text-xs mt-1 min-h-[16px] ${fieldErrors.terms ? 'text-red-500' : 'text-transparent'}`}>
                {fieldErrors.terms || ' '}
              </p>
            </div>

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
                onClick={() => router.push(redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : '/login')}
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
