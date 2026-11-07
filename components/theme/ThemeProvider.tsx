'use client';

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
} from 'react';
import type { ReactNode } from 'react';
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  applyTheme,
  isTheme,
  readTheme,
} from '@/lib/theme';
import type { ThemeName } from '@/lib/theme';

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  const handleStorage = (event: StorageEvent): void => {
    if (event.key !== THEME_STORAGE_KEY || !isTheme(event.newValue)) {
      return;
    }
    document.documentElement.setAttribute('data-theme', event.newValue);
  };
  window.addEventListener('storage', handleStorage);

  return () => {
    observer.disconnect();
    window.removeEventListener('storage', handleStorage);
  };
}

function getServerSnapshot(): ThemeName {
  return DEFAULT_THEME;
}

function readStoredTheme(): string | null {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, readTheme, getServerSnapshot);

  useLayoutEffect(() => {
    const stored = readStoredTheme();
    if (isTheme(stored)) {
      document.documentElement.setAttribute('data-theme', stored);
    }
  }, []);

  const setTheme = useCallback((t: ThemeName) => {
    applyTheme(t);
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(readTheme() === 'buku-tulis' ? 'papan-kapur' : 'buku-tulis');
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
