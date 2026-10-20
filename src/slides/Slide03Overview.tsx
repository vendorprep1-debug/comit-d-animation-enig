import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, MapPin, Layers } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { SlideShell } from "@/components/SlideShell";
import { TiltCard } from "@/components/TiltCard";
import { FadeIn, Typewriter, Float } from "@/components/TextFx";
import { forum, overview } from "@/data/forum";
import { useDeck } from "@/lib/deck-context";

const icons = { edition: Layers, date: CalendarDays, place: MapPin } as const;

const FlipDigit = memo(function FlipDigit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="glass relative h-[110px] w-[130px] overflow-hidden flow:h-14 flow:w-16" style={{ perspective: 400 }}>
        <AnimatePresence initial={false}>
          <motion.span
            key={value}
            className="t-num absolute inset-0 flex items-center justify-center text-[64px] text-lime flow:text-3xl"
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
        <span className="absolute inset-x-0 top-1/2 h-px bg-navy/60" aria-hidden />
      </div>
      <span className="t-label mt-2 text-muted-foreground">{label}</span>
    </div>
  );
});

function Countdown() {
  const { thumb } = useDeck();
  const target = new Date(forum.eventStartISO).getTime();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    if (thumb) return;
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, [thumb]);
  const ready = now !== null;
  const diff = Math.max(0, target - (now ?? target));
  const d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  const frac = Math.min(1, diff / (365 * 864e5));
  const R = 52, C = 2 * Math.PI * R;
  return (
    <div className="flex items-center gap-8 flow:flex-col flow:gap-3" aria-live="off">
      <div className="relative h-[130px] w-[130px] flow:h-20 flow:w-20" aria-hidden>
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={R} stroke="var(--glass-border)" strokeWidth="8" fill="none" />
          <circle cx="60" cy="60" r={R} stroke="var(--lime)" strokeWidth="8" fill="none" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (ready ? frac : 1)} style={{ transition: "stroke-dashoffset 1s" }} />
        </svg>
        <span className="t-num absolute inset-0 flex items-center justify-center text-2xl text-cyan flow:text-sm">{ready ? `J-${d}` : "J-…"}</span>
      </div>
      <div>
        <p className="t-label mb-3 text-cyan">{overview.countdownLabel}</p>
        <div className="flex gap-4 flow:gap-2" role="timer" aria-label={`${d} jours ${h} heures ${m} minutes`}>
          <FlipDigit value={ready ? String(d) : "--"} label="Jours" />
          <FlipDigit value={ready ? pad(h) : "--"} label="Heures" />
          <FlipDigit value={ready ? pad(m) : "--"} label="Min" />
          <FlipDigit value={ready ? pad(s) : "--"} label="Sec" />
        </div>
      </div>
    </div>
  );
}

export default function Slide03Overview() {
  return (
    <SlideShell title={overview.title} kicker={overview.subtitle}>
      <div className="grid grid-cols-4 gap-8 flow:grid-cols-1 flow:gap-4">
        {overview.cards.map((c, i) => {
          const Icon = icons[c.key as keyof typeof icons];
          return (
            <TiltCard key={c.key} index={i} className="flex min-h-[260px] flex-col justify-between p-8 flow:min-h-0 flow:p-5">
              {c.key === "4c" ? (
                <div className="w-fit rounded-2xl bg-foreground p-3"><img src="/logos/4c.png" alt="Logo Centre 4C" className="h-14 flow:h-8" /></div>
              ) : (
                Icon && <Float delay={i * 0.4} amp={6} className="w-fit"><Icon className="h-14 w-14 text-lime flow:h-8 flow:w-8" aria-hidden /></Float>
              )}
              <div className="mt-6">
                <p className="font-display text-[64px] leading-none flow:text-3xl">{c.big}</p>
                {c.small && <p className="t-small mt-2 text-muted-foreground">{c.small}</p>}
              </div>
            </TiltCard>
          );
        })}
      </div>
      <div className="mt-12 grid grid-cols-[1fr_auto] items-center gap-12 flow:mt-6 flow:grid-cols-1 flow:gap-6">
        <div>
          <FadeIn delay={0.9}><p className="t-body max-w-[900px]">{overview.sentence}</p></FadeIn>
          <Typewriter text={overview.slogan} className="t-sub mt-6 font-display !text-[48px] tracking-wide text-sun flow:!text-2xl" delay={1.4} />
        </div>
        <FadeIn delay={1}><Countdown /></FadeIn>
      </div>
    </SlideShell>
  );
}
