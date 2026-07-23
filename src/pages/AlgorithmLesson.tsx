import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, Play, RotateCcw, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGame } from "@/contexts/GameContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIAssistant } from "@/components/layout/AIAssistant";
import { fireConfetti } from "@/lib/confetti";

const noodleSteps = [
  { id: 1, text: { en: "Boil water in a pot", id: "Rebus air dalam panci" }, emoji: "🫖", detail: { en: "Fill the pot with water and turn on the stove", id: "Isi panci dengan air dan nyalakan kompor" } },
  { id: 2, text: { en: "Add the noodles", id: "Masukkan mie" }, emoji: "🍜", detail: { en: "Put the noodles into the boiling water", id: "Masukkan mie ke dalam air mendidih" } },
  { id: 3, text: { en: "Wait for 3 minutes", id: "Tunggu 3 menit" }, emoji: "⏱️", detail: { en: "Let the noodles cook in the hot water", id: "Biarkan mie matang dalam air panas" } },
  { id: 4, text: { en: "Add the seasoning", id: "Tambahkan bumbu" }, emoji: "🧂", detail: { en: "Open the seasoning packet and add it", id: "Buka bungkus bumbu dan tambahkan" } },
  { id: 5, text: { en: "Stir everything together", id: "Aduk semuanya" }, emoji: "🥢", detail: { en: "Mix the noodles and seasoning well", id: "Campur mie dan bumbu hingga merata" } },
  { id: 6, text: { en: "Enjoy your meal!", id: "Nikmati hidanganmu!" }, emoji: "😋", detail: { en: "Your noodles are ready to eat!", id: "Mie kamu siap dimakan!" } },
];

const definition = {
  en: "An algorithm is a step-by-step instruction used to solve a problem.",
  id: "Algoritma adalah petunjuk langkah demi langkah yang digunakan untuk memecahkan masalah.",
};

