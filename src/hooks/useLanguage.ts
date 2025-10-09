import { useKV } from '@github/spark/hooks';

export type Language = 'en' | 'ru' | 'lv' | 'lt' | 'pl' | 'ka' | 'es';

interface LanguageState {
  currentLanguage: Language;
}

export function useLanguage() {
  const [languageState, setLanguageState] = useKV<LanguageState>('language_state', {
    currentLanguage: 'en'
  });

  const changeLanguage = (language: Language) => {
    setLanguageState({ currentLanguage: language });
  };

  return {
    currentLanguage: languageState?.currentLanguage || 'en',
    changeLanguage
  };
}

