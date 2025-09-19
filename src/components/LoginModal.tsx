import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Country } from '@/types';
import { toast } from 'sonner';
import amberLogo from '@/assets/images/amber-studios-logo.png';

interface LoginModalProps {
  isOpen: boolean;
  onLogin: (login: string, password: string, country: Country) => Promise<boolean>;
}

const COUNTRY_PREFIXES = {
  'lv_': 'latvia' as Country,
  'pl_': 'poland' as Country,
  'ge_': 'georgia' as Country,
  'co_': 'colombia' as Country,
  'lt_': 'lithuania' as Country,
};

export function LoginModal({ isOpen, onLogin }: LoginModalProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getCountryFromLogin = (loginValue: string): Country | null => {
    // Check for global admin (no prefix)
    if (loginValue === 'admin') {
      return null; // Special case for global admin
    }
    
    for (const [prefix, country] of Object.entries(COUNTRY_PREFIXES)) {
      if (loginValue.startsWith(prefix)) {
        return country;
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!login || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (isLoading) {
      return; // Prevent multiple submissions
    }

    // Determine country from login prefix or global admin
    const country = getCountryFromLogin(login);
    
    // For global admin, use a default country for login but will have access to all
    const loginCountry = country || 'latvia';

    setIsLoading(true);
    try {
      const success = await onLogin(login, password, loginCountry);
      if (!success) {
        toast.error('Invalid credentials or inactive account');
      }
      // Always reset loading state
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-2xl" aria-describedby="login-description">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-accent/3 rounded-lg" />
        
        <DialogHeader className="relative">
          <div className="flex items-center justify-center mb-6">
            <img 
              src={amberLogo} 
              alt="Amber Studios" 
              className="h-24 w-auto object-contain"
            />
          </div>
          <DialogTitle className="text-center text-2xl font-bold text-foreground">
            Workspace
          </DialogTitle>
          <DialogDescription id="login-description" className="text-center mt-4">
            <p className="text-sm text-muted-foreground leading-tight">
              Management system for{' '}
              <a 
                href="https://amber-studios.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground underline underline-offset-2 transition-colors duration-200"
              >
                amber-studios.com
              </a>
              <br />
              Game presenters and shift managers
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="space-y-2">
            <Label htmlFor="login" className="text-sm font-medium">Login</Label>
            <Input
              id="login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full h-10 bg-background border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 bg-background border-border"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}