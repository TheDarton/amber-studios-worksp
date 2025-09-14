import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { 
  Calendar, 
  ChartBar, 
  Warning, 
  BookOpen,
  TrendUp,
  Clock
} from '@phosphor-icons/react';

export function Dashboard() {
  const { user } = useAuth();
  
  if (!user) return null;

  const getRoleWelcome = () => {
    switch (user.role) {
      case 'admin':
        return 'Manage users, import data, and oversee your country operations.';
      default:
        return 'Welcome to Amber-Studios Workspace.';
    }
  };

  const getQuickStats = () => {
    // Mock data - in real app, this would come from API
    return [
      { label: 'Total Users', value: '156', icon: Calendar, color: 'primary' },
      { label: 'System Health', value: '98%', icon: TrendUp, color: 'accent' },
      { label: 'Pending Actions', value: '5', icon: Clock, color: 'destructive' },
    ];
  };

  const getRecentActivity = () => {
    // Mock data - in real app, this would come from API
    return [
      { 
        type: 'schedule',
        message: 'New schedule published for next week',
        time: '2 hours ago',
        priority: 'medium'
      },
      { 
        type: 'training',
        message: 'Training module "Customer Service Excellence" completed',
        time: '5 hours ago',
        priority: 'low'
      },
      { 
        type: 'mistake',
        message: 'Mistake reported: Incorrect pricing entry',
        time: '1 day ago',
        priority: 'high'
      },
    ];
  };

  const stats = getQuickStats();
  const activities = getRecentActivity();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">
          Welcome back, {user.firstName}!
        </h1>
        <p className="text-muted-foreground mt-2">
          {getRoleWelcome()}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest updates and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge 
                  variant={
                    activity.priority === 'high' ? 'destructive' :
                    activity.priority === 'medium' ? 'default' : 'secondary'
                  }
                >
                  {activity.priority}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role-specific Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks for your role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {user.role === 'admin' && (
              <>
                <button className="p-3 text-left border rounded-lg hover:bg-secondary">
                  <Calendar className="h-5 w-5 mb-2" />
                  <div className="text-sm font-medium">Import CSV</div>
                </button>
                <button className="p-3 text-left border rounded-lg hover:bg-secondary">
                  <ChartBar className="h-5 w-5 mb-2" />
                  <div className="text-sm font-medium">User Management</div>
                </button>
                <button className="p-3 text-left border rounded-lg hover:bg-secondary">
                  <BookOpen className="h-5 w-5 mb-2" />
                  <div className="text-sm font-medium">Training Content</div>
                </button>
                <button className="p-3 text-left border rounded-lg hover:bg-secondary">
                  <Warning className="h-5 w-5 mb-2" />
                  <div className="text-sm font-medium">Review Reports</div>
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}