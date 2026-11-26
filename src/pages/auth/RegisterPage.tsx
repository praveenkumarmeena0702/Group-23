import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Loader2, MailCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { resendEmailOtp } from '@/services/api';
import { AuthLayout } from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';

export function RegisterPage() {
  const { signUp, verifyEmailOtp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/bookings';

  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [pending, setPending] = useState(false);

  // OTP verification state
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [demoOtp, setDemoOtp] = useState<string | undefined>(undefined);
  const [resendSeconds, setResendSeconds] = useState(30);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (step !== 'otp' || resendSeconds <= 0) return;
    const timer = window.setTimeout(() => setResendSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [step, resendSeconds]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    setFormError('');

    if (!name.trim()) nextErrors.name = 'Enter your name.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }
    if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);
    try {
      const res = await signUp(name.trim(), email.trim(), password);
      setDemoOtp(res.demoOtpCode);
      setStep('otp');
      setResendSeconds(30);
      toast({
        title: 'Verification code sent',
        description: `Enter the 6-digit code sent to ${res.email}.`,
        variant: 'info',
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to create account.');
    } finally {
      setPending(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '');
    if (!clean) {
      setOtpDigits((prev) => {
        const next = [...prev];
        next[index] = '';
        return next;
      });
      return;
    }

    if (clean.length > 1) {
      const chars = clean.slice(0, 6).split('');
      setOtpDigits((prev) => prev.map((_, i) => chars[i] ?? ''));
      const focusIdx = Math.min(5, chars.length);
      inputRefs.current[focusIdx]?.focus();
      return;
    }

    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = clean;
      return next;
    });
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setFormError('Enter all 6 digits from your verification email.');
      return;
    }

    setPending(true);
    try {
      await verifyEmailOtp(email.trim(), code);
      toast({
        title: 'Email verified',
        description: 'Your ParkEase account is active.',
        variant: 'success',
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Verification failed.');
    } finally {
      setPending(false);
    }
  };

  const handleResend = async () => {
    if (resendSeconds > 0) return;
    try {
      const res = await resendEmailOtp(email.trim());
      if (res.demoOtpCode) setDemoOtp(res.demoOtpCode);
      setResendSeconds(30);
      toast({ title: 'Code resent', description: `Fresh 6-digit code sent to ${email}.`, variant: 'info' });
    } catch (err) {
      toast({
        title: 'Could not resend code',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'error',
      });
    }
  };

  if (step === 'otp') {
    return (
      <AuthLayout
        title="Check your email"
        subtitle={`We sent a 6-digit verification code to ${email}. Enter it below to activate your account.`}
      >
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div className="flex items-center gap-2.5 rounded-[16px] bg-[#EFF6FF] px-4 py-3 text-xs text-[#3B82F6]">
            <MailCheck className="h-4 w-4 shrink-0" />
            <span>
              Your account remains signed out until verification succeeds.
              {demoOtp ? ` Local preview code: ${demoOtp}` : ''}
            </span>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#171717]">
              6-digit verification code
            </label>
            <div className="mt-2 grid grid-cols-6 gap-2">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  aria-label={`OTP digit ${idx + 1}`}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                  className="h-12 w-full rounded-[14px] border border-[#E9EDF2] bg-white text-center font-mono text-lg font-semibold text-[#171717] focus:border-[#3B82F6] focus:outline-none"
                />
              ))}
            </div>
          </div>

          {formError && (
            <p className="rounded-[12px] border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
              {formError}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Verify & sign in
                <ArrowRight className="arrow-slide h-4 w-4" />
              </>
            )}
          </Button>

          <div className="flex items-center justify-between pt-1 text-xs text-[#737373]">
            <button
              type="button"
              onClick={() => setStep('details')}
              className="hover:text-[#171717]"
            >
              Change email
            </button>
            <button
              type="button"
              disabled={resendSeconds > 0}
              onClick={handleResend}
              className="font-medium text-[#3B82F6] disabled:text-[#737373]"
            >
              {resendSeconds > 0 ? `Resend in ${resendSeconds}s` : 'Resend code'}
            </button>
          </div>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Reserve parking bays in seconds and access instant digital passes across Mumbai."
    >
      <form onSubmit={handleRegisterSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="reg-name" className="block text-[12px] font-medium text-[#171717]">
            Full name
          </label>
          <input
            id="reg-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Aarav Mehta"
            className="mt-1.5 h-11 w-full rounded-[14px] border border-[#E9EDF2] bg-white px-3.5 text-sm text-[#171717] placeholder:text-[#737373]/70 focus:border-[#3B82F6] focus:outline-none"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="reg-email" className="block text-[12px] font-medium text-[#171717]">
            Email address
          </label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1.5 h-11 w-full rounded-[14px] border border-[#E9EDF2] bg-white px-3.5 text-sm text-[#171717] placeholder:text-[#737373]/70 focus:border-[#3B82F6] focus:outline-none"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="reg-password" className="block text-[12px] font-medium text-[#171717]">
            Password
          </label>
          <input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="mt-1.5 h-11 w-full rounded-[14px] border border-[#E9EDF2] bg-white px-3.5 text-sm text-[#171717] placeholder:text-[#737373]/70 focus:border-[#3B82F6] focus:outline-none"
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="reg-confirm" className="block text-[12px] font-medium text-[#171717]">
            Confirm password
          </label>
          <input
            id="reg-confirm"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
            className="mt-1.5 h-11 w-full rounded-[14px] border border-[#E9EDF2] bg-white px-3.5 text-sm text-[#171717] placeholder:text-[#737373]/70 focus:border-[#3B82F6] focus:outline-none"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        {formError && (
          <p className="rounded-[12px] border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
            {formError}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="arrow-slide h-4 w-4" />
            </>
          )}
        </Button>

        <p className="pt-2 text-center text-xs text-[#737373]">
          Already have an account?{' '}
          <Link
            to={`/login${redirectTo !== '/bookings' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
            className="font-medium text-[#3B82F6] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
