"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { EASE_OUT } from "@/lib/motion";
import { useCalmMotion } from "@/lib/use-media-query";

export type LightboxMedia = {
  kind: "video" | "image";
  src: string;
  /** Poster frame for a clip; ignored for a still. */
  poster?: string | null;
  title?: string;
};

type MediaLightboxProps = {
  /** What to show, or null when nothing is open. */
  media: LightboxMedia | null;
  onClose: () => void;
};

/**
 * Full-screen viewer for a project's clip or still. Opens from the Watch/View
 * button, closes on Escape, on a backdrop click, or from the close button.
 *
 * Sits at z-68 deliberately: above the page and the scroll bar, but *below* the
 * custom cursor at z-70 — the stylesheet hides the native cursor, so a higher
 * overlay would leave the viewer with no pointer at all over the controls.
 */
export function MediaLightbox({ media, onClose }: MediaLightboxProps) {
  const calm = useCalmMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const open = Boolean(media);
  const isVideo = media?.kind === "video";

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  /* Play with sound. The click that opened this counts as the user gesture, but
     if the browser still refuses, fall back to a muted play rather than
     leaving the viewer staring at a frozen first frame. */
  useEffect(() => {
    if (!open || !isVideo) return;
    const v = videoRef.current;
    if (!v) return;

    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {
        /* Autoplay fully blocked — the controls are right there. */
      });
    });
  }, [open, isVideo, media?.src]);

  /* Rendered through a portal on purpose. In place, this overlay would sit
     inside the section's `z-10` wrapper — a stacking context — so its z-68
     would be measured against that layer and the fixed nav at z-50 would paint
     straight over it, close button and all.

     SSR renders nothing here (it only opens from a click), so markup matches. */
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {media && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={
            media.title
              ? `${media.title} — ${isVideo ? "video" : "image"}`
              : isVideo
                ? "Project video"
                : "Project image"
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: calm ? 0.15 : 0.3, ease: EASE_OUT }}
          onClick={onClose}
          className="fixed inset-0 z-[68] flex items-center justify-center bg-bg/92 px-4 py-16 backdrop-blur-md sm:px-8"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={isVideo ? "Close video" : "Close image"}
            className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-fg transition-colors hover:border-rose hover:text-rose sm:top-8 sm:right-8"
          >
            <X size={18} />
          </button>

          <motion.div
            /* Clicks inside the frame must not reach the backdrop handler. */
            onClick={(e) => e.stopPropagation()}
            initial={calm ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={calm ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: calm ? 0.15 : 0.4, ease: EASE_OUT }}
            className="flex max-h-full flex-col items-center gap-4"
          >
            {isVideo ? (
              <video
                ref={videoRef}
                src={media.src}
                poster={media.poster ?? undefined}
                controls
                loop
                playsInline
                className="max-h-[76vh] max-w-full rounded-xl border border-line-strong bg-black object-contain shadow-2xl shadow-black/70"
              />
            ) : (
              /* A plain img: the lightbox shows one already-optimised file at
                 its natural aspect ratio, which next/image cannot do without
                 knowing the intrinsic size up front. */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={media.src}
                alt={media.title ? `${media.title} — full size` : "Project image"}
                className="max-h-[76vh] max-w-full rounded-xl border border-line-strong object-contain shadow-2xl shadow-black/70"
              />
            )}
            {media.title && (
              <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">
                {media.title}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
