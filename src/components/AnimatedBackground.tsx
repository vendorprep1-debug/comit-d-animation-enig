import { memo, useEffect, useRef } from "react";
import { slideHues } from "@/data/forum";
import { useReducedMotion } from "@/lib/deck-context";

// Couleurs canvas (miroir des tokens CSS)
const GREEN = [47, 191, 79], CYAN = [34, 229, 255], LIME = [157, 255, 60];
const rgba = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const HEX_R = 38;

const ICON_PATHS = [
  ("M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z M2 21c0-3 1.85-5.36 5.08-6"),
  ("M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"),
  ("M12 12v10 M12 12 4 7 M12 12l8-5 M12 12V2 M10 22h4"),
  ("M5 5h14v14H5z M9 2v3 M15 2v3 M9 19v3 M15 19v3 M2 9h3 M2 15h3 M19 9h3 M19 15h3"),
  ("M7 19H4.8a1.8 1.8 0 0 1-1.6-2.7L7.2 9.5 M11 19h8.2a1.8 1.8 0 0 0 1.6-2.7l-1.3-2.1 M14 16l-3 3 3 3 M8.3 13.6 7.2 9.5 3.1 10.6 M9.3 5.8l1.1-1.9a1.8 1.8 0 0 1 3.1 0l3.9 6.8 M13.4 9.6l4.1 1.1 1.1-4.1"),
  ("M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8 M12 2v3 M12 19v3 M2 12h3 M19 12h3 M4.9 4.9l2.1 2.1 M17 17l2.1 2.1 M4.9 19.1 7 17 M17 7l2.1-2.1"),
];

interface Hex { x: number; y: number; lit: number }
interface Circuit { pts: [number, number][]; len: number; segs: number[]; pulses: number[]; speed: number; color: number[] }

function buildCircuits(W: number, H: number): Circuit[] {
  const n = W < 768 ? 8 : 12;
  const out: Circuit[] = [];
  const dirs: [number, number][] = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  for (let i = 0; i < n; i++) {
    let x = Math.random() * W, y = Math.random() * H;
    const pts: [number, number][] = [[x, y]];
    let d = dirs[Math.floor(Math.random() * 4)];
    const steps = 3 + Math.floor(Math.random() * 3);
    for (let s = 0; s < steps; s++) {
      const L = 60 + Math.random() * 180;
      x += d[0] * L; y += d[1] * L; pts.push([x, y]);
      // diagonale à 45°
      const turn = Math.random() < 0.5 ? 1 : -1;
      const dx = d[0] || turn, dy = d[1] || turn;
      const D = 30 + Math.random() * 50;
      x += dx * D; y += dy * D; pts.push([x, y]);
      if (d[0] === 0) d = [dx, 0]; else d = [0, dy];
    }
    const segs: number[] = []; let len = 0;
    for (let k = 1; k < pts.length; k++) { const l = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]); segs.push(l); len += l; }
    out.push({ pts, len, segs, pulses: [Math.random(), Math.random()], speed: 0.00006 + Math.random() * 0.0001, color: i % 2 ? LIME : CYAN });
  }
  return out;
}

function pointAt(c: Circuit, t: number): [number, number] {
  let d = t * c.len;
  for (let k = 0; k < c.segs.length; k++) {
    if (d <= c.segs[k]) {
      const f = d / c.segs[k], a = c.pts[k], b = c.pts[k + 1];
      return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
    }
    d -= c.segs[k];
  }
  return c.pts[c.pts.length - 1];
}

function hexPath(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.moveTo(x + r, y);
  for (let k = 1; k < 6; k++) { const a = (Math.PI / 3) * k; ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a)); }
  ctx.closePath();
}

