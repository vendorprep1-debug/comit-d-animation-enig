import { motion } from "framer-motion";
import { SlideShell } from "@/components/SlideShell";
import { RevealTitle, FadeIn, Float } from "@/components/TextFx";
import { welcome } from "@/data/forum";
import { useDeck } from "@/lib/deck-context";

function Microphone() {
  const { thumb, reduced } = useDeck();
  const anim = !thumb && !reduced;
  return (
    <div className="relative flex h-[640px] w-[560px] flex-col items-center justify-center flow:h-72 flow:w-full">
      {anim && [0, 1, 2].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute left-1/2 top-[38%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan flow:h-28 flow:w-28"
          initial={{ scale: 0.6, opacity: 0.8 }}
          animate={{ scale: 2.1, opacity: 0 }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
        />
      ))}
      <Float amp={10} duration={3.6}><svg viewBox="0 0 200 260" className="relative h-[460px] flow:h-52" role="img" aria-label="Micro stylisé">
        <defs>
          <linearGradient id="micG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--cyan)" />
            <stop offset="1" stopColor="var(--lime)" />
          </linearGradient>
        </defs>
        <rect x="62" y="10" width="76" height="130" rx="38" fill="url(#micG)" />
        {[40, 60, 80, 100].map((y) => <line key={y} x1="72" x2="128" y1={y} y2={y} stroke="var(--navy)" strokeWidth="4" opacity=".35" />)}
        <path d="M40 100 v10 a60 60 0 0 0 120 0 v-10" fill="none" stroke="var(--enig)" strokeWidth="10" strokeLinecap="round" />
        <line x1="100" y1="170" x2="100" y2="215" stroke="var(--enig)" strokeWidth="10" />
        <rect x="60" y="212" width="80" height="12" rx="6" fill="var(--sun)" />
      </svg></Float>
      <div className="mt-6 flex h-20 items-end gap-2 flow:h-10" aria-hidden>
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.span
            key={i}
            className="w-3 rounded-full bg-lime flow:w-1.5"
            style={{ height: "30%" }}
            animate={anim ? { height: ["20%", `${40 + ((i * 37) % 60)}%`, "25%"] } : undefined}
            transition={{ duration: 0.7 + (i % 4) * 0.15, repeat: Infinity, repeatType: "mirror", delay: i * 0.05 }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Slide02Welcome() {
  return (
    <SlideShell>
      <div className="grid flex-1 grid-cols-[1.3fr_1fr] items-center gap-16 flow:grid-cols-1 flow:gap-6">
        <div>
          <RevealTitle text={welcome.title} className="t-title" stagger={0.02} />
          <FadeIn delay={1.2}><p className="t-body mt-10 max-w-[900px] text-muted-foreground">{welcome.text}</p></FadeIn>
          <FadeIn delay={1.6}><span className="keyword t-sub mt-10 inline-block px-8 py-4 flow:px-4 flow:py-2">{welcome.tag}</span></FadeIn>
        </div>
        <FadeIn delay={0.4} className="flex justify-center"><Microphone /></FadeIn>
      </div>
    </SlideShell>
  );
}
