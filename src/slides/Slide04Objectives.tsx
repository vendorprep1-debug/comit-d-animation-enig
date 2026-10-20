import { motion } from "framer-motion";
import { Presentation, Store, Wrench, Handshake } from "lucide-react";
import { useState } from "react";
import { SlideShell } from "@/components/SlideShell";
import { TiltCard } from "@/components/TiltCard";
import { FadeIn } from "@/components/TextFx";
import { objectives } from "@/data/forum";
import { useDeck } from "@/lib/deck-context";
import { cn } from "@/lib/utils";

const pillarIcons = { conf: Presentation, stands: Store, workshops: Wrench, meet: Handshake } as const;
const pos = [
  "left-1/2 top-0 -translate-x-1/2",
  "right-0 top-1/2 -translate-y-1/2",
  "left-1/2 bottom-0 -translate-x-1/2",
  "left-0 top-1/2 -translate-y-1/2",
];

function Orbit() {
  const { thumb, reduced, flow } = useDeck();
  const [hover, setHover] = useState<number | null>(null);
  if (flow) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {objectives.pillars.map((p) => {
          const Icon = pillarIcons[p.key as keyof typeof pillarIcons];
          return (
            <div key={p.key} className="glass p-3 text-center">
              <Icon className="mx-auto h-6 w-6 text-lime" aria-hidden />
              <p className="t-label mt-2">{p.label}</p>
              <p className="t-small mt-1 text-muted-foreground">{p.desc}</p>
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div className="relative mx-auto h-[540px] w-[600px]">
      <div className="absolute inset-[70px] rounded-full border border-dashed border-cyan/40" aria-hidden />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.svg
          viewBox="0 0 200 200" className="h-[220px] w-[220px]" aria-hidden
          animate={thumb || reduced ? undefined : { rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <polygon points="100,8 180,54 180,146 100,192 20,146 20,54" fill="var(--glass)" stroke="var(--lime)" strokeWidth="3" />
          <polygon points="100,30 161,65 161,135 100,170 39,135 39,65" fill="none" stroke="var(--cyan)" strokeWidth="1.5" opacity=".6" />
        </motion.svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-display text-[40px] leading-none text-lime">{objectives.hexLabel[0]}</span>
          <span className="t-num text-[28px] text-cyan">{objectives.hexLabel[1]}</span>
        </div>
      </div>
      {objectives.pillars.map((p, i) => {
        const Icon = pillarIcons[p.key as keyof typeof pillarIcons];
        const on = hover === i;
        return (
          <motion.button
            key={p.key}
            type="button"
            aria-label={`${p.label} : ${p.desc}`}
            onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(i)} onBlur={() => setHover(null)}
            className={cn("glass absolute z-10 w-[230px] p-4 text-center transition-shadow", pos[i], on && "shadow-[var(--shadow-glow)]")}
            initial={thumb ? false : { opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: on ? 1.15 : 1 }}
            transition={{ delay: hover === null && !thumb ? 0 : 0, type: "spring", stiffness: 260, damping: 18 }}
          >
            <Icon className="mx-auto h-10 w-10 text-lime" aria-hidden />
            <p className="t-label mt-2 !text-[17px]">{p.label}</p>
            <motion.p
              className="t-small overflow-hidden !text-[18px] text-muted-foreground"
              initial={false}
              animate={{ height: on ? "auto" : 0, opacity: on ? 1 : 0 }}
            >
              {p.desc}
            </motion.p>
          </motion.button>
        );
      })}
    </div>
  );
}

export default function Slide04Objectives() {
  const { thumb, reduced } = useDeck();
  return (
    <SlideShell title={objectives.title}>
      <div className="grid flex-1 grid-cols-[1.25fr_1fr] gap-12 flow:grid-cols-1 flow:gap-6">
        <div className="flex flex-col gap-6">
          <FadeIn delay={0.4}><p className="t-small text-muted-foreground">{objectives.text}</p></FadeIn>
          <div className="grid grid-cols-3 gap-5 flow:grid-cols-1">
            {objectives.axes.map((a, i) => (
              <TiltCard key={a.title} index={i + 2} className="p-6 flow:p-4">
                <p className="font-display text-[34px] leading-tight text-lime flow:text-xl">{a.title}</p>
                <ul className="t-small mt-3 space-y-1 text-muted-foreground">
                  {a.items.map((it, k) => (
                    <motion.li key={it}
                      initial={thumb ? false : { opacity: 0, x: reduced ? 0 : -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + i * 0.25 + k * 0.15, duration: 0.5 }}>• {it}</motion.li>
                  ))}
                </ul>
              </TiltCard>
            ))}
          </div>
        </div>
        <FadeIn delay={0.6}><Orbit /></FadeIn>
      </div>
      <FadeIn delay={1.4}>
        <p className="t-body mt-6 border-l-4 border-sun pl-6 italic">{objectives.conclusion}</p>
      </FadeIn>
    </SlideShell>
  );
}
