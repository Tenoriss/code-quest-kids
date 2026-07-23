import { useCallback, useRef, useState } from "react";

type VoicePreference = "en" | "id";

/**
 * Find the most natural-sounding voice for the given language.
 * Prioritises premium Google/Windows voices, then falls back to any available voice.
 */
function findBestVoice(lang: VoicePreference): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // Preferred voice names (most natural-sounding first, no UK accent)
  const preferredEnglish = [
    "Google US English",
    "Microsoft Zira",
    "Microsoft David",
    "Samantha",
    "Karen",
  ];

  const preferredIndonesian = [
    "Google Indonesia Female",
    "Microsoft Andika",
  ];

  const preferred = lang === "id" ? preferredIndonesian : preferredEnglish;

  // Try to find a preferred voice
  for (const name of preferred) {
    const voice = voices.find(
      (v) => v.name.includes(name) && v.lang.startsWith(lang === "id" ? "id" : "en")
    );
    if (voice) return voice;
  }

  // Fallback: any voice matching the language
  const langMatch = voices.find((v) => v.lang.startsWith(lang === "id" ? "id" : "en"));
  if (langMatch) return langMatch;

  // Last resort: any voice at all
  return voices[0] || null;
}

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesReadyRef = useRef(false);

  // Ensure voices are loaded (browsers like Chrome load them async)
  const ensureVoices = useCallback(() => {
    if (voicesReadyRef.current) return;
    if (window.speechSynthesis.getVoices().length > 0) {
      voicesReadyRef.current = true;
      return;
    }
    // Chrome fires 'voiceschanged' only once after the page first loads
    window.speechSynthesis.addEventListener("voiceschanged", () => {
      voicesReadyRef.current = true;
    }, { once: true });
  }, []);

  const speak = useCallback((text: string, lang: VoicePreference = "en") => {
    if (!window.speechSynthesis) return;
    ensureVoices();

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "id" ? "id-ID" : "en-US";

    // Warm, friendly speech for kids — natural pace with a cheerful tone
    utterance.rate = 1.1;
    utterance.pitch = 1.15;
    utterance.volume = 1.0;

    // Try to select a natural-sounding voice
    const bestVoice = findBestVoice(lang);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterRef.current = utterance;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [ensureVoices]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking };
}

export type { VoicePreference };
