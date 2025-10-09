import { useKV } from '@github/spark/hooks';

export type Language = 'en' | 'ru' | 'lv' | 'lt' | 'pl' | 'ka' | 'es';

interface LanguageState {
  currentLanguage: Language;
}

export function useLanguage() {
  const [languageState, setLanguageState] = useKV<LanguageState>('language-state', {
    currentLanguage: 'en'
  });

  const changeLanguage = (lang: Language) => {
    setLanguageState(prev => ({
      ...prev,
      currentLanguage: lang
    }));
  };

  return {
    currentLanguage: languageState?.currentLanguage || 'en',
    changeLanguage
  };
}