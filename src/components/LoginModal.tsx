import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { COUNTRIES } from '@/lib/constants';
import { Country } from '@/types';
import { toast } from 'sonner';
import { Calendar, Clock, Users } from '@phosphor-icons/react';
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
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const success = await onLogin(login, password, country);
      if (!success) {
        toast.error('Invalid credentials or inactive account');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-accent/3 rounded-lg" />
        
        <DialogHeader className="relative">
          <div className="flex items-center justify-center mb-6">
            <img 
              src={amberLogo} 
              alt="Amber Studios" 
              className="h-16 w-auto object-contain"
            />
          </div>
          <DialogTitle className="text-center text-2xl font-bold text-foreground">
            Amber-Studios Workspace
          </DialogTitle>
          <div className="text-center mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              Shift Management System for{' '}
              <a 
                href="https://amber-studios.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-accent underline underline-offset-2 transition-colors duration-200 font-medium"
              >
                amber-studios.com
              </a>
            </p>
            <div className="flex items-center justify-center space-x-6 mt-3">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Schedule Management</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Clock className="w-4 h-4 text-accent" />
                <span>Shift Tracking</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Users className="w-4 h-4 text-primary" />
                <span>Team Management</span>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-medium">Country</Label>
            <Select value={country} onValueChange={(value) => setCountry(value as Country)}>
              <SelectTrigger className="bg-background border-border focus:border-primary focus:ring-primary/20">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border shadow-lg">
                {COUNTRIES.map((c) => (
                  <SelectItem 
                    key={c.value} 
                    value={c.value}
                    className="hover:bg-primary/10 focus:bg-primary/10"
                  >
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="login" className="text-sm font-medium">Login</Label>
            <Input
              id="login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Enter your login"
              className="bg-background border-border focus:border-primary focus:ring-primary/20"
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
              placeholder="Enter your password"
              className="bg-background border-border focus:border-primary focus:ring-primary/20"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium shadow-lg shadow-primary/20 transition-all duration-200" 
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