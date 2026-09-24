"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { asset } from "@/lib/asset";
import { experience, site } from "@/content/site";

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);

  /* The spine draws itself as this block moves through the viewport. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 55%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <Section
      id="experience"
      index="04"
      label="Experience"
      title="Where I’ve done the work."
    >
      <div ref={ref} className="relative pl-8 md:pl-0">
        {/* Spine */}
        <div className="absolute top-2 bottom-2 left-0 w-px bg-line md:left-[11.5rem]">
          <motion.div
            style={{ scaleY }}
            className="h-full w-full origin-top bg-gradient-to-b from-gold via-rose to-rose/20"
          />
        </div>

        <ol className="space-y-14 md:space-y-16">
          {experience.map((job, i) => (
            <li key={`${job.company}-${job.period}`} className="relative">
              <Reveal y={26} delay={i * 0.08}>
                <div className="md:grid md:grid-cols-[11.5rem_1fr] md:gap-12">
                  {/* Period rail */}
                  <div className="md:pt-1 md:pr-10 md:text-right">
                    {job.period && (
                      <p
                        className={`font-mono text-[11px] tracking-[0.16em] uppercase ${
                          i % 2 === 0 ? "text-gold" : "text-rose"
                        }`}
                      >
                        {job.period}
                      </p>
                    )}
                    <p className="mt-1 font-mono text-[10px] tracking-[0.16em] text-faint uppercase">
                      {job.location}
                    </p>
                  </div>

                  {/* Node */}
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                    className={`absolute top-2 left-0 h-2.5 w-2.5 -translate-x-[4px] rounded-full ring-4 ring-bg md:left-[11.5rem] ${
                      i % 2 === 0 ? "bg-gold" : "bg-rose"
                    }`}
                  />

                  <div className="md:pl-2">
                    <h3 className="text-2xl md:text-3xl">{job.role}</h3>
                    <p className="mt-1 text-sm text-muted">{job.company}</p>

                    <ul className="mt-5 space-y-3">
                      {job.points.map((point) => (
                        <li
                          key={point}
                          className="flex gap-3 text-sm leading-relaxed text-muted"
                        >
                          <span
                            className={`mt-[0.55em] h-1 w-1 shrink-0 rounded-full ${
                              i % 2 === 0 ? "bg-gold/70" : "bg-rose/70"
                            }`}
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      {site.resume && (
        <Reveal delay={0.1} className="mt-16 md:pl-[11.5rem]">
          <a
            href={asset(site.resume)}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-3 text-sm text-muted transition-colors hover:text-gold md:ml-12"
          >
            <span className="h-px w-10 bg-line-strong transition-all duration-300 group-hover:w-16 group-hover:bg-gold" />
            Full résumé (PDF)
          </a>
        </Reveal>
      )}
    </Section>
  );
}
