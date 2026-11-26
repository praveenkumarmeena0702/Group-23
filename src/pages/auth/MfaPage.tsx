import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Copy, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import * as api from '@/services/api';
import { AuthLayout } from '@/components/AuthLayout';
import { QrCodeSvg } from '@/components/QrCodeSvg';
import { Button } from '@/components/ui/button';

export function MfaPage() {
  const { user, pendingMfa, completeMfaChallenge, clearPendingMfa, setUserProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/bookings';

  // Challenge state
  const [challengeCode, setChallengeCode] = useState('');
  const [challengeError, setChallengeError] = useState('');
  const [pending, setPending] = useState(false);

  // Enrollment state
  const [enrollData, setEnrollData] = useState<{
    factorId: string;
    secret: string;
    otpauthUri: string;
    recoveryCodes: string[];
  } | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [enrollError, setEnrollError] = useState('');
  const [copiedCodes, setCopiedCodes] = useState(false);

  // 1) Sign-in MFA Challenge flow
  if (pendingMfa) {
    const handleChallengeSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setChallengeError('');
      if (!challengeCode.trim()) {
        setChallengeError('Enter your 6-digit authenticator code or a recovery code.');
        return;
      }
      setPending(true);
      try {
        await completeMfaChallenge(challengeCode.trim());
        toast({ title: 'Verified', description: 'Two-factor check complete.', variant: 'success' });
        navigate(redirectTo, { replace: true });
      } catch (err) {
        setChallengeError(err instanceof Error ? err.message : 'Verification failed.');
      } finally {
        setPending(false);
      }
    };

    return (
      <AuthLayout
        title="Two-factor verification"
        subtitle={`Enter the 6-digit code from your authenticator app for ${pendingMfa.user.email}, or use a single-use recovery code.`}
      >
        <form onSubmit={handleChallengeSubmit} className="space-y-4">
          <div>
            <label htmlFor="mfa-code" className="block text-[12px] font-medium text-[#171717]">
              Authenticator or recovery code
            </label>
            <input
              id="mfa-code"
              type="text"
              value={challengeCode}
              onChange={(e) => setChallengeCode(e.target.value)}
              placeholder="123456 or XXXX-XXXX"
              className="mt-1.5 h-11 w-full rounded-[14px] border border-[#E9EDF2] bg-white px-3.5 font-mono text-base tracking-wider text-[#171717] focus:border-[#3B82F6] focus:outline-none"
            />
            {challengeError && <p className="mt-1 text-xs text-red-600">{challengeError}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify & continue'
            )}
          </Button>

          <button
            type="button"
            onClick={() => {
              clearPendingMfa();
              navigate('/login');
            }}
            className="w-full pt-1 text-center text-xs text-[#737373] hover:text-[#171717]"
          >
            Back to sign in
          </button>
        </form>
      </AuthLayout>
    );
  }

  // 2) Not signed in
  if (!user) {
    return (
      <AuthLayout
        title="Two-factor security"
        subtitle="Sign in to enroll an authenticator app or manage your recovery codes."
      >
        <Button asChild size="lg" className="w-full">
          <Link to="/login?redirect=/mfa">Sign in to continue</Link>
        </Button>
      </AuthLayout>
    );
  }

  // 3) Signed-in MFA Enrollment & Management
  const startEnrollment = async () => {
    setPending(true);
    setEnrollError('');
    try {
      const data = await api.enrollMfa(user);
      setEnrollData(data);
    } catch (err) {
      toast({
        title: 'Could not start enrollment',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'error',
      });
    } finally {
      setPending(false);
    }
  };

  const confirmEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollData) return;
    setEnrollError('');
    setPending(true);
    try {
      const updated = await api.verifyMfaEnrollment(
        enrollData.factorId,
        verifyCode,
        user,
        enrollData.secret,
        enrollData.recoveryCodes,
      );
      setUserProfile(updated);
      setEnrollData(null);
      setVerifyCode('');
      toast({
        title: 'Two-factor enabled',
        description: 'Your account is now protected with an authenticator app.',
        variant: 'success',
      });
    } catch (err) {
      setEnrollError(err instanceof Error ? err.message : 'Invalid verification code.');
    } finally {
      setPending(false);
    }
  };

  const handleDisableMfa = async () => {
    setPending(true);
    try {
      const updated = await api.disableMfa(user);
      setUserProfile(updated);
      toast({ title: 'Two-factor disabled', variant: 'info' });
    } finally {
      setPending(false);
    }
  };

  const handleCopyRecoveryCodes = async () => {
    if (!enrollData) return;
    await navigator.clipboard.writeText(enrollData.recoveryCodes.join('\n'));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  return (
    <AuthLayout
      title="Authenticator security"
      subtitle="Add a 6-digit TOTP authenticator check and backup recovery codes to your account."
    >
      {user.mfaEnabled ? (
        <div className="space-y-5">
          <div className="flex items-center gap-3 rounded-[20px] border border-[#E9EDF2] bg-white p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#171717]">Two-factor authentication is active</p>
              <p className="text-xs text-[#737373]">Protected with TOTP authenticator</p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <Button asChild className="w-full">
              <Link to="/bookings">Back to my bookings</Link>
            </Button>
            <Button
              variant="danger"
              className="w-full"
              disabled={pending}
              onClick={handleDisableMfa}
            >
              {pending ? 'Updating...' : 'Disable two-factor authentication'}
            </Button>
          </div>
        </div>
      ) : enrollData ? (
        <form onSubmit={confirmEnrollment} className="space-y-4">
          <div className="flex flex-col items-center rounded-[20px] border border-[#E9EDF2] bg-white p-4 text-center">
            <QrCodeSvg value={enrollData.otpauthUri} size={140} />
            <p className="mt-3 text-xs text-[#737373]">
              Scan with Google Authenticator, 1Password, or Apple Passwords, or enter key:
            </p>
            <code className="mt-1 rounded-full bg-[#F9FAFB] px-3 py-1 font-mono text-xs font-semibold text-[#171717]">
              {enrollData.secret}
            </code>
          </div>

          <div className="rounded-[20px] border border-[#E9EDF2] bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#737373]">
                Recovery codes
              </p>
              <button
                type="button"
                onClick={handleCopyRecoveryCodes}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#3B82F6] hover:underline"
              >
                {copiedCodes ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedCodes ? 'Copied' : 'Copy all'}
              </button>
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-1.5 font-mono text-xs text-[#171717]">
              {enrollData.recoveryCodes.map((code) => (
                <span key={code} className="rounded-lg bg-[#F9FAFB] px-2.5 py-1 text-center">
                  {code}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="enroll-code" className="block text-[12px] font-medium text-[#171717]">
              Confirm 6-digit code
            </label>
            <input
              id="enroll-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="mt-1.5 h-11 w-full rounded-[14px] border border-[#E9EDF2] bg-white px-3.5 font-mono text-base tracking-widest text-[#171717] focus:border-[#3B82F6] focus:outline-none"
            />
            {enrollError && <p className="mt-1 text-xs text-red-600">{enrollError}</p>}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setEnrollData(null)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={pending}>
              {pending ? 'Verifying...' : 'Activate 2FA'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="rounded-[20px] border border-[#E9EDF2] bg-white p-4 text-sm text-[#737373]">
            Two-factor authentication is currently off for{' '}
            <span className="font-medium text-[#171717]">{user.email}</span>.
          </div>
          <Button size="lg" className="w-full" disabled={pending} onClick={startEnrollment}>
            {pending ? 'Preparing QR...' : 'Set up authenticator app'}
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/bookings">Back to my bookings</Link>
          </Button>
        </div>
      )}
    </AuthLayout>
  );
}
