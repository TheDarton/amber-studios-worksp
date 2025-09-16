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
  User,
  House
} from '@phosphor-icons/react';
import amberLogo from '@/assets/images/amber-studios-logo.png';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const getAvailableNavItems = () => {
    const allItems = [
      { 
        id: 'dashboard', 
        label: 'Dashboard', 
        icon: House,
        roles: ['admin', 'sm', 'dealer', 'operation']
      },
      { 
        id: 'schedules', 
        label: 'Schedules', 
        icon: Calendar,
        roles: ['admin', 'sm', 'dealer', 'operation']
      },
      { 
        id: 'mistakes', 
        label: 'Mistake Statistics', 
        icon: BarChart3,
        roles: ['admin', 'sm', 'dealer', 'operation']
      },
      { 
        id: 'daily-mistakes', 
        label: 'Daily Mistakes', 
        icon: AlertTriangle,
        roles: ['admin', 'sm', 'dealer', 'operation']
      },
      { 
        id: 'training', 
        label: 'Training Academy', 
        icon: BookOpen,
        roles: ['admin', 'sm', 'dealer', 'operation']
      },
      { 
        id: 'news', 
        label: 'News & Updates', 
        icon: Newspaper,
        roles: ['admin', 'sm', 'operation'] // Dealers don't see news page
      },
      { 
        id: 'request-schedule', 
        label: 'Request Schedule', 
        icon: ClipboardList,
        roles: ['admin', 'sm', 'dealer', 'operation']
      },
      { 
        id: 'handover', 
        label: 'Handover/Takeover', 
        icon: ArrowLeftRight,
        roles: ['admin', 'sm', 'operation'] // Only SM and Operation handle handovers
      },
      { 
        id: 'admin', 
        label: 'Admin Panel', 
        icon: Settings,
        roles: ['admin'] // Only admins see admin panel
      },
    ];

    return allItems.filter(item => item.roles.includes(user.role));
  };

  const availableItems = getAvailableNavItems();

  const NavContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-xl border-r border-border/50">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50">
        <div className="flex items-center space-x-3 mb-3">
          <img 
            src={amberLogo} 
            alt="Amber Studios" 
            className="h-8 w-auto object-contain"
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            {user.firstName || user.lastName 
              ? `${user.firstName} ${user.lastName}`.trim()
              : user.login
            }
          </p>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full font-medium capitalize">
              {user.role.replace('_', ' ')}
            </span>
            <span className="px-2 py-1 text-xs bg-accent/20 text-accent rounded-full font-medium">
              {user.country}
            </span>
          </div>
        </div>
      </div>
      
      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {availableItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <Button
              key={item.id}
              variant={isActive ? 'secondary' : 'ghost'}
              className={`w-full justify-start h-11 transition-all duration-200 group ${
                isActive 
                  ? 'bg-primary/15 text-primary hover:bg-primary/20 border border-primary/30 shadow-lg shadow-primary/10' 
                  : 'hover:bg-secondary/80 hover:text-foreground hover:shadow-md'
              }`}
              onClick={() => {
                onNavigate(item.id);
                onItemClick?.();
              }}
            >
              <Icon className={`mr-3 h-4 w-4 transition-all duration-200 ${
                isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
              }`} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1 h-1 bg-primary rounded-full animate-pulse" />
              )}
            </Button>
          );
        })}
      </nav>
      
      <Separator className="bg-border/50" />
      
      {/* Footer Actions */}
      <div className="p-4 space-y-1 bg-muted/30">
        <Button 
          variant="ghost" 
          className="w-full justify-start h-11 hover:bg-secondary/80 transition-all duration-200 group"
        >
          <User className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="font-medium">Profile</span>
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start h-11 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group"
          onClick={(e) => {
            e.preventDefault();
            logout();
          }}
          type="button"
        >
          <LogOut className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors" />
          <span className="font-medium">Sign Out</span>
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
            <Button 
              variant="outline" 
              size="icon" 
              className="fixed top-4 left-4 z-50 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0 bg-card/95 backdrop-blur-xl">
            <NavContent onItemClick={() => {}} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block fixed left-0 top-0 h-full w-80 z-40">
        <NavContent />
      </div>
    </>
  );
}