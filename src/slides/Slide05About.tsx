import { motion } from "framer-motion";
import { SlideShell } from "@/components/SlideShell";
import { FadeIn } from "@/components/TextFx";
import { about } from "@/data/forum";
import { useDeck } from "@/lib/deck-context";

export default function Slide05About() {
  const { thumb, reduced } = useDeck();
  const still = thumb || reduced;
  return (
    <SlideShell title={about.title}>
      <div className="flex flex-1 flex-col justify-center gap-16 flow:gap-8">
        <FadeIn delay={0.5}><p className="t-body max-w-[1350px] !text-[36px] flow:!text-base">{about.text}</p></FadeIn>
        <FadeIn delay={0.9}>
          <div className="keyword flex flex-wrap items-center justify-center gap-6 px-12 py-10 font-display flow:gap-2 flow:px-4 flow:py-5">
            {about.values.map((v, i) => (
              <span key={v} className="flex items-center gap-6 flow:gap-2">
                <motion.span
                  className="text-[110px] leading-none tracking-wide flow:text-4xl"
                  initial={still ? false : { opacity: 0.25, textShadow: "0 0 0 transparent" }}
                  animate={{ opacity: 1, textShadow: ["0 0 0px transparent", "0 0 30px oklch(1 0 0 / .9)", "0 0 0px transparent"] }}
                  transition={{ delay: 1.3 + i * 0.6, duration: 1.2 }}
                >
                  {v}
                </motion.span>
                {i < about.values.length - 1 && <span className="text-[70px] flow:text-2xl" aria-hidden>·</span>}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </SlideShell>
  );
}
