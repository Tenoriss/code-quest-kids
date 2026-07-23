import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Language } from "@/types";

interface Translations {
  [key: string]: { en: string; id: string };
}

const TRANSLATIONS: Translations = {
  "app.title": { en: "Code Quest Kids", id: "Petualangan Kode" },
  "app.tagline": { en: "Learn to Code with Fun!", id: "Belajar Coding dengan Seru!" },
  "nav.home": { en: "Home", id: "Beranda" },
  "nav.objectives": { en: "Objectives", id: "Tujuan" },
  "nav.sequence": { en: "Sequence", id: "Urutan" },
  "nav.algorithm": { en: "Algorithm", id: "Algoritma" },
  "nav.quiz": { en: "Quiz", id: "Kuis" },
  "nav.dashboard": { en: "Dashboard", id: "Dasbor" },
  "start.learning": { en: "Start Learning", id: "Mulai Belajar" },
  "take.quiz": { en: "Take Quiz", id: "Ikuti Kuis" },
  "correct": { en: "Correct! 🎉", id: "Benar! 🎉" },
  "incorrect": { en: "Not quite! Try again! 💪", id: "Belum tepat! Coba lagi! 💪" },
  "next": { en: "Next", id: "Lanjut" },
  "back": { en: "Back", id: "Kembali" },
  "complete": { en: "Complete!", id: "Selesai!" },
  "congratulations": { en: "Congratulations!", id: "Selamat!" },
  "score": { en: "Score", id: "Skor" },
  "time": { en: "Time", id: "Waktu" },
  "xp": { en: "XP", id: "XP" },
  "level": { en: "Level", id: "Level" },
  "hearts": { en: "Hearts", id: "Hati" },
  "streak": { en: "Streak", id: "Rantai" },
  "achievements": { en: "Achievements", id: "Pencapaian" },
  "progress": { en: "Progress", id: "Kemajuan" },
  "teacher.dashboard": { en: "Teacher Dashboard", id: "Dasbor Guru" },
  "student.dashboard": { en: "Student Dashboard", id: "Dasbor Siswa" },
  "certificate": { en: "Certificate", id: "Sertifikat" },
  "drag.hint": { en: "Drag and drop the steps in the correct order!", id: "Seret dan letakkan langkah-langkah sesuai urutan!" },
  "replay": { en: "Replay", id: "Ulangi" },
  "hint": { en: "Need a hint?", id: "Butuh petunjuk?" },
  "speak": { en: "Listen", id: "Dengar" },
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useLocalStorage<Language>("codequest_lang", "en");

  const t = (key: string): string => {
    const translation = TRANSLATIONS[key];
    if (!translation) return key;
    return translation[lang];
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}

export function useT() {
  const { t } = useLanguage();
  return t;
}
