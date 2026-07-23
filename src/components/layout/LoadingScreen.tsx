import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoSvg from "@/assets/logo.svg";

const LOADING_MESSAGES: { en: string; id: string; emoji: string }[] = [
  { en: "Tickle-tickling Byte the robot... 🤗", id: "Menggelitik Byte si robot... 🤗", emoji: "🤗" },
  { en: "Doing the funky chicken dance... 🐔", id: "Menari ayam keren... 🐔", emoji: "🐔" },
  { en: "Putting on silly goggles... 🤓", id: "Pakai kacamata lucu... 🤓", emoji: "🤓" },
  { en: "Eating virtual candy... 🍭", id: "Makan permen virtual... 🍭", emoji: "🍭" },
  { en: "Making funny robot noises... 🤖", id: "Bikin suara robot lucu... 🤖", emoji: "🔊" },
  { en: "Byte is telling a joke... 😂", id: "Byte lagi cerita lucu... 😂", emoji: "😂" },
  { en: "Doing a silly dance... 💃", id: "Nari-nari lucu... 💃", emoji: "💃" },
  { en: "Byte farted! Pfffffft... 💨", id: "Byte kentut! Pfffffft... 💨", emoji: "💨" },
  { en: "Making a funny face... 🙃", id: "Bikin muka lucu... 🙃", emoji: "🙃" },
  { en: "Almost ready! Get your giggles ready! 😜", id: "Hampir siap! Siap-siap ketawa! 😜", emoji: "😜" },
];

const FUNNY_EMOJIS = ["🦄", "🌈", "🍭", "🧁", "🎈", "🐱", "🦊", "🐼", "🍕", "🧸", "🎪", "🤡", "🐸", "🦋", "🌻", "🍩", "🎠", "🪄", "🫧", "🍬"];
const PARTICLE_COUNT = 16;

const rainbowColors = [
  "from-red-400 via-orange-400 to-yellow-400",
  "from-yellow-400 via-green-400 to-teal-400",
  "from-teal-400 via-blue-400 to-indigo-400",
  "from-indigo-400 via-purple-400 to-pink-400",
  "from-pink-400 via-red-400 to-orange-400",
];

interface FunnyEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  wobble: boolean;
}

