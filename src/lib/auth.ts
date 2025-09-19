import { AuthState, User, Country, UserRole } from '@/types';

export function hasPermission(userRole: UserRole, requiredRole: UserRole | UserRole[]): boolean {
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.includes(userRole);
}

export function canAccessCSV(userRole: UserRole, csvType: string): boolean {
  switch (userRole) {
    case 'admin':
    case 'global-admin':
      return true; // Admin and global admin can access all CSV types
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
      
      // Check for global admin (no prefix)
      if (login === 'admin') {
        // Get stored global admin password or use default
        const storedPassword = localStorage.getItem('global-admin-password') || 'admin';
        if (password === storedPassword) {
          const globalAdminUser: User = {
            id: 'global-admin',
            login: 'admin',
            email: 'global@amber-studios.com',
            firstName: 'Global',
            lastName: 'Admin',
            role: 'global-admin',
            country, // Will be set to default but has access to all countries
            isActive: true,
            lastLogin: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          return globalAdminUser;
        }
      }

      // Check for country-specific admin with prefix
      const countryPrefixes = {
        'lv_': 'latvia',
        'pl_': 'poland', 
        'ge_': 'georgia',
        'co_': 'colombia',
        'lt_': 'lithuania',
      };

      for (const [prefix, countryCode] of Object.entries(countryPrefixes)) {
        if (login.startsWith(prefix) && login.length > prefix.length) {
          const baseLogin = login.substring(prefix.length);
          if (baseLogin === 'admin' && password === 'admin') {
            const adminUser: User = {
              id: `admin-${countryCode}`,
              login: login,
              email: `admin@amber-studios-${countryCode}.com`,
              firstName: 'Admin',
              lastName: 'User',
              role: 'admin',
              country: countryCode as Country,
              isActive: true,
              lastLogin: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            return adminUser;
          }
        }
      }

      // Check for test users (for demo purposes)
      const testUsers = this.getTestUsers(country);
      const testUser = testUsers.find(u => u.login === login && password === 'test');
      if (testUser) {
        return {
          ...testUser,
          lastLogin: new Date(),
          updatedAt: new Date()
        };
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

  static async changeGlobalAdminPassword(newPassword: string): Promise<boolean> {
    try {
      localStorage.setItem('global-admin-password', newPassword);
      return true;
    } catch (error) {
      console.error('Error changing global admin password:', error);
      return false;
    }
  }

  static getTestUsers(country: Country): User[] {
    return [
      {
        id: `dealer-${country}`,
        login: 'dealer',
        email: `dealer@amber-studios-${country}.com`,
        firstName: 'John',
        lastName: 'Dealer',
        role: 'dealer',
        country,
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: `sm-${country}`,
        login: 'sm',
        email: `sm@amber-studios-${country}.com`,
        firstName: 'Jane',
        lastName: 'Manager',
        role: 'sm',
        country,
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: `operation-${country}`,
        login: 'operation',
        email: `operation@amber-studios-${country}.com`,
        firstName: 'Mike',
        lastName: 'Operations',
        role: 'operation',
        country,
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
  }

  static getStoredUsers(country: Country): User[] {
    try {
      // This is a simplified approach - in real app use proper database
      const storedUsers = localStorage.getItem(`admin-users-${country}`);
      if (storedUsers) {
        const allUsers: User[] = JSON.parse(storedUsers);
        return allUsers.filter(u => u.country === country);
      }
      return [];
    } catch {
      return [];
    }
  }

  // For global admin to access users from any country
  static getAllStoredUsers(): User[] {
    try {
      const countries: Country[] = ['latvia', 'poland', 'georgia', 'colombia', 'lithuania'];
      const allUsers: User[] = [];
      
      countries.forEach(country => {
        const storedUsers = localStorage.getItem(`admin-users-${country}`);
        if (storedUsers) {
          const countryUsers: User[] = JSON.parse(storedUsers);
          allUsers.push(...countryUsers);
        }
      });
      
      return allUsers;
    } catch {
      return [];
    }
  }
}