import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash, Key } from '@phosphor-icons/react';
import { User, UserRole, Country } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function UserManagement() {
  const { country: adminCountry } = useAuth();
  const [users, setUsers] = useKV<User[]>('admin-users', []);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    login: '',
    firstName: '',
    lastName: '',
    role: 'dealer' as UserRole,
    password: ''
  });

  const handleCreateUser = () => {
    if (!newUser.login || !newUser.firstName || !newUser.lastName || !newUser.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      login: newUser.login,
      email: `${newUser.login}@company.com`, // Auto-generate email
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      country: adminCountry || 'poland', // Use admin's country
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setUsers(currentUsers => {
      const updated = [...(currentUsers || []), user];
      // Also sync to localStorage for auth service
      try {
        localStorage.setItem('admin-users', JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to sync users to localStorage:', error);
      }
      return updated;
    });
    
    setNewUser({
      login: '',
      firstName: '',
      lastName: '',
      role: 'dealer',
      password: ''
    });
    setIsCreateDialogOpen(false);
    toast.success('User created successfully');
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(currentUsers => {
      const updated = (currentUsers || []).filter(u => u.id !== userId);
      // Sync to localStorage
      try {
        localStorage.setItem('admin-users', JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to sync users to localStorage:', error);
      }
      return updated;
    });
    toast.success('User deleted successfully');
  };

  const handleResetPassword = (userId: string) => {
    // In a real app, this would send a password reset email or generate a temporary password
    toast.success('Password reset link sent to user');
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(currentUsers => {
      const updated = (currentUsers || []).map(u => 
        u.id === userId 
          ? { ...u, isActive: !u.isActive, updatedAt: new Date() }
          : u
      );
      // Sync to localStorage
      try {
        localStorage.setItem('admin-users', JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to sync users to localStorage:', error);
      }
      return updated;
    });
    toast.success('User status updated');
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'default';
      case 'sm': return 'secondary';
      case 'dealer': return 'outline';
      case 'operation': return 'destructive';
      default: return 'outline';
    }
  };

  const countries = [
    { value: 'poland', label: 'Poland' },
    { value: 'georgia', label: 'Georgia' },
    { value: 'colombia', label: 'Colombia' },
    { value: 'latvia', label: 'Latvia' },
    { value: 'lithuania', label: 'Lithuania' }
  ];

  const roles = [
    { value: 'dealer', label: 'Dealer' },
    { value: 'sm', label: 'SM' },
    { value: 'operation', label: 'Operation' },
    { value: 'admin', label: 'Admin' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder=""
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder=""
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login">Login</Label>
                  <Input
                    id="login"
                    value={newUser.login}
                    onChange={(e) => setNewUser(prev => ({ ...prev, login: e.target.value }))}
                    placeholder="username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Initial Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter initial password"
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
                
                <Button onClick={handleCreateUser} className="w-full">
                  Create User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!users || users.length === 0 ? (
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
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>{user.login}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{user.country}</TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? 'default' : 'secondary'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResetPassword(user.id)}
                            className="flex items-center gap-1"
                          >
                            <Key size={14} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(user.id)}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="flex items-center gap-1"
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
  );
}