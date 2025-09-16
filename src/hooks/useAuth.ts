import { useKV } from '@github/spark/hooks';
import { useState, useEffect } from 'react';
import { AuthState, User, Country } from '@/types';
import { AuthService } from '@/lib/auth';

export function useAuth() {
  const [authState, setAuthState] = useKV<AuthState>('auth_state', {
    user: null,
    isAuthenticated: false,
    country: null,
  });
  
  // Local state to ensure immediate updates
  const [localState, setLocalState] = useState<AuthState>(authState || {
    user: null,
    isAuthenticated: false,
    country: null,
  });

  // Sync local state with persisted state
  useEffect(() => {
    if (authState) {
      setLocalState(authState);
    }
  }, [authState]);

  const login = async (login: string, password: string, country: Country): Promise<boolean> => {
    try {
      const user = await AuthService.login(login, password, country);
      if (user) {
        const newAuthState = {
          user,
          isAuthenticated: true,
          country,
        };
        
        // Update both local and persisted state
        setLocalState(newAuthState);
        setAuthState(newAuthState);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    const newAuthState = {
      user: null,
      isAuthenticated: false,
      country: null,
    };
    
    // Update both local and persisted state
    setLocalState(newAuthState);
    setAuthState(newAuthState);
  };

  const updateUser = (user: User) => {
    const newAuthState = {
      isAuthenticated: localState?.isAuthenticated || false,
      country: localState?.country || null,
      user,
    };
    
    // Update both local and persisted state
    setLocalState(newAuthState);
    setAuthState(newAuthState);
  };

  // Use local state for immediate reactivity
  return {
    ...localState,
    login,
    logout,
    updateUser,
  };
}