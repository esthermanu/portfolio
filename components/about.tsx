"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { useCalmMotion } from "@/lib/use-media-query";
import { site } from "@/content/site";

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useCalmMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 40, reduce ? 0 : -40]);

  return (
    <Section
      id="about"
      index="02"
      label="About"
      title="Software on one side, hardware on the other."
    >
      <div ref={ref} className="grid gap-12 md:grid-cols-12 md:gap-16">
        {/* Portrait */}
        <div className="md:col-span-5">
          <Reveal y={36}>
            <motion.div
              style={{ y: portraitY }}
              className="group relative aspect-4/5 w-full overflow-hidden rounded-2xl border border-line"
            >
              {site.portrait ? (
                <Image
                  src={site.portrait}
                  alt={site.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  priority
                />
              ) : (
                <Monogram />
              )}

              {/* Gold edge that lights up on hover */}
              <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-rose/0 transition-all duration-500 group-hover:ring-rose/40" />
            </motion.div>
          </Reveal>

          <Reveal delay={0.15} className="mt-5">
            {/* Neutral either way, so the placeholder state is still shippable.
                See the README for how to add a real portrait. */}
            <p className="font-mono text-[11px] leading-relaxed tracking-[0.16em] text-faint uppercase">
              {site.name} · {site.location}
            </p>
          </Reveal>
        </div>

        {/* Copy */}
        <div className="md:col-span-7">
          <div className="space-y-6">
            {site.about.map((para, i) => (
              <Reveal key={i} delay={i * 0.12} y={22}>
                <p
                  className={
                    i === 0
                      ? "text-xl leading-relaxed text-fg md:text-2xl"
                      : "leading-relaxed text-muted"
                  }
                >
                  {para}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
            {site.facts.map((f, i) => (
              <Reveal key={f.label} delay={0.1 + i * 0.08}>
                <div className="h-full bg-bg p-5 transition-colors duration-500 hover:bg-surface">
                  <p className="font-mono text-[10px] tracking-[0.2em] text-rose/70 uppercase">
                    {f.label}
                  </p>
                  <p className="mt-2 font-display text-xl">{f.value}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/** Fallback portrait: layered warm gradient with a drifting monogram. */
function Monogram() {
  return (
    <div className="relative h-full w-full bg-surface">
      <div className="animate-drift absolute -top-1/4 left-0 h-full w-full rounded-full bg-[radial-gradient(circle,rgba(217,169,97,0.3),transparent_72%)]" />
      <div className="animate-drift-rev absolute bottom-0 right-0 h-3/4 w-3/4 rounded-full bg-[radial-gradient(circle,rgba(227,160,189,0.3),transparent_72%)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="duo-text font-display text-[7rem] leading-none">
          {site.initials}
        </span>
      </div>
      <div className="hero-grid absolute inset-0 opacity-60" />
    </div>
  );
}
