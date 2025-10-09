import { useKV } from '@github/spark/hooks';

export type Language = 'en' | 'lv' | 'pl' | 'ka' | 'es' | 'lt';

interface LanguageState {
  currentLanguage: Language;
}

export function useLanguage() {
  const [languageState, setLanguageState] = useKV<LanguageState>('language-state', {
    currentLanguage: 'en'
  });

  const changeLanguage = (newLanguage: Language) => {
    setLanguageState({
      currentLanguage: newLanguage
    });
  };

  return {
    currentLanguage: languageState?.currentLanguage || 'en',
    changeLanguage
  };
}