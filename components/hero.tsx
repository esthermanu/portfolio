"use client";

import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Magnetic } from "@/components/ui/magnetic";
import { SplitText } from "@/components/ui/split-text";
import { useIntro } from "@/components/intro-provider";
import { useCalmMotion } from "@/lib/use-media-query";
import { EASE_OUT } from "@/lib/motion";
import { site } from "@/content/site";

export function Hero() {
  const { ready } = useIntro();
  const reduce = useCalmMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  /* Base delay for everything that follows the name reveal. */
  const t = (n: number) => 0.25 + n;

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden px-6 pt-28 pb-20 sm:px-10"
    >
      <Aurora />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto w-full max-w-6xl"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: t(0), ease: EASE_OUT }}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] tracking-[0.28em] text-faint uppercase"
        >
          <span className="text-gold">{site.role}</span>
          <span className="hidden h-px w-8 bg-line-strong sm:block" />
          <span className="text-rose/90">{site.location}</span>
        </motion.div>

        {/* Name */}
        <h1 className="mt-6 text-[17vw] leading-[0.86] sm:text-[15vw] md:text-[11.5vw] lg:text-[9.5rem]">
          <span className="block">
            <SplitText text="Esther" mode="char" play={ready} delay={0.35} />
          </span>
          <span className="block italic md:pl-[0.12em]">
            <span className="duo-text">
              <SplitText text="Manu" mode="char" play={ready} delay={0.6} />
            </span>
          </span>
        </h1>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:items-end">
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: t(0.85), ease: EASE_OUT }}
            className="max-w-xl text-base leading-relaxed text-muted md:col-span-7 md:text-lg"
          >
            {site.tagline}
          </motion.p>

          {/* Rotating discipline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: t(1), ease: EASE_OUT }}
            className="md:col-span-5"
          >
            <p className="font-mono text-[11px] tracking-[0.28em] text-faint uppercase md:text-right">
              {site.disciplinesLabel}
            </p>
            <RotatingWord words={site.disciplines} />
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: t(1.15), ease: EASE_OUT }}
          className="mt-12 flex flex-wrap items-center gap-4 md:mt-16"
        >
          <Magnetic strength={0.22}>
            <a
              href="#work"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-bg"
            >
              <span className="absolute inset-0 -translate-x-full bg-gold-soft transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <span className="relative">Selected work</span>
              <ArrowDownRight
                size={16}
                className="relative transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              />
            </a>
          </Magnetic>

          {site.resume && (
            <Magnetic strength={0.18}>
              <a
                href={site.resume}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border border-rose/45 px-7 py-3.5 text-sm text-fg transition-colors hover:border-rose hover:text-rose"
              >
                Résumé
                <ArrowUpRight size={16} />
              </a>
            </Magnetic>
          )}

          <span className="inline-flex items-center gap-2.5 pl-1 text-sm text-muted">
            <span className="relative flex h-2 w-2">
              {site.availability.open && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose opacity-80" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  site.availability.open ? "bg-rose" : "bg-faint"
                }`}
              />
            </span>
            {site.availability.label}
          </span>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: t(1.4) }}
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] text-faint uppercase">
          Scroll
        </span>
        <span className="relative h-12 w-px bg-line">
          <span className="animate-scroll-hint absolute inset-0 block bg-gradient-to-b from-gold to-rose" />
        </span>
      </motion.div>
    </section>
  );
}

/** Slow-drifting light behind the hero, plus the hairline grid it sits on. */
function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="hero-grid absolute inset-0" />
      <div className="animate-drift absolute -top-1/3 left-[8%] h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.16),transparent_72%)]" />
      <div className="animate-drift-rev absolute top-1/4 right-[2%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.12),transparent_72%)]" />
      <div className="animate-breathe absolute bottom-[-12rem] left-1/3 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(240,122,176,0.2),transparent_75%)]" />
      <div className="animate-drift absolute top-[6%] right-[24%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.18),transparent_72%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}

/** Cycles through the disciplines list with a masked vertical swap. */
function RotatingWord({ words }: { words: readonly string[] }) {
  const reduce = useCalmMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce || words.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % words.length), 2800);
    return () => clearInterval(id);
  }, [reduce, words.length]);

  return (
    <div className="relative mt-2 h-[1.35em] overflow-hidden text-xl sm:text-2xl md:text-3xl">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[i]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE_OUT }}
          className="blush-text absolute inset-0 block font-display whitespace-nowrap md:text-right"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
