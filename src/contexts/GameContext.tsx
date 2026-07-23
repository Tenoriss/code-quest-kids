import { createContext, useContext, useCallback, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { GameState, Achievement } from "@/types";

const INITIAL_STATE: GameState = {
  xp: 0,
  level: 1,
  hearts: 5,
  streak: 0,
  lastVisit: null,
  completedLessons: [],
  achievements: [],
  quizScores: [],
};

const XP_PER_LEVEL = 100;

const ACHIEVEMENTS: Achievement[] = [
  { id: "first_lesson", title: "First Steps", description: "Complete your first lesson", icon: "🎯", unlocked: false },
  { id: "five_lessons", title: "Eager Learner", description: "Complete 5 lessons", icon: "📚", unlocked: false },
  { id: "perfect_quiz", title: "Quiz Master", description: "Get 100% on a quiz", icon: "🏆", unlocked: false },
  { id: "ten_streak", title: "On Fire!", description: "10-day learning streak", icon: "🔥", unlocked: false },
  { id: "sequence_master", title: "Sequence Master", description: "Complete the sequence game", icon: "⭐", unlocked: false },
  { id: "algorithm_whiz", title: "Algorithm Whiz", description: "Complete the algorithm game", icon: "💡", unlocked: false },
];

interface GameContextType {
  state: GameState;
  addXP: (amount: number) => void;
  loseHeart: () => void;
  completeLesson: (lessonId: string) => void;
  addQuizScore: (score: number, total: number) => void;
  checkAchievements: () => string[];
  achievements: Achievement[];
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useLocalStorage<GameState>("codequest_game", INITIAL_STATE);

  const addXP = useCallback(
    (amount: number) => {
      setState((prev) => {
        const newXP = prev.xp + amount;
        const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
        return { ...prev, xp: newXP, level: newLevel };
      });
    },
    [setState]
  );

  const loseHeart = useCallback(() => {
    setState((prev) => ({ ...prev, hearts: Math.max(0, prev.hearts - 1) }));
  }, [setState]);

  const completeLesson = useCallback(
    (lessonId: string) => {
      setState((prev) => {
        if (prev.completedLessons.includes(lessonId)) return prev;
        return {
          ...prev,
          completedLessons: [...prev.completedLessons, lessonId],
          streak: updateStreak(prev.streak, prev.lastVisit),
          lastVisit: new Date().toISOString(),
        };
      });
    },
    [setState]
  );

  const addQuizScore = useCallback(
    (score: number, total: number) => {
      setState((prev) => ({
        ...prev,
        quizScores: [...prev.quizScores, { date: new Date().toISOString(), score, total }],
      }));
    },
    [setState]
  );

  const checkAchievements = useCallback((): string[] => {
    const unlocked: string[] = [];
    const newAchievements = [...state.achievements];

    if (state.completedLessons.length >= 1 && !newAchievements.includes("first_lesson")) {
      newAchievements.push("first_lesson");
      unlocked.push("first_lesson");
    }
    if (state.completedLessons.length >= 5 && !newAchievements.includes("five_lessons")) {
      newAchievements.push("five_lessons");
      unlocked.push("five_lessons");
    }
    if (
      state.quizScores.some((q) => q.score === q.total) &&
      !newAchievements.includes("perfect_quiz")
    ) {
      newAchievements.push("perfect_quiz");
      unlocked.push("perfect_quiz");
    }
    if (state.streak >= 10 && !newAchievements.includes("ten_streak")) {
      newAchievements.push("ten_streak");
      unlocked.push("ten_streak");
    }

    if (unlocked.length > 0) {
      setState((prev) => ({ ...prev, achievements: newAchievements }));
    }

    return unlocked;
  }, [state, setState]);

  const resetGame = useCallback(() => {
    setState(INITIAL_STATE);
  }, [setState]);

  return (
    <GameContext.Provider
      value={{
        state,
        addXP,
        loseHeart,
        completeLesson,
        addQuizScore,
        checkAchievements,
        achievements: ACHIEVEMENTS,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
}

function updateStreak(currentStreak: number, lastVisit: string | null): number {
  if (!lastVisit) return 1;
  const last = new Date(lastVisit);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return currentStreak;
  if (diffDays === 1) return currentStreak + 1;
  return 1;
}
