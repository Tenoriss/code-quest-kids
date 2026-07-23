import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoSvg from "@/assets/logo.svg";

// ─── Silly Loading Messages ───────────────────────────────────────
const LOADING_MESSAGES: { en: string; id: string; emoji: string }[] = [
  { en: "Tickling Byte the robot... 🤗", id: "Menggelitik Byte si robot... 🤗", emoji: "🤗" },
  { en: "Doing the funky chicken dance! 🐔", id: "Menari ayam keren! 🐔", emoji: "🐔" },
  { en: "Putting on silly goggles... 🤓", id: "Pakai kacamata lucu... 🤓", emoji: "🤓" },
  { en: "Eating virtual candy! 🍭", id: "Makan permen virtual! 🍭", emoji: "🍭" },
  { en: "Making funny robot noises! 🤖", id: "Bikin suara robot lucu! 🤖", emoji: "🔊" },
  { en: "Byte is telling a joke! 😂", id: "Byte cerita lucu! 😂", emoji: "😂" },
  { en: "Byte is breakdancing! 💃", id: "Byte breakdance! 💃", emoji: "💃" },
  { en: "Byte farted! Pfffft! 💨", id: "Byte kentut! Pfffft! 💨", emoji: "💨" },
  { en: "Making a super silly face! 🙃", id: "Bikin muka super lucu! 🙃", emoji: "🙃" },
  { en: "Almost ready! Giggles loading! 😜", id: "Hampir siap! Tawa siap! 😜", emoji: "😜" },
];

const FLOATING_EMOJIS = ["🦄", "🌈", "🍭", "🧁", "🎈", "🐱", "🐼", "🍕", "🧸", "🤡", "🐸", "🌻", "🍩", "🎠", "🪄", "🫧", "🍬", "🎉", "🎊"];
const PARTICLE_COUNT = 14;
const SILLY_FACES = ["😜", "🤪", "😝", "😋", "🤭", "🥴", "😵‍💫", "🤩", "😎", "👻", "🤖", "🐸"];
const BLUSH_COLORS = ["#ff6b9d", "#ff8fab", "#ffb3c6", "#ff4d6d", "#ff85a1"];

interface EmojiParticle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  wobble: boolean;
}

