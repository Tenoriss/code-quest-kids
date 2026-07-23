import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { ThemeMode } from "@/types";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<ThemeMode>("codequest_theme", "kids");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "kids");

    if (theme === "kids") {
      root.classList.add("kids");
      root.style.setProperty("--kids-accent", "#f59e0b");
      root.style.setProperty("--kids-bg", "#fef3c7");
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
