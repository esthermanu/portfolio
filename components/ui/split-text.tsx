"use client";

import { motion } from "motion/react";
import { useCalmMotion } from "@/lib/use-media-query";
import { EASE_OUT, IN_VIEW } from "@/lib/motion";

type SplitTextProps = {
  text: string;
  className?: string;
  /** "word" is calmer and cheaper; "char" is for headline moments only. */
  mode?: "word" | "char";
  delay?: number;
  stagger?: number;
  /**
   * Leave undefined to animate on scroll-into-view. Pass a boolean to drive it
   * manually (the hero waits on the intro curtain this way).
   */
  play?: boolean;
};

/**
 * Masked type reveal: each word (or letter) slides up from behind a clipped
 * line, staggered. The text stays a single readable string for screen readers.
 */
export function SplitText({
  text,
  className,
  mode = "word",
  delay = 0,
  stagger = mode === "char" ? 0.035 : 0.07,
  play,
}: SplitTextProps) {
  const reduce = useCalmMotion();
  const words = text.split(" ");

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  const unit = {
    hidden: reduce ? { opacity: 0 } : { y: "115%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: { duration: reduce ? 0.4 : 0.85, ease: EASE_OUT },
    },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate={play === undefined ? undefined : play ? "visible" : "hidden"}
      whileInView={play === undefined ? "visible" : undefined}
      viewport={play === undefined ? IN_VIEW : undefined}
      aria-label={text}
    >
      {words.map((word, wi) => {
        const units = mode === "char" ? Array.from(word) : [word];
        return (
          <span
            key={`${word}-${wi}`}
            aria-hidden
            className="inline-flex overflow-hidden pb-[0.12em] align-bottom"
          >
            {units.map((u, ui) => (
              <motion.span
                key={`${u}-${ui}`}
                variants={unit}
                className="inline-block will-change-transform"
              >
                {u}
              </motion.span>
            ))}
            {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        );
      })}
    </motion.span>
  );
}
