import { useKV } from '@github/spark/hooks';
import { Country } from '@/types';

const COUNTRIES_KEY = 'countries';

export class CountryService {
  static async getCountries(): Promise<Country[]> {
    const countries = await spark.kv.get<Country[]>(COUNTRIES_KEY) || [];
    return countries;
  }

  static async getCountry(id: string): Promise<Country | null> {
    const countries = await this.getCountries();
    return countries.find(c => c.id === id) || null;
  }

  static async getCountryByPrefix(prefix: string): Promise<Country | null> {
    const countries = await this.getCountries();
    return countries.find(c => c.prefix === prefix) || null;
  }

  static async createCountry(name: string, prefix: string): Promise<Country> {
    const countries = await this.getCountries();
    
    // Check if prefix already exists
    if (countries.some(c => c.prefix === prefix)) {
      throw new Error('Country prefix already exists');
    }

    const newCountry: Country = {
      id: `country_${Date.now()}`,
      name,
      prefix,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedCountries = [...countries, newCountry];
    await spark.kv.set(COUNTRIES_KEY, updatedCountries);
    
    return newCountry;
  }

  static async updateCountry(id: string, updates: Partial<Omit<Country, 'id' | 'createdAt'>>): Promise<Country> {
    const countries = await this.getCountries();
    const countryIndex = countries.findIndex(c => c.id === id);
    
    if (countryIndex === -1) {
      throw new Error('Country not found');
    }

    const updatedCountry = {
      ...countries[countryIndex],
      ...updates,
      updatedAt: new Date(),
    };

    const updatedCountries = [...countries];
    updatedCountries[countryIndex] = updatedCountry;
    
    await spark.kv.set(COUNTRIES_KEY, updatedCountries);
    
    return updatedCountry;
  }

  static async deleteCountry(id: string): Promise<void> {
    const countries = await this.getCountries();
    const filteredCountries = countries.filter(c => c.id !== id);
    await spark.kv.set(COUNTRIES_KEY, filteredCountries);
  }
}

export function useCountries() {
  const [countries, setCountries] = useKV<Country[]>(COUNTRIES_KEY, []);

  const createCountry = async (name: string, prefix: string) => {
    const newCountry = await CountryService.createCountry(name, prefix);
    setCountries(prev => [...(prev || []), newCountry]);
    return newCountry;
  };

  const updateCountry = async (id: string, updates: Partial<Omit<Country, 'id' | 'createdAt'>>) => {
    const updatedCountry = await CountryService.updateCountry(id, updates);
    setCountries(prev => (prev || []).map(c => c.id === id ? updatedCountry : c));
    return updatedCountry;
  };

  const deleteCountry = async (id: string) => {
    await CountryService.deleteCountry(id);
    setCountries(prev => (prev || []).filter(c => c.id !== id));
  };

  return {
    countries: countries || [],
    createCountry,
    updateCountry,
    deleteCountry,
  };
}