import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Sparkles, X } from "lucide-react";
import { useSpeech } from "@/hooks/use-speech";

interface AIAssistantProps {
  message: string;
  hint?: string;
  type?: "welcome" | "hint" | "correct" | "encourage" | "celebrate";
  autoSpeak?: boolean;
}

const EMOJIS: Record<string, string> = {
  welcome: "👋",
  hint: "💡",
  correct: "🎉",
  encourage: "💪",
  celebrate: "🌟",
};

const COLORS: Record<string, string> = {
  welcome: "from-blue-400 to-purple-500",
  hint: "from-yellow-400 to-orange-500",
  correct: "from-green-400 to-emerald-500",
  encourage: "from-pink-400 to-rose-500",
  celebrate: "from-purple-400 to-indigo-500",
};

export function AIAssistant({ message, hint, type = "welcome", autoSpeak = false }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { speak, stop, speaking } = useSpeech();

  useEffect(() => {
    if (autoSpeak) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        speak(message);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoSpeak, message, speak]);

  return (
    <>
      {/* Floating chat button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) speak(message); }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white shadow-lg shadow-purple-500/30 flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span key="robot" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat bubble */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 max-w-xs w-full"
          >
            <div className={`rounded-2xl p-4 bg-gradient-to-br ${COLORS[type]} text-white shadow-xl`}>
              <div className="flex items-start gap-3">
                <span className="text-3xl">{EMOJIS[type]}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{message}</p>
                  {hint && !showHint && (
                    <button
                      onClick={() => setShowHint(true)}
                      className="mt-2 text-xs flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity"
                    >
                      <Sparkles className="w-3 h-3" /> Need a hint?
                    </button>
                  )}
                  {showHint && hint && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2 text-xs bg-white/20 rounded-lg p-2"
                    >
                      💡 {hint}
                    </motion.p>
                  )}
                </div>
              </div>
              <button
                onClick={() => speaking ? stop() : speak(message)}
                className="mt-2 text-xs flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
              >
                {speaking ? "🔊 Stop" : "🔈 Listen"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
