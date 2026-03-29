'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { authApi, storage } from '@/lib/api';

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
  "cy","ua","by","md","ge","am","az","kz","uz","cl","pe","co","ve","ec",
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const clearFieldError = (field: string) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSignUp = async () => {
    setFieldErrors({});
    setSuccess('');
    setLoading(true);

    // Client-side validation
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
        // Auto-login after successful registration
        const loginRes = await authApi.login({ username: fullName, password });
        if (loginRes.success && loginRes.data) {
          storage.setTokens({
            access_token: loginRes.data.access_token,
            refresh_token: loginRes.data.refresh_token,
          });
          storage.setUser({
            id: loginRes.data.user_id,
            username: loginRes.data.username,
            role: 'user',
          });
          document.cookie = `access_token=${loginRes.data.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
          router.push('/');
        } else {
          // Fallback: redirect to login if auto-login fails
          setSuccess('Account created! Redirecting to login...');
          setTimeout(() => router.push('/login'), 1500);
        }
      } else {
        // Map backend field errors to our field error state
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

  const EyeOffIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  const EyeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const inputClass = (field: string) =>
    `auth-input ${fieldErrors[field] ? 'border border-red-500 !bg-red-50/30' : ''}`;

  const inputGroupClass = (field: string) =>
    `auth-input-group ${fieldErrors[field] ? '[&>.auth-input]:border [&>.auth-input]:border-red-500 [&>.auth-input]:!bg-red-50/30' : ''}`;

  return (
    <div className="auth-page-container">
      {/* Left Side - Image */}
      <div className="auth-left-side auth-left-side--wide">
        <Image
          className="auth-left-image"
          src="/images/Rectangle 3463873.png"
          alt="Yacht background"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
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
          <div className="mb-4 md:mb-6">
            <h1 className="text-3xl md:text-[42px] font-bold text-black mb-1 text-center">
              Welcome Back
            </h1>
            <p className="text-base md:text-[22px] font-medium text-[#7d7d7d] text-center">
              Join us and start your next adventure
            </p>
          </div>

          {/* General Error */}
          {fieldErrors._general && (
            <div className="auth-error-message">{fieldErrors._general}</div>
          )}

          {/* Success Message */}
          {success && <div className="auth-success-message">{success}</div>}

          {/* Form */}
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              handleSignUp();
            }}
            className="mt-4 md:mt-6"
          >
            {/* Full Name Field */}
            <div className="mb-4 md:mb-5">
              <label className="block text-[#616161] text-sm font-semibold mb-2 capitalize">
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
                {fieldErrors.username || '\u00A0'}
              </p>
            </div>

            {/* Email Field */}
            <div className="mb-4 md:mb-5">
              <label className="block text-[#616161] text-sm font-semibold mb-2 capitalize">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); }}
                className={inputClass('email')}
                required
              />
              <p className={`text-xs mt-1 min-h-[16px] ${fieldErrors.email ? 'text-red-500' : 'text-transparent'}`}>
                {fieldErrors.email || '\u00A0'}
              </p>
            </div>

            {/* Password Field */}
            <div className="mb-4 md:mb-5">
              <label className="block text-[#616161] text-sm font-semibold mb-2 capitalize">
                Password
              </label>
              <div className={inputGroupClass('password_hash')}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="**************"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearFieldError('password_hash'); clearFieldError('confirmPassword'); }}
                  className="auth-input pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-eye-icon"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
              <p className={`text-xs mt-1 min-h-[16px] ${fieldErrors.password_hash ? 'text-red-500' : 'text-transparent'}`}>
                {fieldErrors.password_hash || '\u00A0'}
              </p>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4 md:mb-5">
              <label className="block text-[#616161] text-sm font-semibold mb-2 capitalize">
                Confirm Password
              </label>
              <div className={inputGroupClass('confirmPassword')}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="**************"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError('confirmPassword'); }}
                  className="auth-input pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="auth-eye-icon"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
              <p className={`text-xs mt-1 min-h-[16px] ${fieldErrors.confirmPassword ? 'text-red-500' : 'text-transparent'}`}>
                {fieldErrors.confirmPassword || '\u00A0'}
              </p>
            </div>

            {/* Terms Agreement */}
            <div className="mb-5 md:mb-6">
              <label className="flex items-start gap-2 cursor-pointer">
                <div
                  onClick={() => { setAgreeTerms(!agreeTerms); clearFieldError('terms'); }}
                  className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-all duration-200 flex-shrink-0 mt-0.5 cursor-pointer ${
                    fieldErrors.terms
                      ? 'border-red-500 bg-red-50/30'
                      : agreeTerms
                        ? 'bg-[#093b77] border-[#093b77]'
                        : 'bg-white border-[#7d7d7d]'
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
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm md:text-base leading-snug ${fieldErrors.terms ? 'text-red-500' : 'text-black'}`}>
                  I agree to the{' '}
                  <a href="/terms" className="text-[#106bd8] underline">
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a href="/privacy" className="text-[#106bd8] underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
              <p className={`text-xs mt-1 min-h-[16px] ${fieldErrors.terms ? 'text-red-500' : 'text-transparent'}`}>
                {fieldErrors.terms || '\u00A0'}
              </p>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="auth-submit-button"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>

            {/* Sign In Link */}
            <p className="text-center text-base text-[#7d7d7d] capitalize mb-4">
              you have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="auth-link-button"
              >
                Sign in
              </button>
            </p>

            {/* Separator */}
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-[#7d7d7d] opacity-30" />
              <span className="px-4 text-base text-[#7d7d7d] whitespace-nowrap">
                Or continue with
              </span>
              <div className="flex-1 h-px bg-[#7d7d7d] opacity-30" />
            </div>

            {/* Social Login Icons */}
            <div className="flex justify-center items-center gap-6 mt-4">
              <button
                type="button"
                onClick={() => console.log('Facebook login clicked')}
                className="w-12 h-12 rounded-full border-none cursor-pointer bg-transparent flex items-center justify-center p-2"
              >
                <Image src="/icons/flat-color-icons_fb.svg" alt="Facebook" width={32} height={32} />
              </button>
              <button
                type="button"
                onClick={() => console.log('Google login clicked')}
                className="w-12 h-12 rounded-full border-none cursor-pointer bg-transparent flex items-center justify-center p-2"
              >
                <Image src="/icons/flat-color-icons_google.svg" alt="Google" width={32} height={32} />
              </button>
              <button
                type="button"
                onClick={() => console.log('Apple login clicked')}
                className="w-12 h-12 rounded-full border-none cursor-pointer bg-transparent flex items-center justify-center p-2"
              >
                <Image src="/icons/flat-color-icons_apple.svg" alt="Apple" width={32} height={32} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
