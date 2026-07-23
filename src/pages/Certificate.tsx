import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router";
import { Download, ArrowLeft, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGame } from "@/contexts/GameContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIAssistant } from "@/components/layout/AIAssistant";
import { downloadCertificate, type CertificateData } from "@/lib/certificate";

export default function Certificate() {
  const { lang } = useLanguage();
  const { state } = useGame();
  const location = useLocation();
  const locationState = location.state as { name?: string; score?: string } | null;

  const defaultName = locationState?.name || "";
  const defaultScore = locationState?.score || `${Math.max(...state.quizScores.map((q) => q.score), 0)}/${Math.max(...state.quizScores.map((q) => q.total), 10)}`;

  const [studentName, setStudentName] = useState(defaultName);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = () => {
    if (!studentName.trim()) return;
    setIsGenerating(true);
    const data: CertificateData = {
      studentName: studentName.trim(),
      date: new Date().toLocaleDateString(),
      course: "Sequence & Algorithm - Beginner 1",
      score: defaultScore,
    };
    downloadCertificate(data);
    setTimeout(() => setIsGenerating(false), 1000);
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString(lang === "en" ? "en-US" : "id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/20 to-yellow-50/20 dark:from-gray-950 dark:via-amber-950/5 dark:to-yellow-950/5">
      <Navbar />
      <AIAssistant
        type="celebrate"
        message={lang === "en" ? "Congratulations! You've completed the course! Claim your certificate!" : "Selamat! Kamu telah menyelesaikan kursus! Ambil sertifikatmu!"}
        autoSpeak
      />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 text-white shadow-lg mb-6">
              <Award className="w-8 h-8" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
                {lang === "en" ? "Your Certificate" : "Sertifikatmu"}
              </span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {lang === "en" ? "You've earned it! Fill in your name and download your certificate." : "Kamu telah mendapatkannya! Isi namamu dan unduh sertifikatmu."}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Certificate Preview */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Certificate Design */}
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-8 text-white text-center relative">
                <div className="absolute inset-4 border-2 border-white/20 rounded-xl pointer-events-none" />
                <div className="absolute inset-8 border border-white/10 rounded-lg pointer-events-none" />
                
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-6xl mb-4">🏆</motion.div>
                <h2 className="text-3xl font-bold mb-2">{lang === "en" ? "Certificate of" : "Sertifikat"}<br />{lang === "en" ? "Completion" : "Penyelesaian"}</h2>
                <p className="text-sm opacity-80 mt-2">{lang === "en" ? "This certificate is proudly awarded to" : "Sertifikat ini dengan bangga diberikan kepada"}</p>
                
                <div className="my-4 py-2 px-6 bg-white/10 rounded-lg backdrop-blur-sm">
                  <p className="text-2xl font-bold">{studentName || (lang === "en" ? "Your Name" : "Nama Kamu")}</p>
                </div>
                
                <p className="text-sm opacity-80">{lang === "en" ? "For completing" : "Untuk menyelesaikan"}</p>
                <h3 className="text-xl font-bold mt-1">Sequence & Algorithm<br />(Beginner 1 - Meeting 2)</h3>
                <p className="text-sm opacity-80 mt-1">{lang === "en" ? "with a score of" : "dengan skor"} {defaultScore}</p>
                
                <div className="flex justify-between mt-6 text-xs opacity-70 px-4">
                  <span>{lang === "en" ? "Date: " : "Tanggal: "}{dateStr}</span>
                  <span>Code Quest Kids</span>
                </div>
              </div>
            </motion.div>

            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30"
            >
              <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">
                {lang === "en" ? "Generate Your Certificate" : "Buat Sertifikatmu"}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">{lang === "en" ? "Your Name" : "Nama Kamu"}</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder={lang === "en" ? "Enter your full name" : "Masukkan nama lengkap"}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500 mb-1 block">{lang === "en" ? "Course" : "Kursus"}</label>
                  <div className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                    Sequence & Algorithm (Beginner 1 - Meeting 2)
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500 mb-1 block">{lang === "en" ? "Score" : "Skor"}</label>
                  <div className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-sm font-semibold text-blue-600 border border-gray-200 dark:border-gray-700">
                    {defaultScore}
                  </div>
                </div>

                <Button
                  onClick={handleDownload}
                  disabled={!studentName.trim() || isGenerating}
                  className="w-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white h-12 shadow-lg disabled:opacity-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isGenerating ? (lang === "en" ? "Generating..." : "Membuat...") : (lang === "en" ? "Download Certificate (PNG)" : "Unduh Sertifikat (PNG)")}
                </Button>

                <p className="text-xs text-gray-400 text-center">
                  {lang === "en" ? "Your certificate will be downloaded as a PNG image." : "Sertifikatmu akan diunduh sebagai gambar PNG."}
                </p>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-8">
            <Link to="/dashboard">
              <Button variant="outline" className="rounded-full">
                <ArrowLeft className="w-4 h-4 mr-2" /> {lang === "en" ? "Back to Dashboard" : "Kembali ke Dasbor"}
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
