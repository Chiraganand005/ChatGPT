import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  const { user, updateTheme: updateUserTheme } = authContext || {};
  
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or user preference or default to light
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || user?.theme || 'light';
  });

  useEffect(() => {
    // Update theme when user loads
    if (user?.theme) {
      setTheme(user.theme);
      localStorage.setItem('theme', user.theme);
    }
  }, [user]);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Update theme in backend if user is logged in
    if (user && updateUserTheme) {
      await updateUserTheme(newTheme);
    }
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;

