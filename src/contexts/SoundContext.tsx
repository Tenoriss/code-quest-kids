import { createContext, useContext, useCallback, useRef, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playClick: () => void;
  playHover: () => void;
  playCorrect: () => void;
  playWrong: () => void;
  playAchievement: () => void;
  playLevelUp: () => void;
  playConfetti: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

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

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, [setIsMuted]);

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
      value={{ isMuted, toggleMute, playClick, playHover, playCorrect, playWrong, playAchievement, playLevelUp, playConfetti }}
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
