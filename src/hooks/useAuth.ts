import { useKV } from '@github/spark/hooks';
import { useCallback } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'Admin' | 'SM' | 'Dealer' | 'Operation';
  countryId: string;
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  activeCountryId: string | null;
}

const COUNTRIES = [
  { id: 'PL', name: 'Poland' },
  { id: 'GE', name: 'Georgia' },
  { id: 'CO', name: 'Colombia' },
  { id: 'LV', name: 'Latvia' },
  { id: 'LT', name: 'Lithuania' }
];

export function useAuth() {
  const [authState, setAuthState] = useKV<AuthState>('auth-state', {
    user: null,
    isAuthenticated: false,
    activeCountryId: null
  });

  const [users, setUsers] = useKV<User[]>('system-users', []);

  const login = useCallback(async (username: string, password: string, countryId: string): Promise<boolean> => {
    // Admin login
    if (username === 'admin' && password === 'admin') {
      const adminUser: User = {
        id: 'admin',
        username: 'admin',
        email: 'admin@amber-studios.com',
        role: 'Admin',
        countryId,
        isActive: true
      };
      
      setAuthState({
        user: adminUser,
        isAuthenticated: true,
        activeCountryId: countryId
      });
      return true;
    }

    // Check created users
    const userList = users || [];
    const user = userList.find(u => 
      u.username === username && 
      u.countryId === countryId && 
      u.isActive
    );

    if (user) {
      // For demo purposes, any password works for created users
      setAuthState({
        user,
        isAuthenticated: true,
        activeCountryId: countryId
      });
      return true;
    }

    return false;
  }, [users, setAuthState]);

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      activeCountryId: null
    });
  }, [setAuthState]);

  const createUser = useCallback((userData: Omit<User, 'id' | 'email'> & { username: string }) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: `${userData.username}@amber-studios.com`,
      ...userData
    };
    
    setUsers(current => [...(current || []), newUser]);
    return newUser;
  }, [setUsers]);

  const updateUser = useCallback((userId: string, updates: Partial<User>) => {
    setUsers(current => 
      (current || []).map(user => 
        user.id === userId ? { ...user, ...updates } : user
      )
    );
  }, [setUsers]);

  const switchCountry = useCallback((countryId: string) => {
    if (authState?.user?.role === 'Admin') {
      setAuthState(current => ({
        user: current?.user || null,
        isAuthenticated: current?.isAuthenticated || false,
        activeCountryId: countryId
      }));
    }
  }, [authState?.user?.role, setAuthState]);

  const isGlobalAdmin = authState?.user?.role === 'Admin';
  const effectiveCountryId = authState?.activeCountryId || authState?.user?.countryId;

  return {
    user: authState?.user || null,
    isAuthenticated: authState?.isAuthenticated || false,
    activeCountryId: authState?.activeCountryId || null,
    effectiveCountryId,
    isGlobalAdmin,
    users: users || [],
    countries: COUNTRIES,
    login,
    logout,
    createUser,
    updateUser,
    switchCountry
  };
}