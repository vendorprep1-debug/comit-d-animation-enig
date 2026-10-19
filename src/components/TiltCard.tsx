import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useDeck } from "@/lib/deck-context";
import { cn } from "@/lib/utils";

/** Carte glass avec inclinaison 3D, reflet et bordure lumineuse tournante, apparition en cascade */
export function TiltCard({
  children, className, index = 0, max = 10, onClick, ariaLabel,
}: { children: ReactNode; className?: string; index?: number; max?: number; onClick?: () => void; ariaLabel?: string }) {
  const { thumb, reduced, flow } = useDeck();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const still = thumb || reduced || flow;

  const move = (e: React.MouseEvent) => {
    if (still || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    ref.current.style.setProperty("--gx", `${px * 100}%`);
    ref.current.style.setProperty("--gy", `${py * 100}%`);
  };
  const leave = () => { rx.set(0); ry.set(0); };
  const interactive = !!onClick;

  return (
    <motion.div
      ref={ref}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={interactive ? (e) => { if (e.key === "Enter") { e.stopPropagation(); onClick?.(); } } : undefined}
      onMouseMove={move}
      onMouseLeave={leave}
      initial={thumb ? false : { opacity: 0, y: reduced ? 0 : 40, scale: reduced ? 1 : 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.3 + index * 0.12, duration: 0.6, ease: "easeOut" }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={cn("glass glow-border relative", interactive && "cursor-pointer", className)}
    >
      <span className="glare" aria-hidden />
      {children}
    </motion.div>
  );
}
