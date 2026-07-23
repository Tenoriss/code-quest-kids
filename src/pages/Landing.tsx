import { useRef, useEffect, useState, useMemo, useCallback, lazy } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Brain, ListOrdered, GitBranch, Trophy, Rocket, ChevronDown, Heart, BookOpen, Award, Clock, Flame, Target, CheckCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSound } from "@/contexts/SoundContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useGame } from "@/contexts/GameContext";
import { Byte } from "@/components/layout/Byte";
import { fireConfetti } from "@/lib/confetti";

// ============================================================
// DATA
// ============================================================

const features = [
  { icon: ListOrdered, title: { en: "Learn Sequences", id: "Belajar Urutan" }, desc: { en: "Understand the correct order of steps to complete any task!", id: "Pahami urutan langkah yang benar untuk menyelesaikan tugas!" }, color: "from-blue-400 to-cyan-500" },
  { icon: GitBranch, title: { en: "Master Algorithms", id: "Kuasai Algoritma" }, desc: { en: "Discover how step-by-step instructions solve problems!", id: "Temukan bagaimana petunjuk langkah demi langkah memecahkan masalah!" }, color: "from-purple-400 to-pink-500" },
  { icon: Brain, title: { en: "Think Logically", id: "Berpikir Logis" }, desc: { en: "Build critical thinking skills through fun puzzles!", id: "Bangun keterampilan berpikir kritis melalui teka-teki seru!" }, color: "from-green-400 to-teal-500" },
  { icon: Trophy, title: { en: "Earn Rewards", id: "Dapatkan Hadiah" }, desc: { en: "Collect XP, hearts, and achievements as you learn!", id: "Kumpulkan XP, hati, dan pencapaian saat belajar!" }, color: "from-yellow-400 to-orange-500" },
];

const stats = [
  { number: "6", label: { en: "Interactive Lessons", id: "Pelajaran Interaktif" } },
  { number: "10+", label: { en: "Fun Activities", id: "Aktivitas Seru" } },
  { number: "175", label: { en: "XP to Earn", id: "XP untuk Dikumpulkan" } },
  { number: "🎯", label: { en: "Beginner Friendly", id: "Ramah Pemula" } },
];

const lessons = [
  { id: "sequence_lesson", title: { en: "What is Sequence?", id: "Apa itu Urutan?" }, icon: "📋", xp: 20, time: 10 },
  { id: "sequence_game", title: { en: "Sequence Game", id: "Game Urutan" }, icon: "🎮", xp: 30, time: 15 },
  { id: "algorithm_lesson", title: { en: "What is Algorithm?", id: "Apa itu Algoritma?" }, icon: "💡", xp: 20, time: 10 },
  { id: "algorithm_game", title: { en: "Algorithm Game", id: "Game Algoritma" }, icon: "🎯", xp: 30, time: 15 },
  { id: "practice", title: { en: "Practice", id: "Latihan" }, icon: "✏️", xp: 25, time: 10 },
  { id: "quiz", title: { en: "Quiz", id: "Kuis" }, icon: "🧠", xp: 50, time: 20 },
];

// ============================================================
// PUBLIC LANDING — Guest Marketing Page
// ============================================================

