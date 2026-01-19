import { useState, useEffect, useCallback } from 'react';
import { login as authLogin, logout as authLogout, isAuthenticated as checkAuth } from '@/lib/auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => checkAuth());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsAuthenticated(checkAuth());
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    setIsLoading(true);
    try {
      const success = authLogin(username, password);
      if (success) {
        setIsAuthenticated(true);
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
