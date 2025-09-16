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
    const newAuthState = {
      user: null,
      isAuthenticated: false,
      country: null,
    };
    setAuthState(newAuthState);
  };

  const updateUser = (user: User) => {
    const newAuthState = {
      isAuthenticated: authState?.isAuthenticated || false,
      country: authState?.country || null,
      user,
    };
    setAuthState(newAuthState);
  };

  return {
    user: authState?.user || null,
    isAuthenticated: authState?.isAuthenticated || false,
    country: authState?.country || null,
    login,
    logout,
    updateUser,
  };
}