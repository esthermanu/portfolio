"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { usePointerFine } from "@/lib/use-media-query";

/**
 * Two-part pointer: a small solid dot that tracks precisely, and a lagging
 * ring that swells over anything interactive. Mouse-only — it never renders on
 * touch devices or for visitors who prefer reduced motion.
 */
export function Cursor() {
  const enabled = usePointerFine();
  const [hot, setHot] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.35 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.35 });

  useEffect(() => {
    if (!enabled) return;

    /* Tell the stylesheet to hide the native cursor while ours is live. */
    document.body.dataset.customCursor = "true";

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);

      const el = e.target as Element | null;
      setHot(Boolean(el?.closest?.('a, button, [role="button"], input, textarea')));
    };
    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      delete document.body.dataset.customCursor;
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70]">
      <motion.div
        className="absolute h-1.5 w-1.5 rounded-full bg-rose-soft"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible ? 1 : 0, scale: hot ? 0 : 1 }}
        transition={{ duration: 0.18 }}
      />
      <motion.div
        className="absolute rounded-full border border-gold/60"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: hot ? 46 : 26,
          height: hot ? 46 : 26,
          opacity: visible ? (hot ? 1 : 0.5) : 0,
          backgroundColor: hot ? "rgba(227,160,189,0.14)" : "rgba(227,160,189,0)",
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
