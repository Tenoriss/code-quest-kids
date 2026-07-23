export interface Lesson {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  xpReward: number;
  icon: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface GameState {
  xp: number;
  level: number;
  hearts: number;
  streak: number;
  lastVisit: string | null;
  completedLessons: string[];
  achievements: string[];
  quizScores: { date: string; score: number; total: number }[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface Student {
  id: string;
  name: string;
  xp: number;
  level: number;
  streak: number;
  completedLessons: string[];
  quizScores: { score: number; total: number; date: string }[];
  lastActive: string;
}

export type ThemeMode = "light" | "dark" | "kids";
export type Language = "en" | "id";

export interface DailyLifeExample {
  title: string;
  steps: string[];
  emoji: string;
}

export interface DragItem {
  id: string;
  text: string;
  emoji: string;
}
