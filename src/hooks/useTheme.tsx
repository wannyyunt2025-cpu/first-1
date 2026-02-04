import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeStyle = 'classic' | 'minimalist';

interface ThemeContextType {
  style: ThemeStyle;
  setStyle: (style: ThemeStyle) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [style, setStyle] = useState<ThemeStyle>(() => {
    const saved = localStorage.getItem('portfolio-style');
    return (saved as ThemeStyle) || 'minimalist';
  });

  useEffect(() => {
    localStorage.setItem('portfolio-style', style);
    const root = window.document.documentElement;
    
    // Manage class for scoped styles
    if (style === 'classic') {
      root.classList.add('theme-classic');
    } else {
      root.classList.remove('theme-classic');
    }
  }, [style]);

  return (
    <ThemeContext.Provider value={{ style, setStyle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
