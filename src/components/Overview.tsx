import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Suspense, useEffect, useRef } from "react";
import { slides } from "@/slides";
import { DeckContext } from "@/lib/deck-context";
import { ScaledStage } from "./ScaledStage";
import { cn } from "@/lib/utils";

export function Overview({ current, onPick, onClose }: { current: number; onPick: (i: number) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.querySelector<HTMLButtonElement>("[data-current=true]")?.focus(); }, []);
  return (
    <motion.div
      ref={ref}
      role="dialog" aria-modal="true" aria-label="Vue d’ensemble des slides"
      className="fixed inset-0 z-50 overflow-y-auto bg-navy/90 p-6 backdrop-blur-md sm:p-10"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-4xl title-gradient">Vue d’ensemble</h2>
        <button onClick={onClose} aria-label="Fermer la vue d’ensemble" className="glass flex h-11 w-11 items-center justify-center !rounded-full"><X className="h-5 w-5" /></button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {slides.map((s, i) => {
          const C = s.component;
          return (
            <button
              key={s.id}
              data-current={i === current}
              onClick={() => onPick(i)}
              aria-label={`Aller à la slide ${i + 1} : ${s.title}`}
              className={cn("group text-left", i === current && "")}
            >
              <div className={cn("relative aspect-video overflow-hidden rounded-xl border-2 transition", i === current ? "border-lime shadow-[var(--shadow-glow)]" : "border-glass-border group-hover:border-cyan")} style={{ background: "var(--gradient-bg)" }}>
                <div className="pointer-events-none absolute inset-0" aria-hidden inert>
                  <DeckContext.Provider value={{ thumb: true, flow: false, reduced: true }}>
                    <ScaledStage><Suspense fallback={null}><C /></Suspense></ScaledStage>
                  </DeckContext.Provider>
                </div>
              </div>
              <p className="t-num mt-2 text-sm"><span className="text-lime">{String(i + 1).padStart(2, "0")}</span> · {s.title}</p>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
