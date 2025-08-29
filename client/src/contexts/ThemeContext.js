import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const [compactMode, setCompactMode] = useState(() => {
    const saved = localStorage.getItem('compactMode');
    return saved === 'true';
  });

  const [showAnimations, setShowAnimations] = useState(() => {
    const saved = localStorage.getItem('showAnimations');
    return saved !== 'false';
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Apply compact mode
    document.body.classList.toggle('compact-mode', compactMode);
    
    // Apply animations
    document.body.classList.toggle('no-animations', !showAnimations);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    localStorage.setItem('compactMode', compactMode.toString());
    localStorage.setItem('showAnimations', showAnimations.toString());
    
    // Debug logging
    console.log('Theme applied:', theme);
    console.log('Document classes:', root.classList.toString());
  }, [theme, compactMode, showAnimations]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const updateCompactMode = (value) => {
    setCompactMode(value);
  };

  const updateShowAnimations = (value) => {
    setShowAnimations(value);
  };

  const value = {
    theme,
    compactMode,
    showAnimations,
    toggleTheme,
    updateTheme,
    updateCompactMode,
    updateShowAnimations
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
