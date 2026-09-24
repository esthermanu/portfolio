import { ArrowUp } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { site } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line pt-12">
      <Marquee className="py-2 opacity-90">
        {["Available for work", "Open to collaboration", "Say hello"].map((t, i) => (
          <span key={t} className="flex items-center gap-8 px-8">
            <span className="font-display text-5xl whitespace-nowrap text-fg/15 md:text-7xl">
              {t}
            </span>
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                i % 2 === 1 ? "bg-rose/50" : "bg-gold/40"
              }`}
            />
          </span>
        ))}
      </Marquee>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12 sm:px-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-2xl">
            <span className="duo-text">{site.initials}</span>
            <span className="ml-3 text-fg">{site.name}</span>
          </p>
          <p className="mt-2 font-mono text-[11px] tracking-[0.18em] text-faint uppercase">
            {site.role} · {site.location}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {site.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-sm text-muted transition-colors hover:text-gold"
            >
              {s.label}
            </a>
          ))}
          <a
            href="#top"
            aria-label="Back to top"
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-line-strong transition-colors hover:border-gold"
          >
            <ArrowUp
              size={15}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-gold"
            />
          </a>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 font-mono text-[10px] tracking-[0.18em] text-faint uppercase sm:flex-row sm:justify-between sm:px-10">
          <span>
            © {year} {site.name}. All rights reserved.
          </span>
          <span>Built with Next.js &amp; Motion</span>
        </div>
      </div>
    </footer>
  );
}
