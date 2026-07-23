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
  learningTime: number;
  currentLesson: string;
  coins: number;
  dailyRewardClaimed: string | null;
  dailyMissionDate: string | null;
  dailyMissionId: string | null;
  dailyMissionDone: boolean;
  weeklyChallengeWeek: number | null;
  weeklyChallengeId: string | null;
  weeklyChallengeDone: boolean;
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

export interface UserProfile {
  fullName: string;
  nickname: string;
  email: string;
  password: string;
  role?: "student" | "teacher";
  birthday: string;
  grade: string;
  country: string;
  avatarUrl: string;
  favoriteColor: string;
  favoriteCharacter: string;
  bio: string;
  avatarFrame: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: string | null;
  users: Record<string, UserProfile>;
}

export interface CollectionItem {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  unlockedAt: string | null;
  type: "badge" | "frame" | "theme" | "sticker" | "accessory";
}

export interface DailyReward {
  day: number;
  xp: number;
  item: string;
  icon: string;
  claimed: boolean;
}

export type ThemeMode = "light" | "dark" | "kids" | "candy" | "space" | "ocean" | "rainbow";

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

export interface DailyMission {
  id: string;
  title: { en: string; id: string };
  description: { en: string; id: string };
  xp: number;
  coins: number;
  icon: string;
}

export interface WeeklyChallenge {
  id: string;
  title: { en: string; id: string };
  description: { en: string; id: string };
  xp: number;
  coins: number;
  icon: string;
}

export interface ThemeRobotData {
  bodyGradient: string;
  eyeColor: string;
  antennaColor: string;
  glowColor: string;
  shadowColor: string;
  mouthColor: string;
  accentColor: string;
  earColor: string;
  bgColor: string;
  bubbleBg: string;
  bubbleText: string;
  bubbleBorder: string;
  emoji: string;
  decoration: string;
}

export interface ThemeDecorationData {
  bgClass: string;
  floatingEmojis: string[];
  particles: string;
  cardStyle: string;
  buttonStyle: string;
  headingClass: string;
  badgeClass: string;
}
