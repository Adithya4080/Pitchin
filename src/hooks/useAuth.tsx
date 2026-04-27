import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getMe,
  AuthUser,
} from '@/api/auth';
import { getAccessToken, getRefreshToken, clearTokens } from '@/api/client';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isOnboarded: boolean | null;
  isOnboardingChecked: boolean;
  setIsOnboarded: (value: boolean) => void;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  /** Legacy: kept so existing components don't break — always resolves false */
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithLinkedIn: () => Promise<{ error: Error | null }>;
  /** Compat shim: in Supabase era this returned a session; now returns { user } */
  session: { user: AuthUser } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [isOnboardingChecked, setIsOnboardingChecked] = useState(false);

  const checkOnboarding = useCallback((u: AuthUser | null) => {
    if (!u) {
      setIsOnboarded(null);
      setIsOnboardingChecked(true);
      return;
    }
    // A user is "onboarded" when they have a role AND a complete profile
    const onboarded = Boolean(u.role && u.is_profile_complete);
    setIsOnboarded(onboarded);
    setIsOnboardingChecked(true);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      setIsOnboardingChecked(true);
      return;
    }
    try {
      const me = await getMe();
      setUser(me);
      checkOnboarding(me);
    } catch {
      clearTokens();
      setUser(null);
      checkOnboarding(null);
    } finally {
      setLoading(false);
    }
  }, [checkOnboarding]);

  // Bootstrap: load user from persisted token
  useEffect(() => {
    refreshUser();

    // Listen for forced logout (token refresh failure)
    const handleLogout = () => {
      setUser(null);
      setIsOnboarded(null);
      setIsOnboardingChecked(true);
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [refreshUser]);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const data = await apiLogin(email, password);
      setUser(data.user);
      checkOnboarding(data.user);
      return { error: null };
    } catch (e) {
      return { error: e as Error };
    }
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    try {
      const data = await apiRegister({ email, password, full_name: fullName });
      setUser(data.user);
      checkOnboarding(data.user);
      return { error: null };
    } catch (e) {
      return { error: e as Error };
    }
  };

  const signOut = async () => {
    const refresh = getRefreshToken() ?? '';
    await apiLogout(refresh).catch(() => {});
    setUser(null);
    setIsOnboarded(null);
    setIsOnboardingChecked(false);
  };

  // These won't work without OAuth setup — kept for API compat
  const signInWithGoogle = async () => ({
    error: new Error('Google sign-in is not configured for this backend.'),
  });
  const signInWithLinkedIn = async () => ({
    error: new Error('LinkedIn sign-in is not configured for this backend.'),
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isOnboarded,
        isOnboardingChecked,
        setIsOnboarded,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        refreshUser,
        signInWithGoogle,
        signInWithLinkedIn,
        session: user ? { user } : null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
