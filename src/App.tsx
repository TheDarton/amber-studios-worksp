import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { LoginModal } from '@/components/LoginModal';
import { Navigation } from '@/components/Navigation';
import { AdminPanel } from '@/components/AdminPanel';
import { useAuth } from '@/hooks/useAuth';
import { Country } from '@/types';

function App() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('welcome');

  const handleLogout = () => {
    setCurrentPage('welcome');
    logout();
  };

  const handleLogin = async (loginValue: string, password: string, country: Country) => {
    const success = await login(loginValue, password, country);
    if (success) {
      setCurrentPage('welcome');
    }
    return success;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'schedules':
        return <div className="p-6"><h1 className="text-2xl font-bold text-foreground">Schedules</h1><p className="text-muted-foreground">Coming soon...</p></div>;
      case 'mistakes':
        return <div className="p-6"><h1 className="text-2xl font-bold text-foreground">Mistake Statistics</h1><p className="text-muted-foreground">Coming soon...</p></div>;
      case 'daily-mistakes':
        return <div className="p-6"><h1 className="text-2xl font-bold text-foreground">Daily Mistakes</h1><p className="text-muted-foreground">Coming soon...</p></div>;
      case 'training':
        return <div className="p-6"><h1 className="text-2xl font-bold text-foreground">Training Academy</h1><p className="text-muted-foreground">Coming soon...</p></div>;
      case 'news':
        return <div className="p-6"><h1 className="text-2xl font-bold text-foreground">News & Updates</h1><p className="text-muted-foreground">Coming soon...</p></div>;
      case 'request-schedule':
        return <div className="p-6"><h1 className="text-2xl font-bold text-foreground">Request Schedule</h1><p className="text-muted-foreground">Coming soon...</p></div>;
      case 'handover':
        return <div className="p-6"><h1 className="text-2xl font-bold text-foreground">Handover/Takeover</h1><p className="text-muted-foreground">Coming soon...</p></div>;
      case 'admin':
        return <AdminPanel />;
      case 'welcome':
      default:
        return (
          <div className="p-6 flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Welcome to Workspace
            </h1>
            <p className="text-lg text-muted-foreground">
              Hello, {user?.firstName || user?.lastName 
                ? `${user.firstName} ${user.lastName}`.trim()
                : user?.login
              }
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Select an option from the menu to get started
            </p>
          </div>
        );
    }
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
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