import { createContext, useContext, useCallback, useRef, useEffect, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  isMusicPlaying: boolean;
  toggleMusic: () => void;
  playClick: () => void;
  playHover: () => void;
  playNotification: () => void;
  playCorrect: () => void;
  playWrong: () => void;
  playAchievement: () => void;
  playLevelUp: () => void;
  playConfetti: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

// 🎵 Fun background music melody — a cheerful ascending/descending motif
const MELODY_NOTES = [
  // Two octaves of cheerful up-down
  523.25, // C5
  587.33, // D5
  659.25, // E5
  698.46, // F5
  783.99, // G5
  659.25, // E5
  587.33, // D5
  523.25, // C5
  // Second phrase
  659.25, // E5
  783.99, // G5
  1046.50, // C6
  783.99, // G5
  659.25, // E5
  523.25, // C5
  587.33, // D5
  659.25, // E5
];

// Web Audio API-based sound generation
function createOscillator(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.15
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function playSound(name: string) {
  try {
    const ctx = new AudioContext();
    switch (name) {
      case "notification":
        createOscillator(ctx, 880, 0.06, "sine", 0.06);
        setTimeout(() => createOscillator(ctx, 1100, 0.08, "sine", 0.05), 60);
        break;
      case "click":
        createOscillator(ctx, 800, 0.08, "square", 0.08);
        break;
      case "hover":
        createOscillator(ctx, 600, 0.04, "sine", 0.03);
        break;
      case "correct":
        createOscillator(ctx, 523, 0.15, "sine", 0.12);
        setTimeout(() => createOscillator(ctx, 659, 0.15, "sine", 0.12), 100);
        setTimeout(() => createOscillator(ctx, 784, 0.2, "sine", 0.12), 200);
        break;
      case "wrong":
        createOscillator(ctx, 300, 0.2, "sawtooth", 0.08);
        setTimeout(() => createOscillator(ctx, 200, 0.3, "sawtooth", 0.08), 150);
        break;
      case "achievement":
        createOscillator(ctx, 523, 0.15, "sine", 0.12);
        setTimeout(() => createOscillator(ctx, 659, 0.15, "sine", 0.12), 100);
        setTimeout(() => createOscillator(ctx, 784, 0.15, "sine", 0.12), 200);
        setTimeout(() => createOscillator(ctx, 1047, 0.3, "sine", 0.15), 300);
        break;
      case "levelup":
        for (let i = 0; i < 5; i++) {
          setTimeout(
            () => createOscillator(ctx, 400 + i * 150, 0.12, "sine", 0.1),
            i * 80
          );
        }
        break;
      case "confetti":
        for (let i = 0; i < 8; i++) {
          setTimeout(
            () => createOscillator(ctx, 600 + Math.random() * 400, 0.15, "sine", 0.06),
            i * 60
          );
        }
        break;
    }
    // Clean up
    setTimeout(() => ctx.close(), 1500);
  } catch {
    // Audio not available
  }
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useLocalStorage("codequest_muted", false);
  const [isMusicPlaying, setIsMusicPlaying] = useLocalStorage("codequest_music", false);

  // Refs for music loop
  const musicCtxRef = useRef<AudioContext | null>(null);
  const musicTimeoutRef = useRef<number | null>(null);
  const noteIndexRef = useRef(0);
  const playMusicNoteRef = useRef<((ctx: AudioContext, index: number) => void) | null>(null);

  const stopMusic = useCallback(() => {
    if (musicTimeoutRef.current !== null) {
      clearTimeout(musicTimeoutRef.current);
      musicTimeoutRef.current = null;
    }
    if (musicCtxRef.current) {
      musicCtxRef.current.close().catch(() => {});
      musicCtxRef.current = null;
    }
    noteIndexRef.current = 0;
  }, []);

  const scheduleNextNote = useCallback((ctx: AudioContext, index: number) => {
    if (index >= MELODY_NOTES.length) {
      // Loop back to start
      noteIndexRef.current = 0;
      musicTimeoutRef.current = window.setTimeout(() => {
        if (musicCtxRef.current && playMusicNoteRef.current) {
          playMusicNoteRef.current(musicCtxRef.current, 0);
        }
      }, 400);
      return;
    }

    const freq = MELODY_NOTES[index];
    const duration = 0.18;
    const volume = 0.04; // Very quiet background music
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);

    noteIndexRef.current = index + 1;

    // Schedule next note
    const gap = index % 4 === 3 ? 250 : 180; // Slightly longer after every 4th note (phrase break)
    musicTimeoutRef.current = window.setTimeout(() => {
      if (musicCtxRef.current && playMusicNoteRef.current) {
        playMusicNoteRef.current(musicCtxRef.current, noteIndexRef.current);
      }
    }, gap);
  }, []);

  useEffect(() => {
    playMusicNoteRef.current = scheduleNextNote;
  }, [scheduleNextNote]);

  const startMusic = useCallback(() => {
    stopMusic();
    try {
      const ctx = new AudioContext();
      musicCtxRef.current = ctx;
      noteIndexRef.current = 0;
      scheduleNextNote(ctx, 0);
    } catch {
      // Audio not available
    }
  }, [stopMusic, scheduleNextNote]);

  // Start/stop music based on isMusicPlaying
  useEffect(() => {
    if (isMusicPlaying) {
      startMusic();
    } else {
      stopMusic();
    }
    return () => {
      stopMusic();
    };
  }, [isMusicPlaying, startMusic, stopMusic]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, [setIsMuted]);

  const toggleMusic = useCallback(() => {
    setIsMusicPlaying((prev) => !prev);
  }, [setIsMusicPlaying]);

  const playNotification = useCallback(() => {
    if (!isMuted) playSound("notification");
  }, [isMuted]);

  const playClick = useCallback(() => {
    if (!isMuted) playSound("click");
  }, [isMuted]);

  const playHover = useCallback(() => {
    if (!isMuted) playSound("hover");
  }, [isMuted]);

  const playCorrect = useCallback(() => {
    if (!isMuted) playSound("correct");
  }, [isMuted]);

  const playWrong = useCallback(() => {
    if (!isMuted) playSound("wrong");
  }, [isMuted]);

  const playAchievement = useCallback(() => {
    if (!isMuted) playSound("achievement");
  }, [isMuted]);

  const playLevelUp = useCallback(() => {
    if (!isMuted) playSound("levelup");
  }, [isMuted]);

  const playConfetti = useCallback(() => {
    if (!isMuted) playSound("confetti");
  }, [isMuted]);

  return (
    <SoundContext.Provider
      value={{ isMuted, toggleMute, isMusicPlaying, toggleMusic, playClick, playHover, playNotification, playCorrect, playWrong, playAchievement, playLevelUp, playConfetti }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within a SoundProvider");
  return ctx;
}
