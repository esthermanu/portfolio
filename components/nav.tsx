"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useEffect, useState } from "react";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import { sections, site } from "@/content/site";

export function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 80));

  /* Scroll-spy: whichever section owns the upper third of the viewport wins. */
  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => Boolean(n));

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0.05, 0.25, 0.5] },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  /* Lock the page behind the mobile menu. */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Escape closes the menu. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE_OUT, delay: 0.3 }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          solid ? "glass border-b border-line" : "border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:px-10 md:h-20">
          <a
            href="#top"
            className="group font-display text-xl tracking-tight"
            aria-label={`${site.name} — back to top`}
          >
            <span className="gold-text">{site.initials}</span>
            <span className="ml-2 hidden font-sans text-[11px] tracking-[0.22em] text-faint uppercase transition-colors group-hover:text-muted sm:inline">
              {site.role}
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="relative block px-4 py-2 text-sm text-muted transition-colors hover:text-rose"
                >
                  {active === s.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-rose/[0.09] ring-1 ring-rose/35"
                      transition={{ duration: 0.45, ease: EASE_OUT }}
                    />
                  )}
                  <span
                    className={`relative ${active === s.id ? "text-fg" : ""}`}
                  >
                    {s.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={`mailto:${site.email}`}
              className="hidden rounded-full border border-line-strong px-5 py-2 text-sm text-fg transition-all hover:border-gold hover:text-gold md:inline-block"
            >
              Get in touch
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line-strong md:hidden"
            >
              <span className="relative block h-3 w-4">
                <motion.span
                  className="absolute left-0 block h-px w-full bg-fg"
                  animate={open ? { top: 6, rotate: 45 } : { top: 0, rotate: 0 }}
                  transition={{ duration: 0.3, ease: EASE_IN_OUT }}
                />
                <motion.span
                  className="absolute left-0 block h-px w-full bg-fg"
                  animate={
                    open ? { top: 6, rotate: -45 } : { top: 12, rotate: 0 }
                  }
                  transition={{ duration: 0.3, ease: EASE_IN_OUT }}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.65, ease: EASE_IN_OUT }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-bg px-6 pt-20 md:hidden"
          >
            <ul className="space-y-2">
              {sections.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.07, ease: EASE_OUT }}
                >
                  <a
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-2"
                  >
                    <span
                      className={`font-mono text-[11px] ${
                        i % 2 === 0 ? "text-gold" : "text-rose"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span className="font-display text-5xl leading-tight">
                      {s.label}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-14 border-t border-line pt-6"
            >
              <a
                href={`mailto:${site.email}`}
                className="font-mono text-sm text-muted"
              >
                {site.email}
              </a>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {site.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sm text-faint transition-colors hover:text-rose"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
