import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { X, Volume2, VolumeX } from "lucide-react";
import GuideBot from "./guide-bot";
import SpeechBubble from "./speech-bubble";
import CinemaCurtain from "./cinema-curtain";
import { useTour } from "./tour-context";
import { useSpeech } from "./use-speech";
import { BYTE_EVENT, NARRATE_EVENT, NARRATE_DONE, NARRATE_CANCEL } from "./byte-events";

/* The bot box is laid out at this size; everything else is a scale of it. */
const BOT_W = 160;
const BOT_H = 192;

const FLY = { stiffness: 55, damping: 15, mass: 1.1 };

/**
 * Converts a desired on-screen box into the x/y of the unscaled bot box.
 * The bot scales from its bottom-centre, so its feet stay where we put them.
 */
const boxFor = ({ left, right, centerY, bottom }, s) => {
  const w = BOT_W * s;
  const h = BOT_H * s;
  const visualLeft = left ?? right - w;
  const visualBottom = bottom ?? centerY + h / 2;
  return { x: visualLeft - (BOT_W - w) / 2, y: visualBottom - BOT_H };
};

const INTRO_LINES = [
  "Hey there, I'm Byte! 🤖",
  "Vishal's personal guide bot.",
  "Come on, let's take a quick tour! 🚀",
];

const INTRO_BUBBLE_W = 300;
const introScaleFor = (w) => (w < 640 ? 1 : 1.4);

const WELCOME = "Welcome, Visitor";

