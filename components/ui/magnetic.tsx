"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useCalmMotion } from "@/lib/use-media-query";
import type { ReactNode } from "react";
import { useRef } from "react";

type MagneticProps = {
  children: ReactNode;
  /** 0 = inert, 1 = the element sticks to the pointer. */
  strength?: number;
  className?: string;
};

/**
 * Leans its child towards the pointer and springs back on exit.
 * Used on the primary buttons and the big contact link.
 */
export function Magnetic({ children, strength = 0.3, className }: MagneticProps) {
  const reduce = useCalmMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 170, damping: 16, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 170, damping: 16, mass: 0.35 });

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