function City() {
  const turbine = (x: number, s: number) => (
    <g transform={`translate(${x} ${200 - 150 * s}) scale(${s})`}>
      <path d="M-3 0 L-6 150 L6 150 L3 0Z" />
      <g className="spin-slow" style={{ transformOrigin: "0px 0px" }}>
        <path d="M0 0 L-4 -70 L4 -70Z" /><path d="M0 0 L-4 -70 L4 -70Z" transform="rotate(120)" /><path d="M0 0 L-4 -70 L4 -70Z" transform="rotate(240)" />
      </g>
      <circle r="6" />
    </g>
  );
  return (
    <svg viewBox="0 0 1600 200" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 h-[22vh] w-full fill-enig opacity-15" aria-hidden>
      <path d="M0 200 V150 H80 V110 H140 V150 H200 V90 L240 70 V150 H300 V120 H360 V200Z" />
      <path d="M420 200 V100 H460 V40 H480 V100 H520 V60 H540 V100 H600 L660 70 V100 L720 70 V100 L780 70 V200Z" />
      {[860, 920, 980].map((x) => <path key={x} d={`M${x} 200 V170 M${x - 30} 170 L${x + 20} 150 L${x + 40} 158 L${x - 10} 178Z`} />)}
      <rect x="1040" y="130" width="120" height="70" /><rect x="1180" y="100" width="80" height="100" /><rect x="1280" y="140" width="60" height="60" />
      <path d="M1360 200 V160 H1600 V200Z" />
      {turbine(1100, 0.9)}{turbine(1420, 1.1)}{turbine(1530, 0.75)}{turbine(330, 0.8)}
    </svg>
  );
}

