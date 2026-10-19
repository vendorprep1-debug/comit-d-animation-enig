import { AnimatePresence, motion } from "framer-motion";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { slides } from "@/slides";
import { DeckContext, useReducedMotion } from "@/lib/deck-context";
import { AnimatedBackground } from "./AnimatedBackground";
import { ProgressBar } from "./ProgressBar";
import { SlideNav } from "./SlideNav";
import { Overview } from "./Overview";
import { ScaledStage } from "./ScaledStage";
import { TimerWidget, Laser, Spotlight, HelpDialog, AmbientAudio } from "./PresenterTools";

const hex = (r: number) =>
  `polygon(${Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k + Math.PI / 6;
    return `${(50 + r * Math.cos(a)).toFixed(2)}% ${(50 + r * Math.sin(a) * (16 / 9)).toFixed(2)}%`;
  }).join(", ")})`;
const HEX_SMALL = hex(0);
const HEX_BIG = hex(130);

export function Deck({ initial, onChange }: { initial: number; onChange: (i: number) => void }) {
  const total = slides.length;
  const [index, setIndex] = useState(() => Math.min(Math.max(initial, 0), total - 1));
  const [dir, setDir] = useState(1);
  const [grid, setGrid] = useState(false);
  const [help, setHelp] = useState(false);
  const [timer, setTimer] = useState(false);
  const [laser, setLaser] = useState(false);
  const [spot, setSpot] = useState(false);
  const [ui, setUi] = useState(true);
  const [flow, setFlow] = useState(false);
  const [clip, setClip] = useState(true);
  const [printing, setPrinting] = useState(false);
  const reduced = useReducedMotion();
  const touch = useRef<{ x: number; y: number } | null>(null);
  const flowRef = useRef<HTMLDivElement>(null);

  const go = useCallback((i: number) => {
    setIndex((cur) => {
      const n = Math.min(Math.max(i, 0), total - 1);
      if (n !== cur) setDir(n > cur ? 1 : -1);
      return n;
    });
  }, [total]);
  const next = useCallback(() => setIndex((c) => { if (c < total - 1) { setDir(1); return c + 1; } return c; }), [total]);
  const prev = useCallback(() => setIndex((c) => { if (c > 0) { setDir(-1); return c - 1; } return c; }), []);

  useEffect(() => {
    onChange(index);
    document.title = `${String(index + 1).padStart(2, "0")}/${total} — ${slides[index].title} · Comité d’Animation`;
    flowRef.current?.scrollTo({ top: 0 });
  }, [index, total, onChange]);

  // détection mobile portrait + support clip-path + préchargement des slides
  useEffect(() => {
    const check = () => setFlow(window.innerWidth < 768 && window.innerHeight > window.innerWidth);
    check();
    setClip(CSS.supports("clip-path", "polygon(0 0, 100% 0, 0 100%)"));
    window.addEventListener("resize", check);
    const idle = setTimeout(() => slides.forEach((s) => s.load()), 1500);
    const before = () => flushSync(() => setPrinting(true));
    const after = () => setPrinting(false);
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => { window.removeEventListener("resize", check); clearTimeout(idle); window.removeEventListener("beforeprint", before); window.removeEventListener("afterprint", after); };
  }, []);

  const toggleFull = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select")) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key;
      if (k === "Escape") { setGrid(false); setHelp(false); setLaser(false); setSpot(false); return; }
      if (k === "?") { setHelp((h) => !h); return; }
      if (grid || help) return;
      if (k === "ArrowRight" || k === "PageDown" || (k === " " && t.tagName !== "BUTTON")) { e.preventDefault(); next(); }
      else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); prev(); }
      else if (k === "Home") go(0);
      else if (k === "End") go(total - 1);
      else switch (k.toLowerCase()) {
        case "f": toggleFull(); break;
        case "g": setGrid(true); break;
        case "t": setTimer((v) => !v); break;
        case "l": setLaser((v) => !v); setSpot(false); break;
        case "s": setSpot((v) => !v); setLaser(false); break;
        case "h": setUi((v) => !v); break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [grid, help, next, prev, go, total, toggleFull]);

  const ctx = useMemo(() => ({ thumb: false, flow, reduced }), [flow, reduced]);
  const Current = slides[index].component;
  const useHex = clip && !reduced && !flow;

  const variants = {
    enter: (d: number) => useHex
      ? (d > 0 ? { clipPath: HEX_SMALL, zIndex: 2, opacity: 1 } : { clipPath: HEX_BIG, zIndex: 1, opacity: 1 })
      : { opacity: 0, x: reduced ? 0 : d * 60 },
    center: { clipPath: useHex ? HEX_BIG : undefined, opacity: 1, x: 0, transitionEnd: { clipPath: "none" } },
    exit: (d: number) => useHex
      ? (d > 0 ? { zIndex: 1, opacity: 1, clipPath: HEX_BIG } : { zIndex: 2, clipPath: HEX_SMALL })
      : { opacity: 0, x: reduced ? 0 : -d * 60 },
  };

  const body = (
    <AnimatePresence initial={false} custom={dir}>
      <motion.div
        key={index}
        custom={dir}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: useHex ? 0.9 : 0.45, ease: [0.65, 0, 0.35, 1] }}
        className={flow ? "relative" : "absolute inset-0"}
        style={useHex ? { background: "var(--gradient-bg)" } : undefined}
      >
        {useHex && <div className="pointer-events-none absolute inset-0 opacity-0" aria-hidden />}
        <Suspense fallback={null}><Current /></Suspense>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <DeckContext.Provider value={ctx}>
      <main
        className="screen-only fixed inset-0 overflow-hidden"
        data-flow={flow}
        onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
        onTouchEnd={(e) => {
          const s = touch.current; if (!s) return;
          const dx = e.changedTouches[0].clientX - s.x, dy = e.changedTouches[0].clientY - s.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? next : prev)();
          touch.current = null;
        }}
        aria-roledescription="présentation"
      >
        <AnimatedBackground slideIndex={index} />
        <h1 className="sr-only">Comité d’Animation – Forum Entreprise ENIG 2026</h1>
        <div
          ref={flowRef}
          className={flow ? "relative z-10 h-full overflow-y-auto overflow-x-hidden" : "relative z-10 h-full w-full"}
          aria-live="polite"
          aria-label={`Slide ${index + 1} sur ${total} : ${slides[index].title}`}
          role="region"
        >
          {flow ? body : <ScaledStage>{body}</ScaledStage>}
        </div>
        {ui && (
          <>
            <ProgressBar index={index} total={total} />
            <SlideNav index={index} total={total} onPrev={prev} onNext={next} onGrid={() => setGrid(true)} onFull={toggleFull} onHelp={() => setHelp(true)} />
            <AmbientAudio />
          </>
        )}
        {timer && <TimerWidget onClose={() => setTimer(false)} />}
        {laser && <Laser />}
        {spot && <Spotlight />}
        {help && <HelpDialog onClose={() => setHelp(false)} />}
        <AnimatePresence>{grid && <Overview current={index} onPick={(i) => { go(i); setGrid(false); }} onClose={() => setGrid(false)} />}</AnimatePresence>
      </main>
      {printing && (
        <div className="print-root">
          <DeckContext.Provider value={{ thumb: true, flow: false, reduced: true }}>
            {slides.map((s) => {
              const C = s.component;
              return (
                <div key={s.id} className="print-page">
                  <div className="print-inner absolute left-0 top-0 h-[1080px] w-[1920px] origin-top-left" style={{ transform: "scale(0.585)" }}>
                    <Suspense fallback={null}><C /></Suspense>
                  </div>
                </div>
              );
            })}
          </DeckContext.Provider>
        </div>
      )}
    </DeckContext.Provider>
  );
}
