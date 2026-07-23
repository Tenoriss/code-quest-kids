import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Brain, Timer, Trophy, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGame } from "@/contexts/GameContext";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIAssistant } from "@/components/layout/AIAssistant";
import { fireConfetti, fireSparkles } from "@/lib/confetti";

const quizQuestions = [
  { id: 1, question: { en: "What is a sequence?", id: "Apa itu urutan?" }, options: { en: ["The correct order of steps to complete a task", "A random collection of items", "A type of computer virus", "A dance move"], id: ["Urutan langkah yang benar untuk menyelesaikan tugas", "Kumpulan acak barang", "Jenis virus komputer", "Gerakan dansa"] }, correct: 0, explanation: { en: "A sequence is the correct order of steps to complete a task. Order matters!", id: "Urutan adalah langkah-langkah yang benar untuk menyelesaikan tugas. Urutan itu penting!" } },
  { id: 2, question: { en: "What is an algorithm?", id: "Apa itu algoritma?" }, options: { en: ["A type of music", "Step-by-step instructions to solve a problem", "A computer screen", "A math formula"], id: ["Jenis musik", "Petunjuk langkah demi langkah untuk memecahkan masalah", "Layar komputer", "Rumus matematika"] }, correct: 1, explanation: { en: "An algorithm is a step-by-step instruction used to solve a problem. Like a recipe!", id: "Algoritma adalah petunjuk langkah demi langkah untuk memecahkan masalah. Seperti resep!" } },
  { id: 3, question: { en: "What happens if you change the order of steps in a sequence?", id: "Apa yang terjadi jika kamu mengubah urutan langkah?" }, options: { en: ["Nothing changes", "You might not get the right result", "It works better", "The steps disappear"], id: ["Tidak ada yang berubah", "Kamu mungkin tidak mendapatkan hasil yang benar", "Ini bekerja lebih baik", "Langkahnya hilang"] }, correct: 1, explanation: { en: "If you change the order, you might not get the result you want! Order matters.", id: "Jika kamu mengubah urutan, kamu mungkin tidak mendapatkan hasil yang diinginkan! Urutan itu penting." } },
  { id: 4, question: { en: "Which everyday activity is an example of following an algorithm?", id: "Aktivitas sehari-hari mana yang merupakan contoh mengikuti algoritma?" }, options: { en: ["Watching TV", "Following a recipe to bake cookies", "Sleeping", "Drawing a circle"], id: ["Menonton TV", "Mengikuti resep membuat kue", "Tidur", "Menggambar lingkaran"] }, correct: 1, explanation: { en: "A recipe is an algorithm - it gives you step-by-step instructions to make something!", id: "Resep adalah algoritma - ini memberikan instruksi langkah demi langkah untuk membuat sesuatu!" } },
  { id: 5, question: { en: "Why do computers need algorithms?", id: "Mengapa komputer membutuhkan algoritma?" }, options: { en: ["Computers can think for themselves", "Computers need exact step-by-step instructions", "Computers don't use algorithms", "Computers guess what to do"], id: ["Komputer bisa berpikir sendiri", "Komputer membutuhkan instruksi langkah demi langkah yang tepat", "Komputer tidak menggunakan algoritma", "Komputer menebak apa yang harus dilakukan"] }, correct: 1, explanation: { en: "Computers need exact step-by-step instructions (algorithms) to do anything!", id: "Komputer membutuhkan instruksi langkah demi langkah yang tepat (algoritma) untuk melakukan apa pun!" } },
  { id: 6, question: { en: "What should you do first when brushing your teeth?", id: "Apa yang harus kamu lakukan pertama saat menggosok gigi?" }, options: { en: ["Put toothpaste on brush", "Rinse your mouth", "Brush your teeth", "Wet your toothbrush"], id: ["Letakkan pasta gigi di sikat", "Bilas mulutmu", "Gosok gigimu", "Basahi sikat gigi"] }, correct: 3, explanation: { en: "First, wet your toothbrush! Then put toothpaste, brush, spit, and rinse. A sequence!", id: "Pertama, basahi sikat gigi! Lalu letakkan pasta gigi, gosok, buang busa, dan bilas. Sebuah urutan!" } },
  { id: 7, question: { en: "True or False: Algorithms help reduce mistakes.", id: "Benar atau Salah: Algoritma membantu mengurangi kesalahan." }, options: { en: ["True - following steps carefully reduces mistakes", "False - algorithms cause more mistakes"], id: ["Benar - mengikuti langkah dengan hati-hati mengurangi kesalahan", "Salah - algoritma menyebabkan lebih banyak kesalahan"] }, correct: 0, explanation: { en: "True! Following a clear sequence of steps helps us make fewer mistakes!", id: "Benar! Mengikuti urutan langkah yang jelas membantu kita membuat lebih sedikit kesalahan!" } },
  { id: 8, question: { en: "What does 'sequence' mean in programming?", id: "Apa arti 'urutan' dalam pemrograman?" }, options: { en: ["Writing code backwards", "The order in which instructions are executed", "Deleting code", "Drawing pictures"], id: ["Menulis kode terbalik", "Urutan di mana instruksi dijalankan", "Menghapus kode", "Menggambar gambar"] }, correct: 1, explanation: { en: "In programming, sequence means the order in which instructions are executed by the computer!", id: "Dalam pemrograman, urutan berarti urutan di mana instruksi dijalankan oleh komputer!" } },
  { id: 9, question: { en: "Which is the correct morning routine sequence?", id: "Mana urutan rutinitas pagi yang benar?" }, options: { en: ["Eat → Wake up → Brush → Bath", "Wake up → Bath → Dress → Eat", "Dress → Eat → Wake up → Bath", "Bath → Eat → Wake up → Dress"], id: ["Makan → Bangun → Gosok gigi → Mandi", "Bangun → Mandi → Pakai baju → Makan", "Pakai baju → Makan → Bangun → Mandi", "Mandi → Makan → Bangun → Pakai baju"] }, correct: 1, explanation: { en: "Correct! Wake up first, then take a bath, get dressed, and eat breakfast!", id: "Benar! Bangun dulu, lalu mandi, pakai baju, dan sarapan!" } },
  { id: 10, question: { en: "Why is learning about sequences and algorithms useful?", id: "Mengapa belajar tentang urutan dan algoritma berguna?" }, options: { en: ["It helps us think logically and solve problems", "It's only for computers", "It's not useful at all", "It makes things more confusing"], id: ["Ini membantu kita berpikir logis dan memecahkan masalah", "Ini hanya untuk komputer", "Ini tidak berguna sama sekali", "Ini membuat segalanya lebih membingungkan"] }, correct: 0, explanation: { en: "Learning sequences and algorithms helps you think logically, solve problems, and understand how technology works!", id: "Belajar urutan dan algoritma membantumu berpikir logis, memecahkan masalah, dan memahami cara kerja teknologi!" } },
];

