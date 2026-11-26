import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { resetPassword } from '@/services/api';
import { useToast } from '@/contexts/ToastContext';
import { AuthLayout } from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const token = searchParams.get('token') || undefined;

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    setFormError('');

    if (password.length < 8) {
      nextErrors.password = 'New password must be at least 8 characters.';
    }
    if (confirm !== password) {
      nextErrors.confirm = 'Passwords do not match.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);
    try {
      await resetPassword(password, token);
      toast({
        title: 'Password updated',
        description: 'Sign in with your new password.',
        variant: 'success',
      });
      navigate('/login', { replace: true });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to reset password.');
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a strong password for your ParkEase driver account."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="reset-pass" className="block text-[12px] font-medium text-[#171717]">
            New password
          </label>
          <input
            id="reset-pass"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="mt-1.5 h-11 w-full rounded-[14px] border border-[#E9EDF2] bg-white px-3.5 text-sm text-[#171717] focus:border-[#3B82F6] focus:outline-none"
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="reset-confirm" className="block text-[12px] font-medium text-[#171717]">
            Confirm new password
          </label>
          <input
            id="reset-confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat password"
            className="mt-1.5 h-11 w-full rounded-[14px] border border-[#E9EDF2] bg-white px-3.5 text-sm text-[#171717] focus:border-[#3B82F6] focus:outline-none"
          />
          {errors.confirm && <p className="mt-1 text-xs text-red-600">{errors.confirm}</p>}
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
              Updating password...
            </>
          ) : (
            'Update password'
          )}
        </Button>

        <p className="pt-2 text-center text-xs text-[#737373]">
          <Link to="/login" className="font-medium text-[#3B82F6] hover:underline">
            Return to sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
