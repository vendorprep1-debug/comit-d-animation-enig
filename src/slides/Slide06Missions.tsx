import { motion } from "framer-motion";
import { Mic, Users, Handshake, Trophy } from "lucide-react";
import { useState } from "react";
import { SlideShell } from "@/components/SlideShell";
import { FadeIn } from "@/components/TextFx";
import { missions } from "@/data/forum";
import { useDeck } from "@/lib/deck-context";

function Clock({ anim }: { anim: boolean }) {
  const hand = (x2: number, y2: number, color: string, dur: number) => (
    <line x1="24" y1="24" x2={x2} y2={y2} stroke={color} strokeWidth="3.5" strokeLinecap="round">
      {anim && <animateTransform attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur={`${dur}s`} repeatCount="indefinite" />}
    </line>
  );
  return (
    <svg viewBox="0 0 48 48" className="h-14 w-14 flow:h-9 flow:w-9" aria-hidden>
      <circle cx="24" cy="24" r="20" fill="none" stroke="var(--lime)" strokeWidth="3.5" />
      {hand(24, 10, "var(--cyan)", 3)}
      {hand(33, 24, "var(--lime)", 36)}
      <circle cx="24" cy="24" r="2.5" fill="var(--sun)" />
    </svg>
  );
}

const icons = { mic: Mic, users: Users, handshake: Handshake, trophy: Trophy } as const;

function MissionCard({ m, i }: { m: (typeof missions.items)[number]; i: number }) {
  const { thumb, reduced } = useDeck();
  const anim = !thumb && !reduced;
  const [flipped, setFlipped] = useState(false);
  const Icon = icons[m.icon as keyof typeof icons];
  const toggle = () => setFlipped((f) => !f);
  return (
    <motion.div
      className="relative h-[560px] flow:h-56"
      style={{ perspective: 1200 }}
      initial={thumb ? false : { opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + i * 0.12 }}
    >
      <motion.div
        role="button" tabIndex={0}
        aria-pressed={flipped}
        aria-label={`Mission ${i + 1} : ${m.title}. Retourner la carte`}
        onClick={toggle}
        onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); toggle(); } }}
        className="relative h-full w-full cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: reduced ? 0 : 0.7 }}
      >
        <div className="glass glow-border absolute inset-0 flex flex-col p-7 flow:p-4" style={{ backfaceVisibility: "hidden" }}>
          <span className="t-num text-[64px] leading-none text-sun/90 flow:text-3xl">0{i + 1}</span>
          <div className="mt-6 flow:mt-2">
            {m.icon === "clock" ? <Clock anim={anim} /> : Icon && (
              <motion.div animate={anim ? { y: [0, -6, 0] } : undefined} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}>
                <Icon className="h-14 w-14 text-lime flow:h-9 flow:w-9" aria-hidden />
              </motion.div>
            )}
          </div>
          <p className="mt-6 font-display text-[42px] leading-tight flow:mt-2 flow:text-2xl">{m.title}</p>
          <p className="t-small mt-3 text-muted-foreground">{m.desc}</p>
        </div>
        <div
          className="keyword absolute inset-0 flex flex-col justify-center p-7 flow:p-4"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="font-display text-[42px] leading-tight flow:text-2xl">{m.title}</p>
          <p className="t-small mt-4 font-sans font-medium">{m.detail}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Slide06Missions() {
  return (
    <SlideShell title={missions.title}>
      <div className="grid grid-cols-5 gap-6 flow:grid-cols-1 flow:gap-4">
        {missions.items.map((m, i) => <MissionCard key={m.title} m={m} i={i} />)}
      </div>
      <FadeIn delay={1.2}><p className="t-label mt-8 text-cyan">{missions.hint}</p></FadeIn>
    </SlideShell>
  );
}
