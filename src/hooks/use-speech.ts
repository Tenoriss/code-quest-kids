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
 * Prioritises natural-sounding voices in this order:
 *   1. Google neural voices (most human)
 *   2. Microsoft neural voices
 *   3. Apple system voices
 *   4. Any voice matching the language
 *   5. Any voice at all
 */
function findBestVoice(lang: VoicePreference): SpeechSynthesisVoice | null {
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const langPrefix = lang === "id" ? "id" : "en";

  // --- Keyword patterns tried in order ---
  const nameKeywords: string[][] =
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

  // Fallback to first voice matching the language prefix
  const langMatch = voices.find((v) => normLang(v.lang).startsWith(langPrefix));
  if (langMatch) return langMatch;

  // Last resort — any voice at all
  return voices[0] || null;
}

/**
 * Try to populate voices synchronously (needed on some browsers where
 * `getVoices()` returns an empty array on the first call).
 */
function populateVoices(): boolean {
  if (!window.speechSynthesis) return false;
  const voices = window.speechSynthesis.getVoices();
  return voices && voices.length > 0;
}

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const voicesLoadedRef = useRef(false);
  const speechIdRef = useRef(0);     // increments each call so stale timeouts are ignored
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  /** Cancel all pending timeouts and speech. */
  const stop = useCallback(() => {
    // Clear all pending sentence timeouts
    for (const t of timeoutsRef.current) clearTimeout(t);
    timeoutsRef.current = [];

    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback((text: string, lang: VoicePreference = "en") => {
    if (!window.speechSynthesis) return;

    // Cancel previous speech & pending timeouts
    stop();

    // Bump speech ID so stale timeouts become no-ops
    const thisSpeechId = ++speechIdRef.current;

    // Ensure voices are loaded
    if (!voicesLoadedRef.current) {
      voicesLoadedRef.current = populateVoices();
    }
    if (!voicesLoadedRef.current) {
      const handler = () => {
        voicesLoadedRef.current = true;
        window.speechSynthesis.removeEventListener("voiceschanged", handler);
      };
      window.speechSynthesis.addEventListener("voiceschanged", handler);
    }

    // --- Human & natural speech settings ---
    // Natural conversational pace at a neutral pitch.
    // These values let the TTS engine apply its own prosody naturally.
    const rate = lang === "id" ? 0.95 : 1.0;  // Indonesian slightly slower (more syllables)
    const pitch = lang === "id" ? 1.05 : 1.0; // Indonesian very slight warmth, English neutral
    const pauseMs = 180;                       // natural breathing pause between sentences

    // Pick the best voice once and reuse it
    const bestVoice = findBestVoice(lang);

    // Split text into sentences for natural breathing pauses.
    // Single-sentence text is spoken as one utterance.
    const sentences = text.match(/[^.!?]*[.!?]+/g) || [text];

    let delay = 0;
    const newTimeouts: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < sentences.length; i++) {
      const trimmed = sentences[i].trim();
      if (!trimmed) continue;

      const tid = setTimeout(() => {
        // Ignore if speech was cancelled and a new call happened
        if (speechIdRef.current !== thisSpeechId) return;
        if (!window.speechSynthesis) return;

        const u = new SpeechSynthesisUtterance(trimmed);
        u.lang = lang === "id" ? "id-ID" : "en-US";
        u.rate = rate;
        u.pitch = pitch;
        u.volume = 1.0;

        if (bestVoice) u.voice = bestVoice;

        // Track speaking state: first sentence starts, last sentence ends
        if (i === 0) u.onstart = () => setSpeaking(true);
        if (i === sentences.length - 1) {
          u.onend = () => setSpeaking(false);
          u.onerror = () => setSpeaking(false);
        }

        window.speechSynthesis.speak(u);
      }, delay);

      newTimeouts.push(tid);
      delay += pauseMs;
    }

    timeoutsRef.current = newTimeouts;
  }, [stop]);

  return { speak, stop, speaking };
}

export type { VoicePreference };
