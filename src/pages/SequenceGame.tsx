import { useState, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, RotateCcw, Star, Sparkles, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGame } from "@/contexts/GameContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIAssistant } from "@/components/layout/AIAssistant";
import { fireConfetti } from "@/lib/confetti";

const originalSteps = [
  { id: "step1", text: { en: "Boil water", id: "Rebus air" }, emoji: "🫖" },
  { id: "step2", text: { en: "Put noodles in cup", id: "Masukkan mie ke dalam cangkir" }, emoji: "🍜" },
  { id: "step3", text: { en: "Pour hot water", id: "Tuang air panas" }, emoji: "💧" },
  { id: "step4", text: { en: "Wait 3 minutes", id: "Tunggu 3 menit" }, emoji: "⏱️" },
  { id: "step5", text: { en: "Add seasoning", id: "Tambahkan bumbu" }, emoji: "🧂" },
  { id: "step6", text: { en: "Stir and enjoy!", id: "Aduk dan nikmati!" }, emoji: "😋" },
];

export default function SequenceGame() {
  const { lang } = useLanguage();
  const { addXP, completeLesson } = useGame();
  const [items, setItems] = useState(() => [...originalSteps].sort(() => Math.random() - 0.5));
  const [checkResult, setCheckResult] = useState<"idle" | "correct" | "incorrect">("idle");
  const [attempts, setAttempts] = useState(0);
  const [stars, setStars] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const checkOrder = useCallback(() => {
    const correct = items.every((item, index) => item.id === originalSteps[index].id);
    setAttempts((a) => a + 1);

    if (correct) {
      setCheckResult("correct");
      setShowReward(true);
      setIsComplete(true);
      addXP(30);
      completeLesson("sequence_game");
      fireConfetti(60);

      // Star rating based on attempts
      if (attempts === 0) setStars(3);
      else if (attempts <= 2) setStars(2);
      else setStars(1);

      setTimeout(() => {
        setShowReward(false);
      }, 4000);
    } else {
      setCheckResult("incorrect");
      setTimeout(() => setCheckResult("idle"), 2000);
    }
  }, [items, attempts, addXP, completeLesson]);

  const resetGame = () => {
    setItems([...originalSteps].sort(() => Math.random() - 0.5));
    setCheckResult("idle");
    setAttempts(0);
    setStars(0);
    setShowReward(false);
    setIsComplete(false);
    setShowHint(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/20 to-blue-50/20 dark:from-gray-950 dark:via-purple-950/5 dark:to-blue-950/5">
      <Navbar />
      <AIAssistant
        type="hint"
        message={lang === "en" ? "Drag the steps into the correct order to make instant noodles!" : "Seret langkah-langkah ke urutan yang benar untuk membuat mie instan!"}
        hint={lang === "en" ? "Think about what you do first: boil water, then add noodles..." : "Pikirkan apa yang kamu lakukan pertama: rebus air, lalu masukkan mie..."}
        autoSpeak
      />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-lg mb-6">
              <ListOrdered className="w-8 h-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                {lang === "en" ? "🍜 Sequence Game" : "🎮 Game Urutan"}
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 dark:text-gray-400"
            >
              {lang === "en"
                ? "Drag and drop the steps to make instant noodles in the correct order!"
                : "Seret dan letakkan langkah-langkah untuk membuat mie instan dengan urutan yang benar!"}
            </motion.p>
          </motion.div>

          {/* Game Area */}
          <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/30 shadow-xl">
            {/* Instructions */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {lang === "en" ? "Arrange the steps:" : "Urutkan langkah-langkah:"}
                </span>
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full">
                  {lang === "en" ? "Drag to reorder" : "Seret untuk mengurutkan"}
                </span>
              </div>
              {!isComplete && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs text-purple-500 hover:text-purple-600 transition-colors"
                >
                  💡 {lang === "en" ? "Hint" : "Petunjuk"}
                </button>
              )}
            </div>

            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-sm text-yellow-700 dark:text-yellow-200"
              >
                {lang === "en"
                  ? "💡 First, boil water! Then put noodles in the cup, pour hot water, wait 3 minutes, add seasoning, and stir!"
                  : "💡 Pertama, rebus air! Lalu masukkan mie ke cangkir, tuang air panas, tunggu 3 menit, tambahkan bumbu, dan aduk!"}
              </motion.div>
            )}

            {/* Drag and Drop List */}
            <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3">
              <AnimatePresence>
                {items.map((item, index) => (
                  <Reorder.Item
                    key={item.id}
                    value={item}
                    className={`relative rounded-xl p-4 cursor-grab active:cursor-grabbing transition-colors ${
                      checkResult === "correct"
                        ? "bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700"
                        : checkResult === "incorrect"
                        ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700"
                        : "bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileDrag={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Drag handle */}
                      <div className="text-gray-300 dark:text-gray-600 cursor-grab">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <circle cx="5" cy="3" r="1.5" />
                          <circle cx="11" cy="3" r="1.5" />
                          <circle cx="5" cy="8" r="1.5" />
                          <circle cx="11" cy="8" r="1.5" />
                          <circle cx="5" cy="13" r="1.5" />
                          <circle cx="11" cy="13" r="1.5" />
                        </svg>
                      </div>
                      {/* Step number */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                        checkResult === "correct"
                          ? "bg-green-400"
                          : checkResult === "incorrect"
                          ? "bg-red-400"
                          : "bg-gradient-to-br from-blue-400 to-purple-500"
                      }`}>
                        {index + 1}
                      </div>
                      {/* Content */}
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="font-medium text-gray-700 dark:text-gray-200">{item.text[lang]}</span>
                    </div>
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
              {!isComplete ? (
                <Button
                  onClick={checkOrder}
                  className="w-full sm:w-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg px-8 h-12"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {lang === "en" ? "Check Order" : "Periksa Urutan"}
                </Button>
              ) : (
                <Button
                  onClick={resetGame}
                  variant="outline"
                  className="w-full sm:w-auto rounded-full px-8 h-12"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {lang === "en" ? "Play Again" : "Main Lagi"}
                </Button>
              )}
            </div>
          </div>

          {/* Attempts counter */}
          <div className="mt-4 text-center">
            <span className="text-xs text-gray-400">
              {lang === "en" ? `Attempts: ${attempts}` : `Percobaan: ${attempts}`}
            </span>
          </div>

          {/* Reward Modal */}
          <AnimatePresence>
            {showReward && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                onClick={() => setShowReward(false)}
              >
                <motion.div
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm mx-4 text-center shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl mb-4"
                  >
                    🎉
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                    {lang === "en" ? "Perfect!" : "Sempurna!"}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {lang === "en" ? "You ordered the steps correctly!" : "Kamu mengurutkan langkah dengan benar!"}
                  </p>
                  {/* Stars */}
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3].map((s) => (
                      <motion.div
                        key={s}
                        initial={{ scale: 0 }}
                        animate={{ scale: s <= stars ? 1 : 0.3 }}
                        transition={{ delay: s * 0.2, type: "spring" }}
                      >
                        <Star className={`w-8 h-8 ${s <= stars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-purple-600 dark:text-purple-300">
                    +30 XP {lang === "en" ? "Earned!" : "Didapatkan!"}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <Link to="/sequence">
              <Button variant="outline" className="rounded-full">{lang === "en" ? "← Back to Lesson" : "← Kembali ke Pelajaran"}</Button>
            </Link>
            <Link to="/algorithm">
              <Button size="lg" className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg">
                {lang === "en" ? "Next: What is Algorithm?" : "Selanjutnya: Apa itu Algoritma?"} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
