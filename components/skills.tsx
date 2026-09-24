import { Marquee } from "@/components/ui/marquee";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { marqueeSkills, skillGroups } from "@/content/site";

export function Skills() {
  return (
    <Section
      id="skills"
      index="03"
      label="Capabilities"
      title="What I reach for."
      lead="A deliberately small toolkit — chosen so I can go deep rather than wide."
      className="bg-surface/30"
    >
      <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
        {skillGroups.map((group, gi) => (
          <Reveal key={group.title} delay={gi * 0.1}>
            <div className="group h-full bg-bg p-7 transition-colors duration-500 hover:bg-surface md:p-8">
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl">{group.title}</h3>
                <span
                  className={`font-mono text-[10px] ${
                    gi % 2 === 1 ? "text-rose" : "text-gold"
                  }`}
                >
                  0{gi + 1}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted">
                {group.blurb}
              </p>

              <span className="mt-6 mb-6 block h-px w-full origin-left scale-x-[0.3] bg-gradient-to-r from-gold/60 via-rose/50 to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100" />

              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className={`rounded-full border border-line px-3.5 py-1.5 text-xs text-muted transition-all duration-300 hover:-translate-y-0.5 ${
                      gi % 2 === 1
                        ? "hover:border-rose/50 hover:text-rose"
                        : "hover:border-gold/50 hover:text-gold"
                    }`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Two counter-scrolling rows of tech */}
      <div className="mt-16 space-y-4">
        <Marquee>
          {marqueeSkills.map((s, i) => (
            <MarqueeItem key={`a-${s}`} label={s} rose={i % 2 === 1} />
          ))}
        </Marquee>
        <Marquee reverse fast>
          {[...marqueeSkills].reverse().map((s, i) => (
            <MarqueeItem key={`b-${s}`} label={s} muted rose={i % 2 === 0} />
          ))}
        </Marquee>
      </div>
    </Section>
  );
}

function MarqueeItem({
  label,
  muted,
  rose,
}: {
  label: string;
  muted?: boolean;
  rose?: boolean;
}) {
  return (
    <span className="flex items-center gap-8 px-8">
      <span
        className={`font-display text-3xl whitespace-nowrap md:text-4xl ${
          muted ? "text-faint" : "text-fg/85"
        }`}
      >
        {label}
      </span>
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
          rose ? "bg-rose/70" : "bg-gold/60"
        }`}
      />
    </span>
  );
}
