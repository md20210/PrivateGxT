import React, { createContext, useContext, useState, useEffect } from 'react';
import { translationsApi } from '../services/api';

type Language = 'de' | 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    return (stored as Language) || 'de';
  });

  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        // Only show loading on initial load, not on language switches
        const isInitialLoad = Object.keys(translations).length === 0;
        if (isInitialLoad) {
          setLoading(true);
        }

        const response = await translationsApi.getTranslations(language);
        setTranslations(response.data.translations);
      } catch (error) {
        console.error('Failed to load translations:', error);
        setTranslations({
          app_title: 'PrivateGxT',
          error: 'Error loading translations'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTranslations();
  }, [language]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
