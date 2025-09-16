import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { LoginModal } from '@/components/LoginModal';
import { Navigation } from '@/components/Navigation';
import { AdminPanel } from '@/components/AdminPanel';
import { useAuth } from '@/hooks/useAuth';
import { Country } from '@/types';

function App() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('welcome');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setCurrentPage('welcome');
    logout();
  };

  const handleLogin = async (loginValue: string, password: string, country: Country) => {
    setIsLoading(true);
    try {
      const success = await login(loginValue, password, country);
      if (success) {
        setCurrentPage('welcome');
      }
      return success;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'schedules':
        return <div className="p-6"><h1 className="text-2xl font-bold text-foreground uppercase">SCHEDULES</h1><p className="text-muted-foreground uppercase">COMING SOON...</p></div>;
      case 'mistakes':
        return <div className="p-6"><h1 className="text-2xl font-bold text-foreground uppercase">MISTAKE STATISTICS</h1><p className="text-muted-foreground uppercase">COMING SOON...</p></div>;
      case 'daily-mistakes':
        return <div className="p-6"><h1 className="text-2xl font-bold text-foreground uppercase">DAILY MISTAKES</h1><p className="text-muted-foreground uppercase">COMING SOON...</p></div>;
      case 'training':
        return <div className="p-6"><h1 className="text-2xl font-bold text-foreground uppercase">TRAINING ACADEMY</h1><p className="text-muted-foreground uppercase">COMING SOON...</p></div>;
      case 'news':
        return <div className="p-6"><h1 className="text-2xl font-bold text-foreground uppercase">NEWS & UPDATES</h1><p className="text-muted-foreground uppercase">COMING SOON...</p></div>;
      case 'request-schedule':
        return <div className="p-6"><h1 className="text-2xl font-bold text-foreground uppercase">REQUEST SCHEDULE</h1><p className="text-muted-foreground uppercase">COMING SOON...</p></div>;
      case 'handover':
        return <div className="p-6"><h1 className="text-2xl font-bold text-foreground uppercase">HANDOVER/TAKEOVER</h1><p className="text-muted-foreground uppercase">COMING SOON...</p></div>;
      case 'admin':
        return <AdminPanel />;
      case 'welcome':
      default:
        return (
          <div className="p-6 flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4 uppercase">
              WELCOME TO WORKSPACE
            </h1>
            <p className="text-lg text-muted-foreground uppercase">
              HELLO, {user?.firstName || user?.lastName 
                ? `${user.firstName} ${user.lastName}`.trim()
                : user?.login
              }
            </p>
            <p className="text-sm text-muted-foreground mt-2 uppercase">
              SELECT AN OPTION FROM THE MENU TO GET STARTED
            </p>
          </div>
        );
    }
  };

  // Show loading while processing login
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground uppercase">SIGNING IN...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background">
        <LoginModal isOpen={true} onLogin={handleLogin} />
        <Toaster />
      </div>
    );
  }

  // Authenticated user with navigation
  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        onLogout={handleLogout}
      />
      
      <main className="md:ml-80 min-h-screen">
        <div className="container mx-auto p-4 md:p-8 pt-16 md:pt-8">
          {renderPage()}
        </div>
      </main>
      
      <Toaster />
    </div>
  );
}

export default App;