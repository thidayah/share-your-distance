'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

export type Language = 'id' | 'en';

export const DEFAULT_LANGUAGE: Language = 'en';

const STORAGE_KEY = 'syd-language';
const CHANGE_EVENT = 'syd-language-change';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggle: () => void;
  t: (id: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function readStoredLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'id') return saved;
  } catch {
    /* ignore */
  }
  return DEFAULT_LANGUAGE;
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

const getServerSnapshot = () => DEFAULT_LANGUAGE;

export function LanguageProvider({ children }: { children: ReactNode }) {
  // useSyncExternalStore hydrates with the server snapshot, so markup matches
  // even when the visitor's stored preference differs from the default.
  const lang = useSyncExternalStore(subscribe, readStoredLanguage, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Language) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const toggle = useCallback(() => {
    setLang(readStoredLanguage() === 'id' ? 'en' : 'id');
  }, [setLang]);

  const t = useCallback((id: string, en: string) => (lang === 'en' ? en : id), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
