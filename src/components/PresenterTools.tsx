import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, Timer as TimerIcon, X, Volume2, VolumeX, Music } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { shortcuts } from "@/data/forum";

const iconBtn = "glass flex h-9 w-9 items-center justify-center !rounded-full hover:bg-foreground/15";

/** T : chronomètre / minuteur */
export function TimerWidget({ onClose }: { onClose: () => void }) {
  const [running, setRunning] = useState(false);
  const [down, setDown] = useState(false);
  const [preset, setPreset] = useState(15);
  const [ms, setMs] = useState(0);
  const last = useRef(0);
  useEffect(() => {
    if (!running) return;
    last.current = performance.now();
    const iv = setInterval(() => {
      const n = performance.now();
      setMs((v) => v + (n - last.current));
      last.current = n;
    }, 250);
    return () => clearInterval(iv);
  }, [running]);
  const shown = down ? Math.max(0, preset * 60000 - ms) : ms;
  const over = down && shown === 0;
  const mm = String(Math.floor(shown / 60000)).padStart(2, "0");
  const ss = String(Math.floor(shown / 1000) % 60).padStart(2, "0");
  return (
    <motion.div drag dragMomentum={false} className="glass fixed right-5 top-6 z-50 w-[250px] p-4" role="region" aria-label="Chronomètre"
      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between">
        <span className="t-label flex items-center gap-2 !text-xs text-lime"><TimerIcon className="h-4 w-4" />{down ? "Minuteur" : "Chrono"}</span>
        <button className={iconBtn} onClick={onClose} aria-label="Fermer le chronomètre"><X className="h-4 w-4" /></button>
      </div>
      <p className={`t-num my-2 text-center text-5xl ${over ? "text-orange4c" : "text-foreground"}`} role="timer">{mm}:{ss}</p>
      <div className="flex items-center justify-center gap-2">
        <button className={iconBtn} onClick={() => setRunning((r) => !r)} aria-label={running ? "Pause" : "Démarrer"}>{running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</button>
        <button className={iconBtn} onClick={() => { setMs(0); setRunning(false); }} aria-label="Réinitialiser"><RotateCcw className="h-4 w-4" /></button>
        <button className="glass t-label !rounded-full px-3 py-2 !text-[10px]" onClick={() => { setDown((d) => !d); setMs(0); }} aria-pressed={down}>
          {down ? "→ Chrono" : "→ Minuteur"}
        </button>
      </div>
      {down && (
        <label className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          Durée (min)
          <input type="number" min={1} max={180} value={preset} onChange={(e) => setPreset(Math.max(1, Number(e.target.value) || 1))}
            className="w-16 rounded-md border border-glass-border bg-navy px-2 py-1 text-foreground" />
        </label>
      )}
    </motion.div>
  );
}

/** L : pointeur laser vert foncé avec traînée (couleurs modifiables ci-dessous) */
const LASER_RGB = "11,93,30"; // vert foncé (#0B5D1E)
const LASER_HEX = "#0B5D1E";
const LASER_GLOW = "rgba(46,170,80,0.9)"; // halo plus clair pour rester visible sur fond sombre

export function Laser() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = () => { c.width = innerWidth * dpr; c.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size();
    const trail: { x: number; y: number; t: number }[] = [];
    let pos: { x: number; y: number } | null = null; // dernière position : le point reste affiché même immobile
    const mv = (e: PointerEvent) => { pos = { x: e.clientX, y: e.clientY }; trail.push({ ...pos, t: performance.now() }); };
    let raf = 0;
    const loop = () => {
      const now = performance.now();
      while (trail.length && now - trail[0].t > 350) trail.shift();
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      for (let i = 1; i < trail.length; i++) {
        const a = 1 - (now - trail[i].t) / 350;
        ctx.strokeStyle = `rgba(${LASER_RGB},${a})`; ctx.lineWidth = 7 * a;
        ctx.shadowBlur = 10 * a; ctx.shadowColor = LASER_GLOW;
        ctx.beginPath(); ctx.moveTo(trail[i - 1].x, trail[i - 1].y); ctx.lineTo(trail[i].x, trail[i].y); ctx.stroke();
      }
      if (pos) {
        const pulse = 1 + 0.12 * Math.sin(now / 180);
        ctx.shadowBlur = 22; ctx.shadowColor = LASER_GLOW; ctx.fillStyle = LASER_HEX;
        ctx.beginPath(); ctx.arc(pos.x, pos.y, 8 * pulse, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0; ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 1.5; ctx.stroke(); // fin liseré pour la lisibilité
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    addEventListener("pointermove", mv); addEventListener("resize", size);
    return () => { cancelAnimationFrame(raf); removeEventListener("pointermove", mv); removeEventListener("resize", size); };
  }, []);
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[60] h-full w-full" aria-hidden />;
}

/** S : spotlight */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mv = (e: PointerEvent) => {
      ref.current?.style.setProperty("--sx", `${e.clientX}px`);
      ref.current?.style.setProperty("--sy", `${e.clientY}px`);
    };
    addEventListener("pointermove", mv);
    return () => removeEventListener("pointermove", mv);
  }, []);
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[55]"
      style={{ background: "radial-gradient(circle 220px at var(--sx, 50%) var(--sy, 50%), transparent 0, transparent 60%, oklch(0 0 0 / .85) 100%)" }}
      aria-hidden
    />
  );
}

export function HelpDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-navy/80 p-4 backdrop-blur" onClick={onClose}>
      <motion.div role="dialog" aria-modal="true" aria-label="Raccourcis clavier" className="glass w-full max-w-md p-6"
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-4xl title-gradient">Raccourcis</h2>
          <button ref={ref} className={iconBtn} onClick={onClose} aria-label="Fermer l’aide"><X className="h-4 w-4" /></button>
        </div>
        <dl className="space-y-2">
          {shortcuts.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4 text-sm">
              <dt><kbd className="keyword px-2 py-1 text-xs">{k}</kbd></dt><dd className="text-muted-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </div>
  );
}

/** Lecteur d'ambiance : désactivé par défaut */
export function AmbientAudio() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);
  const [vol, setVol] = useState(0.4);
  const [error, setError] = useState(false);
  useEffect(() => { if (audio.current) audio.current.volume = vol; }, [vol]);
  useEffect(() => () => audio.current?.pause(), []);
  const toggle = async () => {
    if (!audio.current) { audio.current = new Audio("/audio/ambiance.mp3"); audio.current.loop = true; audio.current.volume = vol; }
    if (playing) { audio.current.pause(); setPlaying(false); return; }
    try { await audio.current.play(); setPlaying(true); setError(false); } catch { setError(true); }
  };
  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      {open && (
        <div className="glass flex items-center gap-2 !rounded-full px-3 py-2">
          <button onClick={toggle} aria-label={playing ? "Mettre la musique en pause" : "Lancer la musique d’ambiance"} className="text-lime">
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          {vol === 0 ? <VolumeX className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
          <input type="range" min={0} max={1} step={0.05} value={vol} onChange={(e) => setVol(Number(e.target.value))} aria-label="Volume" className="w-20 accent-[var(--lime)]" />
          {error && <span className="text-xs text-orange4c">Fichier audio absent</span>}
        </div>
      )}
      <button className={`${iconBtn} !h-11 !w-11`} onClick={() => setOpen((o) => !o)} aria-label="Musique d’ambiance" aria-expanded={open}>
        <Music className={`h-4 w-4 ${playing ? "text-lime" : ""}`} />
      </button>
    </div>
  );
}
