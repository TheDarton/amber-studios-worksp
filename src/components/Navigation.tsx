import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  House, 
  Users, 
  FileArrowUp, 
  GraduationCap, 
  Calendar,
  Bug,
  Newspaper,
  Handshake,
  Gear,
  SignOut
} from '@phosphor-icons/react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const { user, effectiveCountryCode, countries, logout } = useAuth();

  const currentCountry = countries.find(c => c.code === effectiveCountryCode);

  const getMenuItems = () => {
    if (!user) return [];

    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: House }
    ];

    switch (user.role) {
      case 'Global_Admin':
        return [
          ...baseItems,
          { id: 'countries', label: 'Country Management', icon: Users },
          { id: 'create-admin', label: 'Create Country Admin', icon: FileArrowUp },
          { id: 'country-select', label: 'Select Active Country', icon: Calendar },
          { id: 'admin', label: 'Admin Panel', icon: Gear }
        ];
      case 'Country_Admin':
        return [
          ...baseItems,
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'csv-import', label: 'CSV Import', icon: FileArrowUp },
          { id: 'sm-academy', label: 'SM Training Academy', icon: GraduationCap },
          { id: 'dealer-academy', label: 'Dealer Training Academy', icon: GraduationCap },
          { id: 'schedules', label: 'Schedules', icon: Calendar },
          { id: 'mistakes', label: 'Mistakes', icon: Bug },
          { id: 'news', label: 'News', icon: Newspaper },
          { id: 'handovers', label: 'Handovers', icon: Handshake },
          { id: 'admin', label: 'Admin Panel', icon: Gear }
        ];

      case 'SM':
        return [
          ...baseItems,
          { id: 'sm-schedule', label: 'SM Schedules', icon: Calendar },
          { id: 'mistakes', label: 'Mistakes', icon: Bug },
          { id: 'sm-academy', label: 'SM Training Academy', icon: GraduationCap },
          { id: 'news', label: 'News', icon: Newspaper },
          { id: 'handovers', label: 'Handovers', icon: Handshake }
        ];

      case 'Dealer':
        return [
          ...baseItems,
          { id: 'dealer-schedule', label: 'Dealer Schedules', icon: Calendar },
          { id: 'mistakes', label: 'Mistakes', icon: Bug },
          { id: 'dealer-academy', label: 'Dealer Training Academy', icon: GraduationCap }
        ];

      case 'Operation':
        return [
          ...baseItems,
          { id: 'schedules', label: 'All Schedules', icon: Calendar },
          { id: 'mistakes', label: 'Mistakes', icon: Bug },
          { id: 'sm-academy', label: 'SM Training Academy', icon: GraduationCap },
          { id: 'dealer-academy', label: 'Dealer Training Academy', icon: GraduationCap },
          { id: 'news', label: 'News', icon: Newspaper },
          { id: 'handovers', label: 'Handovers', icon: Handshake }
        ];

      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">Amber Studios</h2>
        <p className="text-sm text-muted-foreground">Workspace</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.username}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {user?.role}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {currentCountry?.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentView === item.id ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
                onClick={() => onViewChange(item.id)}
              >
                <Icon size={16} />
                {item.label}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive"
          onClick={logout}
        >
          <SignOut size={16} />
          Sign Out
        </Button>
      </div>
    </div>
  );
}