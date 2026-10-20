import { motion } from "framer-motion";
import { memo, useEffect, useState, type ElementType } from "react";
import { useDeck } from "@/lib/deck-context";
import { cn } from "@/lib/utils";

/** Titre révélé lettre par lettre avec masque, puis dégradé + shimmer */
export const RevealTitle = memo(function RevealTitle({
  text, className, as = "h1", delay = 0, stagger = 0.03,
}: { text: string; className?: string; as?: ElementType; delay?: number; stagger?: number }) {
  const { thumb, reduced } = useDeck();
  const instant = thumb || reduced;
  const [done, setDone] = useState(instant);
  const Tag = as;
  const words = text.split(" ");
  let i = 0;
  const total = text.replace(/ /g, "").length;
  useEffect(() => {
    if (instant) return;
    const t = setTimeout(() => setDone(true), (delay + total * stagger + 0.6) * 1000);
    return () => clearTimeout(t);
  }, [instant, delay, total, stagger]);

  if (done) return <Tag className={cn("title-gradient", className)} aria-label={text}>{text}</Tag>;
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block overflow-hidden whitespace-nowrap align-bottom" aria-hidden>
          {w.split("").map((ch) => {
            const d = delay + i++ * stagger;
            return (
              <motion.span
                key={i}
                className="inline-block text-foreground"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ delay: d, duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {ch}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
});

/** Effet machine à écrire avec curseur clignotant */
export function Typewriter({ text, className, delay = 0.6, speed = 38 }: { text: string; className?: string; delay?: number; speed?: number }) {
  const { thumb, reduced } = useDeck();
  const [n, setN] = useState(thumb || reduced ? text.length : 0);
  useEffect(() => {
    if (thumb || reduced) return;
    let iv: ReturnType<typeof setInterval>;
    const t = setTimeout(() => {
      iv = setInterval(() => setN((v) => (v >= text.length ? (clearInterval(iv), v) : v + 1)), speed);
    }, delay * 1000);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, [text, delay, speed, thumb, reduced]);
  return (
    <p className={className} aria-label={text}>
      <span aria-hidden>{text.slice(0, n)}</span>
      <span className="caret" aria-hidden />
    </p>
  );
}

/** Soulignement qui se dessine progressivement */
export function DrawUnderline({ className, delay = 0.8, width = 360 }: { className?: string; delay?: number; width?: number }) {
  const { thumb, reduced } = useDeck();
  return (
    <svg className={cn("block flow:w-40", className)} width={width} height="18" viewBox="0 0 360 18" fill="none" aria-hidden>
      <defs>
        <linearGradient id="ul" x1="0" x2="1">
          <stop offset="0" stopColor="var(--cyan)" />
          <stop offset="1" stopColor="var(--lime)" />
        </linearGradient>
      </defs>
      <motion.path
        d="M4 12 C 90 2, 200 2, 356 10"
        stroke="url(#ul)" strokeWidth="6" strokeLinecap="round"
        initial={{ pathLength: thumb || reduced ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration: 1.1, ease: "easeInOut" }}
      />
    </svg>
  );
}

/** Apparition simple fade + slide */
export function FadeIn({ children, delay = 0, y = 30, className }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  const { thumb, reduced } = useDeck();
  if (thumb) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/** Flottement doux et continu (icônes, illustrations) */
export function Float({ children, className, delay = 0, amp = 8, duration = 3.2 }: { children: React.ReactNode; className?: string; delay?: number; amp?: number; duration?: number }) {
  const { thumb, reduced } = useDeck();
  if (thumb || reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -amp, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}
