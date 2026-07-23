import { useState } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, BookOpen, ListOrdered, GitBranch, Brain, Trophy, LayoutDashboard, Moon, Sun, Palette, Globe, Sparkles, Heart } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { path: "/", label: { en: "Home", id: "Beranda" }, icon: Home },
  { path: "/objectives", label: { en: "Objectives", id: "Tujuan" }, icon: BookOpen },
  { path: "/sequence", label: { en: "Sequence", id: "Urutan" }, icon: ListOrdered },
  { path: "/algorithm", label: { en: "Algorithm", id: "Algoritma" }, icon: GitBranch },
  { path: "/quiz", label: { en: "Quiz", id: "Kuis" }, icon: Brain },
  { path: "/dashboard", label: { en: "Dashboard", id: "Dasbor" }, icon: Trophy },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const { state } = useGame();

  const themes: Array<{ value: "light" | "dark" | "kids"; icon: typeof Sun; label: string }> = [
    { value: "kids", icon: Sparkles, label: "Kids" },
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 kids:bg-amber-50/90 border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md"
            >
              CQ
            </motion.div>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
              {t("app.title")}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`relative gap-1.5 ${isActive ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" : ""}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{item.label[lang as keyof typeof item.label]}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Gamification display */}
            <div className="hidden sm:flex items-center gap-3 mr-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-medium"
              >
                <Sparkles className="w-3 h-3" /> {state.xp} XP
              </motion.div>
              <div className="flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-xs font-medium">
                <Heart className="w-3 h-3" fill="currentColor" /> {state.hearts}
              </div>
              <div className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-medium">
                Lv.{state.level}
              </div>
            </div>

            {/* Theme toggle */}
            <div className="hidden sm:flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-full p-0.5">
              {themes.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`p-1.5 rounded-full transition-all ${theme === t.value ? "bg-blue-500 text-white shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                    title={t.label}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>

            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "id" : "en")}
              className="px-2.5 py-1 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {lang === "en" ? "🇺🇸 EN" : "🇮🇩 ID"}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 kids:bg-amber-50/95"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label[lang as keyof typeof item.label]}
                  </Link>
                );
              })}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
                {themes.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        theme === t.value
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" /> {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
