"use client";

import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { Magnetic } from "@/components/ui/magnetic";
import { Reveal } from "@/components/ui/reveal";
import { SplitText } from "@/components/ui/split-text";
import { site } from "@/content/site";

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);

  /* Soft spotlight that trails the pointer across the panel. */
  const spotlight = useMotionTemplate`radial-gradient(38rem circle at ${mx}% ${my}%, rgba(217,169,97,0.13), rgba(227,160,189,0.09) 42%, transparent 66%)`;

  return (
    <section
      id="contact"
      ref={ref}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set(((e.clientX - rect.left) / rect.width) * 100);
        my.set(((e.clientY - rect.top) / rect.height) * 100);
      }}
      className="relative scroll-mt-24 overflow-hidden border-t border-line px-6 py-28 sm:px-10 md:py-40"
    >
      <motion.div
        aria-hidden
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0"
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <Reveal y={16} duration={0.7}>
          <div className="flex items-center gap-4 font-mono text-[11px] tracking-[0.28em] text-faint uppercase">
            <span className="text-rose">05</span>
            <span className="h-px w-10 bg-line-strong" />
            <span>Contact</span>
          </div>
        </Reveal>

        <h2 className="mt-8 max-w-4xl text-[12vw] leading-[0.95] sm:text-6xl md:text-7xl">
          <SplitText text="Let’s build" />
          <br />
          <span className="italic">
            <span className="duo-text">
              <SplitText text="something good." delay={0.15} />
            </span>
          </span>
        </h2>

        <Reveal delay={0.2} className="mt-10 max-w-xl">
          <p className="leading-relaxed text-muted md:text-lg">
            Internships, research, a project you want a second pair of hands
            on — my inbox is genuinely open.
          </p>
        </Reveal>

        {/* Primary email link */}
        <div className="mt-14">
          <Reveal delay={0.1}>
            <Magnetic strength={0.15} className="inline-block">
              <a
                href={`mailto:${site.email}`}
                className="group inline-flex flex-wrap items-baseline gap-x-4 gap-y-2"
              >
                <span className="relative font-display text-3xl break-all sm:text-4xl md:text-5xl">
                  {site.email}
                  <span className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </span>
                <ArrowUpRight
                  className="text-gold transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                  size={28}
                />
              </a>
            </Magnetic>
          </Reveal>
        </div>

        {/* Socials */}
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {site.socials.map((s, i) => {
            /* Alternate the two accents down the grid. */
            const accent = i % 2 === 1 ? "group-hover:text-rose" : "group-hover:text-gold";
            return (
              <Reveal key={s.label} delay={i * 0.07}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex h-full items-center justify-between bg-bg p-6 transition-colors duration-500 hover:bg-surface"
                >
                  <span>
                    <span className="block font-mono text-[10px] tracking-[0.2em] text-rose/70 uppercase">
                      {s.label}
                    </span>
                    <span className={`mt-1.5 block text-lg transition-colors duration-300 ${accent}`}>
                      {s.handle}
                    </span>
                  </span>
                  <ArrowUpRight
                    size={18}
                    className={`text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${accent}`}
                  />
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