export default function AlgorithmLesson() {
  const { lang } = useLanguage();
  const { addXP, completeLesson, state } = useGame();
  const [currentStep, setCurrentStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(state.completedLessons.includes("algorithm_lesson"));

  const startAnimation = () => {
    setIsAnimating(true);
    setCurrentStep(0);
    setShowComplete(false);

    noodleSteps.forEach((_, index) => {
      setTimeout(() => {
        setCurrentStep(index);
        if (index === noodleSteps.length - 1) {
          setTimeout(() => {
            setIsAnimating(false);
            setShowComplete(true);
            if (!hasCompleted) {
              addXP(20);
              completeLesson("algorithm_lesson");
              setHasCompleted(true);
              fireConfetti(30);
            }
          }, 1000);
        }
      }, (index + 1) * 1000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/20 to-pink-50/20 dark:from-gray-950 dark:via-purple-950/5 dark:to-pink-950/5">
      <Navbar />
      <AIAssistant
        type="welcome"
        message={lang === "en" ? "An algorithm is like a recipe! Let's learn how to make instant noodles step by step!" : "Algoritma itu seperti resep! Ayo belajar membuat mie instan langkah demi langkah!"}
      />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg mb-6">
              <GitBranch className="w-8 h-8" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {lang === "en" ? "What is Algorithm?" : "Apa itu Algoritma?"}
              </span>
            </h1>
          </motion.div>

          {/* Definition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-xl mb-10"
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
              {lang === "en" ? "🍜 Making Instant Noodles - An Algorithm" : "🍜 Membuat Mie Instan - Sebuah Algoritma"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {lang === "en"
                ? "Just like a recipe tells you how to cook, an algorithm tells you how to solve a problem! Making instant noodles follows a clear algorithm - boil water, add noodles, wait, add seasoning, stir, and enjoy. If you follow each step in order, you'll always get delicious noodles!"
                : "Seperti resep yang memberitahu cara memasak, algoritma memberitahu cara memecahkan masalah! Membuat mie instan mengikuti algoritma yang jelas - rebus air, masukkan mie, tunggu, tambahkan bumbu, aduk, dan nikmati. Jika kamu mengikuti setiap langkah dengan urutan, kamu akan selalu mendapatkan mie yang lezat!"}
            </p>
          </motion.div>

          {/* Interactive Steps */}
          <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/30 mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {lang === "en" ? "🎬 Algorithm in Action" : "🎬 Algoritma dalam Aksi"}
              </h2>
              <div className="flex gap-2">
                {!isAnimating && !showComplete && (
                  <Button onClick={startAnimation} className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Play className="w-4 h-4 mr-1" /> {lang === "en" ? "Show Steps" : "Tunjukkan Langkah"}
                  </Button>
                )}
                {showComplete && (
                  <Button onClick={() => { setCurrentStep(-1); setShowComplete(false); }} variant="outline" className="rounded-full">
                    <RotateCcw className="w-4 h-4 mr-1" /> {lang === "en" ? "Replay" : "Ulangi"}
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {noodleSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: currentStep >= index ? 1 : 0.4,
                    scale: currentStep === index ? 1.05 : currentStep > index ? 0.95 : 0.9,
                  }}
                  transition={{
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                  className={`relative rounded-xl p-4 border-2 transition-all ${
                    currentStep === index
                      ? "border-purple-400 bg-purple-50 dark:bg-purple-900/20 shadow-lg shadow-purple-200 dark:shadow-purple-900/20"
                      : currentStep > index
                      ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30"
                  }`}
                >
                  {/* Step number badge */}
                  <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md ${
                    currentStep >= index ? "bg-purple-500" : "bg-gray-400"
                  }`}>
                    {currentStep > index ? "✓" : step.id}
                  </div>

                  <div className="text-center">
                    <motion.span
                      animate={currentStep === index ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 0.5 }}
                      className="text-4xl block mb-3"
                    >
                      {step.emoji}
                    </motion.span>
                    <h3 className="font-bold text-sm mb-1 text-gray-800 dark:text-gray-100">
                      {step.text[lang as keyof typeof step.text]}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {step.detail[lang as keyof typeof step.detail]}
                    </p>
                  </div>

                  {/* Pulse ring for current step */}
                  {currentStep === index && (
                    <motion.div
                      className="absolute inset-0 rounded-xl border-2 border-purple-400"
                      animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              ))}
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
                    {lang === "en" ? "✅ That's an algorithm! Follow these steps in order and you'll always make perfect noodles!" : "✅ Itulah algoritma! Ikuti langkah-langkah ini secara berurutan dan kamu akan selalu membuat mie yang sempurna!"}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    +20 XP {lang === "en" ? "Earned!" : "Didapatkan!"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Key Points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { emoji: "📝", title: { en: "Step-by-Step", id: "Langkah demi Langkah" }, desc: { en: "Each step is clear and precise", id: "Setiap langkah jelas dan tepat" } },
              { emoji: "🔄", title: { en: "Repeatable", id: "Dapat Diulang" }, desc: { en: "Same steps = same result every time", id: "Langkah sama = hasil sama setiap kali" } },
              { emoji: "✅", title: { en: "Guaranteed Result", id: "Hasil Pasti" }, desc: { en: "If you follow it, you'll succeed", id: "Jika diikuti, kamu akan berhasil" } },
            ].map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-4 text-center border border-purple-100 dark:border-purple-800/30"
              >
                <span className="text-3xl mb-2 block">{point.emoji}</span>
                <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100">{point.title[lang]}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{point.desc[lang]}</p>
              </motion.div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link to="/sequence-game">
              <Button variant="outline" className="rounded-full">{lang === "en" ? "← Back to Sequence Game" : "← Kembali ke Game Urutan"}</Button>
            </Link>
            <Link to="/algorithm-game">
              <Button size="lg" className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg">
                {lang === "en" ? "Play Algorithm Game" : "Mainkan Game Algoritma"} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
