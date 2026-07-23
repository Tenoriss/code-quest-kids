import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGame } from "@/contexts/GameContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIAssistant } from "@/components/layout/AIAssistant";
import { fireConfetti } from "@/lib/confetti";

const scenarios = [
  {
    title: { en: "🪥 Brushing Your Teeth", id: "🪥 Menggosok Gigi" },
    options: [
      { text: { en: "Put toothpaste → Brush → Rinse → Smile!", id: "Letakkan pasta → Gosok → Bilas → Senyum!" }, correct: true },
      { text: { en: "Brush → Put toothpaste → Rinse → Smile!", id: "Gosok → Letakkan pasta → Bilas → Senyum!" }, correct: false },
      { text: { en: "Rinse → Brush → Put toothpaste → Smile!", id: "Bilas → Gosok → Letakkan pasta → Senyum!" }, correct: false },
    ],
    hint: { en: "What do you put on the toothbrush first?", id: "Apa yang kamu letakkan di sikat gigi pertama?" },
  },
  {
    title: { en: "☀️ Waking Up Routine", id: "☀️ Rutinitas Bangun Tidur" },
    options: [
      { text: { en: "Wake up → Brush teeth → Take a bath → Eat breakfast", id: "Bangun → Gosok gigi → Mandi → Sarapan" }, correct: true },
      { text: { en: "Eat breakfast → Wake up → Brush teeth → Take a bath", id: "Sarapan → Bangun → Gosok gigi → Mandi" }, correct: false },
      { text: { en: "Brush teeth → Wake up → Eat breakfast → Take a bath", id: "Gosok gigi → Bangun → Sarapan → Mandi" }, correct: false },
    ],
    hint: { en: "What's the first thing you do when you wake up?", id: "Apa yang pertama kamu lakukan saat bangun?" },
  },
  {
    title: { en: "🍳 Making an Omelette", id: "🍳 Membuat Telur Dadar" },
    options: [
      { text: { en: "Crack eggs → Beat them → Cook in pan → Serve!", id: "Pecahkan telur → Kocok → Masak → Sajikan!" }, correct: true },
      { text: { en: "Cook in pan → Crack eggs → Beat them → Serve!", id: "Masak → Pecahkan telur → Kocok → Sajikan!" }, correct: false },
      { text: { en: "Beat them → Crack eggs → Cook in pan → Serve!", id: "Kocok → Pecahkan telur → Masak → Sajikan!" }, correct: false },
    ],
    hint: { en: "What must you do first before cooking?", id: "Apa yang harus kamu lakukan pertama sebelum memasak?" },
  },
];

export default function AlgorithmGame() {
  const { lang } = useLanguage();
  const { addXP, completeLesson, state } = useGame();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(state.completedLessons.includes("algorithm_game"));

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);

    if (scenarios[currentQ].options[index].correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < scenarios.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setGameOver(true);
      if (!hasCompleted) {
        addXP(30);
        completeLesson("algorithm_game");
        setHasCompleted(true);
        fireConfetti(50);
      }
    }
  };

  const resetGame = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/20 to-pink-50/20 dark:from-gray-950 dark:via-purple-950/5 dark:to-pink-950/5 flex items-center justify-center">
        <div className="text-center p-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl mb-4">🎉</motion.div>
          <h2 className="text-3xl font-bold mb-2">{lang === "en" ? "Game Complete!" : "Game Selesai!"}</h2>
          <p className="text-lg mb-4">{lang === "en" ? `Score: ${score}/${scenarios.length}` : `Skor: ${score}/${scenarios.length}`}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={resetGame} variant="outline" className="rounded-full"><RotateCcw className="w-4 h-4 mr-2" />{lang === "en" ? "Play Again" : "Main Lagi"}</Button>
            <Link to="/why-important"><Button className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">{lang === "en" ? "Next Lesson" : "Pelajaran Berikutnya"}<ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          </div>
        </div>
      </div>
    );
  }

  const scenario = scenarios[currentQ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/20 to-pink-50/20 dark:from-gray-950 dark:via-purple-950/5 dark:to-pink-950/5">
      <Navbar />
      <AIAssistant type="hint" message={lang === "en" ? "Which algorithm is correct? Choose the right order!" : "Algoritma mana yang benar? Pilih urutan yang tepat!"} hint={scenario.hint[lang]} />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                {lang === "en" ? "🎯 Algorithm Game" : "🎯 Game Algoritma"}
              </span>
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span>{lang === "en" ? `Question ${currentQ + 1}/${scenarios.length}` : `Soal ${currentQ + 1}/${scenarios.length}`}</span>
              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full text-xs">{lang === "en" ? `Score: ${score}` : `Skor: ${score}`}</span>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/30">
            <h2 className="text-xl font-bold mb-6 text-center">{scenario.title[lang]}</h2>

            <div className="space-y-3">
              {scenario.options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrect = opt.correct;
                return (
                  <motion.button
                    key={i}
                    onClick={() => handleSelect(i)}
                    whileHover={!showResult ? { scale: 1.02 } : {}}
                    whileTap={!showResult ? { scale: 0.98 } : {}}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      showResult
                        ? isCorrect
                          ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                          : isSelected
                          ? "border-red-400 bg-red-50 dark:bg-red-900/20"
                          : "border-gray-200 dark:border-gray-700 opacity-50"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        showResult
                          ? isCorrect ? "bg-green-400 text-white" : isSelected ? "bg-red-400 text-white" : "bg-gray-200 text-gray-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}>
                        {showResult ? (isCorrect ? "✓" : isSelected ? "✗" : i + 1) : i + 1}
                      </div>
                      <span className="text-sm font-medium">{opt.text[lang]}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {showResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center">
                <p className={`font-semibold ${scenario.options.findIndex(o => o.correct) === selected ? "text-green-600" : "text-red-500"}`}>
                  {scenario.options.findIndex(o => o.correct) === selected
                    ? lang === "en" ? "✅ Correct! Great algorithm thinking!" : "✅ Benar! Pemikiran algoritma yang hebat!"
                    : lang === "en" ? "❌ Not quite! Think about the correct order." : "❌ Belum tepat! Pikirkan urutan yang benar."}
                </p>
              </motion.div>
            )}
          </div>

          {showResult && (
            <div className="text-center mt-6">
              <Button onClick={handleNext} className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8">
                {currentQ < scenarios.length - 1 ? (lang === "en" ? "Next Question" : "Soal Berikutnya") : (lang === "en" ? "See Results" : "Lihat Hasil")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
