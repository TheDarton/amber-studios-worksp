import { useKV } from '@github/spark/hooks';
import { AuthState, User, Country } from '@/types';
import { AuthService } from '@/lib/auth';

export function useAuth() {
  const [authState, setAuthState] = useKV<AuthState>('auth_state', {
    user: null,
    isAuthenticated: false,
    country: null,
  });

  const login = async (login: string, password: string, country: Country): Promise<boolean> => {
    try {
      const user = await AuthService.login(login, password, country);
      if (user) {
        const newAuthState = {
          user,
          isAuthenticated: true,
          country,
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
    setAuthState({
      user: null,
      isAuthenticated: false,
      country: null,
    });
  };

  const updateUser = (user: User) => {
    setAuthState(prev => ({
      isAuthenticated: prev?.isAuthenticated || false,
      country: prev?.country || null,
      user,
    }));
  };

  // Debug logging
  // console.log('Auth state:', authState);

  return {
    ...authState,
    login,
    logout,
    updateUser,
  };
}