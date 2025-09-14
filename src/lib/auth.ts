import { AuthState, User, Country, UserRole } from '@/types';

export function hasPermission(userRole: UserRole, requiredRole: UserRole | UserRole[]): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    dealer: 1,
    sm: 2,
    operation: 3,
    admin: 4,
    global_admin: 5,
  };

  const userLevel = roleHierarchy[userRole];
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.some(role => userLevel >= roleHierarchy[role]);
  }
  
  return userLevel >= roleHierarchy[requiredRole];
}

export function canAccessCSV(userRole: UserRole, csvType: string): boolean {
  const permissions: Record<UserRole, string[] | 'all'> = {
    dealer: ['dealer_schedule_current', 'mistake_statistics_current', 'daily_mistakes_current'],
    sm: ['sm_schedule_current', 'mistake_statistics_current', 'daily_mistakes_current'],
    operation: ['dealer_schedule_current', 'sm_schedule_current', 'mistake_statistics_current', 'daily_mistakes_current'],
    admin: 'all',
    global_admin: 'all',
  };

  const userPermissions = permissions[userRole];
  return userPermissions === 'all' || (Array.isArray(userPermissions) && userPermissions.includes(csvType));
}

export class AuthService {
  static async login(login: string, password: string, country: Country): Promise<User | null> {
    try {
      // Check for global admin first (can access any country)
      const globalUsers = await window.spark.kv.get<User[]>(`users_global`) || [];
      const globalUser = globalUsers.find(u => u.login === login && u.isActive);
      
      if (globalUser) {
        // In real app, verify password hash here
        const updatedGlobalUsers = globalUsers.map(u => 
          u.id === globalUser.id ? { ...u, lastLogin: new Date(), country } : u
        );
        await window.spark.kv.set(`users_global`, updatedGlobalUsers);
        
        return { ...globalUser, country }; // Set the selected country for session
      }

      // Check country-specific users
      const mockUsers = await window.spark.kv.get<User[]>(`users_${country}`) || [];
      const user = mockUsers.find(u => u.login === login && u.isActive);
      
      if (user) {
        // In real app, verify password hash here
        // Update last login
        const updatedUsers = mockUsers.map(u => 
          u.id === user.id ? { ...u, lastLogin: new Date() } : u
        );
        await window.spark.kv.set(`users_${country}`, updatedUsers);
        
        return user;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }
}