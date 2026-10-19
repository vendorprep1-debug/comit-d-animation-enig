import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SlideShell } from "@/components/SlideShell";
import { forum, program, type Session, type SessionType } from "@/data/forum";
import { tunisNow, toMinutes, useDeck } from "@/lib/deck-context";
import { cn } from "@/lib/utils";

const typeStyle: Record<SessionType, string> = {
  Accueil: "bg-glass text-foreground border border-glass-border",
  Conférence: "bg-blue4c text-foreground",
  Entreprises: "bg-cyan text-navy",
  "Table ronde": "bg-orange4c text-navy",
  Concours: "bg-sun text-navy",
  Atelier: "bg-enig text-navy",
  Cérémonie: "bg-lime text-navy",
};

function useLiveSession() {
  const [now, setNow] = useState<{ dateKey: string; minutes: number } | null>(null);
  useEffect(() => {
    const tick = () => setNow(tunisNow(forum.timezone));
    tick();
    const iv = setInterval(tick, 30000);
    return () => clearInterval(iv);
  }, []);
  return (s: Session) => {
    if (!now || now.dateKey !== forum.eventDateKey) return false;
    const a = toMinutes(s.start);
    const b = s.end ? toMinutes(s.end) : a + 60;
    return now.minutes >= a && now.minutes < b;
  };
}

function Row({ s, i, live }: { s: Session; i: number; live: boolean }) {
  const { thumb } = useDeck();
  const dur = s.end ? toMinutes(s.end) - toMinutes(s.start) : 30;
  return (
    <motion.li
      className={cn("relative pl-14 flow:pl-8", live && "rounded-xl")}
      initial={thumb ? false : { opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.25 + i * 0.09 }}
    >
      <span className={cn("absolute left-[13px] top-3 h-5 w-5 rounded-full border-4 border-navy bg-lime flow:left-[5px] flow:h-3.5 flow:w-3.5 flow:border-2", live && "pulse-halo")} aria-hidden />
      <div className={cn("glass flex items-center gap-5 px-5 py-2.5 flow:flex-wrap flow:gap-2 flow:px-3", live && "border-lime shadow-[var(--shadow-glow)]")}>
        <span className="t-num w-[200px] shrink-0 text-[22px] text-cyan flow:w-auto flow:text-sm">{s.start}{s.end ? ` – ${s.end}` : ""}</span>
        <div className="min-w-0 flex-1">
          <p className="text-[24px] font-medium leading-snug flow:text-sm">{s.title}{live && <span className="t-label ml-3 text-lime">● En cours</span>}</p>
          {s.sub && (
            <ul className="mt-1 space-y-0.5 text-[20px] text-muted-foreground flow:text-xs">
              {s.sub.map((x) => <li key={x}>› {x}</li>)}
            </ul>
          )}
          <div className="mt-1.5 h-1.5 rounded-full bg-glass" aria-hidden>
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan to-lime"
              initial={thumb ? false : { width: 0 }}
              animate={{ width: `${(dur / 120) * 100}%` }}
              transition={{ delay: 0.6 + i * 0.09, duration: 0.8 }}
            />
          </div>
        </div>
        <span className={cn("t-label shrink-0 whitespace-nowrap rounded-full px-4 py-1 !text-[15px] flow:!text-[10px]", typeStyle[s.type])}>{s.type}</span>
      </div>
    </motion.li>
  );
}

export default function Slide07Program() {
  const { thumb } = useDeck();
  const [tab, setTab] = useState<"morning" | "afternoon">("morning");
  const isLive = useLiveSession();
  useEffect(() => {
    const n = tunisNow(forum.timezone);
    if (n.dateKey === forum.eventDateKey && n.minutes >= 13 * 60 + 30) setTab("afternoon");
  }, []);
  const list = program[tab];
  return (
    <SlideShell title={program.title}>
      <div className="-mt-4 mb-5 flex gap-3" role="tablist" aria-label="Période">
        {(["morning", "afternoon"] as const).map((t) => (
          <button
            key={t} role="tab" aria-selected={tab === t}
            onClick={(e) => { e.stopPropagation(); setTab(t); }}
            className={cn("t-label relative rounded-full px-7 py-2.5 transition-colors flow:px-4", tab === t ? "text-navy" : "text-foreground glass")}
          >
            {tab === t && <motion.span layoutId="tabpill" className="absolute inset-0 rounded-full bg-sun" />}
            <span className="relative">{t === "morning" ? "Matinée" : "Après-midi"}</span>
          </button>
        ))}
      </div>
      <div className="relative flex-1">
        <AnimatePresence mode="wait">
          <motion.ol
            key={tab}
            className="relative space-y-2.5"
            initial={thumb ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.span
              aria-hidden
              className="absolute left-[21px] top-2 w-1 origin-top rounded-full bg-gradient-to-b from-lime to-cyan flow:left-[10px]"
              style={{ bottom: 8 }}
              initial={thumb ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
            {list.map((s, i) => <Row key={s.start + s.title} s={s} i={i} live={isLive(s)} />)}
          </motion.ol>
        </AnimatePresence>
      </div>
    </SlideShell>
  );
}
