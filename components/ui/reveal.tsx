"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useCalmMotion } from "@/lib/use-media-query";
import { EASE_OUT, IN_VIEW } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  /** Seconds to wait after the element enters view. */
  delay?: number;
  /** Distance travelled, in px. */
  y?: number;
  duration?: number;
  className?: string;
};

/**
 * Fades, lifts and un-blurs its children when they scroll into view.
 * With reduced motion it degrades to a plain fade.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  duration = 0.9,
  className,
}: RevealProps) {
  const reduce = useCalmMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, filter: "blur(8px)" }}
      whileInView={
        reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      viewport={IN_VIEW}
      transition={{ duration: reduce ? 0.4 : duration, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
