import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SlideShell } from "@/components/SlideShell";
import { RevealTitle, FadeIn, DrawUnderline } from "@/components/TextFx";
import { forum } from "@/data/forum";
import { useDeck } from "@/lib/deck-context";
import { cn } from "@/lib/utils";

export default function Slide01Title() {
  const { thumb, reduced } = useDeck();
  return (
    <SlideShell center logoBounce>
      <FadeIn delay={0.1}>
        <span className={cn("t-label inline-block rounded-full border border-lime/60 px-6 py-2 text-lime flow:px-3", !thumb && !reduced && "pulse-halo")}>{forum.badge}</span>
      </FadeIn>
      <RevealTitle text={forum.committee} className="t-hero mt-8" delay={0.3} stagger={0.05} />
      <DrawUnderline className="mt-2" width={520} delay={1.3} />
      <FadeIn delay={1.2} className="mt-8 max-w-[1300px]">
        <p className="t-sub">
          <span className="font-display text-[1.25em] tracking-wide text-lime">{forum.forumName}</span>
          <span className="text-muted-foreground"> – {forum.theme}</span>
        </p>
      </FadeIn>
      <FadeIn delay={1.5} className="mt-10 space-y-2">
        <p className="t-body">Responsable de comité : <strong className="text-sun">{forum.responsible}</strong></p>
        <p className="t-small text-muted-foreground">Année universitaire : {forum.year}</p>
      </FadeIn>
      <motion.p
        className="t-label mt-14 flex items-center gap-3 text-cyan"
        initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.5, 1] }} transition={{ delay: 2.2, duration: 2 }}
      >
        {forum.startHint} <ArrowRight className="h-6 w-6" aria-hidden />
      </motion.p>
    </SlideShell>
  );
}
