import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { ThemeMode, ThemeRobotData, ThemeDecorationData } from "@/types";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  availableThemes: { value: ThemeMode; label: string; icon: string; color: string }[];
  robotData: ThemeRobotData;
  decorationData: ThemeDecorationData;
  isTransitioning: boolean;
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

const ROBOT_THEMES: Record<ThemeMode, ThemeRobotData> = {
  light: {
    bodyGradient: "from-blue-400 via-indigo-300 to-purple-300",
    eyeColor: "text-blue-600",
    antennaColor: "bg-yellow-300 shadow-yellow-300/50",
    glowColor: "from-blue-300/20 to-indigo-300/20",
    shadowColor: "shadow-indigo-300/30",
    mouthColor: "bg-white/90",
    accentColor: "border-blue-200",
    earColor: "bg-blue-300",
    bgColor: "bg-white/80",
    bubbleBg: "bg-white",
    bubbleText: "text-gray-700",
    bubbleBorder: "border-gray-200",
    emoji: "🤖",
    decoration: "☀️",
  },
  dark: {
    bodyGradient: "from-indigo-600 via-purple-600 to-pink-500",
    eyeColor: "text-cyan-300",
    antennaColor: "bg-cyan-400 shadow-cyan-400/50",
    glowColor: "from-purple-400/30 to-cyan-400/20",
    shadowColor: "shadow-purple-500/40",
    mouthColor: "bg-cyan-300/90",
    accentColor: "border-purple-500",
    earColor: "bg-purple-500",
    bgColor: "bg-gray-900/80",
    bubbleBg: "bg-gray-800",
    bubbleText: "text-gray-200",
    bubbleBorder: "border-gray-700",
    emoji: "🤖",
    decoration: "🌙",
  },
  kids: {
    bodyGradient: "from-amber-400 via-orange-400 to-yellow-300",
    eyeColor: "text-amber-700",
    antennaColor: "bg-red-400 shadow-red-400/50",
    glowColor: "from-amber-300/20 to-yellow-300/20",
    shadowColor: "shadow-amber-400/30",
    mouthColor: "bg-white/90",
    accentColor: "border-amber-300",
    earColor: "bg-orange-400",
    bgColor: "bg-amber-50/80",
    bubbleBg: "bg-white",
    bubbleText: "text-gray-700",
    bubbleBorder: "border-amber-200",
    emoji: "🧸",
    decoration: "🎨",
  },
  candy: {
    bodyGradient: "from-pink-300 via-rose-300 to-purple-300",
    eyeColor: "text-pink-600",
    antennaColor: "bg-fuchsia-400 shadow-fuchsia-400/50",
    glowColor: "from-pink-300/20 to-rose-300/20",
    shadowColor: "shadow-pink-400/30",
    mouthColor: "bg-white/90",
    accentColor: "border-pink-300",
    earColor: "bg-fuchsia-400",
    bgColor: "bg-pink-50/80",
    bubbleBg: "bg-white",
    bubbleText: "text-gray-700",
    bubbleBorder: "border-pink-200",
    emoji: "🍬",
    decoration: "🍭",
  },
  space: {
    bodyGradient: "from-blue-600 via-indigo-600 to-purple-600",
    eyeColor: "text-cyan-400",
    antennaColor: "bg-yellow-300 shadow-yellow-300/50",
    glowColor: "from-blue-500/30 to-purple-500/20",
    shadowColor: "shadow-blue-500/40",
    mouthColor: "bg-cyan-300/90",
    accentColor: "border-blue-500",
    earColor: "bg-indigo-600",
    bgColor: "bg-slate-900/80",
    bubbleBg: "bg-slate-800",
    bubbleText: "text-slate-200",
    bubbleBorder: "border-slate-700",
    emoji: "🚀",
    decoration: "⭐",
  },
  ocean: {
    bodyGradient: "from-cyan-300 via-teal-300 to-emerald-300",
    eyeColor: "text-teal-700",
    antennaColor: "bg-emerald-400 shadow-emerald-400/50",
    glowColor: "from-cyan-300/20 to-teal-300/20",
    shadowColor: "shadow-cyan-400/30",
    mouthColor: "bg-white/90",
    accentColor: "border-teal-300",
    earColor: "bg-emerald-400",
    bgColor: "bg-cyan-50/80",
    bubbleBg: "bg-white",
    bubbleText: "text-gray-700",
    bubbleBorder: "border-teal-200",
    emoji: "🐚",
    decoration: "🌊",
  },
  rainbow: {
    bodyGradient: "from-red-400 via-yellow-300 via-green-300 to-blue-400",
    eyeColor: "text-purple-600",
    antennaColor: "bg-pink-400 shadow-pink-400/50",
    glowColor: "from-red-300/20 via-yellow-300/20 to-blue-300/20",
    shadowColor: "shadow-purple-400/30",
    mouthColor: "bg-white/90",
    accentColor: "border-purple-300",
    earColor: "bg-pink-400",
    bgColor: "bg-white/80",
    bubbleBg: "bg-white",
    bubbleText: "text-gray-700",
    bubbleBorder: "border-purple-200",
    emoji: "🌈",
    decoration: "🎉",
  },
};