export default function TourGuide() {
  const { setRevealed, setActiveEdu, setActiveSkill } = useTour();
  const reduce = useReducedMotion();

  // enter → greet → open → tour
  const [stage, setStage] = useState(reduce ? "tour" : "enter");
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [curtainGone, setCurtainGone] = useState(!!reduce);
  const [talking, setTalking] = useState(false);
  const [greetDone, setGreetDone] = useState(false);
  const speech = useSpeech();
  const [mode, setMode] = useState({ kind: "intro" });
  const [bubbleHidden, setBubbleHidden] = useState(false);
  const [vw, setVw] = useState(() => window.innerWidth);

  const x = useSpring(0, FLY);
  const y = useSpring(0, FLY);
  const scale = useSpring(1.4, { stiffness: 90, damping: 18 });
  const velocity = useVelocity(x);
  const tilt = useTransform(velocity, [-1400, 0, 1400], [-16, 0, 16], { clamp: true });

  const modeKey = useRef("");

  /* ---------------- intro ---------------- */
  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const W = window.innerWidth;
    const H = window.innerHeight;
    const s = introScaleFor(W);
    scale.jump(s);
    // bot + bubble are centred as one group on wide screens
    const groupW = W < 640 ? BOT_W * s : BOT_W * s + 16 + INTRO_BUBBLE_W;
    const centre = boxFor({ left: W / 2 - groupW / 2, centerY: H / 2 + 70 }, s);
    x.jump(centre.x);
    // start below the fold and fly up into the spotlight
    y.jump(H + 40);
    if (stage === "enter") {
      requestAnimationFrame(() => y.set(centre.y));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stage !== "enter") return undefined;
    const t = setTimeout(() => setStage("greet"), 900);
    return () => clearTimeout(t);
  }, [stage]);

  // nobody scrolls the page out from under the curtain
  useEffect(() => {
    if (stage === "tour") return undefined;
    const el = document.documentElement;
    const prev = el.style.overflow;
    el.style.overflow = "hidden";
    return () => {
      el.style.overflow = prev;
    };
  }, [stage]);

  const openCurtain = useCallback(() => {
    setStage((s) => (s === "greet" || s === "enter" ? "open" : s));
  }, []);

  // the moment Byte finishes talking (typing and voice), the curtain goes
  useEffect(() => {
    if (!greetDone || stage !== "greet" || speech.speaking) return undefined;
    const t = setTimeout(openCurtain, 350);
    return () => clearTimeout(t);
  }, [greetDone, stage, openCurtain, speech.speaking]);

  // never hold the curtain forever, whatever the speech engine does
  useEffect(() => {
    if (stage !== "greet") return undefined;
    const t = setTimeout(openCurtain, 12000);
    return () => clearTimeout(t);
  }, [stage, openCurtain]);

  useEffect(() => {
    if (stage !== "open") return undefined;
    const t1 = setTimeout(() => setCurtainOpen(true), 200);
    const t2 = setTimeout(() => setRevealed(true), 750);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [stage, setRevealed]);

  const onCurtainOpened = useCallback(() => {
    setCurtainGone(true);
    setStage("tour");
  }, []);

  useEffect(() => {
    if (reduce) setRevealed(true);
  }, [reduce, setRevealed]);

  /* ---------------- tour: follow the page ---------------- */
  useEffect(() => {
    if (stage !== "tour") return undefined;

    let raf = 0;
    const update = () => {
      raf = 0;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const desktop = W >= 1024;
      setVw(W);

      const section = document.getElementById("education");
      const cards = Array.from(document.querySelectorAll("[data-edu-card]"));
      const sRect = section?.getBoundingClientRect();
      const inEducation =
        sRect && cards.length > 0 && sRect.top < H * 0.55 && sRect.bottom > H * 0.45;

      const skSection = document.getElementById("skills");
      const stations = Array.from(document.querySelectorAll("[data-skill-station]"));
      const kRect = skSection?.getBoundingClientRect();
      const inSkills =
        !inEducation && kRect && stations.length > 0 && kRect.top < H * 0.55 && kRect.bottom > H * 0.45;

      let next;
      if (inEducation) {
        // the card whose top area is nearest the reading line
        const line = H * 0.42;
        let best = 0;
        let bestDist = Infinity;
        cards.forEach((c, i) => {
          const r = c.getBoundingClientRect();
          const d = Math.abs(r.top + Math.min(r.height / 2, 90) - line);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        const card = cards[best];
        const r = card.getBoundingClientRect();
        const side = card.dataset.eduSide;

        if (desktop) {
          // as big as the empty column allows, leaving room for the bubble
          const room = side === "left" ? W - r.right - 64 : r.left - 64;
          const s = Math.min(1.2, Math.max(0.75, (room - 300) / BOT_W));
          const centerY = Math.min(Math.max(r.top + 110, 170), H - 170);
          const box =
            side === "left"
              ? boxFor({ left: r.right + 64, centerY }, s)
              : boxFor({ right: r.left - 64, centerY }, s);
          next = { kind: "edu", index: best, side, total: cards.length, s, ...box, card };
        } else {
          const s = 0.58;
          next = { kind: "edu", index: best, side: "mobile", total: cards.length, s, ...boxFor({ right: W - 12, bottom: H - 12 }, s), card };
        }
      } else if (inSkills) {
        // the station that crosses the reading line, else the nearest one
        const line = H * 0.45;
        let best = 0;
        let bestDist = Infinity;
        stations.forEach((st, i) => {
          const r = st.getBoundingClientRect();
          const d = r.top <= line && r.bottom >= line ? 0 : Math.min(Math.abs(r.top - line), Math.abs(r.bottom - line));
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        const st = stations[best];
        const anchor = st.querySelector("[data-byte-anchor]")?.getBoundingClientRect();
        const info = {
          kind: "skill",
          index: best,
          total: stations.length,
          station: st,
        };

        if (desktop && anchor && anchor.height > 0) {
          // stand in the station's own Byte spot, pointing at the honeycomb
          const s = Math.max(0.6, Math.min(1.05, (anchor.width - 20) / BOT_W, (anchor.height - 90) / BOT_H));
          const roomForBubble = 100;
          const bottom = Math.max(
            Math.min(anchor.bottom - 8, H - 24),
            Math.min(anchor.top + BOT_H * s + roomForBubble, H - 24)
          );
          next = { ...info, desktop: true, s, ...boxFor({ left: anchor.left + 4, bottom }, s) };
        } else {
          const s = 0.55;
          next = { ...info, desktop: false, s, ...boxFor({ right: W - 12, bottom: H - 12 }, s) };
        }
      } else if (
        (() => {
          const v = document.getElementById("services")?.getBoundingClientRect();
          return v && v.top < H * 0.55 && v.bottom > H * 0.45;
        })()
      ) {
        // Byte stands beside the services explorer and reads out each tab
        const s = desktop ? 0.85 : 0.55;
        next = { kind: "services", desktop, s, ...boxFor({ right: W - 16, bottom: H - 110 }, s) };
      } else if (!sRect || sRect.top >= H * 0.55) {
        const s = desktop ? 0.95 : 0.6;
        next = { kind: "hero", s, ...boxFor({ right: W - 20, bottom: H - 16 }, s) };
      } else {
        const s = desktop ? 0.75 : 0.5;
        const skillsAhead = !!kRect && kRect.top >= H * 0.55;
        next = { kind: "away", skillsAhead, s, ...boxFor({ right: W - 16, bottom: H - 96 }, s) };
      }

      x.set(next.x);
      y.set(next.y);
      scale.set(next.s);

      const key =
        next.kind === "edu"
          ? `edu-${next.index}-${next.side}`
          : next.kind === "skill"
          ? `skill-${next.index}-${next.desktop}`
          : next.kind === "away"
          ? `away-${next.skillsAhead}`
          : next.kind;
      if (key !== modeKey.current) {
        modeKey.current = key;
        setBubbleHidden(false);
        setActiveEdu(next.kind === "edu" ? next.index : -1);
        setActiveSkill(next.kind === "skill" ? next.index : -1);
        const ds = next.station?.dataset;
        setMode({
          kind: next.kind,
          index: next.index,
          side: next.side,
          total: next.total,
          s: next.s,
          desktop: next.desktop,
          skillsAhead: next.skillsAhead,
          degree: next.card?.dataset.eduDegree,
          institution: next.card?.dataset.eduInstitution,
          title: ds?.title,
          count: ds?.count,
          top: ds?.top,
          topLevel: ds?.topLevel,
          avg: ds?.avg,
        });
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // education renders from the API, so re-measure once it has landed
    const poll = setInterval(schedule, 800);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      clearInterval(poll);
    };
  }, [stage, x, y, scale, setActiveEdu, setActiveSkill]);

  // the sign-off after education only lingers for a moment
  useEffect(() => {
    if (mode.kind !== "away") return undefined;
    const t = setTimeout(() => setBubbleHidden(true), 4500);
    return () => clearTimeout(t);
  }, [mode.kind]);

  /* ---------------- reactions to what the visitor does ---------------- */
  const [reaction, setReaction] = useState(null);
  const [narration, setNarration] = useState(null);
  const stageRef = useRef(stage);
  stageRef.current = stage;

  const narrateDone = useCallback((id) => {
    window.dispatchEvent(new CustomEvent(NARRATE_DONE, { detail: { id } }));
  }, []);

  useEffect(() => {
    const onNarrate = (e) => {
      const d = e.detail || {};
      if (!d.id) return;
      // nothing to say over the intro: let the caller carry on
      if (stageRef.current !== "tour") {
        narrateDone(d.id);
        return;
      }
      setBubbleHidden(false);
      setNarration({ id: d.id, lines: d.lines || [], pose: d.pose || "idle" });
    };
    const onCancel = (e) => {
      const id = e.detail?.id;
      setNarration((n) => (n && n.id === id ? null : n));
    };
    window.addEventListener(NARRATE_EVENT, onNarrate);
    window.addEventListener(NARRATE_CANCEL, onCancel);
    return () => {
      window.removeEventListener(NARRATE_EVENT, onNarrate);
      window.removeEventListener(NARRATE_CANCEL, onCancel);
    };
  }, [narrateDone]);

  useEffect(() => {
    let seq = 0;
    const onReact = (e) => {
      const { kind, name, title } = e.detail || {};
      const first = (name || "").trim().split(/\s+/)[0];
      const byKind = {
        cv: {
          pose: "celebrate",
          lines: [
            "Great choice! 📄",
            "Vishal's CV is downloading now.",
            "Thanks for your interest — he'd love to hear from you!",
          ],
        },
        contact: {
          pose: "celebrate",
          lines: [
            `Thank you${first ? `, ${first}` : ""}! 🎉`,
            "Your message is on its way to Vishal.",
            "He'll get back to you very soon!",
          ],
        },
        service: {
          pose: "celebrate",
          lines: [
            "Great pick! 💼",
            title || "Let's talk about it.",
            "I've filled in the contact form subject for you ✍️",
          ],
        },
        "contact-error": {
          pose: "sad",
          lines: ["Oops! 😕 That message didn't go through.", "Please try again in a moment."],
        },
      };
      if (!byKind[kind]) return;
      seq += 1;
      setBubbleHidden(false);
      setReaction({ id: `${Date.now()}-${seq}`, ...byKind[kind] });
    };
    window.addEventListener(BYTE_EVENT, onReact);
    return () => window.removeEventListener(BYTE_EVENT, onReact);
  }, []);

  // a reaction stays up while Byte is saying it, then the tour resumes
  useEffect(() => {
    if (!reaction || speech.speaking) return undefined;
    const t = setTimeout(() => {
      setReaction(null);
      // don't replay the section's message once the reaction is over
      setBubbleHidden(true);
    }, 4500);
    return () => clearTimeout(t);
  }, [reaction, speech.speaking]);

  /* ---------------- what the bot does and says ---------------- */
  let pose = "idle";
  let lines = null;
  let bubblePos = null;
  let tail = "bottom";
  const s = mode.s ?? 1.15;

  if (stage === "enter") {
    pose = "wave";
  } else if (stage === "greet") {
    pose = "wave";
    lines = INTRO_LINES;
  } else if (stage === "open") {
    pose = "push";
    lines = ["Lights… camera… let's go! ✨"];
  } else if (mode.kind === "hero") {
    pose = "wave";
    lines = ["Scroll down 👇", "I'll walk you through Vishal's education!"];
  } else if (mode.kind === "edu") {
    pose = mode.side === "left" ? "point-left" : mode.side === "right" ? "point-right" : "point-up-left";
    const lead =
      mode.index === 0
        ? "Let's start here! 🎓"
        : mode.index === mode.total - 1
        ? "And this chapter 👉"
        : "Next stop 👉";
    lines = [lead, mode.degree, mode.institution ? `@ ${mode.institution}` : ""].filter(Boolean);
  } else if (mode.kind === "skill") {
    pose = mode.desktop ? "point-right" : "point-up-left";
    const topLine = mode.top ? `Strongest: ${mode.top} (${mode.topLevel}%)` : "";
    if (mode.index === 0) {
      lines = ["Welcome to the Skill Lab! 🧪", `${mode.title} · ${mode.count} skills`, topLine];
    } else if (mode.index === mode.total - 1) {
      lines = [`Final station 🏁 ${mode.title}`, `${mode.count} skills · ${mode.avg}% average`, topLine];
    } else {
      lines = [`Next station 👉 ${mode.title}`, `${mode.count} skills · ${mode.avg}% average`, topLine];
    }
    lines = lines.filter(Boolean);
  } else if (mode.kind === "away") {
    pose = "wave";
    lines = mode.skillsAhead
      ? ["That's the education journey! 🚀", "Next up: the Skill Lab ⬇️"]
      : ["That's the tour for now! ✨", "Explore freely, and say hi below 👋"];
  }

  if (mode.kind === "services") pose = mode.desktop ? "point-left" : "point-up-left";

  // something the visitor just did takes priority over the tour script
  const reacting = stage === "tour" && reaction;
  if (reacting) {
    pose = reaction.pose;
    lines = reaction.lines;
  }

  // a component asked Byte to say something and is waiting for him to finish
  const narrating = stage === "tour" && narration;
  if (narrating) {
    pose = narration.pose;
    lines = narration.lines;
  }

  const introStage = stage !== "tour";
  const wide = vw >= 1024;

  if (introStage) {
    // beside the bot on desktop, above it on phones
    const si = introScaleFor(vw);
    bubblePos = vw >= 640
      ? { left: BOT_W / 2 + (BOT_W * si) / 2 + 16, top: BOT_H * (1 - si) + 40 }
      : { left: 0, bottom: BOT_H * si + 8 };
    tail = vw >= 640 ? "left" : "bottom";
  } else if (mode.kind === "edu" && wide) {
    // on the open side of the timeline, away from the card
    bubblePos =
      mode.side === "left"
        ? { left: BOT_W / 2 + (BOT_W * s) / 2 + 8, top: BOT_H * (1 - s) }
        : { right: BOT_W / 2 + (BOT_W * s) / 2 + 8, top: BOT_H * (1 - s) };
    tail = mode.side === "left" ? "left" : "right";
  } else if (mode.kind === "skill" && mode.desktop) {
    // above Byte, opening towards the honeycomb
    bubblePos = { left: (BOT_W - BOT_W * s) / 2, bottom: BOT_H * s + 10 };
    tail = "bottom-left";
  } else {
    bubblePos = { right: (BOT_W - BOT_W * s) / 2, bottom: BOT_H * s + 10 };
    tail = "bottom-right";
  }

  const showBubble = lines && lines.length > 0 && (!bubbleHidden || reacting || narrating);
  const bubbleKey = !showBubble
    ? ""
    : narrating
    ? `narr-${narration.id}`
    : reacting
    ? `react-${reaction.id}`
    : `${stage}-${mode.kind}-${mode.index ?? ""}`;
  // the greeting also reads out the title card
  const spokenText = showBubble
    ? (stage === "greet" ? [`${WELCOME}!`, ...lines] : lines).join("\n")
    : "";

  // Byte reads each new message aloud
  useEffect(() => {
    if (!bubbleKey) return undefined;
    if (!narrating) {
      speech.say(spokenText);
      return undefined;
    }

    // narration: report back once he has finished, but never before the
    // bubble has finished typing, so muted visitors can still read it
    const id = narration.id;
    const startedAt = Date.now();
    const readMs = lines.join("\n").length * 26 + 400;
    let timer;
    let alive = true;
    speech.say(spokenText, () => {
      if (!alive) return;
      const wait = Math.max(0, startedAt + readMs - Date.now()) + 450;
      timer = setTimeout(() => {
        setNarration((n) => (n && n.id === id ? null : n));
        // don't fall back to replaying the section's own message
        setBubbleHidden(true);
        narrateDone(id);
      }, wait);
    });
    return () => {
      alive = false;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bubbleKey]);

  const curScale = introStage ? introScaleFor(vw) : s;
  const showMutePill = introStage && !curtainOpen && speech.supported;

  return (
    <>
      {!curtainGone && <CinemaCurtain open={curtainOpen} onOpened={onCurtainOpened} />}

      {/* voice is on by default; one click silences Byte */}
      <AnimatePresence>
        {showMutePill && (
          <motion.div
            key="mute-pill"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
            transition={{ delay: 1, duration: 0.5 }}
            className="pointer-events-none fixed inset-x-0 bottom-10 z-[85] flex justify-center px-4"
          >
            <button
              data-byte-mute
              onClick={speech.toggleMute}
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-accent/50 bg-[#0b0f24]/90 px-4 py-2 text-xs font-semibold text-foreground shadow-lg shadow-accent/20 transition-colors hover:border-accent sm:text-sm"
            >
              {speech.muted ? (
                <>
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                  Byte is muted · click to unmute
                </>
              ) : (
                <>
                  {/* little equaliser while Byte talks */}
                  <span className="flex h-4 items-end gap-[2px]" aria-hidden="true">
                    {[0, 1, 2, 3].map((i) => (
                      <motion.span
                        key={i}
                        className="w-[3px] rounded-full bg-accent"
                        animate={{ height: speech.speaking ? ["30%", "100%", "45%", "85%", "30%"] : "30%" }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12 }}
                      />
                    ))}
                  </span>
                  Byte is speaking · click to mute
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* title card on the closed curtain */}
      <AnimatePresence>
        {introStage && !curtainOpen && (
          <motion.div
            key="welcome"
            className="pointer-events-none fixed inset-x-0 top-[13vh] z-[75] flex flex-col items-center px-4 text-center"
            exit={{ opacity: 0, y: -40, filter: "blur(8px)", transition: { duration: 0.5 } }}
          >
            <motion.span
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.45em" }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
              className="mb-3 text-[11px] font-semibold uppercase text-accent/90 sm:text-sm"
            >
              ✦ Vishal Kumar presents ✦
            </motion.span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              {WELCOME.split("").map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, delay: 0.35 + i * 0.045, ease: [0.22, 1, 0.36, 1] }}
                  className="gradient-text inline-block"
                >
                  {ch === " " ? "\u00A0" : ch}
                </motion.span>
              ))}
            </h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 h-[2px] w-40 bg-gradient-to-r from-transparent via-accent to-transparent sm:w-72"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[80]"
        style={{ x, y, width: BOT_W, height: BOT_H }}
      >
        <motion.div
          className="h-full w-full"
          style={{ scale, rotate: tilt, originX: 0.5, originY: 1 }}
        >
          {/* gentle hover bob */}
          {/* cheap glow: a static blurred disc rather than a per-frame filter */}
          <div className="absolute inset-x-[15%] bottom-[8%] top-[20%] rounded-full bg-accent/25 blur-2xl" />
          <motion.div
            className="relative h-full w-full"
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <GuideBot pose={pose} talking={talking || speech.speaking} className="h-full w-full" />
          </motion.div>
        </motion.div>

        {/* voice on / off */}
        {speech.supported && (
          <button
            data-byte-mute
            onClick={speech.toggleMute}
            aria-label={speech.muted ? "Unmute Byte" : "Mute Byte"}
            title={speech.muted ? "Unmute Byte" : "Mute Byte"}
            className="pointer-events-auto absolute flex h-7 w-7 items-center justify-center rounded-full border border-accent/40 bg-[#0b0f24]/95 text-accent shadow-lg shadow-accent/20 transition-transform hover:scale-110"
            style={{ left: BOT_W / 2 + (BOT_W * curScale) / 2 - 22, top: BOT_H * (1 - curScale) + 4 }}
          >
            {speech.muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>
        )}

        <AnimatePresence>
          {showBubble && (
            <div
              key={bubbleKey}
              className="absolute"
              style={bubblePos}
            >
              <SpeechBubble
                lines={lines}
                tail={tail}
                onTypingChange={setTalking}
                onDone={stage === "greet" ? () => setGreetDone(true) : undefined}
                className={introStage ? "max-w-[300px] text-base" : "max-w-[280px] text-sm"}
              />
              {!introStage && (
                <button
                  onClick={() => setBubbleHidden(true)}
                  aria-label="Hide message"
                  className="pointer-events-auto absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-accent"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
