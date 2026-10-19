import { ChevronLeft, ChevronRight, LayoutGrid, Maximize, HelpCircle } from "lucide-react";

const btn = "glass flex h-11 w-11 items-center justify-center !rounded-full text-foreground transition hover:bg-foreground/15 disabled:opacity-30";

export function SlideNav({
  index, total, onPrev, onNext, onGrid, onFull, onHelp,
}: { index: number; total: number; onPrev: () => void; onNext: () => void; onGrid: () => void; onFull: () => void; onHelp: () => void }) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <nav className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2" aria-label="Navigation des slides">
      <button className={btn} onClick={onPrev} disabled={index === 0} aria-label="Slide précédente"><ChevronLeft className="h-5 w-5" /></button>
      <span className="glass t-num min-w-[92px] !rounded-full px-4 py-2 text-center text-sm" aria-live="polite">
        {pad(index + 1)} / {pad(total)}
      </span>
      <button className={btn} onClick={onNext} disabled={index === total - 1} aria-label="Slide suivante"><ChevronRight className="h-5 w-5" /></button>
      <button className={btn} onClick={onGrid} aria-label="Vue d’ensemble (G)"><LayoutGrid className="h-5 w-5" /></button>
      <button className={`${btn} max-sm:hidden`} onClick={onFull} aria-label="Plein écran (F)"><Maximize className="h-5 w-5" /></button>
      <button className={`${btn} max-sm:hidden`} onClick={onHelp} aria-label="Aide raccourcis (?)"><HelpCircle className="h-5 w-5" /></button>
    </nav>
  );
}
