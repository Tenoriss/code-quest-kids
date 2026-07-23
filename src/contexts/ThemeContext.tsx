import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { ThemeMode } from "@/types";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  availableThemes: { value: ThemeMode; label: string; icon: string; color: string }[];
}

const THEMES = [
  { value: "kids" as ThemeMode, label: "Kids", icon: "🎨", color: "#f59e0b" },
  { value: "light" as ThemeMode, label: "Light", icon: "☀️", color: "#6366f1" },
  { value: "dark" as ThemeMode, label: "Dark", icon: "🌙", color: "#8b5cf6" },
  { value: "candy" as ThemeMode, label: "Candy", icon: "🍬", color: "#f472b6" },
  { value: "space" as ThemeMode, label: "Space", icon: "🚀", color: "#0ea5e9" },
  { value: "ocean" as ThemeMode, label: "Ocean", icon: "🌊", color: "#06b6d4" },
  { value: "rainbow" as ThemeMode, label: "Rainbow", icon: "🌈", color: "#a855f7" },
];

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<ThemeMode>("codequest_theme", "kids");

  useEffect(() => {
    const root = document.documentElement;
    // Remove all theme classes
    const allThemes = ["light", "dark", "kids", "candy", "space", "ocean", "rainbow"];
    root.classList.remove(...allThemes);
    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}

export { THEMES };
