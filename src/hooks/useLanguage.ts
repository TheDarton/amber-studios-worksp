import { useKV } from '@github/spark/hooks';

interface LanguageState {
  currentLanguage: string;
}

export function useLanguage() {
  const [languageState, setLanguageState] = useKV<LanguageState>('language-state', {
    currentLanguage: 'en'
  });

  const changeLanguage = (lang: string) => {
    setLanguageState(prev => ({
      ...prev,
      currentLanguage: lang
    }));
  };

  return {
    ...languageState,
    changeLanguage
  };
}

