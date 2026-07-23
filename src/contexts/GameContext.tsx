import { createContext, useContext, useCallback, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { GameState, Achievement, DailyMission, WeeklyChallenge } from "@/types";

const INITIAL_STATE: GameState = {
  xp: 0,
  level: 1,
  hearts: 5,
  streak: 0,
  lastVisit: null,
  completedLessons: [],
  achievements: [],
  quizScores: [],
  learningTime: 0,
  currentLesson: "",
  coins: 0,
  dailyRewardClaimed: null,
  dailyMissionDate: null,
  dailyMissionId: null,
  dailyMissionDone: false,
  weeklyChallengeWeek: null,
  weeklyChallengeId: null,
  weeklyChallengeDone: false,
};

const XP_PER_LEVEL = 100;

const ACHIEVEMENTS: Achievement[] = [
  { id: "first_lesson", title: "First Steps", description: "Complete your first lesson", icon: "🎯", unlocked: false },
  { id: "five_lessons", title: "Eager Learner", description: "Complete 5 lessons", icon: "📚", unlocked: false },
  { id: "perfect_quiz", title: "Quiz Master", description: "Get 100% on a quiz", icon: "🏆", unlocked: false },
  { id: "ten_streak", title: "On Fire!", description: "10-day learning streak", icon: "🔥", unlocked: false },
  { id: "sequence_master", title: "Sequence Master", description: "Complete the sequence game", icon: "⭐", unlocked: false },
  { id: "algorithm_whiz", title: "Algorithm Whiz", description: "Complete the algorithm game", icon: "💡", unlocked: false },
  { id: "collector", title: "Collector", description: "Complete all lessons", icon: "🏅", unlocked: false },
  { id: "speed_demon", title: "Speed Demon", description: "Complete the quiz in under 2 minutes", icon: "⚡", unlocked: false },
];

const DAILY_MISSIONS: DailyMission[] = [
  { id: "complete_lesson", title: { en: "Complete one lesson", id: "Selesaikan satu pelajaran" }, description: { en: "Finish any lesson to earn rewards!", id: "Selesaikan pelajaran apa pun untuk dapatkan hadiah!" }, xp: 20, coins: 10, icon: "📚" },
  { id: "earn_xp", title: { en: "Earn 50 XP", id: "Kumpulkan 50 XP" }, description: { en: "Gain 50 experience points today!", id: "Dapatkan 50 poin pengalaman hari ini!" }, xp: 30, coins: 15, icon: "⭐" },
  { id: "take_quiz", title: { en: "Take today's quiz", id: "Ikuti kuis hari ini" }, description: { en: "Test your knowledge with the quiz!", id: "Uji pengetahuanmu dengan kuis!" }, xp: 25, coins: 12, icon: "🧠" },
  { id: "read_explanation", title: { en: "Read one explanation", id: "Baca satu penjelasan" }, description: { en: "Learn something new from practice!", id: "Pelajari sesuatu yang baru dari latihan!" }, xp: 15, coins: 8, icon: "💡" },
  { id: "practice_skills", title: { en: "Practice skills", id: "Latih kemampuan" }, description: { en: "Complete the practice section!", id: "Selesaikan bagian latihan!" }, xp: 25, coins: 12, icon: "✏️" },
];

const WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  { id: "all_lessons", title: { en: "Complete All Lessons", id: "Selesaikan Semua Pelajaran" }, description: { en: "Finish every lesson this week!", id: "Selesaikan semua pelajaran minggu ini!" }, xp: 100, coins: 50, icon: "🏆" },
  { id: "perfect_quiz", title: { en: "Perfect Quiz Score", id: "Nilai Kuis Sempurna" }, description: { en: "Get 100% on any quiz!", id: "Dapatkan 100% di kuis mana pun!" }, xp: 80, coins: 40, icon: "🎯" },
  { id: "seven_day_streak", title: { en: "7-Day Streak", id: "Rantai 7 Hari" }, description: { en: "Maintain a 7-day learning streak!", id: "Pertahankan rantai belajar 7 hari!" }, xp: 120, coins: 60, icon: "🔥" },
  { id: "xp_collector", title: { en: "XP Collector", id: "Pengumpul XP" }, description: { en: "Earn 200 XP this week!", id: "Kumpulkan 200 XP minggu ini!" }, xp: 90, coins: 45, icon: "💎" },
  { id: "speed_run", title: { en: "Speed Runner", id: "Pelari Cepat" }, description: { en: "Complete the quiz in under 3 minutes!", id: "Selesaikan kuis dalam 3 menit!" }, xp: 70, coins: 35, icon: "⚡" },
];

