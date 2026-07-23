import { useRef, useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Brain, ListOrdered, GitBranch, Trophy, Star, Zap, Code, Rocket, BookOpen, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/layout/Navbar";

const floatingIcons = [
  { Icon: Code, x: "10%", y: "20%", delay: 0, size: 24, color: "text-blue-400" },
  { Icon: Sparkles, x: "85%", y: "15%", delay: 0.5, size: 20, color: "text-yellow-400" },
  { Icon: Brain, x: "15%", y: "70%", delay: 1, size: 28, color: "text-purple-400" },
  { Icon: Star, x: "80%", y: "75%", delay: 1.5, size: 22, color: "text-pink-400" },
  { Icon: Zap, x: "90%", y: "40%", delay: 0.8, size: 18, color: "text-orange-400" },
  { Icon: Trophy, x: "5%", y: "50%", delay: 1.2, size: 26, color: "text-amber-400" },
  { Icon: Rocket, x: "70%", y: "85%", delay: 0.3, size: 20, color: "text-cyan-400" },
  { Icon: BookOpen, x: "92%", y: "60%", delay: 0.7, size: 22, color: "text-emerald-400" },
];

const features = [
  { icon: ListOrdered, title: { en: "Learn Sequences", id: "Belajar Urutan" }, desc: { en: "Understand the correct order of steps to complete any task!", id: "Pahami urutan langkah yang benar untuk menyelesaikan tugas!" }, color: "from-blue-400 to-cyan-500" },
  { icon: GitBranch, title: { en: "Master Algorithms", id: "Kuasai Algoritma" }, desc: { en: "Discover how step-by-step instructions solve problems!", id: "Temukan bagaimana petunjuk langkah demi langkah memecahkan masalah!" }, color: "from-purple-400 to-pink-500" },
  { icon: Brain, title: { en: "Think Logically", id: "Berpikir Logis" }, desc: { en: "Build critical thinking skills through fun puzzles!", id: "Bangun keterampilan berpikir kritis melalui teka-teki seru!" }, color: "from-green-400 to-teal-500" },
  { icon: Trophy, title: { en: "Earn Rewards", id: "Dapatkan Hadiah" }, desc: { en: "Collect XP, hearts, and achievements as you learn!", id: "Kumpulkan XP, hati, dan pencapaian saat belajar!" }, color: "from-yellow-400 to-orange-500" },
];

const stats = [
  { number: "4", label: { en: "Interactive Lessons", id: "Pelajaran Interaktif" } },
  { number: "10+", label: { en: "Fun Activities", id: "Aktivitas Seru" } },
  { number: "100+", label: { en: "XP to Earn", id: "XP untuk Dikumpulkan" } },
  { number: "🎯", label: { en: "Beginner Friendly", id: "Ramah Pemula" } },
];

export default function Landing() {
  const { t, lang } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const [mascotMood, setMascotMood] = useState<"wave" | "happy" | "excited">("wave");

  useEffect(() => {
    const moods: Array<"wave" | "happy" | "excited"> = ["wave", "happy", "excited"];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % moods.length;
      setMascotMood(moods[i]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-blue-950/10 dark:to-purple-950/10">
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Floating icons */}
        {floatingIcons.map(({ Icon, x, y, delay, size, color }, i) => (
          <motion.div
            key={i}
            className={`absolute ${color} opacity-20 dark:opacity-30 pointer-events-none`}
            style={{ left: x, top: y }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              delay,
              ease: "easeInOut",
            }}
          >
            <Icon size={size} />
          </motion.div>
        ))}

        {/* Background gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Mascot */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-8xl mb-6 cursor-pointer"
            onClick={() => setMascotMood("excited")}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={mascotMood}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                {mascotMood === "wave" ? "👋" : mascotMood === "happy" ? "😊" : "🤩"}
              </motion.span>
            </AnimatePresence>
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
              ? "Learn about sequences and algorithms through fun, interactive games and lessons. No coding experience needed!"
              : "Pelajari tentang urutan dan algoritma melalui game dan pelajaran interaktif yang menyenangkan. Tanpa perlu pengalaman coding!"}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/sequence">
              <Button size="lg" className="h-14 px-8 text-base rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300">
                <Rocket className="w-5 h-5 mr-2" />
                {t("start.learning")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/quiz">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-2 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300">
                <Brain className="w-5 h-5 mr-2" />
                {t("take.quiz")}
              </Button>
            </Link>
          </motion.div>

          {/* Stats row */}
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
                className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/30"
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
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="w-6 h-6 text-gray-300 dark:text-gray-600 mx-auto" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
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
                  animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
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
            transition={{ duration: 0.6 }}
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
                ? "Join thousands of young learners discovering the magic of coding!"
                : "Bergabunglah dengan ribuan pelajar muda yang menemukan keajaiban coding!"}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/sequence">
                <Button size="lg" className="h-14 px-10 text-base rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25">
                  <Sparkles className="w-5 h-5 mr-2" />
                  {t("start.learning")}
                </Button>
              </Link>
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
