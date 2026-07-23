import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSound } from "@/contexts/SoundContext";
import { useSpeech } from "@/hooks/use-speech";

interface ByteProps {
  mood?: "idle" | "wave" | "happy" | "celebrate" | "think" | "sad" | "excited";
  message?: string;
  hint?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  /** If true, the chat bubble shows but no voice plays. */
  noVoice?: boolean;
}

const MOOD_ANIMATIONS = {
  idle: { y: [0, -3, 0], rotate: [-2, 2, -2] },
  wave: { y: [0, -5, 0], rotate: [-5, 15, -5] },
  happy: { scale: [1, 1.1, 1], rotate: [-5, 5, -5] },
  celebrate: { y: [0, -15, 0], rotate: [0, 0, 0], scale: [1, 1.15, 1] },
  think: { rotate: [0, 5, 0, -5, 0], y: [0, -2, 0] },
  sad: { y: [0, 2, 0], rotate: [-3, 3, -3], scale: [1, 0.95, 1] },
  excited: { scale: [1, 1.2, 1], rotate: [-10, 10, -10], y: [0, -8, 0] },
};

const MOOD_EYES = {
  idle: "normal",
  wave: "happy",
  happy: "happy",
  celebrate: "star",
  think: "thinking",
  sad: "sad",
  excited: "star",
};

const SIZE_MAP = {
  sm: { container: "w-12 h-12 sm:w-14 sm:h-14", eye: "w-2 h-2 sm:w-3 sm:h-3", pupil: "text-[5px] sm:text-[7px]", mouth: "w-3 h-1", antenna: "w-1.5 h-1.5 -top-1.5", ear: "w-1.5 h-1.5" },
  md: { container: "w-16 h-16 sm:w-20 sm:h-20", eye: "w-3 h-3 sm:w-4 sm:h-4", pupil: "text-[6px] sm:text-[8px]", mouth: "w-4 h-1.5", antenna: "w-2 h-2 -top-2", ear: "w-2 h-2" },
  lg: { container: "w-20 h-20 sm:w-24 sm:h-24", eye: "w-4 h-4 sm:w-5 sm:h-5", pupil: "text-[7px] sm:text-[9px]", mouth: "w-5 h-2", antenna: "w-2.5 h-2.5 -top-2.5", ear: "w-2.5 h-2.5" },
};

const BYTE_MESSAGES = {
  welcome: [
    "Hi there! I'm Byte! Ready to learn? 🚀",
    "Hello! Byte here! Let's have fun learning! ⭐",
    "Hey! I'm so excited to learn with you today! 🌟",
  ],
  correct: [
    "Amazing! You got it right! 🎉",
    "Super smart! That's perfect! ⭐",
    "Wow! You're a natural! 🌟",
  ],
  wrong: [
    "Don't worry! Mistakes help us learn! 💪",
    "Almost! Try again, you've got this! 🤗",
    "No problem! Let's think together! 🧠",
  ],
  encourage: [
    "You can do it! I believe in you! 🌟",
    "Keep going! You're doing great! 💪",
    "Every mistake makes you stronger! 🚀",
  ],
  complete: [
    "You did it! I'm so proud of you! 🏆",
    "Congratulations! You're a superstar! ⭐",
    "Amazing work! Let's celebrate! 🎉",
  ],
  thinking: [
    "Hmm... let me think about this... 🤔",
    "What if we try it this way? 💡",
    "I have an idea! Let me show you! ✨",
  ],
};

