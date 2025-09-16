import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManagement } from '@/components/UserManagement';
import { CSVImport } from '@/components/CSVImport';
import { AuditLogs } from '@/components/AuditLogs';
import { Users, Upload, FileText, Gear } from '@phosphor-icons/react';

export function AdminPanel() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground uppercase">ADMIN PANEL</h1>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users size={16} />
            <span className="hidden sm:inline uppercase">USERS</span>
          </TabsTrigger>
          <TabsTrigger value="csv" className="flex items-center gap-2">
            <Upload size={16} />
            <span className="hidden sm:inline uppercase">CSV IMPORT</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <FileText size={16} />
            <span className="hidden sm:inline uppercase">AUDIT LOGS</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Gear size={16} />
            <span className="hidden sm:inline uppercase">SETTINGS</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="csv">
          <CSVImport />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLogs />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="uppercase">SYSTEM SETTINGS</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground uppercase">
                SYSTEM CONFIGURATION OPTIONS WILL BE AVAILABLE HERE.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}