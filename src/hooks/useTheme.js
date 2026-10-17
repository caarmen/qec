import { useCallback, useEffect, useState } from "react";

export const THEME = {
  LIGHT: "light",
  DARK: "dark",
};

const STORAGE_KEY = "qec-theme";

/**
 * Read the persisted theme choice. Manual toggle only: we never look at
 * system settings, and the default is the light theme.
 */
function getInitialTheme() {
  if (typeof window === "undefined") return THEME.LIGHT;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === THEME.DARK ? THEME.DARK : THEME.LIGHT;
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === THEME.DARK);
  root.style.colorScheme = theme;
}

/**
 * useTheme hook - Manual light/dark theme toggle persisted in localStorage.
 * @returns {{theme: string, toggleTheme: Function, setTheme: Function}} Current theme and setters
 */
export function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((nextTheme) => {
    setThemeState(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const nextTheme = current === THEME.DARK ? THEME.LIGHT : THEME.DARK;
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
      return nextTheme;
    });
  }, []);

  return { theme, setTheme, toggleTheme };
}
