import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { Sparkles, Heart, Trophy, Star, Flame, BookOpen, Target, Zap, ArrowRight, Award, RotateCcw, Clock, Medal, Gift, Calendar, TrendingUp, CheckCircle2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSound } from "@/contexts/SoundContext";
import { Navbar } from "@/components/layout/Navbar";
import { Byte } from "@/components/layout/Byte";
import { fireConfetti } from "@/lib/confetti";

const XP_PER_LEVEL = 100;

const lessons = [
  { id: "sequence_lesson", title: { en: "What is Sequence?", id: "Apa itu Urutan?" }, icon: "📋", xp: 20, time: 10 },
  { id: "sequence_game", title: { en: "Sequence Game", id: "Game Urutan" }, icon: "🎮", xp: 30, time: 15 },
  { id: "algorithm_lesson", title: { en: "What is Algorithm?", id: "Apa itu Algoritma?" }, icon: "💡", xp: 20, time: 10 },
  { id: "algorithm_game", title: { en: "Algorithm Game", id: "Game Algoritma" }, icon: "🎯", xp: 30, time: 15 },
  { id: "practice", title: { en: "Practice", id: "Latihan" }, icon: "✏️", xp: 25, time: 10 },
  { id: "quiz", title: { en: "Quiz", id: "Kuis" }, icon: "🧠", xp: 50, time: 20 },
];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function StudentDashboard() {
  const { lang } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { state, achievements, resetGame, claimDailyReward, addXP, addCoins, checkAchievements } = useGame();
  const { playLevelUp, playAchievement, playConfetti: playConfettiSound } = useSound();
  const navigate = useNavigate();
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [dailyReward, setDailyReward] = useState<{ xp: number; coins: number; day: number } | null>(null);
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Try to claim daily reward on dashboard visit
    const reward = claimDailyReward();
    if (reward) {
      setDailyReward(reward);
      setShowDailyReward(true);
      setXpAmount(reward.xp);
      setShowXPAnimation(true);
      playConfettiSound();
      fireConfetti(30);
      setTimeout(() => setShowDailyReward(false), 4000);
    }

    // Check achievements
    const newAchievements = checkAchievements();
    if (newAchievements.length > 0) {
      playAchievement();
    }
  }, []);

  if (!isAuthenticated) return null;

  const xpProgress = state.xp % XP_PER_LEVEL;
  const xpToNextLevel = XP_PER_LEVEL;
  const unlockedAchievements = achievements.filter((a) => state.achievements.includes(a.id));
  const lockedAchievements = achievements.filter((a) => !state.achievements.includes(a.id));

  // Weekly activity mock data
  const weekActivity = state.completedLessons.length > 0
    ? [3, 5, 2, 4, 1, 0, 0]
    : [0, 0, 0, 0, 0, 0, 0];

  // Calculate quiz average
  const quizScores = state.quizScores;
  const avgQuizScore = quizScores.length > 0
    ? Math.round(quizScores.reduce((s, q) => s + (q.score / q.total) * 100, 0) / quizScores.length)
    : 0;

  // Find favorite lesson
  const lessonCounts = state.completedLessons.reduce((acc: Record<string, number>, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});
  const favLesson = Object.entries(lessonCounts).sort(([, a], [, b]) => b - a)[0]?.[0];
  const favLessonData = lessons.find((l) => l.id === favLesson);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20 dark:from-gray-950 dark:via-blue-950/5 dark:to-purple-950/5">
      <Navbar />
      <Byte
        mood={state.completedLessons.length === 0 ? "wave" : "happy"}
        message={
          state.completedLessons.length === 0
            ? lang === "en"
              ? "Welcome to your dashboard! Start your first lesson to earn XP!"
              : "Selamat datang di dasbormu! Mulai pelajaran pertamamu untuk mendapatkan XP!"
            : lang === "en"
              ? `You've completed ${state.completedLessons.length} lessons! Keep going!`
              : `Kamu telah menyelesaikan ${state.completedLessons.length} pelajaran! Teruskan!`
        }
        autoSpeak
      />

      {/* Daily Reward Popup */}
      {showDailyReward && dailyReward && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowDailyReward(false)}
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm mx-4 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} className="text-6xl mb-4">🎁</motion.div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
              {lang === "en" ? "Daily Login Reward!" : "Hadiah Masuk Harian!"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {lang === "en" ? `Day ${dailyReward.day} streak bonus!` : `Bonus hari ke-${dailyReward.day}!`}
            </p>
            <div className="flex justify-center gap-4 mb-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl px-4 py-3">
                <p className="text-2xl font-bold text-yellow-500">+{dailyReward.xp}</p>
                <p className="text-xs text-gray-500">XP</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-3">
                <p className="text-2xl font-bold text-blue-500">+{dailyReward.coins}</p>
                <p className="text-xs text-gray-500">Coins</p>
              </div>
            </div>
            <Button
              onClick={() => setShowDailyReward(false)}
              className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            >
              {lang === "en" ? "Awesome!" : "Luar Biasa!"}
            </Button>
          </motion.div>
        </motion.div>
      )}

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {lang === "en" ? "My Dashboard" : "Dasborku"}
              </span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {lang === "en" ? "Track your learning progress and achievements!" : "Lacak kemajuan belajar dan pencapaianmu!"}
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Sparkles, value: state.xp, label: { en: "XP", id: "XP" }, color: "from-yellow-400 to-amber-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
              { icon: Trophy, value: `${state.level}`, label: { en: "Level", id: "Level" }, color: "from-blue-400 to-purple-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
              { icon: Heart, value: `${state.hearts}/5`, label: { en: "Hearts", id: "Hati" }, color: "from-red-400 to-pink-500", bg: "bg-red-50 dark:bg-red-900/20" },
              { icon: Flame, value: state.streak, label: { en: "Day Streak", id: "Rantai Hari" }, color: "from-orange-400 to-red-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`${stat.bg} rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/30 hover:shadow-md transition-shadow`}
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

          {/* XP Animation */}
          {showXPAnimation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-700/30 text-center"
            >
              <p className="text-yellow-700 dark:text-yellow-300 font-bold">
                ✨ +{xpAmount} XP {lang === "en" ? "from daily reward!" : "dari hadiah harian!"}
              </p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
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
                <Progress value={(xpProgress / xpToNextLevel) * 100} className="h-3 rounded-full" />
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
                <Progress value={(state.completedLessons.length / lessons.length) * 100} className="h-2 mb-4 rounded-full" />
                <div className="space-y-2">
                  {lessons.map((lesson) => {
                    const completed = state.completedLessons.includes(lesson.id);
                    return (
                      <div key={lesson.id} className={`flex items-center justify-between p-3 rounded-xl ${completed ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-800/30"}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{lesson.icon}</span>
                          <div>
                            <span className={`text-sm font-medium ${completed ? "text-gray-800 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"}`}>
                              {lesson.title[lang]}
                            </span>
                            <p className="text-[10px] text-gray-400">{lesson.time} min</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {completed ? (
                            <Badge variant="outline" className="text-green-500 border-green-200 text-xs">
                              ✓ {lesson.xp} XP
                            </Badge>
                          ) : (
                            <Link to={`/${lesson.id.replace("_", "-")}`}>
                              <Button size="sm" variant="outline" className="rounded-full text-xs h-7">
                                +{lesson.xp} XP
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Weekly Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30"
              >
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-gray-800 dark:text-gray-100">{lang === "en" ? "Weekly Activity" : "Aktivitas Mingguan"}</h3>
                </div>
                <div className="flex items-end justify-between gap-2 h-24">
                  {WEEKDAYS.map((day, i) => {
                    const height = Math.max(weekActivity[i] * 25, 4);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-gray-400">{weekActivity[i]}</span>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}px` }}
                          className={`w-full rounded-lg bg-gradient-to-t from-blue-400 to-purple-400 max-h-24`}
                          style={{ minHeight: 4 }}
                        />
                        <span className="text-[10px] text-gray-500">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Quiz Scores */}
              {quizScores.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30"
                >
                  <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-100">{lang === "en" ? "Quiz History" : "Riwayat Kuis"}</h3>
                  <div className="space-y-2">
                    {[...quizScores].reverse().slice(0, 5).map((q, i) => (
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
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30"
              >
                <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-100">{lang === "en" ? "Stats" : "Statistik"}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {lang === "en" ? "Learning Time" : "Waktu Belajar"}</span>
                    <span className="font-bold">{state.learningTime} min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1"><Award className="w-3 h-3" /> {lang === "en" ? "Achievements" : "Pencapaian"}</span>
                    <span className="font-bold">{unlockedAchievements.length}/{achievements.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1"><Star className="w-3 h-3" /> {lang === "en" ? "Quiz Avg" : "Rata-rata Kuis"}</span>
                    <span className="font-bold">{avgQuizScore}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1"><Medal className="w-3 h-3" /> {lang === "en" ? "Coins" : "Koin"}</span>
                    <span className="font-bold">{state.coins}</span>
                  </div>
                  {favLessonData && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1"><BookOpen className="w-3 h-3" /> {lang === "en" ? "Favorite" : "Favorit"}</span>
                      <span className="font-bold text-xs">{favLessonData.icon} {favLessonData.title[lang]}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {lang === "en" ? "Current Lesson" : "Pelajaran Saat Ini"}</span>
                    <span className="font-bold text-xs">{state.currentLesson ? lessons.find(l => l.id === state.currentLesson)?.title[lang] || "—" : "—"}</span>
                  </div>
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
                      <span className="text-xl">🔒</span>
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

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30"
              >
                <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-100">{lang === "en" ? "Quick Links" : "Tautan Cepat"}</h3>
                <div className="space-y-2">
                  {[
                    { to: "/sequence", icon: "📋", label: { en: "Learn Sequence", id: "Belajar Urutan" } },
                    { to: "/algorithm", icon: "💡", label: { en: "Learn Algorithm", id: "Belajar Algoritma" } },
                    { to: "/quiz", icon: "🧠", label: { en: "Take Quiz", id: "Ikuti Kuis" } },
                    { to: "/certificate", icon: "🏆", label: { en: "Get Certificate", id: "Dapatkan Sertifikat" } },
                    { to: "/profile", icon: "👤", label: { en: "My Profile", id: "Profilku" } },
                  ].map((link, i) => (
                    <Link key={i} to={link.to}>
                      <Button variant="outline" className="w-full justify-start rounded-xl h-10 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                        <span className="mr-2">{link.icon}</span> {link.label[lang]}
                      </Button>
                    </Link>
                  ))}
                </div>
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
    </div>
  );
}
