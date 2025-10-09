import { useKV } from '@github/spark/hooks';
import { AuthState, User } from '@/types';
import { AuthService } from '@/lib/auth';

export function useAuth() {
  const [authState, setAuthState] = useKV<AuthState>('auth_state', {
    user: null,
    isAuthenticated: false,
    activeCountryId: null,
  });

  const login = async (login: string, password: string): Promise<boolean> => {
    try {
      const user = await AuthService.login(login, password);
      if (user) {
        const newAuthState = {
          user,
          isAuthenticated: true,
          activeCountryId: user.role === 'global-admin' ? null : user.countryId,
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
      activeCountryId: null,
    };
    setAuthState(newAuthState);
  };

  const updateUser = (user: User) => {
    const newAuthState = {
      isAuthenticated: authState?.isAuthenticated || false,
      activeCountryId: authState?.activeCountryId || null,
      user,
    };
    setAuthState(newAuthState);
  };

  const switchCountry = (countryId: string) => {
    if (authState?.user?.role === 'global-admin') {
      const newAuthState = {
        ...authState,
        activeCountryId: countryId,
      };
      setAuthState(newAuthState);
    }
  };

  // Get effective country (for global admin, use activeCountryId; for others, use their assigned countryId)
  const getEffectiveCountryId = (): string | null => {
    if (authState?.user?.role === 'global-admin') {
      return authState.activeCountryId || null;
    }
    return authState?.user?.countryId || null;
  };

  return {
    user: authState?.user || null,
    isAuthenticated: authState?.isAuthenticated || false,
    activeCountryId: authState?.activeCountryId || null,
    effectiveCountryId: getEffectiveCountryId(),
    isGlobalAdmin: authState?.user?.role === 'global-admin',
    login,
    logout,
    updateUser,
    switchCountry,
  };
}