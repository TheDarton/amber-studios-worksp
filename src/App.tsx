import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { LoginModal } from '@/components/LoginModal';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { AdminPanel } from '@/components/AdminPanel';
import { useAuth } from '@/hooks/useAuth';
import { Country } from '@/types';

function App() {
  const { user, isAuthenticated, login } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = async (loginValue: string, password: string, country: Country) => {
    return await login(loginValue, password, country);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
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
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <LoginModal isOpen={true} onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      
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