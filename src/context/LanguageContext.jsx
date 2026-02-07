import { createContext, useContext, useState, useCallback } from 'react';
import translations from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const toggleLang = useCallback(() => {
    setLang(prev => (prev === 'en' ? 'ja' : 'en'));
  }, []);

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
