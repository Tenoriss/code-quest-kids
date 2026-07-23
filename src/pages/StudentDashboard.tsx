import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router";
import { Sparkles, Heart, Trophy, Star, Flame, BookOpen, Target, Zap, ArrowRight, Award, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGame } from "@/contexts/GameContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIAssistant } from "@/components/layout/AIAssistant";

const XP_PER_LEVEL = 100;

const lessons = [
  { id: "sequence_lesson", title: { en: "What is Sequence?", id: "Apa itu Urutan?" }, icon: "📋", xp: 20 },
  { id: "sequence_game", title: { en: "Sequence Game", id: "Game Urutan" }, icon: "🎮", xp: 30 },
  { id: "algorithm_lesson", title: { en: "What is Algorithm?", id: "Apa itu Algoritma?" }, icon: "💡", xp: 20 },
  { id: "algorithm_game", title: { en: "Algorithm Game", id: "Game Algoritma" }, icon: "🎯", xp: 30 },
  { id: "practice", title: { en: "Practice", id: "Latihan" }, icon: "✏️", xp: 25 },
  { id: "quiz", title: { en: "Quiz", id: "Kuis" }, icon: "🧠", xp: 50 },
];

export default function StudentDashboard() {
  const { lang } = useLanguage();
  const { state, achievements, resetGame } = useGame();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const xpProgress = (state.xp % XP_PER_LEVEL);
  const xpToNextLevel = XP_PER_LEVEL;
  const completionPercent = Math.round((state.completedLessons.length / lessons.length) * 100);

  const unlockedAchievements = achievements.filter((a) => state.achievements.includes(a.id));
  const lockedAchievements = achievements.filter((a) => !state.achievements.includes(a.id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20 dark:from-gray-950 dark:via-blue-950/5 dark:to-purple-950/5">
      <Navbar />
      <AIAssistant
        type="welcome"
        message={lang === "en" ? "Welcome to your dashboard! Let's see how you're doing!" : "Selamat datang di dasbormu! Mari lihat bagaimana perkembanganmu!"}
        autoSpeak
      />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {lang === "en" ? "My Dashboard" : "Dasborku"}
              </span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400">{lang === "en" ? "Track your learning progress and achievements!" : "Lacak kemajuan belajar dan pencapaianmu!"}</p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Sparkles, value: state.xp, label: { en: "XP", id: "XP" }, color: "from-yellow-400 to-amber-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
              { icon: Trophy, value: `${state.level}`, label: { en: "Level", id: "Level" }, color: "from-blue-400 to-purple-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
              { icon: Heart, value: state.hearts, label: { en: "Hearts", id: "Hati" }, color: "from-red-400 to-pink-500", bg: "bg-red-50 dark:bg-red-900/20" },
              { icon: Flame, value: state.streak, label: { en: "Day Streak", id: "Rantai Hari" }, color: "from-orange-400 to-red-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`${stat.bg} rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/30`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label[lang]}</div>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Progress */}
            <div className="lg:col-span-2 space-y-6">
              {/* XP Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100">{lang === "en" ? "Level Progress" : "Kemajuan Level"}</h3>
                  <span className="text-sm text-purple-600 font-medium">{xpProgress}/{xpToNextLevel} XP</span>
                </div>
                <Progress value={(xpProgress / xpToNextLevel) * 100} className="h-3" />
                <p className="text-xs text-gray-400 mt-2">
                  {lang === "en" ? `${xpToNextLevel - xpProgress} XP to next level` : `${xpToNextLevel - xpProgress} XP ke level berikutnya`}
                </p>
              </motion.div>

              {/* Lessons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100">{lang === "en" ? "Completed Lessons" : "Pelajaran Selesai"}</h3>
                  <span className="text-sm text-blue-600 font-medium">{state.completedLessons.length}/{lessons.length}</span>
                </div>
                <Progress value={completionPercent} className="h-2 mb-4" />
                <div className="space-y-2">
                  {lessons.map((lesson) => {
                    const completed = state.completedLessons.includes(lesson.id);
                    return (
                      <div key={lesson.id} className={`flex items-center justify-between p-3 rounded-xl ${completed ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-800/30"}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{lesson.icon}</span>
                          <span className={`text-sm font-medium ${completed ? "text-gray-800 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"}`}>
                            {lesson.title[lang]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {completed ? (
                            <span className="text-green-500 text-xs font-medium">✓ {lesson.xp} XP</span>
                          ) : (
                            <span className="text-gray-400 text-xs">{lesson.xp} XP</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Quiz Scores */}
              {state.quizScores.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30"
                >
                  <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-100">{lang === "en" ? "Quiz History" : "Riwayat Kuis"}</h3>
                  <div className="space-y-2">
                    {[...state.quizScores].reverse().slice(0, 5).map((q, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/30">
                        <span className="text-xs text-gray-500">{new Date(q.date).toLocaleDateString()}</span>
                        <span className={`text-sm font-bold ${q.score === q.total ? "text-green-500" : "text-blue-500"}`}>{q.score}/{q.total}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30"
              >
                <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-100">{lang === "en" ? "Quick Links" : "Tautan Cepat"}</h3>
                <div className="space-y-2">
                  {[
                    { to: "/sequence", icon: "📋", label: { en: "Learn Sequence", id: "Belajar Urutan" } },
                    { to: "/algorithm", icon: "💡", label: { en: "Learn Algorithm", id: "Belajar Algoritma" } },
                    { to: "/quiz", icon: "🧠", label: { en: "Take Quiz", id: "Ikuti Kuis" } },
                    { to: "/certificate", icon: "🏆", label: { en: "Get Certificate", id: "Dapatkan Sertifikat" } },
                  ].map((link, i) => (
                    <Link key={i} to={link.to}>
                      <Button variant="outline" className="w-full justify-start rounded-xl h-10 text-sm">
                        <span className="mr-2">{link.icon}</span> {link.label[lang]}
                      </Button>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Achievements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-bold text-gray-800 dark:text-gray-100">{lang === "en" ? "Achievements" : "Pencapaian"}</h3>
                </div>
                <div className="space-y-2">
                  {unlockedAchievements.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                      <span className="text-xl">{a.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-yellow-800 dark:text-yellow-200">{a.title}</p>
                        <p className="text-[10px] text-yellow-600 dark:text-yellow-400">{a.description}</p>
                      </div>
                    </div>
                  ))}
                  {lockedAchievements.slice(0, 3).map((a) => (
                    <div key={a.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/30 opacity-50">
                      <span className="text-xl grayscale">🔒</span>
                      <div>
                        <p className="text-xs font-bold text-gray-500">{a.title}</p>
                        <p className="text-[10px] text-gray-400">{a.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {unlockedAchievements.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-2">
                    {lang === "en" ? "Complete lessons to unlock achievements!" : "Selesaikan pelajaran untuk membuka pencapaian!"}
                  </p>
                )}
              </motion.div>

              {/* Reset */}
              <div className="text-center">
                <Button variant="ghost" size="sm" onClick={resetGame} className="text-xs text-gray-400 hover:text-red-500">
                  <RotateCcw className="w-3 h-3 mr-1" /> {lang === "en" ? "Reset Progress" : "Reset Kemajuan"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
