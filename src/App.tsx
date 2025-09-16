import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { LoginModal } from '@/components/LoginModal';
import { Navigation } from '@/components/Navigation';
import { AdminPanel } from '@/components/AdminPanel';
import { useAuth } from '@/hooks/useAuth';
import { Country } from '@/types';

function App() {
  const { user, isAuthenticated, login } = useAuth();
  const [currentPage, setCurrentPage] = useState('schedules');

  const handleLogin = async (loginValue: string, password: string, country: Country) => {
    return await login(loginValue, password, country);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'schedules':
        return <div className="p-6"><h1 className="text-2xl font-bold">Schedules</h1><p>Coming soon...</p></div>;
      case 'mistakes':
        return <div className="p-6"><h1 className="text-2xl font-bold">Mistake Statistics</h1><p>Coming soon...</p></div>;
      case 'daily-mistakes':
        return <div className="p-6"><h1 className="text-2xl font-bold">Daily Mistakes</h1><p>Coming soon...</p></div>;
      case 'training':
        return <div className="p-6"><h1 className="text-2xl font-bold">Training Academy</h1><p>Coming soon...</p></div>;
      case 'news':
        return <div className="p-6"><h1 className="text-2xl font-bold">News & Updates</h1><p>Coming soon...</p></div>;
      case 'request-schedule':
        return <div className="p-6"><h1 className="text-2xl font-bold">Request Schedule</h1><p>Coming soon...</p></div>;
      case 'handover':
        return <div className="p-6"><h1 className="text-2xl font-bold">Handover/Takeover</h1><p>Coming soon...</p></div>;
      case 'admin':
        return <AdminPanel />;
      default:
        return <div className="p-6"><h1 className="text-2xl font-bold">Schedules</h1><p>Coming soon...</p></div>;
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
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