import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, RotateCcw, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGame } from "@/contexts/GameContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIAssistant } from "@/components/layout/AIAssistant";
import { fireConfetti } from "@/lib/confetti";

interface Question {
  type: "multiple" | "truefalse";
  question: { en: string; id: string };
  options: { en: string[]; id: string[] };
  correct: number;
  explanation: { en: string; id: string };
}

const questions: Question[] = [
  {
    type: "multiple",
    question: { en: "What is a sequence?", id: "Apa itu urutan?" },
    options: {
      en: ["The correct order of steps to complete a task", "A random list of things to do", "A type of dance"],
      id: ["Urutan langkah yang benar untuk menyelesaikan tugas", "Daftar acak hal yang harus dilakukan", "Jenis tarian"],
    },
    correct: 0,
    explanation: { en: "A sequence is the correct order of steps to complete a task!", id: "Urutan adalah langkah-langkah yang benar untuk menyelesaikan tugas!" },
  },
  {
    type: "multiple",
    question: { en: "What is an algorithm?", id: "Apa itu algoritma?" },
    options: {
      en: ["A math problem", "Step-by-step instructions to solve a problem", "A computer game"],
      id: ["Soal matematika", "Petunjuk langkah demi langkah untuk memecahkan masalah", "Game komputer"],
    },
    correct: 1,
    explanation: { en: "An algorithm is a step-by-step instruction used to solve a problem!", id: "Algoritma adalah petunjuk langkah demi langkah untuk memecahkan masalah!" },
  },
  {
    type: "truefalse",
    question: { en: "True or False: The order of steps in a sequence doesn't matter.", id: "Benar atau Salah: Urutan langkah tidak penting." },
    options: {
      en: ["False - The order matters a lot!", "True - You can do steps in any order"],
      id: ["Salah - Urutan sangat penting!", "Benar - Kamu bisa melakukan langkah dalam urutan apa pun"],
    },
    correct: 0,
    explanation: { en: "The order matters! If you brush your teeth before putting toothpaste, that's not right!", id: "Urutan itu penting! Jika kamu gosok gigi sebelum menaruh pasta gigi, itu tidak benar!" },
  },
  {
    type: "multiple",
    question: { en: "Which of these is an algorithm?", id: "Mana yang merupakan algoritma?" },
    options: {
      en: ["A recipe for making pancakes", "A color of the rainbow", "A name of a pet"],
      id: ["Resep membuat pancake", "Warna pelangi", "Nama hewan peliharaan"],
    },
    correct: 0,
    explanation: { en: "A recipe is an algorithm - it tells you step by step how to make something!", id: "Resep adalah algoritma - ini memberitahu langkah demi langkah cara membuat sesuatu!" },
  },
  {
    type: "multiple",
    question: { en: "Why are algorithms important in programming?", id: "Mengapa algoritma penting dalam pemrograman?" },
    options: {
      en: ["Computers need exact instructions", "Computers can guess what we want", "Computers don't use algorithms"],
      id: ["Komputer membutuhkan instruksi yang tepat", "Komputer bisa menebak apa yang kita mau", "Komputer tidak menggunakan algoritma"],
    },
    correct: 0,
    explanation: { en: "Computers need exact step-by-step instructions (algorithms) to do anything!", id: "Komputer membutuhkan instruksi langkah demi langkah yang tepat (algoritma) untuk melakukan apa pun!" },
  },
];

