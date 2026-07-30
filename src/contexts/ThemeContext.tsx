// src/contexts/ThemeContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("sindria-theme");
    return (saved as Theme) || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    // حذف کلاس قبلی
    root.classList.remove("theme-light", "theme-dark", "dark", "light");

    if (theme === "dark") {
      root.classList.add("theme-dark", "dark");
    } else {
      root.classList.add("theme-light", "light");
    }

    localStorage.setItem("sindria-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
