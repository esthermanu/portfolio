"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { ArrowUpRight, Code, Expand, Play } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { usePointerFine, useCalmMotion } from "@/lib/use-media-query";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { asset } from "@/lib/asset";
import { MediaLightbox } from "@/components/ui/media-lightbox";
import type { LightboxMedia } from "@/components/ui/media-lightbox";
import { EASE_OUT } from "@/lib/motion";
import { projects, site } from "@/content/site";
import type { Project } from "@/content/site";

export function Projects() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [viewing, setViewing] = useState<LightboxMedia | null>(null);
  const canHover = usePointerFine();

  /* Send focus back to whichever Watch button opened the player. */
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeViewer = useCallback(() => {
    setViewing(null);
    triggerRef.current?.focus();
  }, []);
  const wrapRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 220, damping: 24, mass: 0.4 });
  const py = useSpring(my, { stiffness: 220, damping: 24, mass: 0.4 });

  /* Float the card just above and right of the pointer, so it never sits on
     top of the title it is previewing. The offsets are baked into the motion
     values rather than added as translateX/translateY, because those map to the
     same transform slots as x/y and would silently cancel them out.
     CARD_H (224px) tracks the h-56 class below. */
  const CARD_H = 224;
  const cardX = useTransform(px, (v) => v + 18);
  const cardY = useTransform(py, (v) => v - (CARD_H + 26));

  const active = hovered === null ? null : projects[hovered];

  return (
    <Section
      id="work"
      index="01"
      label="Selected work"
      title="Things I’ve built and shipped."
      lead="Hardware, CAD, control code — and the apps built on top."
    >
      <div
        ref={wrapRef}
        onPointerMove={(e) => {
          if (!canHover) return;
          const rect = wrapRef.current?.getBoundingClientRect();
          if (!rect) return;
          mx.set(e.clientX - rect.left);
          my.set(e.clientY - rect.top);
        }}
        onPointerLeave={() => setHovered(null)}
        className="relative border-t border-line"
      >
        {projects.map((p, i) => (
          <ProjectRow
            key={p.title}
            project={p}
            index={i}
            dimmed={hovered !== null && hovered !== i}
            onEnter={() => canHover && setHovered(i)}
            onOpen={(btn, media) => {
              triggerRef.current = btn;
              setViewing(media);
            }}
          />
        ))}

        {/* Cursor-following preview — desktop pointers only */}
        <AnimatePresence>
          {canHover && active && (
            <motion.div
              key={active.title}
              initial={{ opacity: 0, scale: 0.92, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              exit={{ opacity: 0, scale: 0.94, rotate: -6 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              style={{ x: cardX, y: cardY }}
              className="pointer-events-none absolute top-0 left-0 z-20 hidden h-56 w-80 overflow-hidden rounded-xl border border-line-strong shadow-2xl shadow-black/60 md:block"
            >
              <Thumb project={active} mode="preview" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MediaLightbox media={viewing} onClose={closeViewer} />

      <Reveal delay={0.1} className="mt-14">
        <a
          href={site.socials[0]?.href ?? "#"}
          target="_blank"
          rel="noreferrer noopener"
          className="group inline-flex items-center gap-3 text-sm text-muted transition-colors hover:text-rose"
        >
          <span className="h-px w-10 bg-line-strong transition-all duration-300 group-hover:w-16 group-hover:bg-rose" />
          See everything on GitHub
          <ArrowUpRight
            size={15}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      </Reveal>
    </Section>
  );
}

function ProjectRow({
  project: p,
  index,
  dimmed,
  onEnter,
  onOpen,
}: {
  project: Project;
  index: number;
  dimmed: boolean;
  onEnter: () => void;
  onOpen: (trigger: HTMLButtonElement, media: LightboxMedia) => void;
}) {
  /* A clip wins over a still, matching what the thumbnail itself shows. */
  const media: LightboxMedia | null = p.video
    ? { kind: "video", src: p.video, poster: p.image, title: p.title }
    : p.image
      ? { kind: "image", src: p.image, title: p.title }
      : null;
  return (
    <Reveal y={24} delay={index * 0.06}>
      <motion.article
        onPointerEnter={onEnter}
        animate={{ opacity: dimmed ? 0.4 : 1 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
        className="group relative border-b border-line py-8 md:py-10"
      >
        {/* Warm wash that sweeps in on hover */}
        <span className="pointer-events-none absolute inset-x-[-1.5rem] inset-y-0 -z-10 scale-y-75 rounded-2xl bg-gradient-to-r from-gold/[0.07] via-rose/[0.05] to-transparent opacity-0 transition-all duration-500 group-hover:scale-y-100 group-hover:opacity-100" />

        <div className="flex flex-col gap-6 md:flex-row md:items-baseline md:gap-10">
          <span
            className={`font-mono text-xs md:pt-3 ${
              index % 2 === 0 ? "text-gold" : "text-rose"
            }`}
          >
            0{index + 1}
          </span>

          {/* Mobile thumbnail — replaces the hover preview on touch */}
          <div className="relative h-40 w-full overflow-hidden rounded-lg border border-line md:hidden">
            <Thumb project={p} showTitle={false} />
          </div>

          <div className="flex-1">
            <h3 className="text-3xl transition-transform duration-500 ease-out group-hover:translate-x-1 md:text-4xl">
              <span className="transition-colors duration-300 group-hover:text-gold">
                {p.title}
              </span>
            </h3>
            <p className="mt-1 font-mono text-[11px] tracking-[0.18em] text-rose/75 uppercase">
              {p.category} · {p.year}
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted md:text-base">
              {p.summary}
            </p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-line px-3 py-1 font-mono text-[10px] tracking-wider text-muted uppercase transition-colors group-hover:border-line-strong"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex shrink-0 items-center gap-2 md:pt-2">
            {media && (
              <button
                type="button"
                onClick={(e) => onOpen(e.currentTarget, media)}
                aria-label={`${p.title} — ${
                  media.kind === "video" ? "play video" : "view image"
                }`}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-rose/50 px-5 text-xs tracking-wide text-fg transition-colors hover:border-rose hover:text-rose"
              >
                {media.kind === "video" ? (
                  <>
                    Watch
                    <Play size={13} className="fill-current" />
                  </>
                ) : (
                  <>
                    View
                    <Expand size={13} />
                  </>
                )}
              </button>
            )}
            {p.href && (
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${p.title} — live site`}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong px-5 text-xs tracking-wide text-fg transition-colors hover:border-gold hover:text-gold"
              >
                Live
                <ArrowUpRight size={14} />
              </a>
            )}
            {p.repo && (
              <a
                href={p.repo}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${p.title} — source code`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-fg transition-colors hover:border-gold hover:text-gold"
              >
                <Code size={15} />
              </a>
            )}
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}

/** Real screenshot when one exists, otherwise a per-project gradient plate. */
function Thumb({
  project: p,
  showTitle = true,
  mode = "inline",
}: {
  project: Project;
  showTitle?: boolean;
  /** "preview" is the card that follows the cursor; "inline" is the mobile tile. */
  mode?: "preview" | "inline";
}) {
  const calm = useCalmMotion();

  /* A clip wins over a still. The still, if there is one, becomes its poster so
     the first frame is never blank while the video loads. */
  if (p.video) {
    /* Silent, decorative preview only. The Watch button opens the real player,
       so this never needs controls — on touch, or under reduced motion, it
       simply rests on its poster frame. */
    return (
      <video
        src={asset(p.video)}
        poster={asset(p.image)}
        className="h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        autoPlay={mode === "preview" && !calm}
        aria-hidden
      />
    );
  }

  if (p.image) {
    return (
      <Image
        src={asset(p.image)}
        alt={`${p.title} screenshot`}
        fill
        sizes="(max-width: 768px) 100vw, 320px"
        className="object-cover"
      />
    );
  }

  return (
    <div
      className="flex h-full w-full flex-col justify-between p-5"
      style={{
        backgroundImage: `linear-gradient(140deg, ${p.accent[0]}, ${p.accent[1]})`,
      }}
    >
      <span className="font-mono text-[10px] tracking-[0.2em] text-black/55 uppercase">
        {p.year}
      </span>
      <div>
        {showTitle && (
          <span className="block font-display text-3xl text-black/80">
            {p.title}
          </span>
        )}
        <span className="mt-1 block font-mono text-[10px] tracking-[0.16em] text-black/55 uppercase">
          {p.stack.slice(0, 3).join(" · ")}
        </span>
      </div>
    </div>
  );
}