interface GameContextType {
  state: GameState;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  loseHeart: () => void;
  restoreHearts: () => void;
  completeLesson: (lessonId: string) => void;
  addQuizScore: (score: number, total: number) => void;
  addLearningTime: (minutes: number) => void;
  setCurrentLesson: (lessonId: string) => void;
  claimDailyReward: () => { xp: number; coins: number; day: number } | null;
  checkAchievements: () => string[];
  getDailyMission: () => { mission: DailyMission; isDone: boolean } | null;
  completeDailyMission: () => void;
  getWeeklyChallenge: () => { challenge: WeeklyChallenge; isDone: boolean } | null;
  completeWeeklyChallenge: () => void;
  achievements: Achievement[];
  dailyMissions: DailyMission[];
  weeklyChallenges: WeeklyChallenge[];
  resetGame: () => void;
  hasCompleted: (lessonId: string) => boolean;
  completionPercent: number;
}

const GameContext = createContext<GameContextType | null>(null);

const LESSONS = [
  "sequence_lesson", "sequence_game",
  "algorithm_lesson", "algorithm_game",
  "practice", "quiz",
];

function getWeekNumber(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

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

  const addCoins = useCallback(
    (amount: number) => {
      setState((prev) => ({ ...prev, coins: prev.coins + amount }));
    },
    [setState]
  );

  const loseHeart = useCallback(() => {
    setState((prev) => ({ ...prev, hearts: Math.max(0, prev.hearts - 1) }));
  }, [setState]);

  const restoreHearts = useCallback(() => {
    setState((prev) => ({ ...prev, hearts: 5 }));
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

  const addLearningTime = useCallback(
    (minutes: number) => {
      setState((prev) => ({ ...prev, learningTime: prev.learningTime + minutes }));
    },
    [setState]
  );

  const setCurrentLesson = useCallback(
    (lessonId: string) => {
      setState((prev) => ({ ...prev, currentLesson: lessonId }));
    },
    [setState]
  );

  const claimDailyReward = useCallback(() => {
    const today = new Date().toDateString();
    let response: { xp: number; coins: number; day: number } | null = null;

    setState((prev) => {
      if (prev.dailyRewardClaimed === today) {
        response = null;
        return prev;
      }

      let day = 1;
      if (prev.streak > 0) {
        day = Math.min(prev.streak + 1, 7);
      }

      const xpReward = day * 10;
      const coinReward = day * 5;

      response = { xp: xpReward, coins: coinReward, day };

      return {
        ...prev,
        xp: prev.xp + xpReward,
        coins: prev.coins + coinReward,
        dailyRewardClaimed: today,
      };
    });

    return response;
  }, [setState]);

  const checkAchievements = useCallback((): string[] => {
    const unlocked: string[] = [];
    const newAchievements = [...state.achievements];

    if (state.completedLessons.length >= 1 && !newAchievements.includes("first_lesson")) {
      newAchievements.push("first_lesson"); unlocked.push("first_lesson");
    }
    if (state.completedLessons.length >= 5 && !newAchievements.includes("five_lessons")) {
      newAchievements.push("five_lessons"); unlocked.push("five_lessons");
    }
    if (state.completedLessons.length >= 6 && !newAchievements.includes("collector")) {
      newAchievements.push("collector"); unlocked.push("collector");
    }
    if (state.quizScores.some((q) => q.score === q.total) && !newAchievements.includes("perfect_quiz")) {
      newAchievements.push("perfect_quiz"); unlocked.push("perfect_quiz");
    }
    if (state.streak >= 10 && !newAchievements.includes("ten_streak")) {
      newAchievements.push("ten_streak"); unlocked.push("ten_streak");
    }
    if (state.completedLessons.includes("sequence_game") && !newAchievements.includes("sequence_master")) {
      newAchievements.push("sequence_master"); unlocked.push("sequence_master");
    }
    if (state.completedLessons.includes("algorithm_game") && !newAchievements.includes("algorithm_whiz")) {
      newAchievements.push("algorithm_whiz"); unlocked.push("algorithm_whiz");
    }

    if (unlocked.length > 0) {
      setState((prev) => ({ ...prev, achievements: newAchievements }));
    }

    return unlocked;
  }, [state, setState]);

  // Daily mission: assign one random mission per day
  const getDailyMission = useCallback((): { mission: DailyMission; isDone: boolean } | null => {
    const today = new Date().toDateString();
    let missionData: DailyMission | null = null;
    let isDone = false;

    setState((prev) => {
      if (prev.dailyMissionDate === today && prev.dailyMissionId) {
        const existing = DAILY_MISSIONS.find((m) => m.id === prev.dailyMissionId);
        if (existing) {
          missionData = existing;
          isDone = prev.dailyMissionDone;
        }
        return prev;
      }

      // Pick a new random mission for today
      const randomIndex = Math.floor(Math.random() * DAILY_MISSIONS.length);
      const newMission = DAILY_MISSIONS[randomIndex];
      missionData = newMission;
      isDone = false;

      return {
        ...prev,
        dailyMissionDate: today,
        dailyMissionId: newMission.id,
        dailyMissionDone: false,
      };
    });

    return missionData ? { mission: missionData, isDone } : null;
  }, [setState]);

  const completeDailyMission = useCallback(() => {
    let reward: { xp: number; coins: number } | null = null;

    setState((prev) => {
      if (prev.dailyMissionDone) return prev;
      const mission = DAILY_MISSIONS.find((m) => m.id === prev.dailyMissionId);
      if (!mission) return prev;

      reward = { xp: mission.xp, coins: mission.coins };

      return {
        ...prev,
        dailyMissionDone: true,
        xp: prev.xp + mission.xp,
        coins: prev.coins + mission.coins,
      };
    });

    return reward;
  }, [setState]);

  const getWeeklyChallenge = useCallback((): { challenge: WeeklyChallenge; isDone: boolean } | null => {
    const currentWeek = getWeekNumber(new Date());
    let challengeData: WeeklyChallenge | null = null;
    let isDone = false;

    setState((prev) => {
      if (prev.weeklyChallengeWeek === currentWeek && prev.weeklyChallengeId) {
        const existing = WEEKLY_CHALLENGES.find((c) => c.id === prev.weeklyChallengeId);
        if (existing) {
          challengeData = existing;
          isDone = prev.weeklyChallengeDone;
        }
        return prev;
      }

      const randomIndex = Math.floor(Math.random() * WEEKLY_CHALLENGES.length);
      const newChallenge = WEEKLY_CHALLENGES[randomIndex];
      challengeData = newChallenge;
      isDone = false;

      return {
        ...prev,
        weeklyChallengeWeek: currentWeek,
        weeklyChallengeId: newChallenge.id,
        weeklyChallengeDone: false,
      };
    });

    return challengeData ? { challenge: challengeData, isDone } : null;
  }, [setState]);

  const completeWeeklyChallenge = useCallback(() => {
    let reward: { xp: number; coins: number } | null = null;

    setState((prev) => {
      if (prev.weeklyChallengeDone) return prev;
      const challenge = WEEKLY_CHALLENGES.find((c) => c.id === prev.weeklyChallengeId);
      if (!challenge) return prev;

      reward = { xp: challenge.xp, coins: challenge.coins };

      return {
        ...prev,
        weeklyChallengeDone: true,
        xp: prev.xp + challenge.xp,
        coins: prev.coins + challenge.coins,
      };
    });

    return reward;
  }, [setState]);

  const resetGame = useCallback(() => {
    setState(INITIAL_STATE);
  }, [setState]);

  const hasCompleted = useCallback(
    (lessonId: string) => state.completedLessons.includes(lessonId),
    [state.completedLessons]
  );

  const completionPercent = Math.round((state.completedLessons.length / LESSONS.length) * 100);

  return (
    <GameContext.Provider
      value={{
        state,
        addXP,
        addCoins,
        loseHeart,
        restoreHearts,
        completeLesson,
        addQuizScore,
        addLearningTime,
        setCurrentLesson,
        claimDailyReward,
        checkAchievements,
        getDailyMission,
        completeDailyMission,
        getWeeklyChallenge,
        completeWeeklyChallenge,
        achievements: ACHIEVEMENTS,
        dailyMissions: DAILY_MISSIONS,
        weeklyChallenges: WEEKLY_CHALLENGES,
        resetGame,
        hasCompleted,
        completionPercent,
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
