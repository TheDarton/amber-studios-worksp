import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { LoginModal } from '@/components/LoginModal';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { AdminPanel } from '@/components/AdminPanel';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useAuth } from '@/hooks/useAuth';

function App() {
  const { user, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<string>('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'admin':
        return <AdminPanel />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <LoginModal />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Language selector in top right */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector />
      </div>
      
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <main className="pl-64">
        {renderCurrentView()}
      </main>
      <Toaster />
    </div>
  );
}

export default App;