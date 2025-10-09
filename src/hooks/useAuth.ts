import { useKV } from '@github/spark/hooks';
import { useCallback } from 'react';

export interface User {
  id: string;
  username: string;
  email?: string;
  name?: string;
  surname?: string;
  role: 'Global_Admin' | 'Country_Admin' | 'SM' | 'Dealer' | 'Operation';
  countryCode?: string;
  isActive: boolean;
}

export interface Country {
  id: string;
  name: string;
  code: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  activeCountryCode: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useKV<AuthState>('auth-state', {
    user: null,
    isAuthenticated: false,
    activeCountryCode: null
  });

  const [users, setUsers] = useKV<User[]>('system-users', []);
  const [countries, setCountries] = useKV<Country[]>('system-countries', []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    // Global Admin login (case-insensitive)
    if (username.toLowerCase() === 'global_admin' && password === 'Admin1234') {
      const globalAdminUser: User = {
        id: 'global_admin',
        username: 'Global_admin',
        role: 'Global_Admin',
        isActive: true
      };
      
      setAuthState({
        user: globalAdminUser,
        isAuthenticated: true,
        activeCountryCode: null
      });
      return true;
    }

    // Check country admin login (with prefix)
    const userList = users || [];
    
    // Extract country code from username if it has prefix (e.g., "lv_admin" -> "lv")
    let countryCode = '';
    let actualUsername = username.toLowerCase();
    if (username.includes('_')) {
      const parts = username.split('_');
      if (parts.length === 2) {
        countryCode = parts[0].toLowerCase();
        actualUsername = parts[1].toLowerCase();
      }
    }

    const user = userList.find(u => 
      u.username.toLowerCase() === actualUsername && 
      u.countryCode === countryCode && 
      u.isActive
    );

    if (user) {
      // For demo purposes, check if password matches
      setAuthState({
        user,
        isAuthenticated: true,
        activeCountryCode: countryCode
      });
      return true;
    }

    return false;
  }, [users, setAuthState]);

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      activeCountryCode: null
    });
  }, [setAuthState]);

  const createCountry = useCallback((name: string) => {
    // Generate country code from name (e.g., "Latvia" -> "lv")
    const code = name.toLowerCase().substring(0, 2);
    const newCountry: Country = {
      id: `country_${Date.now()}`,
      name,
      code
    };
    
    setCountries(current => [...(current || []), newCountry]);
    return newCountry;
  }, [setCountries]);

  const createCountryAdmin = useCallback((adminData: {
    username: string;
    name?: string;
    surname?: string;
    password: string;
    email?: string;
    countryCode: string;
  }) => {
    const newAdmin: User = {
      id: `admin_${Date.now()}`,
      username: adminData.username,
      name: adminData.name,
      surname: adminData.surname,
      email: adminData.email,
      role: 'Country_Admin',
      countryCode: adminData.countryCode,
      isActive: true
    };
    
    setUsers(current => [...(current || []), newAdmin]);
    return newAdmin;
  }, [setUsers]);

  const createUser = useCallback((userData: Omit<User, 'id'>) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
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

  const switchCountry = useCallback((countryCode: string) => {
    if (authState?.user?.role === 'Global_Admin') {
      setAuthState(current => ({
        user: current?.user || null,
        isAuthenticated: current?.isAuthenticated || false,
        activeCountryCode: countryCode
      }));
    }
  }, [authState?.user?.role, setAuthState]);

  const isGlobalAdmin = authState?.user?.role === 'Global_Admin';
  const isCountryAdmin = authState?.user?.role === 'Country_Admin';
  const effectiveCountryCode = authState?.activeCountryCode || authState?.user?.countryCode;

  return {
    user: authState?.user || null,
    isAuthenticated: authState?.isAuthenticated || false,
    activeCountryCode: authState?.activeCountryCode || null,
    effectiveCountryCode,
    isGlobalAdmin,
    isCountryAdmin,
    users: users || [],
    countries: countries || [],
    login,
    logout,
    createCountry,
    createCountryAdmin,
    createUser,
    updateUser,
    switchCountry
  };
}