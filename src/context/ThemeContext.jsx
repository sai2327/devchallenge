import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/helpers';
import { STORAGE_KEYS, THEME_MODES } from '../utils/constants';

const ThemeContext = createContext({});

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(THEME_MODES.LIGHT);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = storage.get(STORAGE_KEYS.THEME);
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? THEME_MODES.DARK : THEME_MODES.LIGHT;
      setTheme(initialTheme);
      applyTheme(initialTheme);
    }
  }, []);

  const applyTheme = (newTheme) => {
    if (newTheme === THEME_MODES.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT;
    setTheme(newTheme);
    applyTheme(newTheme);
    storage.set(STORAGE_KEYS.THEME, newTheme);
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === THEME_MODES.DARK,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
