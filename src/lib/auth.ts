import { AuthState, User, Country, UserRole } from '@/types';

export function hasPermission(userRole: UserRole, requiredRole: UserRole | UserRole[]): boolean {
  // Only admin role exists now, so always return true for admin
  return userRole === 'admin';
}

export function canAccessCSV(userRole: UserRole, csvType: string): boolean {
  // Admin can access all CSV types
  return userRole === 'admin';
}

export class AuthService {
  static async login(login: string, password: string, country: Country): Promise<User | null> {
    try {
      // Only accept admin/admin credentials
      if (login !== 'admin' || password !== 'admin') {
        return null;
      }

      // Create admin user for the selected country
      const adminUser: User = {
        id: `admin-${country}`,
        login: 'admin',
        email: `admin@amber-studios-${country}.com`,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        country,
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return adminUser;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }
}