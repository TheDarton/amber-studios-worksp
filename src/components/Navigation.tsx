import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { hasPermission } from '@/lib/auth';
import { Country } from '@/types';
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
  Globe as Globe
} from '@phosphor-icons/react';
import amberLogo from '@/assets/images/amber-studios-logo.png';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const COUNTRY_NAMES = {
  latvia: 'Latvia',
  poland: 'Poland',
  georgia: 'Georgia',
  colombia: 'Colombia',
  lithuania: 'Lithuania',
} as const;

export function Navigation({ currentPage, onNavigate, onLogout }: NavigationProps) {
  const { user, isGlobalAdmin, effectiveCountry, switchCountry } = useAuth();
  
  // Fallback user data if not loaded yet
  const currentUser = user || { 
    role: 'admin', 
    login: 'User', 
    firstName: 'Admin', 
    lastName: 'User',
    country: 'poland' 
  };

  const getAvailableNavItems = () => {
    const allItems = [
      { 
        id: 'schedules', 
        label: 'Schedules', 
        icon: Calendar,
        roles: ['admin', 'global-admin', 'sm', 'dealer', 'operation']
      },
      { 
        id: 'mistakes', 
        label: 'Mistake Statistics', 
        icon: BarChart3,
        roles: ['admin', 'global-admin', 'sm', 'dealer', 'operation']
      },
      { 
        id: 'daily-mistakes', 
        label: 'Daily Mistakes', 
        icon: AlertTriangle,
        roles: ['admin', 'global-admin', 'sm', 'dealer', 'operation']
      },
      { 
        id: 'training', 
        label: 'Training Academy', 
        icon: BookOpen,
        roles: ['admin', 'global-admin', 'sm', 'dealer', 'operation']
      },
      { 
        id: 'news', 
        label: 'News & Updates', 
        icon: Newspaper,
        roles: ['admin', 'global-admin', 'sm', 'operation'] // Dealers don't see news page
      },
      { 
        id: 'request-schedule', 
        label: 'Request Schedule', 
        icon: ClipboardList,
        roles: ['admin', 'global-admin', 'sm', 'dealer', 'operation']
      },
      { 
        id: 'handover', 
        label: 'Handover/Takeover', 
        icon: ArrowLeftRight,
        roles: ['admin', 'global-admin', 'sm', 'operation'] // Only SM and Operation handle handovers
      },
      { 
        id: 'admin', 
        label: 'Users', 
        icon: Settings,
        roles: ['admin', 'global-admin'] // Only admins see admin panel
      },
    ];

    return allItems.filter(item => item.roles.includes(currentUser.role));
  };

  const availableItems = getAvailableNavItems();

  const NavContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-6 bg-background/80 from-primary/10 to-accent/10 border-b border-border">
        <div className="flex items-center space-x-3 mb-3">
          <img 
            src={amberLogo} 
            alt="Amber Studios" 
            className="h-14 w-auto object-contain"
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            {currentUser.firstName || currentUser.lastName 
              ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
              : currentUser.login
            }
          </p>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full font-medium">
              {currentUser.role.replace('-', ' ')}
            </span>
            <span className="px-2 py-1 text-xs bg-accent/20 text-accent rounded-full font-medium">
              {COUNTRY_NAMES[effectiveCountry as keyof typeof COUNTRY_NAMES] || effectiveCountry}
            </span>
          </div>
        </div>

        {/* Country Selector for Global Admin */}
        {isGlobalAdmin && (
          <div className="mt-4">
            <div className="flex items-center space-x-2 mb-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Active Country</span>
            </div>
            <Select
              value={effectiveCountry || 'latvia'}
              onValueChange={(value) => switchCountry(value as Country)}
            >
              <SelectTrigger className="w-full h-8 text-xs bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(COUNTRY_NAMES).map(([code, name]) => (
                  <SelectItem key={code} value={code} className="text-xs">
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto bg-background/80">
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
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1 h-1 bg-primary-foreground rounded-full animate-pulse" />
              )}
            </Button>
          );
        })}
      </nav>
      
      <Separator className="bg-border" />
      
      {/* Footer Actions */}
      <div className="p-4 space-y-1 bg-background/80">
        <Button 
          className="w-full justify-start h-11 bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-200 group"
          onClick={(e) => {
            e.preventDefault();
            onLogout();
          }}
          type="button"
        >
          <LogOut className="mr-3 h-4 w-4 text-destructive-foreground transition-colors" />
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