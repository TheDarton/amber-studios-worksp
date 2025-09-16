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
  SignOut as LogOut
} from '@phosphor-icons/react';
import amberLogo from '@/assets/images/amber-studios-logo.png';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function Navigation({ currentPage, onNavigate, onLogout }: NavigationProps) {
  const { user, isAuthenticated } = useAuth();
  
  // Show loading state while user data is being fetched
  if (!isAuthenticated || !user) {
    return (
      <>
        {/* Mobile Navigation Loading */}
        <div className="md:hidden">
          <div className="fixed top-4 left-4 z-50">
            <div className="w-10 h-10 bg-card border border-border rounded-md shadow-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          </div>
        </div>

        {/* Desktop Navigation Loading */}
        <div className="hidden md:block fixed left-0 top-0 h-full w-80 z-40">
          <div className="flex flex-col h-full bg-card border-r border-border">
            <div className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
              <div className="flex items-center space-x-3 mb-3">
                <img 
                  src={amberLogo} 
                  alt="Amber Studios" 
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-sm font-medium text-foreground uppercase">LOADING...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Additional safety check for user properties
  if (!user.role || !user.login) {
    return (
      <>
        {/* Mobile Navigation Loading */}
        <div className="md:hidden">
          <div className="fixed top-4 left-4 z-50">
            <div className="w-10 h-10 bg-card border border-border rounded-md shadow-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          </div>
        </div>

        {/* Desktop Navigation Loading */}
        <div className="hidden md:block fixed left-0 top-0 h-full w-80 z-40">
          <div className="flex flex-col h-full bg-card border-r border-border">
            <div className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
              <div className="flex items-center space-x-3 mb-3">
                <img 
                  src={amberLogo} 
                  alt="Amber Studios" 
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-sm font-medium text-foreground uppercase">LOADING USER DATA...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const getAvailableNavItems = () => {
    const allItems = [
      { 
        id: 'schedules', 
        label: 'SCHEDULES', 
        icon: Calendar,
        roles: ['admin', 'sm', 'dealer', 'operation']
      },
      { 
        id: 'mistakes', 
        label: 'MISTAKE STATISTICS', 
        icon: BarChart3,
        roles: ['admin', 'sm', 'dealer', 'operation']
      },
      { 
        id: 'daily-mistakes', 
        label: 'DAILY MISTAKES', 
        icon: AlertTriangle,
        roles: ['admin', 'sm', 'dealer', 'operation']
      },
      { 
        id: 'training', 
        label: 'TRAINING ACADEMY', 
        icon: BookOpen,
        roles: ['admin', 'sm', 'dealer', 'operation']
      },
      { 
        id: 'news', 
        label: 'NEWS & UPDATES', 
        icon: Newspaper,
        roles: ['admin', 'sm', 'operation'] // Dealers don't see news page
      },
      { 
        id: 'request-schedule', 
        label: 'REQUEST SCHEDULE', 
        icon: ClipboardList,
        roles: ['admin', 'sm', 'dealer', 'operation']
      },
      { 
        id: 'handover', 
        label: 'HANDOVER/TAKEOVER', 
        icon: ArrowLeftRight,
        roles: ['admin', 'sm', 'operation'] // Only SM and Operation handle handovers
      },
      { 
        id: 'admin', 
        label: 'ADMIN PANEL', 
        icon: Settings,
        roles: ['admin'] // Only admins see admin panel
      },
    ];

    return allItems.filter(item => item.roles.includes(user.role));
  };

  const availableItems = getAvailableNavItems();

  const NavContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
        <div className="flex items-center space-x-3 mb-3">
          <img 
            src={amberLogo} 
            alt="Amber Studios" 
            className="h-14 w-auto object-contain"
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
            <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full font-medium uppercase">
              {user.role.replace('_', ' ')}
            </span>
            <span className="px-2 py-1 text-xs bg-accent/20 text-accent rounded-full font-medium uppercase">
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
              className={`w-full justify-start h-11 transition-all duration-200 group ${
                isActive 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg' 
                  : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'
              }`}
              onClick={() => {
                onNavigate(item.id);
                onItemClick?.();
              }}
            >
              <Icon className={`mr-3 h-4 w-4 transition-all duration-200 ${
                isActive ? 'text-primary-foreground' : 'text-secondary-foreground group-hover:text-primary-foreground'
              }`} />
              <span className="font-medium uppercase">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1 h-1 bg-primary-foreground rounded-full animate-pulse" />
              )}
            </Button>
          );
        })}
      </nav>
      
      <Separator className="bg-border" />
      
      {/* Footer Actions */}
      <div className="p-4 space-y-1 bg-muted/30">
        <Button 
          className="w-full justify-start h-11 bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-200 group"
          onClick={(e) => {
            e.preventDefault();
            onLogout();
          }}
          type="button"
        >
          <LogOut className="mr-3 h-4 w-4 text-destructive-foreground transition-colors" />
          <span className="font-medium uppercase">SIGN OUT</span>
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
              className="fixed top-4 left-4 z-50 bg-card border-border shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0 bg-card">
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