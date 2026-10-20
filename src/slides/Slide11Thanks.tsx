import { useEffect, useRef } from "react";
import { SlideShell } from "@/components/SlideShell";
import { RevealTitle, FadeIn, DrawUnderline } from "@/components/TextFx";
import { thanks } from "@/data/forum";
import { useDeck } from "@/lib/deck-context";

const COLORS = ["#2FBF4F", "#9DFF3C", "#22E5FF", "#FFDD57"];

function Celebration() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = c.clientWidth || 1920, H = c.clientHeight || 1080; // taille de la scène (indépendante du scale)
    c.width = W * dpr; c.height = H * dpr;
    ctx.scale(dpr, dpr);
    type Pt = { x: number; y: number; vx: number; vy: number; c: string; r: number; rot: number; vr: number; life: number; hex: boolean };
    const pts: Pt[] = [];
    for (let i = 0; i < 160; i++) {
      pts.push({ x: Math.random() * W, y: -20 - Math.random() * H * 0.5, vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3,
        c: COLORS[i % 4], r: 5 + Math.random() * 6, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, life: 1, hex: false });
    }
    const burst = (x: number, y: number) => {
      for (let i = 0; i < 48; i++) {
        const a = (i / 48) * Math.PI * 2, s = 3 + Math.random() * 4;
        pts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, c: COLORS[i % 4], r: 4 + Math.random() * 4, rot: 0, vr: 0.1, life: 1, hex: true });
      }
    };
    const timers = [400, 1000, 1700, 2400].map((t, i) => setTimeout(() => burst(W * (0.2 + 0.2 * i), H * (0.25 + (i % 2) * 0.15)), t));
    const hex = (r: number) => { ctx.beginPath(); for (let k = 0; k < 6; k++) { const a = (Math.PI / 3) * k; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); };
    let raf = 0; const t0 = performance.now();
    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        if (p.hex) { p.vx *= 0.97; p.vy = p.vy * 0.97 + 0.05; p.life -= 0.012; } else { p.vy += 0.02; }
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        if (p.life <= 0 || p.y > H + 30) continue;
        ctx.save(); ctx.globalAlpha = Math.max(0, p.life); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
        if (p.hex) { hex(p.r); ctx.fill(); } else ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
        ctx.restore();
      }
      if (performance.now() - t0 < 7000) raf = requestAnimationFrame(loop); else ctx.clearRect(0, 0, W, H);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); };
  }, []);
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 z-30 h-full w-full" aria-hidden />;
}

export default function Slide11Thanks() {
  const { thumb, reduced } = useDeck();
  return (
    <SlideShell center>
      {!thumb && !reduced && <Celebration />}
      <RevealTitle text={thanks.big} className="t-hero !text-[300px] flow:!text-8xl" stagger={0.08} />
      <DrawUnderline width={520} delay={0.8} />
      <FadeIn delay={0.8}><p className="t-title mt-6 !text-[72px] text-cyan flow:!text-3xl">{thanks.sub}</p></FadeIn>
      <FadeIn delay={1.2}><p className="keyword t-sub mt-10 inline-block px-8 py-3 flow:px-4">{thanks.questions}</p></FadeIn>
      <FadeIn delay={1.6}><p className="t-small mt-12 text-muted-foreground">{thanks.signature}</p></FadeIn>
    </SlideShell>
  );
}
