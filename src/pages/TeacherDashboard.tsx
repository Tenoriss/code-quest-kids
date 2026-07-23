import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Users, TrendingUp, Award, Calendar, BarChart3, ArrowLeft, BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGame } from "@/contexts/GameContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIAssistant } from "@/components/layout/AIAssistant";

const mockStudents = [
  { name: { en: "Alice", id: "Alice" }, xp: 450, level: 5, completed: 6, streak: 12, avgScore: 95 },
  { name: { en: "Bob", id: "Bob" }, xp: 320, level: 4, completed: 5, streak: 8, avgScore: 82 },
  { name: { en: "Charlie", id: "Charlie" }, xp: 280, level: 3, completed: 4, streak: 5, avgScore: 78 },
  { name: { en: "Diana", id: "Diana" }, xp: 200, level: 2, completed: 3, streak: 3, avgScore: 70 },
  { name: { en: "Ethan", id: "Ethan" }, xp: 150, level: 2, completed: 2, streak: 1, avgScore: 65 },
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function TeacherDashboard() {
  const { lang } = useLanguage();
  const { state } = useGame();
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  const totalStudents = mockStudents.length;
  const avgXP = Math.round(mockStudents.reduce((s, st) => s + st.xp, 0) / totalStudents);
  const avgScore = Math.round(mockStudents.reduce((s, st) => s + st.avgScore, 0) / totalStudents);
  const totalCompleted = mockStudents.reduce((s, st) => s + st.completed, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/20 to-teal-50/20 dark:from-gray-950 dark:via-emerald-950/5 dark:to-teal-950/5">
      <Navbar />
      <AIAssistant
        type="welcome"
        message={lang === "en" ? "Welcome to the Teacher Dashboard! Track your students' progress here." : "Selamat datang di Dasbor Guru! Lacak kemajuan siswa di sini."}
        autoSpeak
      />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                {lang === "en" ? "Teacher Dashboard" : "Dasbor Guru"}
              </span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400">{lang === "en" ? "Monitor student progress, quiz scores, and class analytics." : "Pantau kemajuan siswa, skor kuis, dan analitik kelas."}</p>
          </motion.div>

          {/* Overview Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, value: totalStudents, label: { en: "Total Students", id: "Total Siswa" }, color: "from-blue-400 to-cyan-500" },
              { icon: TrendingUp, value: avgXP, label: { en: "Avg XP", id: "Rata-rata XP" }, color: "from-green-400 to-emerald-500" },
              { icon: Award, value: `${avgScore}%`, label: { en: "Avg Score", id: "Rata-rata Skor" }, color: "from-purple-400 to-pink-500" },
              { icon: BookOpen, value: totalCompleted, label: { en: "Lessons Done", id: "Pelajaran Selesai" }, color: "from-yellow-400 to-orange-500" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/30"
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
            {/* Student List */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30"
              >
                <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">{lang === "en" ? "Students" : "Siswa"}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-2 text-gray-500 font-medium">{lang === "en" ? "Name" : "Nama"}</th>
                        <th className="text-center py-3 px-2 text-gray-500 font-medium">XP</th>
                        <th className="text-center py-3 px-2 text-gray-500 font-medium">{lang === "en" ? "Level" : "Level"}</th>
                        <th className="text-center py-3 px-2 text-gray-500 font-medium">{lang === "en" ? "Lessons" : "Pelajaran"}</th>
                        <th className="text-center py-3 px-2 text-gray-500 font-medium">{lang === "en" ? "Streak" : "Rantai"}</th>
                        <th className="text-center py-3 px-2 text-gray-500 font-medium">{lang === "en" ? "Score" : "Skor"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockStudents.map((student, i) => (
                        <motion.tr
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors ${
                            selectedStudent === i ? "bg-blue-50 dark:bg-blue-900/20" : ""
                          }`}
                          onClick={() => setSelectedStudent(selectedStudent === i ? null : i)}
                        >
                          <td className="py-3 px-2 font-medium text-gray-800 dark:text-gray-100">{student.name[lang]}</td>
                          <td className="py-3 px-2 text-center">{student.xp}</td>
                          <td className="py-3 px-2 text-center">{student.level}</td>
                          <td className="py-3 px-2 text-center">{student.completed}</td>
                          <td className="py-3 px-2 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              student.streak >= 10 ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600" : "bg-gray-100 dark:bg-gray-700 text-gray-500"
                            }`}>
                              {student.streak}🔥
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className={`font-medium ${student.avgScore >= 80 ? "text-green-500" : student.avgScore >= 60 ? "text-yellow-500" : "text-red-500"}`}>
                              {student.avgScore}%
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Attendance Mockup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-gray-800 dark:text-gray-100">{lang === "en" ? "Weekly Attendance" : "Kehadiran Mingguan"}</h3>
                </div>
                <div className="flex items-end justify-between gap-2 h-32">
                  {weekDays.map((day, i) => {
                    const attendance = [85, 90, 78, 95, 88, 60, 45][i];
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-xs text-gray-400">{attendance}%</span>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${attendance * 1.2}px` }}
                          className={`w-full rounded-lg bg-gradient-to-t from-blue-400 to-purple-400 max-h-28`}
                          style={{ minHeight: 20 }}
                        />
                        <span className="text-xs text-gray-500">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Student Detail */}
              {selectedStudent !== null && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30"
                >
                  <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">{mockStudents[selectedStudent].name[lang]}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">XP</span>
                      <span className="font-bold">{mockStudents[selectedStudent].xp}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{lang === "en" ? "Level" : "Level"}</span>
                      <span className="font-bold">{mockStudents[selectedStudent].level}</span>
                    </div>
                    <Progress value={((mockStudents[selectedStudent].xp % 100) / 100) * 100} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{lang === "en" ? "Streak" : "Rantai"}</span>
                      <span className="font-bold text-orange-500">{mockStudents[selectedStudent].streak}🔥</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{lang === "en" ? "Avg Score" : "Rata-rata Skor"}</span>
                      <span className="font-bold text-green-500">{mockStudents[selectedStudent].avgScore}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{lang === "en" ? "Completed" : "Selesai"}</span>
                      <span className="font-bold">{mockStudents[selectedStudent].completed}/6</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30"
              >
                <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-100">{lang === "en" ? "Actions" : "Aksi"}</h3>
                <div className="space-y-2">
                  <Link to="/quiz"><Button variant="outline" className="w-full justify-start rounded-xl"><BarChart3 className="w-4 h-4 mr-2" />{lang === "en" ? "View Quiz Results" : "Lihat Hasil Kuis"}</Button></Link>
                  <Link to="/certificate"><Button variant="outline" className="w-full justify-start rounded-xl"><Award className="w-4 h-4 mr-2" />{lang === "en" ? "Certificates" : "Sertifikat"}</Button></Link>
                  <Link to="/"><Button variant="outline" className="w-full justify-start rounded-xl"><ArrowLeft className="w-4 h-4 mr-2" />{lang === "en" ? "Back to Home" : "Kembali ke Beranda"}</Button></Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
