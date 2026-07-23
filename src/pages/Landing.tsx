import { useRef, useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Brain, ListOrdered, GitBranch, Trophy, Rocket, ChevronDown, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSound } from "@/contexts/SoundContext";
import { Navbar } from "@/components/layout/Navbar";
import { Byte } from "@/components/layout/Byte";
import { fireConfetti } from "@/lib/confetti";

const floatingDecorations = [
  { emoji: "⭐", x: "5%", y: "15%", size: 24, delay: 0 },
  { emoji: "🚀", x: "90%", y: "10%", size: 28, delay: 0.5 },
  { emoji: "🌈", x: "80%", y: "80%", size: 22, delay: 1 },
  { emoji: "💻", x: "10%", y: "70%", size: 20, delay: 1.5 },
  { emoji: "🧩", x: "95%", y: "50%", size: 18, delay: 0.8 },
  { emoji: "🎨", x: "15%", y: "40%", size: 20, delay: 1.2 },
  { emoji: "🎵", x: "85%", y: "30%", size: 16, delay: 0.3 },
  { emoji: "🎮", x: "3%", y: "85%", size: 22, delay: 0.7 },
  { emoji: "📚", x: "70%", y: "5%", size: 18, delay: 1.1 },
  { emoji: "✨", x: "50%", y: "90%", size: 14, delay: 0.4 },
];

const floatingCode = [
  { text: "<html>", x: "20%", y: "25%", delay: 0, size: 12 },
  { text: "</div>", x: "75%", y: "60%", delay: 0.8, size: 10 },
  { text: "{}", x: "8%", y: "55%", delay: 1.5, size: 16 },
  { text: "if()", x: "92%", y: "40%", delay: 0.3, size: 12 },
  { text: "0101", x: "82%", y: "20%", delay: 1.2, size: 10 },
  { text: "def", x: "25%", y: "80%", delay: 0.6, size: 12 },
  { text: "npm", x: "68%", y: "88%", delay: 1.8, size: 10 },
  { text: "print", x: "35%", y: "10%", delay: 2, size: 11 },
];

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

export default function Landing() {
  const { t, lang } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { playClick } = useSound();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const [mascotMood, setMascotMood] = useState<"wave" | "happy" | "excited" | "celebrate">("wave");
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  // Stable random values for binary animation — computed once, not on every render
  const binaryPositions = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        left: `${i * 5}%`,
        top: `${Math.random() * 100}%`,
        digits: Array.from({ length: 10 }, () => (Math.random() > 0.5 ? "1" : "0")).join(""),
      })),
    []
  );

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

  const handleStartLearning = () => {
    playClick();
    if (isAuthenticated) navigate("/sequence");
    else navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 via-purple-50/20 to-pink-50/20 dark:from-gray-950 dark:via-blue-950/10 dark:via-purple-950/5 dark:to-pink-950/10 overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Gradient Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-purple-100/30 dark:from-blue-900/20 dark:via-transparent dark:to-purple-900/20" />

          {/* Glow orbs */}
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
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-yellow-300/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-pink-300/10 rounded-full blur-3xl" />

          {/* Floating Decorations */}
          {floatingDecorations.map((item, i) => (
            <motion.div
              key={i}
              className="absolute pointer-events-none"
              style={{ left: item.x, top: item.y }}
              animate={{
                y: [0, -20 - i * 3, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 5 + i * 0.5,
                repeat: Infinity,
                delay: item.delay,
                ease: "easeInOut",
              }}
            >
              <span className="text-xl sm:text-2xl" style={{ fontSize: item.size }}>
                {item.emoji}
              </span>
            </motion.div>
          ))}

          {/* Floating Code Snippets */}
          {floatingCode.map((item, i) => (
            <motion.div
              key={i}
              className="absolute pointer-events-none font-mono"
              style={{ left: item.x, top: item.y }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.15, 0.3, 0.15],
              }}
              transition={{
                duration: 6 + i * 0.4,
                repeat: Infinity,
                delay: item.delay,
                ease: "easeInOut",
              }}
            >
              <span
                className="text-blue-300 dark:text-blue-500/30 font-semibold"
                style={{ fontSize: item.size }}
              >
                {item.text}
              </span>
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
          {/* Byte Robot */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mb-6 inline-block"
          >
            <Byte mood={mascotMood} position="inline" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-4"
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {lang === "en" ? "Code Quest" : "Petualangan Kode"}
            </span>
            <br />
            <span className="text-gray-800 dark:text-gray-100">
              {lang === "en" ? "For Young Minds" : "Untuk Pikiran Muda"}
            </span>
          </motion.h1>

          {/* Subtitle */}
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

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={handleStartLearning}
              size="lg"
              className="h-14 px-8 text-base rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
            >
              <Rocket className="w-5 h-5 mr-2" />
              {isAuthenticated ? (lang === "en" ? "Continue Learning" : "Lanjut Belajar") : (lang === "en" ? "Get Started Free" : "Mulai Gratis")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Link to="/quiz">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base rounded-full border-2 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300"
              >
                <Brain className="w-5 h-5 mr-2" />
                {t("take.quiz")}
              </Button>
            </Link>
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
                className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/30 hover:shadow-lg transition-all"
              >
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">{stat.number}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label[lang as keyof typeof stat.label]}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
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
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                  className="group relative bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 cursor-default"
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

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl p-12 border border-gray-200/50 dark:border-gray-700/30 shadow-2xl"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-6xl mb-6"
            >
              🚀
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {lang === "en" ? "Ready to Start Your Adventure?" : "Siap Memulai Petualanganmu?"}
              </span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto">
              {lang === "en"
                ? "Join thousands of young learners discovering the magic of coding with Byte the robot!"
                : "Bergabunglah dengan ribuan pelajar muda yang menemukan keajaiban coding bersama Byte si robot!"}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={handleStartLearning}
                size="lg"
                className="h-14 px-10 text-base rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {isAuthenticated ? (lang === "en" ? "Continue Learning" : "Lanjut Belajar") : (lang === "en" ? "Start Free" : "Mulai Gratis")}
              </Button>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="h-14 px-10 text-base rounded-full border-2">
                  <Trophy className="w-5 h-5 mr-2" />
                  {t("student.dashboard")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
