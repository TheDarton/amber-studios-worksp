import { useKV } from '@github/spark/hooks';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'lv', name: 'Latvian', flag: '🇱🇻' },
  { code: 'lt', name: 'Lithuanian', flag: '🇱🇹' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'ka', name: 'Georgian', flag: '🇬🇪' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' }
];

interface LanguageState {
  currentLanguage: string;
}

export function useLanguage() {
  const [languageState, setLanguageState] = useKV<LanguageState>('language-state', {
    currentLanguage: 'en'
  });

  const changeLanguage = (langCode: string) => {
    setLanguageState({
      currentLanguage: langCode
    });
  };

  const getCurrentLanguage = () => {
    return LANGUAGES.find(lang => lang.code === languageState?.currentLanguage) || LANGUAGES[0];
  };

  return {
    currentLanguage: languageState?.currentLanguage || 'en',
    languages: LANGUAGES,
    changeLanguage,
    getCurrentLanguage
  };
}