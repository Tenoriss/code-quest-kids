import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, RotateCcw, Play, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGame } from "@/contexts/GameContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIAssistant } from "@/components/layout/AIAssistant";
import { fireConfetti } from "@/lib/confetti";

const morningRoutine = [
  { id: 1, text: { en: "Wake Up", id: "Bangun Tidur" }, emoji: "🛏️", time: "6:00 AM" },
  { id: 2, text: { en: "Brush Teeth", id: "Gosok Gigi" }, emoji: "🪥", time: "6:10 AM" },
  { id: 3, text: { en: "Take a Bath", id: "Mandi" }, emoji: "🚿", time: "6:20 AM" },
  { id: 4, text: { en: "Eat Breakfast", id: "Sarapan" }, emoji: "🍳", time: "7:00 AM" },
  { id: 5, text: { en: "Go to School", id: "Berangkat Sekolah" }, emoji: "🏫", time: "7:30 AM" },
];

const definition = {
  en: "A sequence is the correct order of steps to complete a task.",
  id: "Urutan adalah langkah-langkah yang benar untuk menyelesaikan suatu tugas.",
};

export default function SequenceLesson() {
  const { lang } = useLanguage();
  const { state, addXP, completeLesson } = useGame();
  const [animating, setAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [showComplete, setShowComplete] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(state.completedLessons.includes("sequence_lesson"));
  const [playOnce, setPlayOnce] = useState(false);

  const startAnimation = () => {
    setAnimating(true);
    setCurrentStep(0);
    setShowComplete(false);
    setPlayOnce(true);

    morningRoutine.forEach((_, index) => {
      setTimeout(() => {
        setCurrentStep(index);
        if (index === morningRoutine.length - 1) {
          setTimeout(() => {
            setAnimating(false);
            setShowComplete(true);
            if (!hasCompleted) {
              addXP(20);
              completeLesson("sequence_lesson");
              setHasCompleted(true);
              fireConfetti(30);
            }
          }, 800);
        }
      }, (index + 1) * 800);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20 dark:from-gray-950 dark:via-blue-950/5 dark:to-purple-950/5">
      <Navbar />
      <AIAssistant
        type="welcome"
        message={lang === "en" ? "A sequence is like steps in a game! Let's learn about it with a fun morning routine!" : "Urutan itu seperti langkah-langkah dalam game! Ayo belajar tentangnya dengan rutinitas pagi yang seru!"}
        autoSpeak
      />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg mb-6">
              <ListOrdered className="w-8 h-8" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {lang === "en" ? "What is Sequence?" : "Apa itu Urutan?"}
              </span>
            </h1>
          </motion.div>

          {/* Definition Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl mb-10"
          >
            <p className="text-xl sm:text-2xl font-bold text-center leading-relaxed">
              "{definition[lang]}"
            </p>
          </motion.div>

          {/* Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30 mb-10"
          >
            <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
              {lang === "en" ? "🌅 Morning Routine - A Simple Sequence" : "🌅 Rutinitas Pagi - Urutan Sederhana"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {lang === "en"
                ? "Every morning, you follow a sequence of steps without even realizing it! Wake up, brush your teeth, take a bath, eat breakfast, and go to school. If you changed the order, things wouldn't make sense - you wouldn't eat breakfast before brushing your teeth, right?"
                : "Setiap pagi, kamu mengikuti urutan langkah tanpa sadar! Bangun tidur, gosok gigi, mandi, sarapan, dan pergi ke sekolah. Jika kamu mengubah urutannya, semuanya akan kacau - kamu tidak akan sarapan sebelum gosok gigi, kan?"}
            </p>
          </motion.div>

          {/* Interactive Timeline */}
          <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/30 mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {lang === "en" ? "🎬 Interactive Timeline" : "🎬 Garis Waktu Interaktif"}
              </h2>
              <div className="flex gap-2">
                {!playOnce && (
                  <Button
                    onClick={startAnimation}
                    className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  >
                    <Play className="w-4 h-4 mr-1" /> {lang === "en" ? "Play" : "Mainkan"}
                  </Button>
                )}
                {showComplete && (
                  <Button
                    onClick={() => { setCurrentStep(-1); setShowComplete(false); setPlayOnce(false); }}
                    variant="outline"
                    className="rounded-full"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" /> {lang === "en" ? "Replay" : "Ulangi"}
                  </Button>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 rounded-full" />

              <div className="space-y-4">
                {morningRoutine.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: currentStep >= index ? 1 : 0.3,
                      x: 0,
                      scale: currentStep === index ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.4, delay: currentStep === index ? 0.1 : 0 }}
                    className={`relative pl-14 py-3 pr-4 rounded-xl transition-all duration-300 ${
                      currentStep === index
                        ? "bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 shadow-md"
                        : currentStep > index
                        ? "bg-green-50 dark:bg-green-900/20"
                        : "bg-gray-50 dark:bg-gray-800/30"
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className={`absolute left-4 top-4 w-4 h-4 rounded-full border-2 ${
                      currentStep >= index
                        ? "bg-green-400 border-green-400 shadow-md shadow-green-400/30"
                        : "bg-gray-300 dark:bg-gray-600 border-gray-300 dark:border-gray-600"
                    }`}>
                      {currentStep > index && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center text-white text-[8px]"
                        >
                          ✓
                        </motion.div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{step.emoji}</span>
                      <div>
                        <p className={`font-semibold ${currentStep >= index ? "text-gray-800 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"}`}>
                          {step.text[lang as keyof typeof step.text]}
                        </p>
                        <p className="text-xs text-gray-400">{step.time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Completion message */}
            <AnimatePresence>
              {showComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 p-4 bg-green-100 dark:bg-green-900/30 rounded-xl text-center"
                >
                  <p className="text-green-700 dark:text-green-300 font-semibold">
                    {lang === "en" ? "✅ Great job! That's a perfect sequence!" : "✅ Bagus! Itu urutan yang sempurna!"}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {lang === "en" ? "You earned 20 XP!" : "Kamu mendapat 20 XP!"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Key Takeaway */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/30 rounded-2xl p-6 mb-10"
          >
            <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">💡 {lang === "en" ? "Key Point" : "Poin Penting"}</h3>
            <p className="text-yellow-700 dark:text-yellow-200 text-sm">
              {lang === "en"
                ? "A sequence is important because the ORDER matters! If you mix up the steps, you might not get the result you want."
                : "Urutan itu penting karena URUTannya penting! Jika kamu mencampur aduk langkah-langkahnya, kamu mungkin tidak mendapatkan hasil yang kamu inginkan."}
            </p>
          </motion.div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link to="/objectives">
              <Button variant="outline" className="rounded-full">{lang === "en" ? "← Back to Objectives" : "← Kembali ke Tujuan"}</Button>
            </Link>
            <Link to="/sequence-game">
              <Button size="lg" className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg">
                {lang === "en" ? "Play Sequence Game" : "Mainkan Game Urutan"} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
