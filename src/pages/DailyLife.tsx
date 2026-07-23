import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIAssistant } from "@/components/layout/AIAssistant";

const examples = [
  {
    emoji: "🪥",
    title: { en: "Brush Your Teeth", id: "Gosok Gigi" },
    steps: [
      { en: "Wet your toothbrush", id: "Basahi sikat gigi" },
      { en: "Put toothpaste on brush", id: "Letakkan pasta gigi" },
      { en: "Brush all your teeth", id: "Gosok semua gigi" },
      { en: "Spit out the toothpaste", id: "Buang busanya" },
      { en: "Rinse your mouth", id: "Bilas mulutmu" },
      { en: "Smile! 😁", id: "Senyum! 😁" },
    ],
    color: "from-blue-400 to-cyan-500",
  },
  {
    emoji: "🧼",
    title: { en: "Wash Your Hands", id: "Cuci Tangan" },
    steps: [
      { en: "Wet your hands", id: "Basahi tangan" },
      { en: "Apply soap", id: "Gunakan sabun" },
      { en: "Scrub for 20 seconds", id: "Gosok selama 20 detik" },
      { en: "Rinse with water", id: "Bilas dengan air" },
      { en: "Dry with a towel", id: "Keringkan dengan handuk" },
      { en: "Clean hands! ✨", id: "Tangan bersih! ✨" },
    ],
    color: "from-teal-400 to-emerald-500",
  },
  {
    emoji: "🫖",
    title: { en: "Make a Cup of Tea", id: "Membuat Secangkir Teh" },
    steps: [
      { en: "Boil water", id: "Rebus air" },
      { en: "Put tea bag in cup", id: "Masukkan kantong teh" },
      { en: "Pour hot water", id: "Tuang air panas" },
      { en: "Wait 3 minutes", id: "Tunggu 3 menit" },
      { en: "Remove tea bag", id: "Angkat kantong teh" },
      { en: "Add sugar & enjoy! ☕", id: "Tambahkan gula & nikmati! ☕" },
    ],
    color: "from-amber-400 to-orange-500",
  },
  {
    emoji: "🏫",
    title: { en: "Getting Ready for School", id: "Persiapan ke Sekolah" },
    steps: [
      { en: "Wake up", id: "Bangun tidur" },
      { en: "Take a bath", id: "Mandi" },
      { en: "Get dressed", id: "Pakai seragam" },
      { en: "Eat breakfast", id: "Sarapan" },
      { en: "Pack your bag", id: "Siapkan tas" },
      { en: "Go to school! 🎒", id: "Berangkat sekolah! 🎒" },
    ],
    color: "from-purple-400 to-pink-500",
  },
  {
    emoji: "🍪",
    title: { en: "Baking Cookies", id: "Membuat Kue" },
    steps: [
      { en: "Mix flour and sugar", id: "Campur tepung dan gula" },
      { en: "Add butter and eggs", id: "Tambahkan mentega dan telur" },
      { en: "Knead the dough", id: "Uleni adonan" },
      { en: "Shape into circles", id: "Bentuk menjadi bulat" },
      { en: "Bake in the oven", id: "Panggang di oven" },
      { en: "Enjoy warm cookies! 🍪", id: "Nikmati kue hangat! 🍪" },
    ],
    color: "from-yellow-400 to-red-500",
  },
  {
    emoji: "🌱",
    title: { en: "Plant a Seed", id: "Menanam Biji" },
    steps: [
      { en: "Dig a small hole", id: "Gali lubang kecil" },
      { en: "Put the seed in", id: "Masukkan bijinya" },
      { en: "Cover with soil", id: "Tutup dengan tanah" },
      { en: "Water the seed", id: "Siram bijinya" },
      { en: "Place in sunlight", id: "Letakkan di sinar matahari" },
      { en: "Watch it grow! 🌻", id: "Lihat tumbuh! 🌻" },
    ],
    color: "from-green-400 to-emerald-500",
  },
];

export default function DailyLife() {
  const { lang } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/20 to-orange-50/20 dark:from-gray-950 dark:via-amber-950/5 dark:to-orange-950/5">
      <Navbar />
      <AIAssistant
        type="welcome"
        message={lang === "en" ? "Sequences and algorithms are everywhere! Look at all these daily activities that follow a sequence!" : "Urutan dan algoritma ada di mana-mana! Lihat semua aktivitas sehari-hari yang mengikuti urutan!"}
        autoSpeak
      />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                {lang === "en" ? "Daily Life Examples" : "Contoh Sehari-hari"}
              </span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {lang === "en"
                ? "You use sequences and algorithms every day without even knowing it! Here are some examples:"
                : "Kamu menggunakan urutan dan algoritma setiap hari tanpa sadar! Berikut beberapa contohnya:"}
            </p>
          </motion.div>

          <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examples.map((example, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="group bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/30 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${example.color} p-4 text-white`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{example.emoji}</span>
                    <h3 className="font-bold text-lg">{example.title[lang]}</h3>
                  </div>
                </div>

                {/* Steps */}
                <div className="p-4 space-y-1">
                  {example.steps.map((step, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: i * 0.1 + j * 0.05 }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br ${example.color} shrink-0`}>
                        {j + 1}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{step[lang]}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {lang === "en"
                ? "See? Everything we do follows a sequence! Now you understand why order matters."
                : "Lihat? Semua yang kita lakukan mengikuti urutan! Sekarang kamu mengerti mengapa urutan itu penting."}
            </p>
            <Link to="/practice">
              <Button size="lg" className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                {lang === "en" ? "Practice Time!" : "Waktunya Latihan!"} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
