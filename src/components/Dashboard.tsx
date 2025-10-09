import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileArrowUp, 
  Calendar, 
  Bug, 
  GraduationCap,
  Newspaper 
} from '@phosphor-icons/react';

export function Dashboard() {
  const { user, effectiveCountryId, countries, users } = useAuth();
  
  const currentCountry = countries.find(c => c.id === effectiveCountryId);
  const countryUsers = users.filter(u => u.countryId === effectiveCountryId);

  const getWelcomeMessage = () => {
    const time = new Date().getHours();
    const greeting = time < 12 ? 'Good morning' : time < 18 ? 'Good afternoon' : 'Good evening';
    return `${greeting}, ${user?.username}!`;
  };

  const getRoleDescription = () => {
    switch (user?.role) {
      case 'Admin':
        return 'You have full access to all system features including user management and data imports.';
      case 'SM':
        return 'Access your schedules, manage mistakes, and use training resources.';
      case 'Dealer':
        return 'View your dealer schedules and access dealer training academy.';
      case 'Operation':
        return 'Monitor all operations with read-only access to schedules and mistakes.';
      default:
        return 'Welcome to the workspace.';
    }
  };

  const getQuickActions = () => {
    switch (user?.role) {
      case 'Admin':
        return [
          { label: 'Manage Users', icon: Users, view: 'users' },
          { label: 'Import Data', icon: FileArrowUp, view: 'csv-import' },
          { label: 'View Schedules', icon: Calendar, view: 'schedules' },
          { label: 'Check Mistakes', icon: Bug, view: 'mistakes' }
        ];
      case 'SM':
        return [
          { label: 'My Schedule', icon: Calendar, view: 'sm-schedule' },
          { label: 'Mistakes', icon: Bug, view: 'mistakes' },
          { label: 'Training', icon: GraduationCap, view: 'sm-academy' },
          { label: 'News', icon: Newspaper, view: 'news' }
        ];
      case 'Dealer':
        return [
          { label: 'My Schedule', icon: Calendar, view: 'dealer-schedule' },
          { label: 'Mistakes', icon: Bug, view: 'mistakes' },
          { label: 'Training', icon: GraduationCap, view: 'dealer-academy' }
        ];
      case 'Operation':
        return [
          { label: 'All Schedules', icon: Calendar, view: 'schedules' },
          { label: 'Mistakes', icon: Bug, view: 'mistakes' },
          { label: 'Training', icon: GraduationCap, view: 'sm-academy' },
          { label: 'News', icon: Newspaper, view: 'news' }
        ];
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {getWelcomeMessage()}
        </h1>
        <p className="text-muted-foreground mb-4">
          {getRoleDescription()}
        </p>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="px-3 py-1">
            {user?.role}
          </Badge>
          <div className="text-sm text-muted-foreground">
            Operating in: <span className="font-medium">{currentCountry?.name}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.view}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => {
                    // Navigation would be handled by parent component
                    console.log(`Navigate to ${action.view}`);
                  }}
                >
                  <Icon size={24} />
                  <span className="text-sm">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {user?.role === 'Admin' && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{countryUsers.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active users in {currentCountry?.name}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Role Distribution</CardTitle>
                <Badge className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['SM', 'Dealer', 'Operation'].map(role => {
                    const count = countryUsers.filter(u => u.role === role).length;
                    return (
                      <div key={role} className="flex justify-between text-sm">
                        <span>{role}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest updates and system changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 border border-border rounded-lg">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">System initialized</p>
                <p className="text-xs text-muted-foreground">Welcome to the workspace</p>
              </div>
              <div className="text-xs text-muted-foreground">Just now</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}