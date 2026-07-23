import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, ListOrdered, AlertTriangle, Code, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIAssistant } from "@/components/layout/AIAssistant";

const reasons = [
  {
    icon: ListOrdered,
    title: { en: "Solve Problems", id: "Memecahkan Masalah" },
    desc: { en: "Sequences help us break down big problems into small, manageable steps. Like building a LEGO tower one block at a time!", id: "Urutan membantu kita memecah masalah besar menjadi langkah-langkah kecil. Seperti membangun menara LEGO satu balok setiap kali!" },
    color: "from-blue-400 to-cyan-500",
    emoji: "🧩",
  },
  {
    icon: AlertTriangle,
    title: { en: "Reduce Mistakes", id: "Mengurangi Kesalahan" },
    desc: { en: "When we follow a sequence, we're less likely to make mistakes. It's like following a recipe - you won't forget the sugar!", id: "Saat kita mengikuti urutan, kita lebih jarang membuat kesalahan. Seperti mengikuti resep - kamu tidak akan lupa gula!" },
    color: "from-yellow-400 to-orange-500",
    emoji: "✅",
  },
  {
    icon: Heart,
    title: { en: "Daily Life", id: "Kehidupan Sehari-hari" },
    desc: { en: "We use sequences and algorithms every day! From brushing our teeth to tying our shoes - it's all about following steps in order.", id: "Kita menggunakan urutan dan algoritma setiap hari! Dari menggosok gigi hingga mengikat sepatu - semuanya tentang mengikuti langkah secara berurutan." },
    color: "from-pink-400 to-rose-500",
    emoji: "🏠",
  },
  {
    icon: Code,
    title: { en: "Programming", id: "Pemrograman" },
    desc: { en: "Computers need exact sequences (algorithms) to work. When you learn this, you're thinking like a real programmer!", id: "Komputer membutuhkan urutan yang tepat (algoritma) untuk bekerja. Saat kamu belajar ini, kamu berpikir seperti programmer sungguhan!" },
    color: "from-purple-400 to-indigo-500",
    emoji: "💻",
  },
];

const floatingEmojis = ["🌟", "🧩", "💡", "✅", "💻", "🏠", "🎯", "🚀", "💪", "🌈"];

export default function WhyImportant() {
  const { lang } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50/20 to-teal-50/20 dark:from-gray-950 dark:via-green-950/5 dark:to-teal-950/5 relative overflow-hidden">
      {/* Floating emoji decorations */}
      {floatingEmojis.map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none select-none opacity-20 dark:opacity-10"
          style={{ left: `${5 + (i * 10) % 90}%`, top: `${8 + (i * 15) % 80}%` }}
          animate={{ y: [0, -15 - i * 2, 0], rotate: [0, 8, -8, 0] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
        >
          <span className="text-2xl sm:text-3xl">{emoji}</span>
        </motion.div>
      ))}
      <Navbar />
      <AIAssistant
        type="welcome"
        message={lang === "en" ? "Let's discover why sequences and algorithms are super important in our daily lives!" : "Ayo temukan mengapa urutan dan algoritma sangat penting dalam kehidupan sehari-hari!"}
      />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                {lang === "en" ? "Why Is This Important?" : "Mengapa Ini Penting?"}
              </span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {lang === "en"
                ? "Sequences and algorithms aren't just for computers - they help us in so many ways!"
                : "Urutan dan algoritma bukan hanya untuk komputer - mereka membantu kita dalam banyak hal!"}
            </p>
          </motion.div>

          <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {reasons.map((reason, i) => {
              const Icon = reason.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/30 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 cursor-default overflow-hidden"
                >
                  {/* Glow effect on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${reason.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${reason.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-4xl mb-3">{reason.emoji}</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">{reason.title[lang]}</h3>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{reason.desc[lang]}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-8 text-white text-center shadow-xl mb-12"
          >
            <p className="text-xl font-bold">
              {lang === "en"
                ? "🌟 Learning sequences and algorithms helps you think better, solve problems faster, and understand how technology works!"
                : "🌟 Belajar urutan dan algoritma membantumu berpikir lebih baik, memecahkan masalah lebih cepat, dan memahami bagaimana teknologi bekerja!"}
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/algorithm-game">
              <Button variant="outline" className="rounded-full">{lang === "en" ? "← Back to Algorithm Game" : "← Kembali ke Game Algoritma"}</Button>
            </Link>
            <Link to="/daily-life">
              <Button size="lg" className="rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg">
                {lang === "en" ? "See Daily Life Examples" : "Lihat Contoh Sehari-hari"} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
