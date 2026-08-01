import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getMe,
  loginWithGoogle,
  AuthUser,
} from '@/api/auth';
import { getAccessToken, getRefreshToken, clearTokens } from '@/api/client';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/Queryclient';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isOnboarded: boolean | null;
  isOnboardingChecked: boolean;
  setIsOnboarded: (value: boolean) => void;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null; user?: AuthUser }>;
  signUpWithEmail: (email: string, password: string, password2: string, fullName: string) => Promise<{ error: Error | null; user?: AuthUser }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithLinkedIn: () => Promise<{ error: Error | null }>;
  session: { user: AuthUser } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [isOnboardingChecked, setIsOnboardingChecked] = useState(false);
  const { toast } = useToast();

  const checkOnboarding = useCallback((u: AuthUser | null) => {
    if (!u) {
      setIsOnboarded(null);
      setIsOnboardingChecked(true);
      return;
    }
    const onboarded = Boolean(u.role);
    setIsOnboarded(onboarded);
    setIsOnboardingChecked(true);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      setIsOnboardingChecked(true);
      return null;
    }
    try {
      const me = await getMe();
      setUser(me);
      checkOnboarding(me);
      return me;
    } catch {
      clearTokens();
      setUser(null);
      checkOnboarding(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [checkOnboarding]);

  useEffect(() => {
    refreshUser();

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
      queryClient.clear();
      setUser(data.user);
      checkOnboarding(data.user);
      return { error: null, user: data.user };
    } catch (e) {
      return { error: e as Error };
    }
  };

  const signUpWithEmail = async (email: string, password: string, password2: string, fullName: string) => {
    try {
      const data = await apiRegister({ email, password, password2, full_name: fullName });
      
      setUser(data.user);
      checkOnboarding(data.user);
      return { error: null, user: data.user };
    } catch (e) {
      return { error: e as Error };
    }
  };

  const signOut = async () => {
    const refresh = getRefreshToken() ?? '';
    await apiLogout(refresh).catch(() => {});
    queryClient.clear();
    setUser(null);
    setIsOnboarded(null);
    setIsOnboardingChecked(false);
    queryClient.clear();
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const data = await loginWithGoogle(response.access_token);
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        queryClient.clear();
        setUser(data.user);
        checkOnboarding(data.user);
      } catch (e) {
        toast({ title: 'Google sign-in failed', variant: 'destructive' });
      }
    },
    onError: () => {
      toast({ title: 'Google sign-in was cancelled', variant: 'destructive' });
    },
  });

  const signInWithGoogle = async (): Promise<{ error: Error | null }> => {
    return new Promise((resolve) => {
      googleLogin();
      resolve({ error: null });
    });
  };

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