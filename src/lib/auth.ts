import { User, UserRole } from '@/types';
import { CountryService } from './countryService';

const USERS_KEY = 'workspace_users';
const GLOBAL_ADMIN_LOGIN = 'globaladmin';
const GLOBAL_ADMIN_PASSWORD = 'Admin1234';

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
      return ['dealer_schedule', 'mistake_statistics', 'daily_mistakes'].includes(csvType);
    case 'sm':
      return ['sm_schedule', 'mistake_statistics', 'daily_mistakes'].includes(csvType);
    case 'operation':
      return ['dealer_schedule', 'sm_schedule', 'mistake_statistics', 'daily_mistakes'].includes(csvType);
    default:
      return false;
  }
}

export class AuthService {
  static async initializeGlobalAdmin(): Promise<void> {
    const users = await spark.kv.get<User[]>(USERS_KEY) || [];
    
    // Check if global admin already exists
    const globalAdminExists = users.some(user => user.login === GLOBAL_ADMIN_LOGIN);
    
    if (!globalAdminExists) {
      const globalAdmin: User = {
        id: 'global_admin_001',
        login: GLOBAL_ADMIN_LOGIN,
        email: 'admin@amber-studios.com',
        firstName: 'Global',
        lastName: 'Admin',
        role: 'global-admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const updatedUsers = [...users, globalAdmin];
      await spark.kv.set(USERS_KEY, updatedUsers);
    }
  }

  static async login(login: string, password: string): Promise<User | null> {
    await this.initializeGlobalAdmin();
    
    // Handle global admin login
    if (login === GLOBAL_ADMIN_LOGIN && password === GLOBAL_ADMIN_PASSWORD) {
      const users = await spark.kv.get<User[]>(USERS_KEY) || [];
      const globalAdmin = users.find(user => user.login === GLOBAL_ADMIN_LOGIN);
      if (globalAdmin) {
        // Update last login
        const updatedUser = { ...globalAdmin, lastLogin: new Date(), updatedAt: new Date() };
        const updatedUsers = users.map(u => u.id === globalAdmin.id ? updatedUser : u);
        await spark.kv.set(USERS_KEY, updatedUsers);
        return updatedUser;
      }
    }

    // Handle prefix-based login for country admins and other users
    const prefix = this.extractPrefix(login);
    if (prefix) {
      const actualLogin = login.replace(`${prefix}_`, '');
      const country = await CountryService.getCountryByPrefix(prefix);
      if (country) {
        return this.authenticateUser(actualLogin, password, country.id);
      }
    }

    return null;
  }

  private static extractPrefix(login: string): string | null {
    const parts = login.split('_');
    if (parts.length >= 2) {
      return parts[0];
    }
    return null;
  }

  private static async authenticateUser(login: string, password: string, countryId: string): Promise<User | null> {
    const users = await spark.kv.get<User[]>(USERS_KEY) || [];
    const user = users.find(u => 
      u.login === login && 
      u.countryId === countryId &&
      u.isActive
    );
    
    if (user && this.verifyPassword(password, user.id)) {
      // Update last login
      const updatedUser = { ...user, lastLogin: new Date(), updatedAt: new Date() };
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
      await spark.kv.set(USERS_KEY, updatedUsers);
      return updatedUser;
    }
    
    return null;
  }

  private static verifyPassword(password: string, userId: string): boolean {
    // Simple password verification - in production, use proper hashing
    if (userId === 'global_admin_001') {
      return password === GLOBAL_ADMIN_PASSWORD;
    }
    return password === 'admin'; // Default password for all users
  }

  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin'>): Promise<User> {
    const users = await spark.kv.get<User[]>(USERS_KEY) || [];
    
    // Check if user already exists
    const existingUser = users.find(u => 
      u.login === userData.login && 
      u.countryId === userData.countryId
    );
    
    if (existingUser) {
      throw new Error('User with this login already exists in this country');
    }

    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedUsers = [...users, newUser];
    await spark.kv.set(USERS_KEY, updatedUsers);
    
    return newUser;
  }

  static async getUsers(countryId?: string): Promise<User[]> {
    const users = await spark.kv.get<User[]>(USERS_KEY) || [];
    
    if (countryId) {
      return users.filter(u => u.countryId === countryId);
    }
    
    return users;
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const users = await spark.kv.get<User[]>(USERS_KEY) || [];
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const updatedUser = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date(),
    };

    const updatedUsers = [...users];
    updatedUsers[userIndex] = updatedUser;
    
    await spark.kv.set(USERS_KEY, updatedUsers);
    
    return updatedUser;
  }

  static async deleteUser(userId: string): Promise<void> {
    const users = await spark.kv.get<User[]>(USERS_KEY) || [];
    const filteredUsers = users.filter(u => u.id !== userId);
    await spark.kv.set(USERS_KEY, filteredUsers);
  }

  static async resetPassword(userId: string, newPassword: string): Promise<void> {
    // In a real implementation, hash the password
    console.log(`Password reset for user ${userId}: ${newPassword}`);
  }
}

// Initialize global admin
AuthService.initializeGlobalAdmin();