const DECORATION_THEMES: Record<ThemeMode, ThemeDecorationData> = {
  light: {
    bgClass: "bg-gradient-to-b from-white via-blue-50/30 via-indigo-50/20 to-purple-50/20",
    floatingEmojis: ["☀️", "✨", "💫", "🌸", "🕊️", "🌈"],
    particles: "bg-blue-200/30",
    cardStyle: "bg-white/70 backdrop-blur-sm border border-gray-200/50",
    buttonStyle: "bg-gradient-to-r from-blue-500 to-indigo-600",
    headingClass: "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent",
    badgeClass: "bg-blue-100 text-blue-700",
  },
  dark: {
    bgClass: "bg-gradient-to-b from-gray-950 via-indigo-950/20 to-purple-950/20",
    floatingEmojis: ["🌙", "⭐", "🌠", "💫", "✨", "🌌"],
    particles: "bg-indigo-500/20",
    cardStyle: "bg-gray-900/60 backdrop-blur-sm border border-gray-800/50",
    buttonStyle: "bg-gradient-to-r from-indigo-600 to-purple-600",
    headingClass: "bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent",
    badgeClass: "bg-indigo-900/50 text-indigo-300",
  },
  kids: {
    bgClass: "bg-gradient-to-b from-amber-50 via-orange-50/30 to-yellow-50/20",
    floatingEmojis: ["🎨", "🧸", "✏️", "📚", "🌈", "🎈"],
    particles: "bg-amber-300/30",
    cardStyle: "bg-amber-50/80 backdrop-blur-sm border border-amber-200/50",
    buttonStyle: "bg-gradient-to-r from-amber-500 to-orange-500",
    headingClass: "bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent",
    badgeClass: "bg-amber-100 text-amber-700",
  },
  candy: {
    bgClass: "bg-gradient-to-b from-pink-50 via-rose-50/30 to-fuchsia-50/20",
    floatingEmojis: ["🍬", "🍭", "🧁", "🎀", "💖", "🌟"],
    particles: "bg-pink-300/30",
    cardStyle: "bg-pink-50/80 backdrop-blur-sm border border-pink-200/50",
    buttonStyle: "bg-gradient-to-r from-pink-500 to-rose-500",
    headingClass: "bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent",
    badgeClass: "bg-pink-100 text-pink-700",
  },
  space: {
    bgClass: "bg-gradient-to-b from-slate-950 via-blue-950/30 to-purple-950/30",
    floatingEmojis: ["🚀", "🛸", "🌍", "⭐", "🌙", "☄️"],
    particles: "bg-blue-400/20",
    cardStyle: "bg-slate-900/60 backdrop-blur-sm border border-slate-800/50",
    buttonStyle: "bg-gradient-to-r from-blue-600 to-indigo-600",
    headingClass: "bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent",
    badgeClass: "bg-blue-900/50 text-blue-300",
  },
  ocean: {
    bgClass: "bg-gradient-to-b from-cyan-50 via-teal-50/30 to-emerald-50/20",
    floatingEmojis: ["🐠", "🐋", "🐚", "🌊", "🦈", "🐙"],
    particles: "bg-cyan-300/30",
    cardStyle: "bg-cyan-50/80 backdrop-blur-sm border border-teal-200/50",
    buttonStyle: "bg-gradient-to-r from-cyan-500 to-teal-500",
    headingClass: "bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent",
    badgeClass: "bg-cyan-100 text-cyan-700",
  },
  rainbow: {
    bgClass: "bg-gradient-to-b from-red-50 via-yellow-50 via-green-50 to-blue-50",
    floatingEmojis: ["🌈", "🎉", "🎊", "💫", "🌟", "🎈"],
    particles: "bg-purple-300/30",
    cardStyle: "bg-white/70 backdrop-blur-sm border border-purple-200/50",
    buttonStyle: "bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500",
    headingClass: "bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent",
    badgeClass: "bg-purple-100 text-purple-700",
  },
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeValue] = useLocalStorage<ThemeMode>("codequest_theme", "kids");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const setTheme = useCallback(
    (newTheme: ThemeMode) => {
      if (newTheme === theme) return;
      setIsTransitioning(true);
      // Apply theme change after a tiny delay to trigger the transition
      requestAnimationFrame(() => {
        setThemeValue(newTheme);
        // End transition after animation completes
        setTimeout(() => setIsTransitioning(false), 600);
      });
    },
    [theme, setThemeValue]
  );

  useEffect(() => {
    const root = document.documentElement;
    const allThemes = ["light", "dark", "kids", "candy", "space", "ocean", "rainbow"];
    root.classList.remove(...allThemes);
    root.classList.add(theme);
  }, [theme]);

  const robotData = ROBOT_THEMES[theme];
  const decorationData = DECORATION_THEMES[theme];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        availableThemes: THEMES,
        robotData,
        decorationData,
        isTransitioning,
      }}
    >
      <div className={isTransitioning ? "theme-transitioning" : ""}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}

export { THEMES, ROBOT_THEMES, DECORATION_THEMES };
