import { useState, useEffect, useCallback } from 'react';

export function useTheme(defaultDark = true) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return defaultDark;
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      if (window.matchMedia) return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {}
    return defaultDark;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => setIsDarkMode(v => !v), []);
  return { isDarkMode, toggleTheme, setIsDarkMode };
}
