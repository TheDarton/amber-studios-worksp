import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  Calendar, 
  ChartBar, 
  Warning, 
  BookOpen,
  TrendUp,
  Clock,
  Users,
  FileText
} from '@phosphor-icons/react';

export function Dashboard() {
  const { user } = useAuth();
  
  if (!user) return null;

  const getRoleWelcome = () => {
    switch (user.role) {
      case 'admin':
        return 'Manage users, import data, and oversee your country operations.';
      case 'sm':
        return 'View your schedule, manage teams, and access training resources.';
      case 'dealer':
        return 'Check your schedule, track performance, and complete training.';
      case 'operation':
        return 'Monitor operations, view reports, and manage handovers.';
      default:
        return 'Welcome to Amber-Studios Workspace.';
    }
  };

  const getQuickStats = () => {
    // Mock data - in real app, this would come from API
    const baseStats = [
      { label: 'Active Users', value: '156', icon: Users, color: 'primary' },
      { label: 'System Health', value: '98%', icon: TrendUp, color: 'accent' },
      { label: 'Pending Actions', value: '5', icon: Clock, color: 'destructive' },
    ];

    if (user.role === 'admin') {
      return baseStats;
    }

    return [
      { label: 'My Schedule', value: '7 days', icon: Calendar, color: 'primary' },
      { label: 'Completion Rate', value: '94%', icon: TrendUp, color: 'accent' },
      { label: 'Tasks Due', value: '3', icon: Clock, color: 'destructive' },
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
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl" />
        <div className="relative p-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            {getRoleWelcome()}
          </p>
          <div className="flex items-center space-x-2 mt-4">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
              {user.role.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
              {user.country}
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">vs last period</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription>
            Latest updates and notifications from your workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 group-hover:scale-125 transition-transform" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
                <Badge 
                  variant={
                    activity.priority === 'high' ? 'destructive' :
                    activity.priority === 'medium' ? 'default' : 'secondary'
                  }
                  className="opacity-60 group-hover:opacity-100 transition-opacity"
                >
                  {activity.priority}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role-specific Quick Actions */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>
            Common tasks for your role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user.role === 'admin' && (
              <>
                <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 group">
                  <FileText className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Import CSV</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 group">
                  <Users className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">User Management</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 group">
                  <BookOpen className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Training Content</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 group">
                  <Warning className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Review Reports</span>
                </Button>
              </>
            )}
            {(user.role === 'sm' || user.role === 'dealer' || user.role === 'operation') && (
              <>
                <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 group">
                  <Calendar className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">View Schedule</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 group">
                  <ChartBar className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Performance</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 group">
                  <BookOpen className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Training</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 group">
                  <FileText className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Reports</span>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}