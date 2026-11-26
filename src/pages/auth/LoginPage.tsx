import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { AuthLayout } from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';

export function LoginPage() {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get('redirect') || '/bookings';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setFormError('');

    let valid = true;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Enter a valid email address.');
      valid = false;
    }
    if (!password) {
      setPasswordError('Enter your password.');
      valid = false;
    }
    if (!valid) return;

    setPending(true);
    try {
      const res = await signIn(email.trim(), password);
      if (res.requiresMfa) {
        navigate(`/mfa?redirect=${encodeURIComponent(redirectTo)}`, { replace: true });
        return;
      }
      toast({ title: 'Welcome back', description: 'Signed in to ParkEase.', variant: 'success' });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your parking bays, view passes, and reserve in seconds."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="block text-[12px] font-medium text-[#171717]"
          >
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1.5 h-11 w-full rounded-[14px] border border-[#E9EDF2] bg-white px-3.5 text-sm text-[#171717] placeholder:text-[#737373]/70 focus:border-[#3B82F6] focus:outline-none"
          />
          {emailError && <p className="mt-1 text-xs text-red-600">{emailError}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="block text-[12px] font-medium text-[#171717]"
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-[#3B82F6] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-1.5 h-11 w-full rounded-[14px] border border-[#E9EDF2] bg-white px-3.5 text-sm text-[#171717] placeholder:text-[#737373]/70 focus:border-[#3B82F6] focus:outline-none"
          />
          {passwordError && <p className="mt-1 text-xs text-red-600">{passwordError}</p>}
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
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="arrow-slide h-4 w-4" />
            </>
          )}
        </Button>

        <p className="pt-2 text-center text-xs text-[#737373]">
          New to ParkEase?{' '}
          <Link
            to={`/register${redirectTo !== '/bookings' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
            className="font-medium text-[#3B82F6] hover:underline"
          >
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