export default function Practice() {
  const { lang } = useLanguage();
  const { addXP, completeLesson, state } = useGame();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(state.completedLessons.includes("practice"));
  const [answers, setAnswers] = useState<boolean[]>([]);

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    const isCorrect = index === questions[currentQ].correct;
    if (isCorrect) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, isCorrect]);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setGameOver(true);
      if (!hasCompleted) {
        addXP(25);
        completeLesson("practice");
        setHasCompleted(true);
        fireConfetti(40);
      }
    }
  };

  const reset = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setGameOver(false);
    setAnswers([]);
  };

  const q = questions[currentQ];

  if (gameOver) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20 dark:from-gray-950 dark:via-blue-950/5 dark:to-purple-950/5 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md text-center shadow-2xl">
          <div className="text-6xl mb-4">{percentage >= 80 ? "🎉" : percentage >= 50 ? "👍" : "💪"}</div>
          <h2 className="text-3xl font-bold mb-2">{lang === "en" ? "Practice Complete!" : "Latihan Selesai!"}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-2">{lang === "en" ? `You got ${score} out of ${questions.length} correct!` : `Kamu mendapat ${score} dari ${questions.length} benar!`}</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
            <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
          </div>
          <p className="text-sm text-gray-400 mb-6">{percentage >= 80 ? lang === "en" ? "Amazing! You really understand sequences and algorithms!" : "Luar biasa! Kamu benar-benar mengerti urutan dan algoritma!" : percentage >= 50 ? lang === "en" ? "Good job! A little more practice and you'll be a pro!" : "Bagus! Sedikit latihan lagi dan kamu akan jadi pro!" : lang === "en" ? "Keep practicing! You'll get better!" : "Terus berlatih! Kamu akan semakin baik!"}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={reset} variant="outline" className="rounded-full"><RotateCcw className="w-4 h-4 mr-2" />{lang === "en" ? "Try Again" : "Coba Lagi"}</Button>
            <Link to="/quiz"><Button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">{lang === "en" ? "Take the Quiz" : "Ikuti Kuis"}<ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20 dark:from-gray-950 dark:via-blue-950/5 dark:to-purple-950/5">
      <Navbar />
      <AIAssistant type="encourage" message={lang === "en" ? "Let's practice what we've learned! You've got this!" : "Ayo berlatih apa yang sudah kita pelajari! Kamu pasti bisa!"} hint={q.explanation[lang]} />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-500">{lang === "en" ? `Question ${currentQ + 1}/${questions.length}` : `Soal ${currentQ + 1}/${questions.length}`}</span>
            <div className="flex gap-2">
              {questions.map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full transition-all ${i < currentQ ? (answers[i] ? "bg-green-400" : "bg-red-400") : i === currentQ ? "bg-blue-400 scale-125" : "bg-gray-300 dark:bg-gray-600"}`} />
              ))}
            </div>
            <span className="text-sm font-medium text-blue-600">{lang === "en" ? `Score: ${score}` : `Skor: ${score}`}</span>
          </div>

          {/* Question Card */}
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/30"
          >
            <div className="mb-2">
              <span className="px-3 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600">{q.type === "truefalse" ? "✅ True/False" : "🔘 Multiple Choice"}</span>
            </div>
            <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">{q.question[lang]}</h2>

            <div className="space-y-3">
              {q.options[lang].map((opt, i) => {
                const isSelected = selected === i;
                const isCorrect = i === q.correct;
                return (
                  <motion.button
                    key={i}
                    onClick={() => handleSelect(i)}
                    whileHover={!showResult ? { scale: 1.01 } : {}}
                    disabled={showResult}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      showResult
                        ? isCorrect
                          ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                          : isSelected
                          ? "border-red-400 bg-red-50 dark:bg-red-900/20"
                          : "border-gray-200 dark:border-gray-700 opacity-50"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        showResult
                          ? isCorrect ? "bg-green-400 text-white" : isSelected ? "bg-red-400 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600"
                      }`}>
                        {showResult ? (isCorrect ? "✓" : isSelected ? "✗" : String.fromCharCode(65 + i)) : String.fromCharCode(65 + i)}
                      </div>
                      <span className="text-sm">{opt}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {showResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 p-4 rounded-xl ${selected === q.correct ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"}`}>
                <p className={`font-semibold text-sm ${selected === q.correct ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
                  {selected === q.correct ? "✅ " + (lang === "en" ? "Correct!" : "Benar!") : "❌ " + (lang === "en" ? "Not quite!" : "Belum tepat!")}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{q.explanation[lang]}</p>
              </motion.div>
            )}
          </motion.div>

          {showResult && (
            <div className="text-center mt-6">
              <Button onClick={handleNext} className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8">
                {currentQ < questions.length - 1 ? (lang === "en" ? "Next Question" : "Soal Berikutnya") : (lang === "en" ? "See Results" : "Lihat Hasil")}
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
