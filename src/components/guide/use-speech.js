import { useCallback, useEffect, useRef, useState } from "react";

/*
 * Byte's voice, via the browser's built-in speech synthesis.
 *
 * Voice is ON by default: every line is spoken straight away. Some browsers
 * refuse speech until the visitor has interacted with the page; when that
 * happens the line is parked and played on the first click / key press, so
 * Byte still talks without asking for permission up front.
 */

const MUTE_KEY = "byte-muted";

// friendlier voices first; falls back to any English voice
const VOICE_PREFERENCE = [
  /Google UK English Female/i,
  /Microsoft (Aria|Jenny|Ava|Emma).*Online/i,
  /Google US English/i,
  /Samantha/i,
  /Microsoft (Zira|Heera)/i,
  /Google UK English Male/i,
];

const supported = () => typeof window !== "undefined" && "speechSynthesis" in window;

// emojis and decorative symbols read out badly, so they are dropped
const clean = (text) =>
  text
    .split("\n")
    .map((line) =>
      line
        .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}✦✨]/gu, "")
        .replace(/@/g, "at")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter(Boolean)
    // each bubble line becomes its own sentence, so the voice pauses between them
    .map((line) => (/[.!?…]$/.test(line) ? line : `${line}.`))
    .join(" ");

function pickVoice() {
  const voices = window.speechSynthesis.getVoices();
  for (const re of VOICE_PREFERENCE) {
    const v = voices.find((voice) => re.test(voice.name));
    if (v) return v;
  }
  return voices.find((v) => /^en[-_]/i.test(v.lang)) || voices[0] || null;
}

const hasActivation = () => navigator.userActivation?.hasBeenActive ?? true;

export function useSpeech() {
  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem(MUTE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [speaking, setSpeaking] = useState(false);
  // a line has been handed to the engine but has not started yet
  const [queued, setQueued] = useState(false);

  const pending = useRef(null); // a line the browser would not let us speak yet
  const current = useRef(null);
  const startedRef = useRef(false); // has the current utterance actually started?
  const voice = useRef(null);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  useEffect(() => {
    if (!supported()) return undefined;
    const load = () => {
      voice.current = pickVoice();
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
      window.speechSynthesis.cancel();
    };
  }, []);

  const play = useCallback((text, onEnd) => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(clean(text));
    if (!voice.current) voice.current = pickVoice();
    if (voice.current) u.voice = voice.current;
    u.lang = voice.current?.lang || "en-US";
    u.rate = 1.02;
    u.pitch = 1.35; // a touch higher, so it sounds like a small robot
    u.volume = 1;

    let started = false;
    let finished = false;
    let released = false; // the caller has been told it may carry on
    let endGuard;
    const release = () => {
      if (released) return;
      released = true;
      if (current.current === u) setQueued(false);
      onEnd?.();
    };
    const done = () => {
      if (finished) return;
      finished = true;
      clearTimeout(watchdog);
      clearTimeout(kick);
      clearTimeout(endGuard);
      if (current.current === u) {
        current.current = null;
        startedRef.current = false;
        setSpeaking(false);
        setQueued(false);
      }
      release();
    };
    const blocked = () => {
      // keep the line so the first interaction can still play it
      pending.current = text;
      if (current.current === u) synth.cancel();
      done();
    };

    /*
     * The first line after a page load can take a few seconds to start
     * (online voices warm up). That is NOT the same as being blocked —
     * a real block arrives as a "not-allowed" error. So a slow start is
     * never cancelled: the caller is simply allowed to carry on, the line
     * keeps its place in the queue, and it is still remembered so a click
     * can replay it if it truly never starts.
     */
    const watchdog = setTimeout(() => {
      if (started) return;
      if (!hasActivation()) {
        pending.current = text;
        release();
      } else {
        // activated but silent: Chrome's cancel()/speak() race, retry is pointless
        if (current.current === u) synth.cancel();
        done();
      }
    }, 2500);

    u.onstart = () => {
      started = true;
      startedRef.current = true;
      pending.current = null;
      setQueued(false);
      setSpeaking(true);
      // Chrome can also lose the end event; never wait longer than the
      // line could possibly take
      endGuard = setTimeout(() => {
        if (current.current === u) synth.cancel();
        done();
      }, u.text.length * 95 + 3000);
    };
    u.onend = done;
    u.onerror = (e) => (e.error === "not-allowed" ? blocked() : done());
    current.current = u;
    startedRef.current = false;
    setQueued(true);

    // a short gap after cancel() lets Chrome actually start the next line
    const kick = setTimeout(() => {
      if (!finished && current.current === u) synth.speak(u);
    }, 90);
  }, []);

  /** Speak `text`; `onEnd` always fires (finished, muted, blocked or unsupported). */
  const say = useCallback(
    (text, onEnd) => {
      if (!supported() || mutedRef.current || !text) {
        onEnd?.();
        return;
      }
      play(text, onEnd);
    },
    [play]
  );

  // if the browser held speech back, the first interaction releases it
  useEffect(() => {
    if (!supported()) return undefined;
    const release = (e) => {
      // the mute control handles its own click
      if (e.target?.closest?.("[data-byte-mute]")) return;
      const text = pending.current;
      // replay unless Byte is already audibly speaking that line
      if (text && !mutedRef.current && !(current.current && startedRef.current)) play(text);
    };
    window.addEventListener("pointerdown", release);
    window.addEventListener("keydown", release);
    return () => {
      window.removeEventListener("pointerdown", release);
      window.removeEventListener("keydown", release);
    };
  }, [play]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      try {
        localStorage.setItem(MUTE_KEY, next ? "1" : "0");
      } catch {
        /* private mode: the toggle still works for this visit */
      }
      if (next && supported()) {
        pending.current = null;
        window.speechSynthesis.cancel();
        setSpeaking(false);
        setQueued(false);
      }
      return next;
    });
  }, []);

  // "speaking" also covers a line that is queued but still warming up, so
  // callers (like the intro curtain) wait for it instead of talking over it
  return { say, speaking: speaking || queued, muted, toggleMute, supported: supported() };
}
