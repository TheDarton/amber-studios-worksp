import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeClosed } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { useLanguage, Language } from '@/hooks/useLanguage';
import { getTranslation, languageOptions } from '@/lib/translations';
import logoImg from '@/assets/images/amber-studios-logo.png';

interface LoginModalProps {
  isOpen: boolean;
  onLogin: (login: string, password: string) => Promise<boolean>;
}

export function LoginModal({ isOpen, onLogin }: LoginModalProps) {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const t = (key: string) => getTranslation(currentLanguage, key);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!login.trim() || !password.trim()) {
      toast.error(t('invalidCredentials'));
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await onLogin(login.trim(), password);
      if (!success) {
        toast.error(t('invalidCredentials'));
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(t('invalidCredentials'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent 
        className="sm:max-w-md mx-auto bg-white/95 backdrop-blur-sm border-orange-200 shadow-2xl"
        aria-describedby="login-description"
      >
        <div id="login-description" className="sr-only">
          Login form to access the workspace management system
        </div>
        
        <div className="flex flex-col items-center space-y-6 py-4">
          {/* Logo */}
          <div className="flex items-center justify-center mb-2">
            <img src={logoImg} alt="Amber Studios Logo" className="h-16 w-auto" />
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {t('workspace')}
            </h1>
            <div className="text-sm text-gray-600 leading-tight">
              <div>{t('managementSystem')}</div>
              <div>{t('gamePresenters')}</div>
            </div>
          </div>

          {/* Language Selector */}
          <div className="w-full space-y-2">
            <Label htmlFor="language" className="text-sm text-gray-700">
              {t('language')}
            </Label>
            <Select value={currentLanguage} onValueChange={(value: Language) => changeLanguage(value)}>
              <SelectTrigger id="language" className="w-full bg-white border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login" className="text-sm text-gray-700">
                {t('login')}
              </Label>
              <Input
                id="login"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full bg-white border-gray-300"
                required
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-gray-700">
                {t('password')}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border-gray-300 pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  title={showPassword ? t('hidePassword') : t('showPassword')}
                >
                  {showPassword ? (
                    <EyeClosed size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5"
              disabled={isLoading}
            >
              {isLoading ? t('loading') : t('signIn')}
            </Button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-2">
            <a
              href="https://amber-studios.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors underline"
            >
              amber-studios.com
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}