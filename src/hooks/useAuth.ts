import { useKV } from '@github/spark/hooks';
import { AuthState, User, Country } from '@/types';
import { AuthService } from '@/lib/auth';

export function useAuth() {
  const [authState, setAuthState] = useKV<AuthState>('auth_state', {
    user: null,
    isAuthenticated: false,
    country: null,
    activeCountry: null,
  });

  const login = async (login: string, password: string, country: Country): Promise<boolean> => {
    try {
      const user = await AuthService.login(login, password, country);
      if (user) {
        const newAuthState = {
          user,
          isAuthenticated: true,
          country,
          activeCountry: user.role === 'global-admin' ? country : null,
        };
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
      activeCountry: null,
    };
    setAuthState(newAuthState);
  };

  const updateUser = (user: User) => {
    const newAuthState = {
      isAuthenticated: authState?.isAuthenticated || false,
      country: authState?.country || null,
      activeCountry: authState?.activeCountry || null,
      user,
    };
    setAuthState(newAuthState);
  };

  const switchCountry = (country: Country) => {
    if (authState?.user?.role === 'global-admin') {
      const newAuthState = {
        ...authState,
        activeCountry: country,
      };
      setAuthState(newAuthState);
    }
  };

  // Get effective country (for global admin, use activeCountry; for others, use their assigned country)
  const getEffectiveCountry = (): Country | null => {
    if (authState?.user?.role === 'global-admin') {
      return authState.activeCountry || authState.country;
    }
    return authState?.country || null;
  };

  return {
    user: authState?.user || null,
    isAuthenticated: authState?.isAuthenticated || false,
    country: authState?.country || null,
    activeCountry: authState?.activeCountry || null,
    effectiveCountry: getEffectiveCountry(),
    isGlobalAdmin: authState?.user?.role === 'global-admin',
    login,
    logout,
    updateUser,
    switchCountry,
  };
}