import { useState } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, BookOpen, ListOrdered, GitBranch, Brain, Trophy, Palette, Sparkles, Heart, User, LogOut, ChevronDown, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSound } from "@/contexts/SoundContext";
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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const location = useLocation();
  const { theme, setTheme, availableThemes } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const { state } = useGame();
  const { isAuthenticated, currentUserProfile, logout } = useAuth();
  const { isMuted, toggleMute, playClick, playHover } = useSound();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 kids:bg-amber-50/90 border-b border-gray-200/50 dark:border-gray-700/50">
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
                    className={`relative gap-1.5 transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={playClick}
                    onMouseEnter={playHover}
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
            <div className="hidden sm:flex items-center gap-2 mr-2">
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

            {/* Sound toggle */}
            <button
              onClick={toggleMute}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-gray-500" />}
            </button>

            {/* Theme selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onMouseEnter={playHover}
              >
                <Palette className="w-4 h-4 text-gray-500" />
              </button>
              <AnimatePresence>
                {showThemeMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-2 z-50"
                  >
                    {availableThemes.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => { setTheme(t.value); setShowThemeMenu(false); playClick(); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
                          theme === t.value
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <span>{t.icon}</span>
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "id" : "en")}
              className="px-2.5 py-1 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onMouseEnter={playHover}
            >
              {lang === "en" ? "🇺🇸 EN" : "🇮🇩 ID"}
            </button>

            {/* User menu / Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onMouseEnter={playHover}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {currentUserProfile?.avatarUrl ? (
                      <img src={currentUserProfile.avatarUrl} className="w-full h-full rounded-full object-cover" alt="" />
                    ) : (
                      currentUserProfile?.nickname?.[0]?.toUpperCase() || currentUserProfile?.fullName?.[0]?.toUpperCase() || "?"
                    )}
                  </div>
                  <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-2 z-50"
                    >
                      <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
                          {currentUserProfile?.nickname || currentUserProfile?.fullName || "Student"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{currentUserProfile?.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setShowUserMenu(false)}>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <Trophy className="w-4 h-4" /> Dashboard
                        </button>
                      </Link>
                      <Link to="/profile" onClick={() => setShowUserMenu(false)}>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <User className="w-4 h-4" /> Profile
                        </button>
                      </Link>
                      <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/auth">
                <Button
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs h-9"
                  onClick={playClick}
                >
                  Sign In
                </Button>
              </Link>
            )}

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
              {/* Mobile user info */}
              {isAuthenticated && (
                <div className="flex items-center gap-3 px-3 py-3 border-b border-gray-100 dark:border-gray-800 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {currentUserProfile?.nickname?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{currentUserProfile?.nickname || "Student"}</p>
                    <p className="text-xs text-gray-400">{state.xp} XP • Level {state.level}</p>
                  </div>
                </div>
              )}

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

              {/* Mobile profile link */}
              {isAuthenticated && (
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <User className="w-4 h-4" /> Profile
                </Link>
              )}

              {/* Mobile theme selector */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
                <p className="text-xs text-gray-400 px-3 mb-2">Theme</p>
                <div className="grid grid-cols-4 gap-1 px-1">
                  {availableThemes.slice(0, 4).map((t) => (
                    <button
                      key={t.value}
                      onClick={() => { setTheme(t.value); setIsOpen(false); }}
                      className={`p-2 rounded-xl text-center text-xs transition-all ${
                        theme === t.value
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      <span className="block text-lg">{t.icon}</span>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound & Language */}
              <div className="flex items-center gap-2 px-3 pt-2">
                <button
                  onClick={toggleMute}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                >
                  {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  {isMuted ? "Muted" : "Sound"}
                </button>
                <button
                  onClick={() => setLang(lang === "en" ? "id" : "en")}
                  className="px-3 py-2 rounded-xl text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                >
                  {lang === "en" ? "🇺🇸 English" : "🇮🇩 Indonesia"}
                </button>
              </div>

              {isAuthenticated && (
                <div className="px-3 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
