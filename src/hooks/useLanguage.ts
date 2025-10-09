import { useKV } from '@github/spark/hooks';

interface Language {
  code: string;
  name: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'lv', name: 'Latviešu', flag: '🇱🇻' },
  { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'ka', name: 'ქართული', flag: '🇬🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

interface LanguageState {
  currentLanguage: string;
}

export function useLanguage() {
  const [languageState, setLanguageState] = useKV<LanguageState>('language-state', {
    currentLanguage: 'en'
  });

  const setCurrentLanguage = (language: string) => {
    setLanguageState({
      currentLanguage: language
    });
  };

  const getCurrentLanguage = () => {
    const currentLang = languageState?.currentLanguage || 'en';
    return LANGUAGES.find(lang => lang.code === currentLang) || LANGUAGES[0];
  };

  return {
    currentLanguage: languageState?.currentLanguage || 'en',
    languages: LANGUAGES,
    changeLanguage: setCurrentLanguage,
    getCurrentLanguage
  };
}