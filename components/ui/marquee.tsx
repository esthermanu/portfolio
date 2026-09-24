import type { ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  reverse?: boolean;
  fast?: boolean;
  className?: string;
};

/**
 * Seamless infinite row. The track holds two identical copies and shifts by
 * exactly -50%, so the loop never shows a seam. Pauses on hover; the CSS
 * reduced-motion rule freezes it entirely.
 */
export function Marquee({ children, reverse, fast, className }: MarqueeProps) {
  return (
    <div className={`marquee edge-fade overflow-hidden ${className ?? ""}`}>
      <div
        className={[
          "marquee-track flex w-max items-center",
          reverse && "marquee-track--rev",
          fast && "marquee-track--fast",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="flex items-center">{children}</div>
        <div className="flex items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
