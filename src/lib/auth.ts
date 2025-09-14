import { AuthState, User, Country, UserRole } from '@/types';

export function hasPermission(userRole: UserRole, requiredRole: UserRole | UserRole[]): boolean {
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.includes(userRole);
}

export function canAccessCSV(userRole: UserRole, csvType: string): boolean {
  switch (userRole) {
    case 'admin':
      return true; // Admin can access all CSV types
    case 'dealer':
      return ['dealer_schedule_current', 'mistake_statistics_current', 'daily_mistakes_current'].includes(csvType);
    case 'sm':
      return ['sm_schedule_current', 'mistake_statistics_current', 'daily_mistakes_current'].includes(csvType);
    case 'operation':
      return ['dealer_schedule_current', 'sm_schedule_current', 'mistake_statistics_current', 'daily_mistakes_current'].includes(csvType);
    default:
      return false;
  }
}

export class AuthService {
  static async login(login: string, password: string, country: Country): Promise<User | null> {
    try {
      // First check if it's admin credentials
      if (login === 'admin' && password === 'admin') {
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
      }

      // Check against created users (in real app, this would be from database)
      const users = this.getStoredUsers(country);
      const user = users.find(u => u.login === login && u.isActive);
      
      if (user) {
        // In real app, verify password hash
        // For demo, we'll accept any password for created users
        return {
          ...user,
          lastLogin: new Date(),
          updatedAt: new Date()
        };
      }

      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  static getStoredUsers(country: Country): User[] {
    try {
      // This is a simplified approach - in real app use proper database
      const storedUsers = localStorage.getItem('admin-users');
      if (storedUsers) {
        const allUsers: User[] = JSON.parse(storedUsers);
        return allUsers.filter(u => u.country === country);
      }
      return [];
    } catch {
      return [];
    }
  }
}