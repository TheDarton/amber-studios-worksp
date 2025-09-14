import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  Calendar, 
  ChartBar, 
  BookOpen,
  Users,
  FileText,
  ClipboardText,
  Handshake,
  Note
} from '@phosphor-icons/react';

export function Dashboard() {
  const { user } = useAuth();
  
  if (!user) return null;

  const getQuickActions = () => {
    const commonActions = [
      { 
        icon: Calendar, 
        label: 'Schedules', 
        description: 'View work schedules',
        available: true 
      },
      { 
        icon: ChartBar, 
        label: 'Mistake Statistics', 
        description: 'Performance analytics',
        available: true 
      },
      { 
        icon: ClipboardText, 
        label: 'Daily Mistakes', 
        description: 'Daily error reports',
        available: true 
      },
      { 
        icon: BookOpen, 
        label: 'Training Academy', 
        description: 'Learning resources',
        available: user.role !== 'operation' 
      },
      { 
        icon: Note, 
        label: 'News & Updates', 
        description: 'Latest announcements',
        available: user.role === 'sm' || user.role === 'operation' 
      },
      { 
        icon: Calendar, 
        label: 'Request Schedule', 
        description: 'Submit schedule requests',
        available: true 
      },
      { 
        icon: Handshake, 
        label: 'Handover/Takeover', 
        description: 'Transfer records',
        available: true 
      }
    ];

    if (user.role === 'admin') {
      commonActions.push(
        { 
          icon: Users, 
          label: 'User Management', 
          description: 'Manage users and permissions',
          available: true 
        },
        { 
          icon: FileText, 
          label: 'CSV Import', 
          description: 'Import data files',
          available: true 
        }
      );
    }

    return commonActions.filter(action => action.available);
  };

  const actions = getQuickActions();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl" />
        <div className="relative p-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome, {user.firstName}!
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Access your workspace tools and resources
          </p>
          <div className="flex items-center space-x-2 mt-4">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
              {user.role.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 capitalize">
              {user.country}
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Available Tools</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button 
                  key={index}
                  variant="outline" 
                  className="h-24 flex-col space-y-2 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 group text-left justify-start p-4"
                >
                  <div className="flex items-center space-x-3 w-full">
                    <Icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium">{action.label}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}