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
  const [users, setUsers] = useKV<User[]>(`admin-users-${adminCountry}`, []);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    login: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'dealer' as UserRole,
    password: ''
  });

  const handleCreateUser = () => {
    if (!newUser.login || !newUser.password) {
      toast.error('LOGIN AND PASSWORD ARE REQUIRED');
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      login: newUser.login,
      email: newUser.email || '',
      firstName: newUser.firstName || '',
      lastName: newUser.lastName || '',
      role: newUser.role,
      country: adminCountry || 'poland',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setUsers(currentUsers => {
      const updated = [...(currentUsers || []), user];
      // Also sync to localStorage for auth service (country-specific)
      try {
        localStorage.setItem(`admin-users-${adminCountry}`, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to sync users to localStorage:', error);
      }
      return updated;
    });
    
    setNewUser({
      login: '',
      firstName: '',
      lastName: '',
      email: '',
      role: 'dealer',
      password: ''
    });
    setIsCreateDialogOpen(false);
    toast.success('USER CREATED SUCCESSFULLY');
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(currentUsers => {
      const updated = (currentUsers || []).filter(u => u.id !== userId);
      // Sync to localStorage (country-specific)
      try {
        localStorage.setItem(`admin-users-${adminCountry}`, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to sync users to localStorage:', error);
      }
      return updated;
    });
    toast.success('USER DELETED SUCCESSFULLY');
  };

  const handleResetPassword = (userId: string) => {
    // In a real app, this would send a password reset email or generate a temporary password
    toast.success('PASSWORD RESET LINK SENT TO USER');
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(currentUsers => {
      const updated = (currentUsers || []).map(u => 
        u.id === userId 
          ? { ...u, isActive: !u.isActive, updatedAt: new Date() }
          : u
      );
      // Sync to localStorage (country-specific)
      try {
        localStorage.setItem(`admin-users-${adminCountry}`, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to sync users to localStorage:', error);
      }
      return updated;
    });
    toast.success('USER STATUS UPDATED');
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
    { value: 'dealer', label: 'DEALER' },
    { value: 'sm', label: 'SM' },
    { value: 'operation', label: 'OPERATION' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="uppercase">USER MANAGEMENT</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 uppercase">
                <Plus size={16} />
                CREATE USER
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="uppercase">CREATE NEW USER</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {newUser.role !== 'operation' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="uppercase">NAME</Label>
                      <Input
                        id="firstName"
                        value={newUser.firstName}
                        onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder=""
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="uppercase">SURNAME</Label>
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
                  <Label htmlFor="login" className="uppercase">LOGIN *</Label>
                  <Input
                    id="login"
                    value={newUser.login}
                    onChange={(e) => setNewUser(prev => ({ ...prev, login: e.target.value }))}
                    placeholder=""
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="uppercase">EMAIL</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    placeholder=""
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="uppercase">INITIAL PASSWORD *</Label>
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
                  <Label className="uppercase">ROLE</Label>
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
                
                <Button onClick={handleCreateUser} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase">
                  CREATE USER
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!users || users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground uppercase">
              NO USERS CREATED YET. CLICK "CREATE USER" TO ADD THE FIRST USER.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="uppercase">NAME</TableHead>
                    <TableHead className="uppercase">LOGIN</TableHead>
                    <TableHead className="uppercase">EMAIL</TableHead>
                    <TableHead className="uppercase">ROLE</TableHead>
                    <TableHead className="uppercase">COUNTRY</TableHead>
                    <TableHead className="uppercase">STATUS</TableHead>
                    <TableHead className="text-right uppercase">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
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
                          {user.role.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="uppercase">{user.country}</TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? 'default' : 'secondary'}>
                          {user.isActive ? 'ACTIVE' : 'INACTIVE'}
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
                            {user.isActive ? 'DEACTIVATE' : 'ACTIVATE'}
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
  );
}