// ─── Cute floating hearts / sparkles that orbit the logo ──────────
function OrbitingSparkles() {
  const sparkles = [
    { emoji: "⭐", angle: 0, spread: 65, size: "text-lg" },
    { emoji: "✨", angle: 60, spread: 75, size: "text-base" },
    { emoji: "💫", angle: 120, spread: 70, size: "text-lg" },
    { emoji: "🌟", angle: 180, spread: 80, size: "text-base" },
    { emoji: "✨", angle: 240, spread: 65, size: "text-lg" },
    { emoji: "💖", angle: 300, spread: 75, size: "text-base" },
  ];

  return (
    <>
      {sparkles.map((s, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none select-none"
          initial={false}
          animate={{
            left: [`${50 + Math.cos((s.angle * Math.PI) / 180) * s.spread}%`],
            top: [`${50 + Math.sin((s.angle * Math.PI) / 180) * s.spread}%`],
            scale: [0.3, 1.4, 0.3],
            opacity: [0, 1, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            delay: i * 0.35,
            ease: "easeInOut",
          }}
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <span className={s.size}>{s.emoji}</span>
        </motion.div>
      ))}
    </>
  );
}

// ─── Cute animated eyes that blink and bounce ─────────────────────
function CuteEyes({ isWinking }: { isWinking: boolean }) {
  return (
    <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-5 z-10 pointer-events-none">
      {/* Left eye */}
      <motion.div
        className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-inner"
        animate={
          isWinking
            ? { scaleY: [1, 0.1, 1], scaleX: [1, 0.3, 1] }
            : { scaleY: [1, 1, 1, 1, 1, 0.1, 1, 1, 1, 1] }
        }
        transition={
          isWinking
            ? { duration: 0.3, ease: "easeInOut" }
            : { duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.95, 1] } // Blinks naturally
        }
      >
        <motion.div
          className="w-2.5 h-2.5 rounded-full bg-gray-900"
          animate={{ y: [0, -1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Right eye */}
      <motion.div
        className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-inner"
        animate={
          isWinking
            ? { scaleY: [1, 0.1, 1], scaleX: [1, 0.3, 1], rotate: [0, 0, -5, 0] }
            : { scaleY: [1, 1, 1, 1, 1, 0.1, 1, 1, 1, 1] }
        }
        transition={
          isWinking
            ? { duration: 0.4, ease: "easeInOut" }
            : { duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.95, 1] }
        }
      >
        <motion.div
          className="w-2.5 h-2.5 rounded-full bg-gray-900"
          animate={{ y: [0, -1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
        />
      </motion.div>
    </div>
  );
}

// ─── Cute pink blush cheeks that appear periodically ──────────────
function BlushCheeks({ show }: { show: boolean }) {
  const color = BLUSH_COLORS[Math.floor(Math.random() * BLUSH_COLORS.length)];

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="absolute top-[58%] left-[32%] w-6 h-4 rounded-full z-10 pointer-events-none"
            style={{ backgroundColor: color }}
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.05 }}
            className="absolute top-[58%] right-[32%] w-6 h-4 rounded-full z-10 pointer-events-none"
            style={{ backgroundColor: color }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main Loading Screen ──────────────────────────────────────────
export default function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showSillyFace, setShowSillyFace] = useState(false);
  const [sillyFaceIndex, setSillyFaceIndex] = useState(0);
  const [isWinking, setIsWinking] = useState(false);
  const [showBlush, setShowBlush] = useState(false);
  const [logoScale, setLogoScale] = useState(1);
  const [logoY, setLogoY] = useState(0);
  const langRef = useRef<"en" | "id">("en");
  const faceRef = useRef(0);
  const blushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stable sillyFaces outside render
  const sillyFaces = SILLY_FACES;

  // Particles (stable)
  const particlesRef = useRef<EmojiParticle[]>(
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      emoji: FLOATING_EMOJIS[Math.floor(Math.random() * FLOATING_EMOJIS.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 16 + Math.random() * 22,
      delay: Math.random() * 3,
      duration: 5 + Math.random() * 4,
      wobble: Math.random() > 0.35,
    }))
  );

  // Detect language
  useEffect(() => {
    const stored = localStorage.getItem("codequest_lang");
    if (stored === "id" || stored === "en") langRef.current = stored;
  }, []);

  // ─── Smooth message cycling ─────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // ─── Smooth progress bar (spring-like increments) ───────────────
  useEffect(() => {
    const tick = () => {
      setProgress((prev) => {
        if (prev >= 90) return 90;
        // Smoothly decelerating increments
        const remaining = 90 - prev;
        const step = Math.max(1, remaining * (0.08 + Math.random() * 0.12));
        return Math.min(prev + step, 90);
      });
    };
    const interval = setInterval(tick, 380);
    return () => clearInterval(interval);
  }, []);

  // ─── Smooth silly face popup with spring ────────────────────────
  useEffect(() => {
    const showFace = () => {
      faceRef.current = Math.floor(Math.random() * sillyFaces.length);
      setSillyFaceIndex(faceRef.current);
      setShowSillyFace(true);
      setTimeout(() => setShowSillyFace(false), 1400);
    };
    const interval = setInterval(showFace, 2800);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Smooth wink animation ──────────────────────────────────────
  useEffect(() => {
    const wink = () => {
      setIsWinking(true);
      setTimeout(() => setIsWinking(false), 500);
    };
    // Wink sometimes, not always
    const scheduleWink = () => {
      const delay = 4000 + Math.random() * 5000;
      return setTimeout(() => {
        wink();
        scheduleWink();
      }, delay);
    };
    const timer = scheduleWink();
    return () => clearTimeout(timer);
  }, []);

  // ─── Blush cheeks that appear and fade smoothly ─────────────────
  useEffect(() => {
    const showBlushCheeks = () => {
      setShowBlush(true);
      if (blushTimerRef.current) clearTimeout(blushTimerRef.current);
      blushTimerRef.current = setTimeout(() => setShowBlush(false), 2000);
    };
    const interval = setInterval(showBlushCheeks, 5000);
    return () => {
      clearInterval(interval);
      if (blushTimerRef.current) clearTimeout(blushTimerRef.current);
    };
  }, []);

  // ─── Smooth jelly/squish animation ──────────────────────────────
  const doJelly = useCallback(() => {
    setLogoScale(0.85);
    setLogoY(-5);
    requestAnimationFrame(() => {
      setLogoScale(1.15);
      setLogoY(2);
      requestAnimationFrame(() => {
        setLogoScale(0.95);
        setLogoY(-1);
        requestAnimationFrame(() => {
          setLogoScale(1.02);
          setLogoY(0);
          requestAnimationFrame(() => {
            setLogoScale(1);
          });
        });
      });
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(doJelly, 3500);
    return () => clearInterval(interval);
  }, [doJelly]);

  const lang = langRef.current;
  const particles = particlesRef.current;
  const currentMessage = LOADING_MESSAGES[messageIndex];

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden will-change-transform">
      {/* ─── Kids learning programming cartoon background ─────── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&q=80')",
        }}
      />
      {/* Soft dark overlay so Byte robot and text stay visible */}
      <div className="absolute inset-0 bg-black/20" />

      {/* ─── Floating emoji particles (smoother paths) ─────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((fe) => (
          <motion.div
            key={fe.id}
            className="absolute select-none will-change-transform"
            style={{ left: `${fe.x}%`, top: `${fe.y}%`, fontSize: `${fe.size}px` }}
            animate={
              fe.wobble
                ? {
                    y: [0, -60 - (fe.id % 4) * 5, 0],
                    x: [0, fe.id % 2 === 0 ? 30 : -30, 0],
                    rotate: [0, (fe.id % 2 === 0 ? 1 : -1) * 20, (fe.id % 2 === 0 ? -1 : 1) * 15, 0],
                    scale: [0.4, 1.3, 0.4],
                  }
                : {
                    y: [0, -100, 0],
                    x: [0, (fe.id % 2 === 0 ? 1 : -1) * 50, 0],
                    rotate: [0, 360],
                    scale: [0.3, 1.2, 0.3],
                  }
            }
            transition={{
              duration: fe.duration,
              repeat: Infinity,
              delay: fe.delay,
              ease: "easeInOut",
            }}
          >
            {fe.emoji}
          </motion.div>
        ))}
      </div>

      {/* ─── Main Content ─────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center gap-7 will-change-transform">
        {/* ─── Byte Robot Logo ──────────────────────────────────── */}
        <motion.div
          initial={{ scale: 0, rotate: -360 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 12, duration: 0.9 }}
          className="relative"
        >
          {/* Rainbow ring behind logo - outer */}
          <motion.div
            className="absolute inset-0 -m-7 rounded-full opacity-35 blur-[2px] will-change-transform"
            style={{
              background: "conic-gradient(from 0deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #9b59b6, #ff6b6b)",
            }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
          {/* Rainbow ring - inner (counter-rotating for smoother effect) */}
          <motion.div
            className="absolute inset-0 -m-10 rounded-full opacity-15 blur-md will-change-transform"
            style={{
              background: "conic-gradient(from 0deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #9b59b6, #ff6b6b)",
            }}
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          />

          {/* White glow */}
          <motion.div
            className="absolute inset-0 -m-5 rounded-full bg-white/12 blur-2xl will-change-transform"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Super smooth bounce + jelly combo */}
          <motion.div
            animate={{
              y: [0, -15, 0, -8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.3, 0.6, 0.8, 1],
            }}
            style={{
              scale: logoScale,
              marginTop: logoY,
              transition: "scale 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), margin-top 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {/* Logo image */}
            <div className="relative">
              <img
                src={logoSvg}
                alt="CodeQuest"
                className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-2xl"
              />

              {/* ─── Cute animated eyes overlay ──────────────── */}
              <CuteEyes isWinking={isWinking} />

              {/* ─── Blush cheeks ────────────────────────────── */}
              <BlushCheeks show={showBlush} />
            </div>
          </motion.div>

          {/* ─── Silly face popup (super smooth spring entry) ──── */}
          <AnimatePresence mode="popLayout">
            {showSillyFace && (
              <motion.div
                key={sillyFaceIndex}
                initial={{ opacity: 0, scale: 0, x: 30, y: -30 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 55,
                  y: -35,
                  rotate: [0, -8, 8, -5, 0],
                }}
                exit={{ opacity: 0, scale: 0, x: 40, y: -40 }}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 14,
                  mass: 0.6,
                }}
                className="absolute text-3xl sm:text-4xl z-20 select-none"
                style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.3))" }}
              >
                <motion.span
                  animate={{ rotate: [0, -12, 12, -12, 0] }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
                >
                  {sillyFaces[sillyFaceIndex]}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Orbiting sparkles ──────────────────────────────── */}
          <OrbitingSparkles />
        </motion.div>

        {/* ─── Animated Message (smoother spring transitions) ─────── */}
        <div className="h-16 flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={messageIndex}
              initial={{ opacity: 0, y: 25, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.6 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 18,
                mass: 0.8,
              }}
              className="flex items-center gap-3 bg-white/12 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/15 shadow-lg will-change-transform"
            >
              <motion.span
                animate={{
                  rotate: [0, 12, -12, 12, 0],
                  scale: [1, 1.25, 1],
                }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                className="text-3xl"
              >
                {currentMessage.emoji}
              </motion.span>
              <span className="text-white text-base sm:text-lg font-bold drop-shadow-md">
                {currentMessage[lang]}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── Progress Bar (smoother spring animation) ───────────── */}
        <div className="w-64 sm:w-80">
          <div className="h-4 rounded-full bg-white/12 overflow-hidden backdrop-blur-sm border-2 border-white/15 shadow-inner will-change-transform">
            <motion.div
              className="h-full rounded-full will-change-transform"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #9b59b6)",
              }}
              layout="position"
              transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.5 }}
            />
          </div>
          {/* Loading text with spinning decorations */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              className="text-sm"
            >
              🌀
            </motion.span>
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-white/60 text-xs font-medium"
            >
              {lang === "en" ? "Loading giggles..." : "Memuat tawa..."}
            </motion.span>
            <motion.span
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              className="text-sm"
            >
              🌀
            </motion.span>
          </div>
        </div>
      </div>

      {/* ─── Bottom dancing robots (smoother wave) ────────────────── */}
      <div className="absolute bottom-6 flex items-center gap-3 will-change-transform">
        {["🤖", "💃", "🕺", "🤖", "💃"].map((emoji, i) => (
          <motion.span
            key={i}
            className="text-xl select-none"
            animate={{
              y: [0, -14 - (i % 3) * 5, 0],
              rotate: [0, i % 2 === 0 ? 12 : -12, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 0.9 + i * 0.12,
              repeat: Infinity,
              delay: i * 0.18,
              ease: "easeInOut",
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
