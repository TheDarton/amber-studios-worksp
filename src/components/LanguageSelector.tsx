import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CaretDown } from '@phosphor-icons/react';

export function LanguageSelector() {
  const { currentLanguage, languages, changeLanguage, getCurrentLanguage } = useLanguage();
  const current = getCurrentLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-sm gap-1 h-8 px-2">
          <span className="text-base">{current.flag}</span>
          <span className="uppercase font-medium">{current.code}</span>
          <CaretDown size={12} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`flex items-center gap-2 ${
              language.code === currentLanguage ? 'bg-accent' : ''
            }`}
          >
            <span className="text-base">{language.flag}</span>
            <span className="font-medium">{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}