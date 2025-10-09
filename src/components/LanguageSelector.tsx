import { CaretDown } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage, type Language } from '@/hooks/useLanguage';

const LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸' },
  lv: { name: 'Latviešu', flag: '🇱🇻' },
  pl: { name: 'Polski', flag: '🇵🇱' },
  ka: { name: 'ქართული', flag: '🇬🇪' },
  es: { name: 'Español', flag: '🇨🇴' },
  lt: { name: 'Lietuvių', flag: '🇱🇹' },
} as const;

export function LanguageSelector() {
  const { currentLanguage, changeLanguage } = useLanguage();
  const currentLang = LANGUAGES[currentLanguage];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs font-normal text-muted-foreground hover:text-foreground hover:bg-muted/50"
        >
          <span className="mr-1">{currentLang.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.toUpperCase()}</span>
          <CaretDown className="ml-1 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {Object.entries(LANGUAGES).map(([code, lang]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => changeLanguage(code as Language)}
            className={`cursor-pointer ${
              currentLanguage === code ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            <span className="mr-2">{lang.flag}</span>
            <span className="text-sm">{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}