/** Fond animé plein écran : une seule boucle rAF */
export const AnimatedBackground = memo(function AnimatedBackground({ slideIndex }: { slideIndex: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const shock = useRef(0);
  const reduced = useReducedMotion();

  useEffect(() => { shock.current = performance.now(); }, [slideIndex]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = 0, H = 0, hexes: Hex[] = [], circuits: Circuit[] = [];
    let grid: HTMLCanvasElement | null = null;
    const mobile = window.innerWidth < 768;
    const mouse = { x: -9999, y: -9999, nx: 0, ny: 0 };
    const icons = Array.from({ length: mobile ? 6 : 12 }, (_, i) => ({
      p: new Path2D(ICON_PATHS[i % ICON_PATHS.length]), x: Math.random(), y: Math.random(), s: 1.6 + Math.random() * 2.2,
      rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.0002, vy: 0.000008 + Math.random() * 0.00001,
      depth: 10 + Math.random() * 40, a: 0.08 + Math.random() * 0.07,
    }));
    const flies = Array.from({ length: mobile ? 25 : 60 }, () => ({
      x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.00004, vy: (Math.random() - 0.5) * 0.00004, ph: Math.random() * 6, r: 1 + Math.random() * 2,
    }));

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      hexes = [];
      const w = HEX_R * 1.5, h = HEX_R * Math.sqrt(3);
      for (let c = 0; c * w < W + w; c++) for (let r = 0; r * h < H + h; r++) hexes.push({ x: c * w, y: r * h + (c % 2 ? h / 2 : 0), lit: 0 });
      grid = document.createElement("canvas");
      grid.width = W * dpr; grid.height = H * dpr;
      const g = grid.getContext("2d")!;
      g.scale(dpr, dpr);
      g.strokeStyle = rgba(GREEN, 0.12); g.lineWidth = 1;
      g.beginPath(); for (const hx of hexes) hexPath(g as unknown as CanvasRenderingContext2D, hx.x, hx.y, HEX_R - 1); g.stroke();
      circuits = buildCircuits(W, H);
    };
    resize();

    const draw = (now: number, dt: number) => {
      ctx.clearRect(0, 0, W, H);
      if (grid) ctx.drawImage(grid, 0, 0, W, H);
      // hexagones qui s'illuminent
      if (!reduced && Math.random() < dt / 90) hexes[Math.floor(Math.random() * hexes.length)].lit = now;
      const sAge = now - shock.current, sR = sAge * 1.4;
      const sOn = !reduced && sAge < 2200;
      for (const hx of hexes) {
        let a = 0, col = GREEN;
        if (hx.lit) {
          const t = (now - hx.lit) / 2000;
          if (t >= 1) hx.lit = 0; else { a = Math.sin(t * Math.PI) * 0.35; col = t > 0.5 ? CYAN : GREEN; }
        }
        const dm = Math.hypot(hx.x - mouse.x, hx.y - mouse.y);
        if (dm < 190) { const w = (Math.sin(dm / 22 - now / 160) + 1) / 2; a = Math.max(a, (1 - dm / 190) * 0.3 * w); col = CYAN; }
        if (sOn) { const ds = Math.abs(Math.hypot(hx.x - W / 2, hx.y - H / 2) - sR); if (ds < 50) { a = Math.max(a, (1 - ds / 50) * 0.4 * (1 - sAge / 2200)); col = LIME; } }
        if (a > 0.01) { ctx.beginPath(); hexPath(ctx, hx.x, hx.y, HEX_R - 3); ctx.fillStyle = rgba(col, a * 0.5); ctx.fill(); ctx.strokeStyle = rgba(col, a); ctx.stroke(); }
      }
      // circuits
      ctx.lineWidth = 1.5;
      for (const c of circuits) {
        ctx.strokeStyle = rgba(GREEN, 0.18);
        ctx.beginPath(); c.pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
        ctx.fillStyle = rgba(GREEN, 0.4);
        const [sx, sy] = c.pts[0], [ex, ey] = c.pts[c.pts.length - 1];
        ctx.beginPath(); ctx.arc(sx, sy, 4, 0, 7); ctx.arc(ex, ey, 4, 0, 7); ctx.fill();
        const [mx, my] = c.pts[2] ?? c.pts[1]; ctx.fillRect(mx - 7, my - 5, 14, 10);
        for (let k = 0; k < c.pulses.length; k++) {
          if (!reduced) c.pulses[k] = (c.pulses[k] + c.speed * dt) % 1;
          const [px, py] = pointAt(c, c.pulses[k]);
          const grd = ctx.createRadialGradient(px, py, 0, px, py, 14);
          grd.addColorStop(0, rgba(c.color, 0.9)); grd.addColorStop(1, rgba(c.color, 0));
          ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(px, py, 14, 0, 7); ctx.fill();
        }
      }
      // icônes parallaxe
      ctx.lineWidth = 1.5; ctx.lineCap = "round"; ctx.lineJoin = "round";
      for (const ic of icons) {
        if (!reduced) { ic.y -= ic.vy * dt; ic.rot += ic.vr * dt; if (ic.y < -0.1) ic.y = 1.1; }
        ctx.save();
        ctx.translate(ic.x * W - mouse.nx * ic.depth, ic.y * H - mouse.ny * ic.depth);
        ctx.rotate(ic.rot); ctx.scale(ic.s, ic.s); ctx.translate(-12, -12);
        ctx.strokeStyle = rgba(LIME, ic.a); ctx.stroke(ic.p);
        ctx.restore();
      }
      // lucioles
      for (const f of flies) {
        if (!reduced) { f.x = (f.x + f.vx * dt + 1) % 1; f.y = (f.y + f.vy * dt + 1) % 1; }
        const a = 0.35 + 0.35 * Math.sin(now / 600 + f.ph);
        const x = f.x * W, y = f.y * H;
        const grd = ctx.createRadialGradient(x, y, 0, x, y, f.r * 5);
        grd.addColorStop(0, rgba(LIME, a)); grd.addColorStop(1, rgba(LIME, 0));
        ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(x, y, f.r * 5, 0, 7); ctx.fill();
      }
    };

    let raf = 0, last = performance.now(), acc = 0;
    const frameMs = mobile ? 1000 / 30 : 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(64, now - last);
      acc += dt; last = now;
      if (acc < frameMs) return;
      draw(now, acc); acc = 0;
    };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) { last = performance.now(); raf = requestAnimationFrame(loop); }
    };
    const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.nx = e.clientX / W - 0.5; mouse.ny = e.clientY / H - 0.5; };
    const onResize = () => { resize(); if (reduced) draw(performance.now(), 0); };

    if (reduced) draw(performance.now(), 0); else raf = requestAnimationFrame(loop);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  const hue = slideHues[slideIndex % slideHues.length];
  return (
    <div className="screen-only pointer-events-none fixed inset-0 z-0 overflow-hidden" style={{ background: "var(--gradient-bg)" }} aria-hidden>
      <div className="aurora left-[-10%] top-[-10%] h-[60vh] w-[60vw] bg-blue4c" />
      <div className="aurora bottom-[-15%] right-[-10%] h-[60vh] w-[55vw] bg-enig [animation-delay:-8s]" />
      <div className="aurora right-[20%] top-[30%] h-[30vh] w-[25vw] bg-orange4c !opacity-10 [animation-delay:-16s]" />
      <div
        className="absolute inset-0 opacity-[0.12] transition-[background-color] duration-[1200ms] [mask-image:radial-gradient(ellipse_at_50%_40%,#000,transparent_75%)]"
        style={{ backgroundColor: hue }}
      />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      <City />
    </div>
  );
});
