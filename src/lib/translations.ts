import { Language } from '@/hooks/useLanguage';

const translations = {
  en: {
    countries: 'Countries',
    createCountryAdmin: 'Create Country Admin',
    selectActiveCountry: 'Select Active Country',
    users: 'Users',
  },
  ru: {
    countries: 'Страны',
    createCountryAdmin: 'Создать администратора страны',
    selectActiveCountry: 'Выбрать активную страну',
    users: 'Пользователи',
  },
  lv: {
    countries: 'Valstis',
    createCountryAdmin: 'Izveidot valsts administratoru',
    selectActiveCountry: 'Atlasīt aktīvo valsti',
    users: 'Lietotāji',
  },
  lt: {
    countries: 'Šalys',
    createCountryAdmin: 'Sukurti šalies administratorių',
    selectActiveCountry: 'Pasirinkti aktyvią šalį',
    users: 'Vartotojai',
  },
  pl: {
    countries: 'Kraje',
    createCountryAdmin: 'Utwórz administratora kraju',
    selectActiveCountry: 'Wybierz aktywny kraj',
    users: 'Użytkownicy',
  },
  ka: {
    countries: 'ქვეყნები',
    createCountryAdmin: 'ქვეყნის ადმინისტრატორის შექმნა',
    selectActiveCountry: 'აქტიური ქვეყნის არჩევა',
    users: 'მომხმარებლები',
  },
  es: {
    countries: 'Países',
    createCountryAdmin: 'Crear administrador del país',
    selectActiveCountry: 'Seleccionar país activo',
    users: 'Usuarios',
  },
};

export function getTranslation(language: Language, key: string): string {
  return translations[language]?.[key as keyof typeof translations[typeof language]] || translations.en[key as keyof typeof translations.en] || key;
}