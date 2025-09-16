import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { COUNTRIES } from '@/lib/constants';
import { Country } from '@/types';
import { toast } from 'sonner';
import amberLogo from '@/assets/images/amber-studios-logo.png';

interface LoginModalProps {
  isOpen: boolean;
  onLogin: (login: string, password: string, country: Country) => Promise<boolean>;
}

export function LoginModal({ isOpen, onLogin }: LoginModalProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState<Country | ''>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!login || !password || !country) {
      toast.error('PLEASE FILL IN ALL FIELDS');
      return;
    }

    if (isLoading) {
      return; // Prevent multiple submissions
    }

    setIsLoading(true);
    try {
      const success = await onLogin(login, password, country);
      if (!success) {
        toast.error('INVALID CREDENTIALS OR INACTIVE ACCOUNT');
      }
      // Always reset loading state
    } catch (error) {
      toast.error('LOGIN FAILED. PLEASE TRY AGAIN.');
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
          <DialogTitle className="text-center text-2xl font-bold text-foreground uppercase">
            WORKSPACE
          </DialogTitle>
          <DialogDescription id="login-description" className="text-center mt-4">
            <p className="text-sm text-muted-foreground uppercase font-bold">
              MANAGEMENT SYSTEM FOR{' '}
              <a 
                href="https://amber-studios.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground underline underline-offset-2 transition-colors duration-200 font-bold"
              >
                AMBER-STUDIOS.COM
              </a>{' '}
              DEALERS AND SHIFT MANAGERS
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-medium uppercase">COUNTRY</Label>
            <Select value={country} onValueChange={(value) => setCountry(value as Country)}>
              <SelectTrigger className="w-full h-10 bg-background border-border focus:border-primary focus:ring-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border shadow-lg">
                {COUNTRIES.map((c) => (
                  <SelectItem 
                    key={c.value} 
                    value={c.value}
                    className="hover:bg-primary/10 focus:bg-primary/10 hover:text-foreground focus:text-foreground data-[highlighted]:bg-primary/10 data-[highlighted]:text-foreground uppercase cursor-pointer"
                  >
                    {c.label.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="login" className="text-sm font-medium uppercase">LOGIN</Label>
            <Input
              id="login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full h-10 bg-background border-border focus:border-primary focus:ring-primary/20"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium uppercase">PASSWORD</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 bg-background border-border focus:border-primary focus:ring-primary/20"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200 uppercase" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>SIGNING IN...</span>
              </div>
            ) : (
              'SIGN IN'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}