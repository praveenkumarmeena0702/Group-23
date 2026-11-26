import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { requestPasswordReset } from '@/services/api';
import { AuthLayout } from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [demoToken, setDemoToken] = useState<string | undefined>(undefined);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Enter a valid email address.');
      return;
    }

    setPending(true);
    try {
      const res = await requestPasswordReset(email.trim());
      setDemoToken(res.demoToken);
      setSubmitted(true);
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter the email linked to your ParkEase account to receive recovery instructions."
    >
      {submitted ? (
        <div className="space-y-4">
          <div className="rounded-[20px] border border-[#E9EDF2] bg-white p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#3B82F6]" />
              <div>
                <p className="text-sm font-semibold text-[#171717]">Check your inbox</p>
                <p className="mt-1 text-xs leading-relaxed text-[#737373]">
                  If an account exists for <span className="font-medium text-[#171717]">{email}</span>,
                  we have sent password reset instructions.
                </p>
              </div>
            </div>
          </div>

          {demoToken && (
            <div className="rounded-[16px] bg-[#EFF6FF] p-3.5 text-xs text-[#3B82F6]">
              Local preview reset link:{' '}
              <Link to={`/reset-password?token=${demoToken}`} className="font-semibold underline">
                Open reset password page
              </Link>
            </div>
          )}

          <Button asChild variant="outline" className="w-full">
            <Link to="/login">
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="forgot-email" className="block text-[12px] font-medium text-[#171717]">
              Email address
            </label>
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1.5 h-11 w-full rounded-[14px] border border-[#E9EDF2] bg-white px-3.5 text-sm text-[#171717] placeholder:text-[#737373]/70 focus:border-[#3B82F6] focus:outline-none"
            />
            {emailError && <p className="mt-1 text-xs text-red-600">{emailError}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending instructions...
              </>
            ) : (
              'Send reset link'
            )}
          </Button>

          <p className="pt-2 text-center text-xs text-[#737373]">
            Remembered your password?{' '}
            <Link to="/login" className="font-medium text-[#3B82F6] hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
