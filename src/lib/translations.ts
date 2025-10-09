import { Language } from '@/hooks/useLanguage';

export const languageOptions = [
  { value: 'en' as Language, label: 'English' },
  { value: 'ru' as Language, label: 'Русский' },
];

export function getTranslation(language: Language, key: string): string {
  return key;
}