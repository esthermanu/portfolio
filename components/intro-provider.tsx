"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";
import { EASE_IN_OUT, EASE_OUT, INTRO_MS } from "@/lib/motion";
import { useCalmMotion } from "@/lib/use-media-query";
import { site } from "@/content/site";

const IntroContext = createContext({ ready: false });

/** True once the opening curtain has lifted — the hero waits on this. */
export function useIntro() {
  return useContext(IntroContext);
}

/* sessionStorage never changes under us, so there is nothing to subscribe to. */
const noopSubscribe = () => () => {};
const notSeenOnServer = () => false;

function readIntroSeen() {
  try {
    return sessionStorage.getItem("em-intro") === "1";
  } catch {
    /* private mode or blocked storage — treat as a first visit */
    return false;
  }
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const calm = useCalmMotion();

  /* Play the curtain once per browser session, and never with reduced motion. */
  const seen = useSyncExternalStore(
    noopSubscribe,
    readIntroSeen,
    notSeenOnServer,
  );
  const skip = seen || calm;

  const [elapsed, setElapsed] = useState(false);
  const ready = skip || elapsed;

  useEffect(() => {
    if (skip) return;

    const t = setTimeout(() => {
      try {
        sessionStorage.setItem("em-intro", "1");
      } catch {
        /* ignore */
      }
      setElapsed(true);
    }, INTRO_MS);

    return () => clearTimeout(t);
  }, [skip]);

  /* Hold the page still while the curtain is down. */
  useEffect(() => {
    document.body.style.overflow = ready ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [ready]);

  return (
    <IntroContext.Provider value={{ ready }}>
      <AnimatePresence>{!ready && <Curtain />}</AnimatePresence>
      {children}
    </IntroContext.Provider>
  );
}

function Curtain() {
  const count = useMotionValue(0);
  const shown = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));

  useEffect(() => {
    const controls = animate(count, 100, {
      duration: INTRO_MS / 1000 - 0.35,
      ease: [0.5, 0, 0.2, 1],
    });
    return () => controls.stop();
  }, [count]);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex flex-col justify-between overflow-hidden bg-bg px-6 py-8 sm:px-10"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.95, ease: EASE_IN_OUT }}
      aria-hidden
    >
      <motion.div
        className="flex items-baseline justify-between font-mono text-[11px] tracking-[0.3em] text-faint uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.25 } }}
        transition={{ duration: 0.8, delay: 0.15 }}
      >
        <span>{site.name}</span>
        <span>{site.role}</span>
      </motion.div>

      <motion.div
        className="flex items-end justify-between gap-6"
        exit={{ opacity: 0, y: -20, transition: { duration: 0.35, ease: EASE_OUT } }}
      >
        <motion.p
          className="font-display text-[14vw] leading-[0.85] sm:text-[11vw] md:text-[9vw]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.1 }}
        >
          <span className="duo-text">{site.initials}</span>
        </motion.p>

        <motion.span
          className="font-mono text-4xl text-fg/70 tabular-nums sm:text-5xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {shown}
        </motion.span>
      </motion.div>

      {/* Loading hairline */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-line">
        <motion.div
          className="h-full origin-left bg-gradient-to-r from-gold to-rose"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: INTRO_MS / 1000 - 0.3, ease: [0.5, 0, 0.2, 1] }}
        />
      </div>
    </motion.div>
  );
}
