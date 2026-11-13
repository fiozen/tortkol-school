'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLocale, DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@school/shared';
import { translations, TranslationDictionary } from './translations';

interface LanguageContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: translations[DEFAULT_LOCALE],
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE);

  useEffect(() => {
    const saved = localStorage.getItem('school_lang') as SupportedLocale;
    if (saved && SUPPORTED_LOCALES.includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem('school_lang', newLocale);
  };

  const t = translations[locale] || translations[DEFAULT_LOCALE];

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
