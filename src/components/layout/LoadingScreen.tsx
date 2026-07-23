import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoSvg from "@/assets/logo.svg";

const LOADING_MESSAGES: { en: string; id: string; emoji: string }[] = [
  { en: "Waking up Byte the robot...", id: "Membangunkan Byte si robot...", emoji: "🤖" },
  { en: "Charging learning circuits...", id: "Mengisi sirkuit belajar...", emoji: "⚡" },
  { en: "Organizing sequence steps...", id: "Menyusun langkah urutan...", emoji: "📋" },
  { en: "Brewing algorithm potion...", id: "Membuat ramuan algoritma...", emoji: "🧪" },
  { en: "Polishing quiz questions...", id: "Memoles soal kuis...", emoji: "🧠" },
  { en: "Collecting XP stars...", id: "Mengumpulkan bintang XP...", emoji: "⭐" },
  { en: "Preparing fun animations...", id: "Menyiapkan animasi seru...", emoji: "🎨" },
  { en: "Loading brain power...", id: "Memuat kekuatan otak...", emoji: "💪" },
  { en: "Byte is doing a happy dance...", id: "Byte menari gembira...", emoji: "🕺" },
  { en: "Almost ready! Here we go!", id: "Hampir siap! Ayo!", emoji: "🚀" },
];

const PARTICLE_COUNT = 12;
const COLORS = ["#6366f1", "#8b5cf6", "#a855f7", "#34d399", "#fbbf24", "#f472b6"];

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  shape: "circle" | "star";
}

export default function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 4 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2,
      shape: Math.random() > 0.5 ? "circle" : ("star" as "circle" | "star"),
    }))
  );
  const langRef = useRef<"en" | "id">("en");

  // Detect language from localStorage or default to "en"
  useEffect(() => {
    const stored = localStorage.getItem("codequest_lang");
    if (stored === "id" || stored === "en") {
      langRef.current = stored;
    }
  }, []);

  // Cycle through messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Animate progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        const step = 1 + Math.random() * 6;
        return Math.min(prev + step, 95);
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const currentMessage = LOADING_MESSAGES[messageIndex];
  const lang = langRef.current;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500">
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-white/5 blur-3xl"
        animate={{ scale: [1, 1.3, 1], x: [0, 30, 0], y: [0, -30, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-pink-300/10 blur-3xl"
        animate={{ scale: [1, 1.4, 1], x: [0, -40, 0], y: [0, 40, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-yellow-300/5 blur-3xl"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Floating particles */}
      {particles.map((p) =>
        p.shape === "star" ? (
          <motion.div
            key={p.id}
            className="absolute pointer-events-none"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            animate={{
              y: [0, -60, 0],
              x: [0, p.id % 2 === 0 ? 20 : -20, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          >
            <span className="text-lg" style={{ fontSize: `${p.size + 4}px` }}>
              {p.id % 3 === 0 ? "✨" : p.id % 3 === 1 ? "⭐" : "💫"}
            </span>
          </motion.div>
        ) : (
          <motion.div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
            }}
            animate={{
              y: [0, -80, 0],
              x: [0, p.id % 2 === 0 ? 30 : -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        )
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Byte Robot Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, duration: 0.8 }}
          className="relative"
        >
          {/* Glow behind logo */}
          <motion.div
            className="absolute inset-0 -m-4 rounded-full bg-white/10 blur-xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Logo with bounce */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          >
            <img
              src={logoSvg}
              alt="CodeQuest"
              className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>

        {/* Animated Message */}
        <div className="h-16 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={messageIndex}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-3xl"
              >
                {currentMessage.emoji}
              </motion.span>
              <span className="text-white/90 text-lg sm:text-xl font-nunito font-semibold drop-shadow-md">
                {currentMessage[lang]}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="w-64 sm:w-80">
          <div className="h-3 rounded-full bg-white/15 overflow-hidden backdrop-blur-sm border border-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-green-400 to-emerald-400"
              style={{ width: `${progress}%` }}
              layout
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/50 text-xs text-center mt-2 font-medium"
          >
            {lang === "en" ? "Loading..." : "Memuat..."}
          </motion.p>
        </div>
      </div>

      {/* Bottom decoration dots */}
      <div className="absolute bottom-8 flex items-center gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-white/30"
            animate={{ scale: [0.5, 1.2, 0.5], opacity: [0.3, 0.8, 0.3] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
