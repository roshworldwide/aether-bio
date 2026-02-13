'use client';

import React, { createContext, useContext, useState } from 'react';
import { THEMES, DEFAULT_THEME } from '../../aether.config';

// Define the shape of our "Brain"
type ThemeType = typeof DEFAULT_THEME;
type ThemeContextType = {
  currentTheme: ThemeType;
  switchTheme: (key: keyof typeof THEMES) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(DEFAULT_THEME);

  const switchTheme = (key: keyof typeof THEMES) => {
    setCurrentTheme(THEMES[key]);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// A hook to let any component access the Brain
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}