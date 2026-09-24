import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";
import { SplitText } from "@/components/ui/split-text";

type SectionProps = {
  id: string;
  /** Two-digit index shown in the eyebrow, e.g. "01". */
  index: string;
  label: string;
  title: string;
  lead?: string;
  children: ReactNode;
  className?: string;
};

export function Section({
  id,
  index,
  label,
  title,
  lead,
  children,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 px-6 py-24 sm:px-10 md:py-36 ${className ?? ""}`}
    >
      {/* Keeps the copy in its own layer above the page background. */}
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <header className="mb-14 md:mb-20">
          <Reveal y={16} duration={0.7}>
            <div className="flex items-center gap-4 font-mono text-[11px] tracking-[0.28em] text-faint uppercase">
              <span className={Number(index) % 2 === 0 ? "text-rose" : "text-gold"}>
                {index}
              </span>
              <span className="h-px w-10 bg-gradient-to-r from-rose to-transparent" />
              <span>{label}</span>
            </div>
          </Reveal>

          <h2 className="mt-6 max-w-3xl text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
            <SplitText text={title} />
          </h2>

          {lead && (
            <Reveal delay={0.15} className="mt-6 max-w-2xl">
              <p className="text-base leading-relaxed text-muted md:text-lg">{lead}</p>
            </Reveal>
          )}
        </header>

        {children}
      </div>
    </section>
  );
}
