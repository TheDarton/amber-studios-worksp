import { UserManagement } from '@/components/UserManagement';

export function AdminPanel() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
      </div>

      <UserManagement />
    </div>
  );
}