interface LeaderboardEntry {
  name: string;
  score: number;
  total: number;
  time: number;
  date: string;
}

export default function Quiz() {
  const { lang } = useLanguage();
  const { addXP, addQuizScore, completeLesson } = useGame();
  const [leaderboard, setLeaderboard] = useLocalStorage<LeaderboardEntry[]>("codequest_leaderboard", []);

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [quizOver, setQuizOver] = useState(false);
  const [playerName, setPlayerName] = useState("");

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (quizOver) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setQuizOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [quizOver]);

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    if (index === quizQuestions[currentQ].correct) {
      setScore((s) => s + 1);
      fireSparkles(15);
    }
  };

  const handleNext = () => {
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = useCallback(() => {
    setQuizOver(true);
    if (timerRef.current) clearInterval(timerRef.current);
    addXP(score * 5);
    addQuizScore(score, quizQuestions.length);
    completeLesson("quiz");
    if (score === quizQuestions.length) fireConfetti(100);

    // Save to leaderboard
    const entry: LeaderboardEntry = {
      name: "Student",
      score,
      total: quizQuestions.length,
      time: 300 - timeLeft,
      date: new Date().toISOString().slice(0, 10),
    };
    setLeaderboard((prev) => {
      const updated = [...prev, entry].sort((a, b) => b.score - a.score || a.time - b.time);
      return updated.slice(0, 20);
    });
  }, [score, addXP, addQuizScore, completeLesson, timeLeft, setLeaderboard]);



  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const q = quizQuestions[currentQ];
  const progress = ((currentQ + (showResult ? 1 : 0)) / quizQuestions.length) * 100;

  if (quizOver) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20 dark:from-gray-950 dark:via-blue-950/5 dark:to-purple-950/5">
        <Navbar />
        <main className="pt-24 pb-20 px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/30 shadow-2xl text-center">
              <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5 }} className="text-6xl mb-4">{percentage >= 80 ? "🏆" : percentage >= 50 ? "👍" : "💪"}</motion.div>
              <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">{lang === "en" ? "Quiz Complete!" : "Kuis Selesai!"}</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">{lang === "en" ? `You scored ${score} out of ${quizQuestions.length}` : `Skor kamu ${score} dari ${quizQuestions.length}`}</p>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-6">
                <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
                  <p className="text-2xl font-bold text-blue-600">{score}/{quizQuestions.length}</p>
                  <p className="text-xs text-gray-500">{lang === "en" ? "Score" : "Skor"}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3">
                  <p className="text-2xl font-bold text-purple-600">{formatTime(300 - timeLeft)}</p>
                  <p className="text-xs text-gray-500">{lang === "en" ? "Time" : "Waktu"}</p>
                </div>
              </div>

              {percentage >= 80 && (
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder={lang === "en" ? "Enter your name for the certificate" : "Masukkan namamu untuk sertifikat"}
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center mb-3"
                  />
                  <Link to="/certificate" state={{ name: playerName, score: `${score}/${quizQuestions.length}` }}>
                    <Button className="rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white w-full">
                      <Star className="w-4 h-4 mr-2" />{lang === "en" ? "Get Certificate" : "Dapatkan Sertifikat"}
                    </Button>
                  </Link>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/"><Button variant="outline" className="rounded-full">{lang === "en" ? "Back to Home" : "Kembali ke Beranda"}</Button></Link>
                <Link to="/dashboard"><Button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">{lang === "en" ? "View Dashboard" : "Lihat Dasbor"}</Button></Link>
              </div>

              {/* Leaderboard */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-bold mb-4 flex items-center justify-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> {lang === "en" ? "Leaderboard" : "Papan Peringkat"}</h3>
                <div className="space-y-2">
                  {leaderboard.slice(0, 5).map((entry, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? "bg-yellow-400" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-amber-600" : "bg-gray-300 dark:bg-gray-600"}`}>{i + 1}</span>
                        <span className="text-sm font-medium">{entry.name}</span>
                      </div>
                      <span className="text-sm font-bold text-blue-600">{entry.score}/{entry.total}</span>
                    </div>
                  ))}
                  {leaderboard.length === 0 && <p className="text-xs text-gray-400">{lang === "en" ? "No scores yet. Be the first!" : "Belum ada skor. Jadilah yang pertama!"}</p>}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/20 to-blue-50/20 dark:from-gray-950 dark:via-purple-950/5 dark:to-blue-950/5">
      <Navbar />
      <AIAssistant type="encourage" message={lang === "en" ? "Ready for the quiz? 10 questions to test your knowledge. You can do this!" : "Siap untuk kuis? 10 pertanyaan untuk menguji pengetahuanmu. Kamu pasti bisa!"} />

      <main className="pt-28 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{lang === "en" ? "Quiz" : "Kuis"}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm">
                <Timer className="w-4 h-4 text-red-500" />
                <span className={`font-mono font-bold ${timeLeft < 60 ? "text-red-500 animate-pulse" : "text-gray-600"}`}>{formatTime(timeLeft)}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="font-bold text-yellow-600">{score}</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <Progress value={progress} className="mb-6 h-2" />

          {/* Question number */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">{lang === "en" ? `Question ${currentQ + 1} of ${quizQuestions.length}` : `Soal ${currentQ + 1} dari ${quizQuestions.length}`}</span>
            <div className="flex gap-1.5">
              {quizQuestions.map((_, i) => (
                <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i < currentQ ? "bg-green-400" : i === currentQ ? "bg-purple-500 scale-125" : "bg-gray-300 dark:bg-gray-600"}`} />
              ))}
            </div>
          </div>

          {/* Question */}
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/30"
          >
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
                        ? isCorrect ? "border-green-400 bg-green-50 dark:bg-green-900/20" : isSelected ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-gray-700 opacity-50"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        showResult ? isCorrect ? "bg-green-400 text-white" : isSelected ? "bg-red-400 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400"
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
                  {selected === q.correct ? "✅ " + (lang === "en" ? "Correct!" : "Benar!") : "❌ " + (lang === "en" ? "Incorrect!" : "Salah!")}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{q.explanation[lang]}</p>
                {selected === q.correct && <p className="text-xs text-green-600 dark:text-green-400 mt-1">+5 XP</p>}
              </motion.div>
            )}
          </motion.div>

          {showResult && (
            <div className="text-center mt-6">
              <Button onClick={handleNext} className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 h-12 shadow-lg">
                {currentQ < quizQuestions.length - 1 ? (lang === "en" ? "Next Question" : "Soal Berikutnya") : (lang === "en" ? "Finish Quiz" : "Selesaikan Kuis")}
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
