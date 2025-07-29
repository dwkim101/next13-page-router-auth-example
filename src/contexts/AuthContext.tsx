import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/api/external';
import authApi from '@/lib/api/client/auth'; // authApi 임포트

const AuthContext = createContext<{
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, nickname: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: signedInUser } = await authApi.signIn(email, password);
      setUser(signedInUser);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, nickname: string, password: string, passwordConfirmation: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: signedUpUser } = await authApi.signUp(email, nickname, password, passwordConfirmation);
      setUser(signedUpUser);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Sign up failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
    
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {}
    setUser(null);
    setError(null);
  };

  const ensureAuth = async () => {
    if (isInitialized || typeof window === 'undefined') return;
    setIsLoading(true);
    try {
      const fetchedUser = await authApi.getMe();
      setUser(fetchedUser);
    } catch {
      setUser(null);
    }
    setIsLoading(false);
    setIsInitialized(true);
  };

  useEffect(() => { ensureAuth(); }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading: isLoading || !isInitialized,
      error,
      signIn,
      signUp,
      logout,
      clearError: () => setError(null),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}