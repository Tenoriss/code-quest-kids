import { useCallback, useRef, useState } from "react";

type VoicePreference = "en" | "id";

/**
 * Normalise a language tag so "id_ID" and "id-ID" are treated the same.
 */
function normLang(raw: string): string {
  return raw.replace("_", "-").toLowerCase();
}

/**
 * Find the best voice for the given language.
 *
 * Indonesian (id-ID) known names across platforms:
 *   - Chrome:    "Google Bahasa Indonesia"
 *   - macOS/iOS: "Damayanti"
 *   - Windows:   "Microsoft Andika"
 *
 * English (en-US) known names (no UK accent):
 *   - Chrome:  "Google US English"
 *   - Windows: "Microsoft Zira", "Microsoft David"
 *   - macOS:   "Samantha", "Karen"
 */
function findBestVoice(lang: VoicePreference): SpeechSynthesisVoice | null {
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const langPrefix = lang === "id" ? "id" : "en";

  // --- Voice-matching strategies (tried in order) ---

  // 1. Match by keyword(s) in the voice name (most specific first)
  const nameKeywords =
    lang === "id"
      ? [
          ["Google", "Indonesia"],
          ["Google", "Bahasa"],
          ["Damayanti"],
          ["Andika"],
        ]
      : [
          ["Google", "US"],
          ["Google", "American"],
          ["Zira"],
          ["David"],
          ["Samantha"],
          ["Karen"],
        ];

  for (const keywords of nameKeywords) {
    const voice = voices.find(
      (v) =>
        normLang(v.lang).startsWith(langPrefix) &&
        keywords.every((kw) => v.name.includes(kw)),
    );
    if (voice) return voice;
  }

  // 2. Fallback to first voice matching the language prefix
  const langMatch = voices.find((v) => normLang(v.lang).startsWith(langPrefix));
  if (langMatch) return langMatch;

  // 3. Last resort — any voice at all
  return voices[0] || null;
}

/**
 * Try to populate voices synchronously (needed on some browsers where
 * `getVoices()` returns an empty array on the first call).
 * Returns `true` if voices are readily available.
 */
function populateVoices(): boolean {
  if (!window.speechSynthesis) return false;
  // Force voice list population (Chrome loads them on first access)
  const voices = window.speechSynthesis.getVoices();
  return voices && voices.length > 0;
}

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesLoadedRef = useRef(false);

  const speak = useCallback((text: string, lang: VoicePreference = "en") => {
    if (!window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Try to populate voices (synchronous attempt first)
    if (!voicesLoadedRef.current) {
      voicesLoadedRef.current = populateVoices();
    }

    // If still empty, register the async handler on first call only
    if (!voicesLoadedRef.current) {
      const handler = () => {
        voicesLoadedRef.current = true;
        window.speechSynthesis.removeEventListener("voiceschanged", handler);
      };
      window.speechSynthesis.addEventListener("voiceschanged", handler);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "id" ? "id-ID" : "en-US";

    // --- Per-language fun & natural speech settings ---
    if (lang === "id") {
      // Indonesian is more syllabic — natural pace with a friendly, cheerful lift
      utterance.rate = 1.05;  // Slightly relaxed — easy to follow every syllable
      utterance.pitch = 1.2;  // Bright and cheerful, like a friendly teacher
      utterance.volume = 1.0;
    } else {
      // English — warm, bouncy, and engaging for kids
      utterance.rate = 1.1;   // Lively but not rushed
      utterance.pitch = 1.15; // Gentle cheerful lift
      utterance.volume = 1.0;
    }

    // Select a natural-sounding voice
    const bestVoice = findBestVoice(lang);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    // Keep a reference so the browser doesn't garbage-collect mid-speech
    utterRef.current = utterance;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking };
}

export type { VoicePreference };
