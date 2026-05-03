import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
];

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'light');
  const [colorTheme, setColorTheme] = useState(localStorage.getItem('colorTheme') || 'emerald');
  const [currency, setCurrency] = useState(
    CURRENCIES.find(c => c.code === localStorage.getItem('currency')) || CURRENCIES[0]
  );

  useEffect(() => {
    // Apply dark mode class
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('mode', mode);
  }, [mode]);

  useEffect(() => {
    // Apply color theme class
    const themes = ['theme-blue', 'theme-purple', 'theme-rose', 'theme-amber', 'theme-indigo'];
    document.body.classList.remove(...themes);
    if (colorTheme !== 'emerald') {
      document.body.classList.add(`theme-${colorTheme}`);
    }
    localStorage.setItem('colorTheme', colorTheme);
  }, [colorTheme]);

  const toggleMode = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const changeColorTheme = (color) => {
    setColorTheme(color);
  };

  const changeCurrency = (code) => {
    const found = CURRENCIES.find(c => c.code === code);
    if (found) {
      setCurrency(found);
      localStorage.setItem('currency', code);
    }
  };

  return (
    <ThemeContext.Provider value={{ mode, colorTheme, toggleMode, changeColorTheme, currency, changeCurrency, CURRENCIES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
