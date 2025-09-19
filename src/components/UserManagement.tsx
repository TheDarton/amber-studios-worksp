import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash, Key, Gear as Settings } from '@phosphor-icons/react';
import { User, UserRole, Country } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { AuthService } from '@/lib/auth';
import { toast } from 'sonner';

const COUNTRY_NAMES = {
  latvia: 'Latvia',
  poland: 'Poland',
  georgia: 'Georgia',
  colombia: 'Colombia',
  lithuania: 'Lithuania',
} as const;

export function UserManagement() {
  const { effectiveCountry, isGlobalAdmin, user: currentUser } = useAuth();
  
  // For global admin, get users from all countries; for country admin, only their country
  const [users, setUsers] = useKV<User[]>(
    isGlobalAdmin ? 'global-admin-all-users' : `admin-users-${effectiveCountry}`, 
    []
  );
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newUser, setNewUser] = useState({
    login: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'dealer' as UserRole,
    password: ''
  });

  // Load users based on admin type
  const loadUsers = () => {
    if (!effectiveCountry) return;
    
    if (isGlobalAdmin) {
      // Load all users from all countries
      const allUsers = AuthService.getAllStoredUsers();
      setUsers(allUsers);
    } else {
      // Load only users from current country
      const countryUsers = AuthService.getStoredUsers(effectiveCountry);
      setUsers(countryUsers);
    }
  };

  // Call loadUsers on component mount and when effectiveCountry changes
  useEffect(() => {
    loadUsers();
  }, [effectiveCountry, isGlobalAdmin]);

  const handleCreateUser = () => {
    if (!newUser.login || !newUser.password) {
      toast.error('Login and password are required');
      return;
    }

    const targetCountry = effectiveCountry!;
    const user: User = {
      id: Date.now().toString(),
      login: newUser.login,
      email: newUser.email || '',
      firstName: newUser.firstName || '',
      lastName: newUser.lastName || '',
      role: newUser.role,
      country: targetCountry,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save to country-specific storage
    try {
      const existingUsers = AuthService.getStoredUsers(targetCountry);
      const updatedUsers = [...existingUsers, user];
      localStorage.setItem(`admin-users-${targetCountry}`, JSON.stringify(updatedUsers));
      
      // Refresh displayed users
      loadUsers();
      
      setNewUser({
        login: '',
        firstName: '',
        lastName: '',
        email: '',
        role: 'dealer',
        password: ''
      });
      setIsCreateDialogOpen(false);
      toast.success('User created successfully');
    } catch (error) {
      console.error('Failed to create user:', error);
      toast.error('Failed to create user');
    }
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = (users || []).find(u => u.id === userId);
    if (!userToDelete) return;

    try {
      const existingUsers = AuthService.getStoredUsers(userToDelete.country);
      const updatedUsers = existingUsers.filter(u => u.id !== userId);
      localStorage.setItem(`admin-users-${userToDelete.country}`, JSON.stringify(updatedUsers));
      
      // Refresh displayed users
      loadUsers();
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleResetPassword = (userId: string) => {
    // In a real app, this would send a password reset email or generate a temporary password
    toast.success('Password reset link sent to user');
  };

  const handleToggleStatus = (userId: string) => {
    const userToToggle = (users || []).find(u => u.id === userId);
    if (!userToToggle) return;

    try {
      const existingUsers = AuthService.getStoredUsers(userToToggle.country);
      const updatedUsers = existingUsers.map(u => 
        u.id === userId 
          ? { ...u, isActive: !u.isActive, updatedAt: new Date() }
          : u
      );
      localStorage.setItem(`admin-users-${userToToggle.country}`, JSON.stringify(updatedUsers));
      
      // Refresh displayed users
      loadUsers();
      toast.success('User status updated');
    } catch (error) {
      console.error('Failed to update user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleChangeGlobalAdminPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in both password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 4) {
      toast.error('Password must be at least 4 characters long');
      return;
    }

    try {
      const success = await AuthService.changeGlobalAdminPassword(newPassword);
      if (success) {
        setNewPassword('');
        setConfirmPassword('');
        setIsPasswordDialogOpen(false);
        toast.success('Password changed successfully');
      } else {
        toast.error('Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'default';
      case 'global-admin': return 'destructive';
      case 'sm': return 'secondary';
      case 'dealer': return 'outline';
      case 'operation': return 'destructive';
      default: return 'outline';
    }
  };

  const roles = [
    { value: 'dealer', label: 'Dealer' },
    { value: 'sm', label: 'SM' },
    { value: 'operation', label: 'Operation' }
  ];

  // Filter users based on admin type
  const displayUsers = isGlobalAdmin 
    ? (users || []) // Global admin sees all users
    : (users || []).filter(u => u.country === effectiveCountry); // Country admin sees only their users

  return (
    <div className="space-y-6">
      {/* Global Admin Password Change Card */}
      {isGlobalAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Global Admin Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Change Password</h3>
                <p className="text-sm text-muted-foreground">Update your global admin password</p>
              </div>
              <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Settings size={16} />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Change Global Admin Password</DialogTitle>
                    <DialogDescription>
                      Enter your new password. This will affect your login credentials.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleChangeGlobalAdminPassword} 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Change Password
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Management Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              {isGlobalAdmin && (
                <p className="text-sm text-muted-foreground mt-1">
                  Managing users for: {COUNTRY_NAMES[effectiveCountry as keyof typeof COUNTRY_NAMES]}
                </p>
              )}
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus size={16} />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account for {COUNTRY_NAMES[effectiveCountry as keyof typeof COUNTRY_NAMES]}.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {newUser.role !== 'operation' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Name</Label>
                        <Input
                          id="firstName"
                          value={newUser.firstName}
                          onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder=""
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Surname</Label>
                        <Input
                          id="lastName"
                          value={newUser.lastName}
                          onChange={(e) => setNewUser(prev => ({ ...prev, lastName: e.target.value }))}
                          placeholder=""
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="login">Login *</Label>
                    <Input
                      id="login"
                      value={newUser.login}
                      onChange={(e) => setNewUser(prev => ({ ...prev, login: e.target.value }))}
                      placeholder=""
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      placeholder=""
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Initial Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                      placeholder=""
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={newUser.role} onValueChange={(value: UserRole) => setNewUser(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={handleCreateUser} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Create User
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!displayUsers || displayUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No users created yet. Click "Create User" to add the first user.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Login</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.firstName || user.lastName 
                            ? `${user.firstName} ${user.lastName}`.trim()
                            : user.login
                          }
                        </TableCell>
                        <TableCell>{user.login}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{COUNTRY_NAMES[user.country as keyof typeof COUNTRY_NAMES]}</TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? 'default' : 'secondary'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              className="bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
                              size="sm"
                              onClick={() => handleResetPassword(user.id)}
                            >
                              <Key size={14} />
                            </Button>
                            <Button
                              className="bg-accent text-accent-foreground hover:bg-accent/90"
                              size="sm"
                              onClick={() => handleToggleStatus(user.id)}
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}