export default function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showSillyFace, setShowSillyFace] = useState(false);
  const [sillyFaceIndex, setSillyFaceIndex] = useState(0);
  const [squishAmount, setSquishAmount] = useState(1);
  const langRef = useRef<"en" | "id">("en");

  const sillyFaces = ["😜", "🤪", "😝", "😋", "🤭", "😏", "🥴", "😵‍💫", "🤩", "😎"];

  const funnyEmojisRef = useRef<FunnyEmoji[]>(
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      emoji: FUNNY_EMOJIS[Math.floor(Math.random() * FUNNY_EMOJIS.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 16 + Math.random() * 24,
      delay: Math.random() * 3,
      duration: 4 + Math.random() * 4,
      wobble: Math.random() > 0.4,
    }))
  );

  // Detect language
  useEffect(() => {
    const stored = localStorage.getItem("codequest_lang");
    if (stored === "id" || stored === "en") langRef.current = stored;
  }, []);

  // Cycle messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  // Progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return 92;
        const step = 1 + Math.random() * 8;
        return Math.min(prev + step, 92);
      });
    }, 350);
    return () => clearInterval(interval);
  }, []);

  // Random silly face popup
  useEffect(() => {
    const interval = setInterval(() => {
      setSillyFaceIndex(Math.floor(Math.random() * sillyFaces.length));
      setShowSillyFace(true);
      setTimeout(() => setShowSillyFace(false), 1200);
    }, 2500);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Squish animation (randomly squish the logo)
  useEffect(() => {
    const doSquish = () => {
      setSquishAmount(0.7);
      setTimeout(() => setSquishAmount(1.15), 150);
      setTimeout(() => setSquishAmount(0.9), 300);
      setTimeout(() => setSquishAmount(1), 450);
    };
    const interval = setInterval(doSquish, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentMessage = LOADING_MESSAGES[messageIndex];
  const lang = langRef.current;
  const topEmojis = funnyEmojisRef.current;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500">
      {/* Animated rainbow orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-red-400/8 blur-3xl"
        animate={{ scale: [1, 1.5, 1], x: [0, 40, 0], y: [0, -40, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-yellow-300/8 blur-3xl"
        animate={{ scale: [1, 1.6, 1], x: [0, -50, 0], y: [0, 50, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Floating silly emojis everywhere */}
      {topEmojis.map((fe) => (
        <motion.div
          key={fe.id}
          className="absolute pointer-events-none select-none"
          style={{ left: `${fe.x}%`, top: `${fe.y}%`, fontSize: `${fe.size}px` }}
          animate={
            fe.wobble
              ? {
                  y: [0, -50 - fe.id * 3, 0],
                  x: [0, fe.id % 2 === 0 ? 25 : -25, 0],
                  rotate: [0, fe.id % 2 === 0 ? 15 : -15, -15, 15, 0],
                  scale: [0.3, 1.2, 0.3],
                }
              : {
                  y: [0, -80, 0],
                  x: [0, fe.id % 2 === 0 ? 40 : -40, 0],
                  rotate: [0, 360],
                  scale: [0.2, 1.1, 0.2],
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

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Byte Robot Logo with funny animations */}
        <motion.div
          initial={{ scale: 0, rotate: -360 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 10, duration: 1 }}
          className="relative"
        >
          {/* Rainbow ring behind logo */}
          <motion.div
            className="absolute inset-0 -m-6 rounded-full opacity-40 blur-md"
            style={{
              background: "conic-gradient(#ff6b6b, #ffd93d, #6bcb77, #4d96ff, #9b59b6, #ff6b6b)",
            }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          {/* Second rainbow ring */}
          <motion.div
            className="absolute inset-0 -m-8 rounded-full opacity-20 blur-lg"
            style={{
              background: "conic-gradient(#ff6b6b, #ffd93d, #6bcb77, #4d96ff, #9b59b6, #ff6b6b)",
            }}
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />

          {/* Glow */}
          <motion.div
            className="absolute inset-0 -m-4 rounded-full bg-white/15 blur-xl"
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Logo with squish + bounce combo */}
          <motion.div
            animate={{
              y: [0, -14, 0, -7, 0],
              scaleX: [1, squishAmount, 1],
              scaleY: [1, 2 - squishAmount, 1],
            }}
            transition={{
              y: { duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
              scaleX: { duration: 0.45, ease: "easeInOut" },
              scaleY: { duration: 0.45, ease: "easeInOut" },
            }}
          >
            <img
              src={logoSvg}
              alt="CodeQuest"
              className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-2xl"
            />
          </motion.div>

          {/* Silly face popup */}
          <AnimatePresence>
            {showSillyFace && (
              <motion.div
                key={sillyFaceIndex}
                initial={{ opacity: 0, scale: 0, y: 20, x: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 50 }}
                exit={{ opacity: 0, scale: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 12 }}
                className="absolute -top-4 -right-4 text-3xl sm:text-4xl z-20 drop-shadow-lg"
                style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}
              >
                <motion.span
                  animate={{ rotate: [0, -15, 15, -15, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  {sillyFaces[sillyFaceIndex]}
                </motion.span>
                {/* Speech bubble tail */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/20 rotate-45 rounded-sm" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Star burst around the logo */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute pointer-events-none text-xl"
              style={{
                left: `${50 + Math.cos((i * 60 * Math.PI) / 180) * 70}%`,
                top: `${50 + Math.sin((i * 60 * Math.PI) / 180) * 70}%`,
                transform: "translate(-50%, -50%)",
              }}
              animate={{
                scale: [0, 1.3, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            >
              {["⭐", "✨", "💫", "🌟", "✨", "⭐"][i]}
            </motion.div>
          ))}
        </motion.div>

        {/* Animated Message - extra bouncy */}
        <div className="h-16 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={messageIndex}
              initial={{ opacity: 0, y: 30, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: -30, scale: 0.5, rotate: 10 }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 15,
              }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/15"
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 15, 0], scale: [1, 1.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
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

        {/* Progress Bar - rainbow colored */}
        <div className="w-64 sm:w-80">
          <div className="h-4 rounded-full bg-white/15 overflow-hidden backdrop-blur-sm border-2 border-white/20 shadow-inner">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #9b59b6)`,
              }}
              layout
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
            />
          </div>
          <div className="flex items-center justify-center gap-2 mt-2">
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-sm"
            >
              🌀
            </motion.span>
            <span className="text-white/60 text-xs font-medium">
              {lang === "en" ? "Loading giggles..." : "Memuat tawa..."}
            </span>
            <motion.span
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-sm"
            >
              🌀
            </motion.span>
          </div>
        </div>
      </div>

      {/* Bottom dancing dots */}

      <div className="absolute bottom-6 flex items-center gap-3">
        {["🤖", "💃", "🕺", "🤖", "💃"].map((emoji, i) => (
          <motion.span
            key={i}
            className="text-xl"
            animate={{
              y: [0, -12 - i * 3, 0],
              rotate: [0, i % 2 === 0 ? 10 : -10, 0],
            }}
            transition={{
              duration: 0.8 + i * 0.15,
              repeat: Infinity,
              delay: i * 0.15,
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
