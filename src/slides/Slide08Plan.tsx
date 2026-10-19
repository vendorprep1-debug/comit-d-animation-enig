import { motion } from "framer-motion";
import { CalendarCheck, Moon, Zap, MessageSquareHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { SlideShell } from "@/components/SlideShell";
import { actionPlan } from "@/data/forum";
import { useDeck } from "@/lib/deck-context";
import { cn } from "@/lib/utils";

const icons = [CalendarCheck, Moon, Zap, MessageSquareHeart];

export default function Slide08Plan() {
  const { thumb, reduced, flow } = useDeck();
  const n = actionPlan.steps.length;
  const [active, setActive] = useState(thumb || reduced ? n - 1 : -1);
  const [auto, setAuto] = useState(!(thumb || reduced));
  useEffect(() => {
    if (!auto) return;
    if (active >= n - 1) { setAuto(false); return; }
    const t = setTimeout(() => setActive((a) => a + 1), active < 0 ? 600 : 1400);
    return () => clearTimeout(t);
  }, [active, auto, n]);
  const pct = active < 0 ? 0 : (active / (n - 1)) * 100;

  return (
    <SlideShell title={actionPlan.title}>
      <div className="relative mt-16 flex-1 flow:mt-2">
        {!flow && (
          <div className="absolute left-[12.5%] right-[12.5%] top-[54px] h-2 rounded-full bg-glass" aria-hidden>
            <motion.div className="h-full rounded-full bg-gradient-to-r from-enig via-lime to-cyan" animate={{ width: `${pct}%` }} transition={{ duration: 0.9 }} />
          </div>
        )}
        <ol className="relative grid grid-cols-4 gap-8 flow:grid-cols-1 flow:gap-4">
          {actionPlan.steps.map((s, i) => {
            const Icon = icons[i];
            const on = i <= active;
            const current = i === active;
            return (
              <li key={s.title} className="flex flex-col items-center text-center flow:flex-row flow:items-start flow:gap-3 flow:text-left">
                <button
                  type="button"
                  aria-label={`Étape ${i + 1} : ${s.title}`}
                  aria-current={current ? "step" : undefined}
                  onClick={(e) => { e.stopPropagation(); setAuto(false); setActive(i); }}
                  className={cn(
                    "relative z-10 flex h-[116px] w-[116px] shrink-0 items-center justify-center rounded-full border-4 transition-all duration-500 flow:h-14 flow:w-14",
                    on ? "border-lime bg-navy-2 text-lime shadow-[var(--shadow-glow)]" : "border-glass-border bg-navy text-muted-foreground",
                    current && "scale-110",
                  )}
                >
                  <Icon className="h-12 w-12 flow:h-6 flow:w-6" aria-hidden />
                </button>
                <motion.div
                  className={cn("glass mt-8 w-full p-7 transition-opacity duration-500 flow:mt-0 flow:p-4", on ? "opacity-100" : "opacity-40")}
                  animate={{ y: current && !reduced ? -8 : 0 }}
                >
                  <p className="t-label text-sun">Étape {i + 1}</p>
                  <p className="mt-2 font-display text-[48px] leading-none flow:text-2xl">{s.title}</p>
                  <p className="t-small mt-4 text-muted-foreground">{s.text}</p>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </SlideShell>
  );
}
