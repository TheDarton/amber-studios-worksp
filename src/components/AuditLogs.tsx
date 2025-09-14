import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, MagnifyingGlass } from '@phosphor-icons/react';
import { AuditLog, Country } from '@/types';

export function AuditLogs() {
  const [auditLogs, setAuditLogs] = useKV<AuditLog[]>('audit-logs', [
    {
      id: '1',
      userId: 'admin',
      action: 'user_created',
      resourceType: 'user',
      resourceId: 'user_123',
      details: { userName: 'john.doe', role: 'dealer' },
      timestamp: new Date('2024-01-15T10:30:00'),
      country: 'poland'
    },
    {
      id: '2',
      userId: 'admin',
      action: 'csv_imported',
      resourceType: 'csv',
      resourceId: 'import_456',
      details: { fileName: 'dealer_schedule_current.csv', rowCount: 150 },
      timestamp: new Date('2024-01-15T11:45:00'),
      country: 'poland'
    },
    {
      id: '3',
      userId: 'admin',
      action: 'password_reset',
      resourceType: 'user',
      resourceId: 'user_789',
      details: { targetUser: 'jane.smith' },
      timestamp: new Date('2024-01-15T14:20:00'),
      country: 'georgia'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [filterAction, setFilterAction] = useState<string>('all');

  const filteredLogs = (auditLogs || []).filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resourceType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = filterCountry === 'all' || log.country === filterCountry;
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    
    return matchesSearch && matchesCountry && matchesAction;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'user_created':
        return <Badge className="bg-green-100 text-green-800">User Created</Badge>;
      case 'user_deleted':
        return <Badge variant="destructive">User Deleted</Badge>;
      case 'password_reset':
        return <Badge variant="secondary">Password Reset</Badge>;
      case 'csv_imported':
        return <Badge className="bg-blue-100 text-blue-800">CSV Imported</Badge>;
      case 'login':
        return <Badge variant="outline">Login</Badge>;
      case 'logout':
        return <Badge variant="outline">Logout</Badge>;
      default:
        return <Badge variant="outline">{action.replace('_', ' ')}</Badge>;
    }
  };

  const countries = [
    { value: 'all', label: 'All Countries' },
    { value: 'poland', label: 'Poland' },
    { value: 'georgia', label: 'Georgia' },
    { value: 'colombia', label: 'Colombia' },
    { value: 'latvia', label: 'Latvia' },
    { value: 'lithuania', label: 'Lithuania' }
  ];

  const actions = [
    { value: 'all', label: 'All Actions' },
    { value: 'user_created', label: 'User Created' },
    { value: 'user_deleted', label: 'User Deleted' },
    { value: 'password_reset', label: 'Password Reset' },
    { value: 'csv_imported', label: 'CSV Imported' },
    { value: 'login', label: 'Login' },
    { value: 'logout', label: 'Logout' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText size={20} />
          Audit Logs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <MagnifyingGlass size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Country</Label>
            <Select value={filterCountry} onValueChange={setFilterCountry}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Action</Label>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {actions.map(action => (
                  <SelectItem key={action.value} value={action.value}>
                    {action.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No audit logs found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {log.timestamp.toLocaleDateString()} {log.timestamp.toLocaleTimeString()}
                    </TableCell>
                    <TableCell className="font-medium">{log.userId}</TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.resourceType}</div>
                        <div className="text-sm text-muted-foreground">{log.resourceId}</div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{log.country}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {Object.entries(log.details).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}:</span> {String(value)}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {filteredLogs.length > 0 && (
          <div className="text-sm text-muted-foreground text-center">
            Showing {filteredLogs.length} of {auditLogs?.length || 0} audit logs
          </div>
        )}
      </CardContent>
    </Card>
  );
}