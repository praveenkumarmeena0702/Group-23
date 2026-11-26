import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as api from '@/services/api';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types';

interface PendingMfaState {
  user: UserProfile;
  factorId: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  pendingMfa: PendingMfaState | null;
  refreshUser: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ requiresMfa: boolean }>;
  completeMfaChallenge: (code: string) => Promise<void>;
  clearPendingMfa: () => void;
  signUp: (name: string, email: string, password: string) => Promise<{ email: string; demoOtpCode?: string }>;
  verifyEmailOtp: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUserProfile: (u: UserProfile) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingMfa, setPendingMfa] = useState<PendingMfaState | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const current = await api.getCurrentUser();
      setUser(current);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
    if (isSupabaseConfigured && supabase) {
      const { data: sub } = supabase.auth.onAuthStateChange(() => {
        refreshUser();
      });
      return () => sub.subscription.unsubscribe();
    }
  }, [refreshUser]);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await api.signInWithPassword(email, password);
    if (res.requiresMfa && res.factorId) {
      setPendingMfa({ user: res.user, factorId: res.factorId });
      return { requiresMfa: true };
    }
    setUser(res.user);
    setPendingMfa(null);
    return { requiresMfa: false };
  }, []);

  const completeMfaChallenge = useCallback(
    async (code: string) => {
      if (!pendingMfa) throw new Error('No pending MFA session.');
      const verifiedUser = await api.verifyMfaChallenge(
        pendingMfa.user,
        pendingMfa.factorId,
        code,
      );
      setUser(verifiedUser);
      setPendingMfa(null);
    },
    [pendingMfa],
  );

  const clearPendingMfa = useCallback(() => {
    setPendingMfa(null);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    return api.signUpWithEmail(name, email, password);
  }, []);

  const verifyEmailOtp = useCallback(async (email: string, code: string) => {
    const profile = await api.verifyEmailOtp(email, code);
    setUser(profile);
  }, []);

  const signOut = useCallback(async () => {
    await api.signOut();
    setUser(null);
    setPendingMfa(null);
  }, []);

  const setUserProfile = useCallback((u: UserProfile) => {
    setUser(u);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        pendingMfa,
        refreshUser,
        signIn,
        completeMfaChallenge,
        clearPendingMfa,
        signUp,
        verifyEmailOtp,
        signOut,
        setUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
