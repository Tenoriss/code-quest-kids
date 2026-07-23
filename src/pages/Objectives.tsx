import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, Target, ListOrdered, GitBranch, Search, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useT } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIAssistant } from "@/components/layout/AIAssistant";

const objectives = [
  {
    icon: ListOrdered,
    title: { en: "Understand Sequence", id: "Memahami Urutan" },
    desc: { en: "Learn that a sequence is the correct order of steps to complete a task. Every task we do follows a sequence!", id: "Pelajari bahwa urutan adalah langkah-langkah yang benar untuk menyelesaikan tugas. Setiap tugas yang kita lakukan mengikuti urutan!" },
    color: "from-blue-400 to-cyan-500",
    emoji: "📋",
  },
  {
    icon: GitBranch,
    title: { en: "Understand Algorithm", id: "Memahami Algoritma" },
    desc: { en: "Discover how algorithms are step-by-step instructions used to solve problems, just like a recipe!", id: "Temukan bagaimana algoritma adalah petunjuk langkah demi langkah untuk memecahkan masalah, seperti resep!" },
    color: "from-purple-400 to-pink-500",
    emoji: "💡",
  },
  {
    icon: Search,
    title: { en: "Identify Examples", id: "Mengidentifikasi Contoh" },
    desc: { en: "Find sequences and algorithms in everyday activities like brushing teeth, making tea, or going to school!", id: "Temukan urutan dan algoritma dalam aktivitas sehari-hari seperti menggosok gigi, membuat teh, atau pergi ke sekolah!" },
    color: "from-green-400 to-teal-500",
    emoji: "🔍",
  },
  {
    icon: Brain,
    title: { en: "Build Logical Thinking", id: "Membangun Pemikiran Logis" },
    desc: { en: "Develop your logical thinking skills through fun puzzles, games, and step-by-step problem solving!", id: "Kembangkan keterampilan berpikir logis melalui teka-teki seru, permainan, dan pemecahan masalah langkah demi langkah!" },
    color: "from-yellow-400 to-orange-500",
    emoji: "🧠",
  },
];

export default function Objectives() {
  const { lang } = useLanguage();
  const t = useT();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20 dark:from-gray-950 dark:via-blue-950/5 dark:to-purple-950/5">
      <Navbar />
      <AIAssistant
        type="welcome"
        message={lang === "en" ? "Let's see what you'll learn today! These are our learning goals." : "Ayo lihat apa yang akan kamu pelajari hari ini! Ini adalah tujuan belajar kita."}
      />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg mb-6">
              <Target className="w-8 h-8" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {lang === "en" ? "Learning Objectives" : "Tujuan Pembelajaran"}
              </span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {lang === "en"
                ? "By the end of this lesson, you will be able to do all of these amazing things!"
                : "Di akhir pelajaran ini, kamu akan bisa melakukan semua hal menakjubkan ini!"}
            </p>
          </motion.div>

          {/* Objectives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {objectives.map((obj, i) => {
              const Icon = obj.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30 hover:shadow-xl transition-all duration-300 cursor-default"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${obj.color} flex items-center justify-center shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl mb-1">{obj.emoji}</div>
                      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">{obj.title[lang as keyof typeof obj.title]}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{obj.desc[lang as keyof typeof obj.desc]}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/sequence">
              <Button size="lg" className="h-14 px-8 text-base rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg">
                {lang === "en" ? "Start Lesson: Sequence" : "Mulai Pelajaran: Urutan"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full">
                {t("back")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