export function Byte({
  mood = "idle",
  message,
  hint,
  className = "",
  size = "md",
  noVoice = false,
}: ByteProps) {
  const { robotData } = useTheme();
  const { lang } = useLanguage();
  const { playNotification } = useSound();
  const { speak, stop, speaking } = useSpeech();
  const [currentMood, setCurrentMood] = useState<typeof mood>(mood);
  const [currentMessage, setCurrentMessage] = useState(message || "");
  const [showHint, setShowHint] = useState(false);
  const moodIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevMessageRef = useRef<string>("");

  const sz = SIZE_MAP[size];

  const getRandomMessage = useCallback((category: keyof typeof BYTE_MESSAGES) => {
    const msgs = BYTE_MESSAGES[category];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (mood !== undefined) setCurrentMood(mood);
    if (message) {
      setCurrentMessage(message);
    } else if (mood !== "idle") {
      const moodMap: Record<string, keyof typeof BYTE_MESSAGES> = {
        happy: "correct",
        celebrate: "complete",
        sad: "wrong",
        excited: "encourage",
        think: "thinking",
        wave: "welcome",
      };
      const category = (moodMap[mood] || "welcome") as keyof typeof BYTE_MESSAGES;
      setCurrentMessage(getRandomMessage(category));
    }
  }, [mood, message, getRandomMessage]);

  /* Play a gentle notification pop and speak the message when a new message appears */
  useEffect(() => {
    if (currentMessage && currentMessage !== prevMessageRef.current) {
      prevMessageRef.current = currentMessage;
      if (!noVoice) {
        playNotification();
        speak(currentMessage, lang);
      }
    }
  }, [currentMessage, playNotification, speak, lang, noVoice]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const autoCycleMood = useCallback(() => {
    if (mood !== "idle") return;
    const moods = ["idle", "wave", "idle", "happy", "idle", "think", "idle", "wave"] as const;
    let i = 0;
    moodIntervalRef.current = setInterval(() => {
      i = (i + 1) % moods.length;
      const newMood = moods[i];
      if (newMood) setCurrentMood(newMood);
    }, 4000);
    return () => {
      if (moodIntervalRef.current) clearInterval(moodIntervalRef.current);
    };
  }, [mood]);

  useEffect(() => {
    return autoCycleMood();
  }, [autoCycleMood]);

  const eyeEmoji = {
    normal: "◉",
    happy: "✦",
    star: "★",
    thinking: "◌",
    sad: "⊙",
  };

  const eyeType = MOOD_EYES[currentMood] || "normal";
  const eyes = eyeEmoji[eyeType as keyof typeof eyeEmoji] || eyeEmoji.normal;

  return (
    <div className={`${className} transition-all duration-500`}>
      <div className="flex items-start gap-3">
        {/* Robot Avatar */}
        <div className="relative flex-shrink-0">
          <motion.div
            animate={MOOD_ANIMATIONS[currentMood] || MOOD_ANIMATIONS.idle}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className={`relative ${sz.container}`}
          >
            {/* Robot Body with theme gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${robotData.bodyGradient} rounded-2xl ${robotData.shadowColor} overflow-hidden transition-all duration-500`}
            >
              {/* Robot Face */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Eyes */}
                <div className="flex items-center gap-3 mb-1">
                  <div className={`${sz.eye} bg-white rounded-full flex items-center justify-center shadow-sm`}>
                    <span className={`${sz.pupil} font-bold ${robotData.eyeColor} transition-colors duration-500`}>{eyes}</span>
                  </div>
                  <div className={`${sz.eye} bg-white rounded-full flex items-center justify-center shadow-sm`}>
                    <span className={`${sz.pupil} font-bold ${robotData.eyeColor} transition-colors duration-500`}>{eyes}</span>
                  </div>
                </div>
                {/* Mouth */}
                <motion.div
                  animate={currentMood === "happy" || currentMood === "celebrate" || currentMood === "excited" ? { scaleX: 1.3 } : { scaleX: 1 }}
                  className={`${sz.mouth} ${robotData.mouthColor} rounded-full mt-0.5 transition-colors duration-500`}
                />
              </div>
              {/* Antenna */}
              <motion.div
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute ${sz.antenna} left-1/2 -translate-x-1/2 rounded-full ${robotData.antennaColor} shadow-lg transition-colors duration-500`}
              />
              {/* Theme decoration on robot body */}
              <div className="absolute bottom-1 right-1 text-[7px] sm:text-[9px] opacity-70 select-none">
                {robotData.emoji}
              </div>
            </div>

            {/* Glow effect */}
            <div
              className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${robotData.glowColor} blur-sm transition-all duration-500`}
            />
          </motion.div>

          {/* Ear/side decorations */}
          <div className={`absolute -left-1 top-1/2 -translate-y-1/2 rounded-full ${robotData.earColor} transition-colors duration-500 ${sz.ear}`} />
          <div className={`absolute -right-1 top-1/2 -translate-y-1/2 rounded-full ${robotData.earColor} transition-colors duration-500 ${sz.ear}`} />
        </div>

        {/* Speech Bubble */}
        {currentMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative flex-1"
          >
            <div
              className={`${robotData.bubbleBg} ${robotData.bubbleBorder} rounded-2xl rounded-tl-sm p-3 sm:p-4 shadow-lg border transition-all duration-500`}
            >
              <p className={`text-xs sm:text-sm ${robotData.bubbleText} font-medium leading-relaxed transition-colors duration-500`}>
                {currentMessage}
              </p>

              {/* Hint */}
              {hint && !showHint && (
                <button
                  onClick={() => setShowHint(true)}
                  className="mt-2 text-xs text-purple-500 hover:text-purple-600 flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />{lang === "en" ? " Need a hint?" : " Butuh petunjuk?"}
                </button>
              )}
              {showHint && hint && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 text-xs bg-purple-50 dark:bg-purple-900/30 rounded-lg p-2 text-purple-700 dark:text-purple-200"
                >
                  💡 {hint}
                </motion.p>
              )}

              {/* Listen / Stop button */}
              <button
                onClick={() => {
                  if (speaking) {
                    stop();
                  } else {
                    speak(currentMessage, lang);
                  }
                }}
                className={`mt-2 flex items-center gap-1 text-xs transition-colors ${
                  speaking
                    ? "text-purple-500 dark:text-purple-300"
                    : "text-gray-400 hover:text-purple-500 dark:hover:text-purple-300"
                }`}
              >
                {speaking ? (
                  <>
                    <VolumeX className="w-3 h-3" />
                    {lang === "en" ? "Stop" : "Berhenti"}
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3 h-3" />
                    {lang === "en" ? "Listen" : "Dengar"}
                  </>
                )}
              </button>
            </div>
            {/* Speech bubble arrow */}
            <div className={`absolute -left-1 bottom-3 w-2 h-2 ${robotData.bubbleBg} border-l border-b ${robotData.bubbleBorder} -rotate-45 transition-all duration-500`} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