function PublicLanding() {
  const { t, lang } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { playClick } = useSound();
  const { decorationData } = useTheme();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [mascotMood, setMascotMood] = useState<"wave" | "happy" | "excited" | "celebrate">("wave");
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const guests = [
    { name: "Sarah", age: 9, text: { en: "I love learning with Byte! The games are so fun! ⭐", id: "Aku suka belajar dengan Byte! Game-nya sangat seru! ⭐" } },
    { name: "Alex", age: 11, text: { en: "Now I understand how to make my own sequences! 🚀", id: "Sekarang aku mengerti cara membuat urutanku sendiri! 🚀" } },
    { name: "Maya", age: 8, text: { en: "Algorithm is like giving instructions to a robot! 🤖", id: "Algoritma itu seperti memberi instruksi ke robot! 🤖" } },
  ];

  /* eslint-disable react-hooks/purity */
  const binaryPositions = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        left: `${i * 5}%`,
        top: `${Math.random() * 100}%`,
        digits: Array.from({ length: 10 }, () => (Math.random() > 0.5 ? "1" : "0")).join(""),
      })),
    []
  );
  /* eslint-enable react-hooks/purity */

  useEffect(() => {
    const moods: Array<"wave" | "happy" | "excited" | "celebrate"> = ["wave", "happy", "excited", "wave", "happy"];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % moods.length;
      setMascotMood(moods[i]);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const floatingDecorations = decorationData.floatingEmojis.map((emoji, i) => (
    { emoji, x: `${5 + (i * 13) % 90}%`, y: `${10 + (i * 17) % 80}%`, delay: i * 0.3 }
  ));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute inset-0 ${decorationData.bgClass} transition-all duration-700`} />
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl"
            animate={{ x: mousePos.x * 30 - 15, y: mousePos.y * 30 - 15 }}
            transition={{ type: "spring", stiffness: 50 }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl"
            animate={{ x: mousePos.x * -30 + 15, y: mousePos.y * -30 + 15 }}
            transition={{ type: "spring", stiffness: 50 }}
          />

          {/* Floating Decorations */}
          {floatingDecorations.map((item, i) => (
            <motion.div
              key={i}
              className="absolute pointer-events-none"
              style={{ left: item.x, top: item.y }}
              animate={{ y: [0, -20 - i * 3, 0], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5 + i * 0.5, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
            >
              <span className="text-xl sm:text-2xl">{item.emoji}</span>
            </motion.div>
          ))}

          {/* Binary background */}
          <div className="absolute inset-0 overflow-hidden opacity-[0.03] dark:opacity-[0.05]">
            {binaryPositions.map((item, i) => (
              <motion.div
                key={i}
                className="absolute font-mono text-xs text-blue-500"
                style={{ left: item.left, top: item.top }}
                animate={{ y: [0, -1000] }}
                transition={{ duration: 20 + i * 3, repeat: Infinity, ease: "linear" }}
              >
                {item.digits}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mb-6 inline-block"
          >
            <Byte mood={mascotMood} size="lg" noVoice />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-4"
          >
            <span className={decorationData.headingClass}>
              {lang === "en" ? "Code Quest" : "Petualangan Kode"}
            </span>
            <br />
            <span className="text-gray-800 dark:text-gray-100">
              {lang === "en" ? "For Young Minds" : "Untuk Pikiran Muda"}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8"
          >
            {lang === "en"
              ? "Learn about sequences and algorithms through fun, interactive games and lessons with Byte the robot! No coding experience needed!"
              : "Pelajari tentang urutan dan algoritma melalui game dan pelajaran interaktif yang menyenangkan bersama Byte si robot! Tanpa perlu pengalaman coding!"}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={() => { playClick(); navigate("/auth"); }}
              size="lg"
              className={`h-14 px-8 text-base rounded-full ${decorationData.buttonStyle} text-white shadow-lg shadow-purple-500/25 hover:shadow-xl transition-all duration-300`}
            >
              <Rocket className="w-5 h-5 mr-2" />
              {lang === "en" ? "Get Started Free" : "Mulai Gratis"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => {
                playClick();
                if (isAuthenticated) {
                  navigate("/quiz");
                } else {
                  navigate("/auth?returnTo=/quiz");
                }
              }}
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base rounded-full border-2 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300"
            >
              <Brain className="w-5 h-5 mr-2" />
              {t("take.quiz")}
            </Button>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -3 }}
                className={`${decorationData.cardStyle} rounded-2xl p-4 border hover:shadow-lg transition-all`}
              >
                <div className={`text-2xl font-bold ${decorationData.headingClass}`}>{stat.number}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label[lang as keyof typeof stat.label]}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12"
          >
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <ChevronDown className="w-6 h-6 text-gray-300 dark:text-gray-600 mx-auto" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:via-blue-950/10 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className={decorationData.headingClass}>
                {lang === "en" ? "What You'll Learn" : "Apa yang Akan Kamu Pelajari"}
              </span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {lang === "en" ? "Four exciting topics that will teach you how to think like a programmer!" : "Empat topik seru yang akan mengajarkanmu berpikir seperti programmer!"}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`group ${decorationData.cardStyle} rounded-2xl p-6 border hover:shadow-xl transition-all duration-300 cursor-default`}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">{feature.title[lang as keyof typeof feature.title]}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc[lang as keyof typeof feature.desc]}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-3xl font-bold text-center mb-12 ${decorationData.headingClass}`}
          >
            {lang === "en" ? "What Kids Say" : "Kata Anak-Anak"}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guests.map((guest, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${decorationData.cardStyle} rounded-2xl p-6 border text-center`}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                  {guest.name[0]}
                </div>
                <p className="text-xs text-gray-400 mb-2">{lang === "en" ? `Age ${guest.age}` : `Usia ${guest.age}`}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{guest.text[lang as keyof typeof guest.text]}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`${decorationData.cardStyle} rounded-3xl p-12 border shadow-2xl`}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-6xl mb-6"
            >
              🚀
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className={decorationData.headingClass}>
                {lang === "en" ? "Ready to Start Your Adventure?" : "Siap Memulai Petualanganmu?"}
              </span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto">
              {lang === "en"
                ? "Join thousands of young learners discovering the magic of coding with Byte the robot!"
                : "Bergabunglah dengan ribuan pelajar muda yang menemukan keajaiban coding bersama Byte si robot!"}
            </p>
            <Button
              onClick={() => { playClick(); navigate("/auth"); }}
              size="lg"
              className={`h-14 px-10 text-base rounded-full ${decorationData.buttonStyle} text-white shadow-lg shadow-purple-500/25`}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {lang === "en" ? "Start Free" : "Mulai Gratis"}
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ============================================================
// STUDENT HOME — Personalized Dashboard (after login)
// ============================================================

function StudentHome() {
  const { lang } = useLanguage();
  const { isAuthenticated, currentUserProfile } = useAuth();
  const { state, achievements, getDailyMission, getWeeklyChallenge, completeDailyMission, completeWeeklyChallenge } = useGame();
  const { decorationData } = useTheme();
  const { playClick, playAchievement } = useSound();
  const navigate = useNavigate();

  const [dailyMission, setDailyMission] = useState<{ mission: { id: string; title: { en: string; id: string }; description: { en: string; id: string }; xp: number; coins: number; icon: string }; isDone: boolean } | null>(null);
  const [weeklyChallenge, setWeeklyChallenge] = useState<{ challenge: { id: string; title: { en: string; id: string }; description: { en: string; id: string }; xp: number; coins: number; icon: string }; isDone: boolean } | null>(null);
  const [showMissionComplete, setShowMissionComplete] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const mission = getDailyMission();
    if (mission) setDailyMission(mission);
    const challenge = getWeeklyChallenge();
    if (challenge) setWeeklyChallenge(challenge);
  }, [getDailyMission, getWeeklyChallenge]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Get time-based greeting
  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { en: "Good Morning", id: "Selamat Pagi" };
    if (hour < 17) return { en: "Good Afternoon", id: "Selamat Siang" };
    return { en: "Good Evening", id: "Selamat Sore" };
  }, []);

  const greeting = getGreeting();
  const studentName = currentUserProfile?.nickname || currentUserProfile?.fullName || "Student";
  const xpProgress = state.xp % 100;
  const xpToNextLevel = 100;

  // Find current lesson for "Continue Learning"
  const currentLessonData = state.currentLesson
    ? lessons.find((l) => l.id === state.currentLesson)
    : null;

  const unlockedAchievements = achievements.filter((a) => state.achievements.includes(a.id));

  const handleCompleteMission = () => {
    completeDailyMission();
    setDailyMission((prev) => prev ? { ...prev, isDone: true } : null);
    setShowMissionComplete(true);
    playAchievement();
    fireConfetti(20);
    setTimeout(() => setShowMissionComplete(false), 3000);
  };

  const handleCompleteChallenge = () => {
    completeWeeklyChallenge();
    setWeeklyChallenge((prev) => prev ? { ...prev, isDone: true } : null);
    setShowMissionComplete(true);
    playAchievement();
    fireConfetti(30);
    setTimeout(() => setShowMissionComplete(false), 3000);
  };

  if (!isAuthenticated) return null;

  const timeIcon = new Date().getHours() < 12 ? "☀️" : new Date().getHours() < 17 ? "🌤️" : "🌙";

  return (
    <div className={`min-h-screen ${decorationData.bgClass} transition-all duration-700`}>
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Byte Greeting + Personalized Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
              <Byte
                mood="wave"
                message={
                  lang === "en"
                    ? `Hi ${studentName}! ${greeting.en}! Ready for today's adventure? 🚀`
                    : `Hai ${studentName}! ${greeting.id}! Siap untuk petualangan hari ini? 🚀`
                }
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{timeIcon}</span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  <span className={decorationData.headingClass}>
                    {greeting[lang]}, {studentName}! 👋
                  </span>
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {state.currentLesson
                    ? lang === "en"
                      ? `Continue where you left off in ${currentLessonData?.title[lang] || "your lesson"}`
                      : `Lanjutkan dari ${currentLessonData?.title[lang] || "pelajaranmu"}`
                    : lang === "en"
                      ? "Ready to start learning? Pick a lesson below!"
                      : "Siap belajar? Pilih pelajaran di bawah!"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Mission Complete Toast */}
          {showMissionComplete && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-700/30 text-center"
            >
              <p className="text-green-700 dark:text-green-300 font-bold text-lg">
                🎉 {lang === "en" ? "Mission Complete! Rewards earned! 🎉" : "Misi Selesai! Hadiah didapatkan! 🎉"}
              </p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Continue Learning Card */}
              {state.currentLesson ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${decorationData.cardStyle} rounded-2xl p-6 border overflow-hidden relative`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-2xl" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      <h3 className="font-bold text-gray-800 dark:text-gray-100">
                        {lang === "en" ? "Continue Learning" : "Lanjutkan Belajar"}
                      </h3>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl flex-shrink-0">
                        {currentLessonData?.icon || "📚"}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 dark:text-gray-100">
                          {currentLessonData?.title[lang] || state.currentLesson}
                        </h4>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {currentLessonData?.time || 10} min</span>
                          <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> +{currentLessonData?.xp || 20} XP</span>
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                          <Button
                            onClick={() => navigate(`/${state.currentLesson.replace("_", "-")}`)}
                            className={`rounded-full h-9 text-sm ${decorationData.buttonStyle} text-white`}
                          >
                            <Rocket className="w-4 h-4 mr-1" />
                            {lang === "en" ? "Resume" : "Lanjutkan"}
                          </Button>
                          <Byte mood="happy" message="" size="sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${decorationData.cardStyle} rounded-2xl p-6 border`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl">
                      🚀
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-gray-100">
                        {lang === "en" ? "Start Your First Lesson!" : "Mulai Pelajaran Pertamamu!"}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {lang === "en" ? "Begin your learning adventure today!" : "Mulai petualangan belajarmu hari ini!"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3"
              >
                {[
                  { icon: Sparkles, value: state.xp, label: { en: "XP", id: "XP" }, color: "from-yellow-400 to-amber-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
                  { icon: Trophy, value: `${state.level}`, label: { en: "Level", id: "Level" }, color: "from-blue-400 to-purple-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
                  { icon: Flame, value: `${state.streak}`, label: { en: "Streak", id: "Rantai" }, color: "from-orange-400 to-red-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
                  { icon: Heart, value: `${state.hearts}/5`, label: { en: "Hearts", id: "Hati" }, color: "from-red-400 to-pink-500", bg: "bg-red-50 dark:bg-red-900/20" },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className={`${stat.bg} rounded-2xl p-3 border border-gray-200/50 dark:border-gray-700/30`}>
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 shadow-sm`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-lg font-bold text-gray-800 dark:text-gray-100">{stat.value}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400">{stat.label[lang]}</div>
                    </div>
                  );
                })}
              </motion.div>

              {/* Level Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className={`${decorationData.cardStyle} rounded-2xl p-5 border`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {lang === "en" ? "Level Progress" : "Kemajuan Level"}
                  </span>
                  <span className="text-sm text-purple-600 font-medium">{xpProgress}/{xpToNextLevel} XP</span>
                </div>
                <Progress value={(xpProgress / xpToNextLevel) * 100} className="h-2.5 rounded-full" />
              </motion.div>

              {/* Lesson Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`${decorationData.cardStyle} rounded-2xl p-5 border`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100">
                    {lang === "en" ? "Lesson Progress" : "Kemajuan Pelajaran"}
                  </h3>
                  <span className="text-sm text-blue-600 font-medium">{state.completedLessons.length}/{lessons.length}</span>
                </div>
                <Progress value={(state.completedLessons.length / lessons.length) * 100} className="h-2 mb-4 rounded-full" />
                <div className="grid grid-cols-2 gap-2">
                  {lessons.slice(0, 4).map((lesson) => {
                    const completed = state.completedLessons.includes(lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        className={`flex items-center gap-2 p-2 rounded-xl ${
                          completed ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-800/30"
                        }`}
                      >
                        <span className="text-lg">{lesson.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium truncate ${completed ? "text-gray-800 dark:text-gray-100" : "text-gray-400"}`}>
                            {lesson.title[lang]}
                          </p>
                        </div>
                        {completed ? (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <Link to={`/${lesson.id.replace("_", "-")}`}>
                            <Button size="sm" variant="ghost" className="rounded-full text-[10px] h-6 px-2 text-purple-500">
                              +{lesson.xp}
                            </Button>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
                {lessons.length > 4 && (
                  <Link to="/dashboard" className="text-xs text-purple-500 hover:text-purple-600 mt-2 inline-block">
                    {lang === "en" ? "View all lessons →" : "Lihat semua pelajaran →"}
                  </Link>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Daily Mission */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`${decorationData.cardStyle} rounded-2xl p-5 border`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-orange-500" />
                  <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100">
                    {lang === "en" ? "Daily Mission" : "Misi Harian"}
                  </h3>
                </div>
                {dailyMission ? (
                  <div className={`p-3 rounded-xl ${dailyMission.isDone ? "bg-green-50 dark:bg-green-900/20" : "bg-orange-50 dark:bg-orange-900/20"}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{dailyMission.mission.icon}</span>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-100">{dailyMission.mission.title[lang]}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{dailyMission.mission.description[lang]}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-orange-200/50 dark:border-orange-700/30">
                      <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <span className="text-yellow-600">+{dailyMission.mission.xp} XP</span>
                        <span className="text-blue-600">+{dailyMission.mission.coins} 🪙</span>
                      </div>
                      {dailyMission.isDone ? (
                        <Badge className="bg-green-500 text-white text-[10px] h-5">
                          {lang === "en" ? "Done! 🎉" : "Selesai! 🎉"}
                        </Badge>
                      ) : (
                        <Button
                          onClick={handleCompleteMission}
                          size="sm"
                          className="rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white text-[10px] h-7 px-3"
                        >
                          {lang === "en" ? "Claim" : "Klaim"}
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center py-3">
                    {lang === "en" ? "Loading mission..." : "Memuat misi..."}
                  </p>
                )}
              </motion.div>

              {/* Weekly Challenge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className={`${decorationData.cardStyle} rounded-2xl p-5 border`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100">
                    {lang === "en" ? "Weekly Challenge" : "Tantangan Mingguan"}
                  </h3>
                </div>
                {weeklyChallenge ? (
                  <div className={`p-3 rounded-xl ${weeklyChallenge.isDone ? "bg-green-50 dark:bg-green-900/20" : "bg-yellow-50 dark:bg-yellow-900/20"}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{weeklyChallenge.challenge.icon}</span>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-100">{weeklyChallenge.challenge.title[lang]}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{weeklyChallenge.challenge.description[lang]}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-yellow-200/50 dark:border-yellow-700/30">
                      <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <span className="text-yellow-600">+{weeklyChallenge.challenge.xp} XP</span>
                        <span className="text-blue-600">+{weeklyChallenge.challenge.coins} 🪙</span>
                      </div>
                      {weeklyChallenge.isDone ? (
                        <Badge className="bg-green-500 text-white text-[10px] h-5">
                          {lang === "en" ? "Complete! 🏆" : "Selesai! 🏆"}
                        </Badge>
                      ) : (
                        <Button
                          onClick={handleCompleteChallenge}
                          size="sm"
                          className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] h-7 px-3"
                        >
                          {lang === "en" ? "Claim" : "Klaim"}
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center py-3">
                    {lang === "en" ? "Loading challenge..." : "Memuat tantangan..."}
                  </p>
                )}
              </motion.div>

              {/* Achievements Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`${decorationData.cardStyle} rounded-2xl p-5 border`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100">
                    {lang === "en" ? "Achievements" : "Pencapaian"}
                  </h3>
                </div>
                <div className="space-y-1.5">
                  {unlockedAchievements.slice(0, 3).map((a) => (
                    <div key={a.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                      <span className="text-base">{a.icon}</span>
                      <p className="text-[11px] font-medium text-yellow-800 dark:text-yellow-200">{a.title}</p>
                    </div>
                  ))}
                  {unlockedAchievements.length === 0 && (
                    <p className="text-[11px] text-gray-400 text-center py-2">
                      {lang === "en" ? "Complete lessons to unlock!" : "Selesaikan pelajaran untuk membuka!"}
                    </p>
                  )}
                </div>
                <Link to="/dashboard" className="text-[11px] text-purple-500 hover:text-purple-600 mt-2 inline-block">
                  {lang === "en" ? "View all →" : "Lihat semua →"}
                </Link>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className={`${decorationData.cardStyle} rounded-2xl p-5 border`}
              >
                <h3 className="font-bold text-sm mb-3 text-gray-800 dark:text-gray-100">
                  {lang === "en" ? "Quick Access" : "Akses Cepat"}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { to: "/sequence", icon: "📋", label: { en: "Sequence", id: "Urutan" } },
                    { to: "/algorithm", icon: "💡", label: { en: "Algorithm", id: "Algoritma" } },
                    { to: "/quiz", icon: "🧠", label: { en: "Quiz", id: "Kuis" } },
                    { to: "/dashboard", icon: "📊", label: { en: "Dashboard", id: "Dasbor" } },
                  ].map((link, i) => (
                    <Link key={i} to={link.to} onClick={playClick}>
                      <Button
                        variant="outline"
                        className="w-full justify-start rounded-xl h-10 text-xs hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <span className="mr-1.5">{link.icon}</span>
                        {link.label[lang]}
                      </Button>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LANDING — Smart Router
// ============================================================

const TeacherDashboard = lazy(() => import("./TeacherDashboard.tsx"));

export default function Landing() {
  const { isAuthenticated, currentUserProfile } = useAuth();

  if (isAuthenticated) {
    // Teachers see their dashboard instead of student home
    if (currentUserProfile?.role === "teacher") {
      return <TeacherDashboard />;
    }
    return <StudentHome />;
  }

  return <PublicLanding />;
}
