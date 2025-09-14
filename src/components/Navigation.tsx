import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { hasPermission } from '@/lib/auth';
import { 
  List as Menu, 
  Calendar, 
  ChartBar as BarChart3, 
  Warning as AlertTriangle, 
  BookOpen, 
  Newspaper, 
  Clipboard as ClipboardList, 
  ArrowsLeftRight as ArrowLeftRight,
  Gear as Settings,
  SignOut as LogOut,
  User
} from '@phosphor-icons/react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart3,
      roles: ['dealer', 'sm', 'operation', 'admin', 'global_admin']
    },
    { 
      id: 'schedules', 
      label: 'Schedules', 
      icon: Calendar,
      roles: ['dealer', 'sm', 'operation', 'admin', 'global_admin']
    },
    { 
      id: 'mistakes', 
      label: 'Mistake Statistics', 
      icon: BarChart3,
      roles: ['dealer', 'sm', 'operation', 'admin', 'global_admin']
    },
    { 
      id: 'daily-mistakes', 
      label: 'Daily Mistakes', 
      icon: AlertTriangle,
      roles: ['dealer', 'sm', 'operation', 'admin', 'global_admin']
    },
    { 
      id: 'training', 
      label: 'Training Academy', 
      icon: BookOpen,
      roles: ['dealer', 'sm', 'operation', 'admin', 'global_admin']
    },
    { 
      id: 'news', 
      label: 'News & Updates', 
      icon: Newspaper,
      roles: ['sm', 'operation', 'admin', 'global_admin']
    },
    { 
      id: 'request-schedule', 
      label: 'Request Schedule', 
      icon: ClipboardList,
      roles: ['dealer', 'sm', 'operation', 'admin', 'global_admin']
    },
    { 
      id: 'handover', 
      label: 'Handover/Takeover', 
      icon: ArrowLeftRight,
      roles: ['sm', 'operation', 'admin', 'global_admin']
    },
    { 
      id: 'admin', 
      label: 'Admin Panel', 
      icon: Settings,
      roles: ['admin', 'global_admin']
    },
  ];

  const availableItems = navItems.filter(item => 
    hasPermission(user.role, item.roles as any)
  );

  const NavContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-primary">Amber-Studios</h2>
        <p className="text-sm text-muted-foreground">{user.firstName} {user.lastName}</p>
        <p className="text-xs text-muted-foreground capitalize">{user.role.replace('_', ' ')} • {user.country}</p>
      </div>
      
      <Separator />
      
      <nav className="flex-1 p-4 space-y-2">
        {availableItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={currentPage === item.id ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                onNavigate(item.id);
                onItemClick?.();
              }}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
      
      <Separator />
      
      <div className="p-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start">
          <User className="mr-2 h-4 w-4" />
          Profile
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <NavContent onItemClick={() => {}} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block fixed left-0 top-0 h-full w-72 border-r bg-background">
        <NavContent />
      </div>
    </>
  );
}