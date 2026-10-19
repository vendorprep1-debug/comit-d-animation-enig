import { motion } from "framer-motion";
import { useDeck } from "@/lib/deck-context";
import { cn } from "@/lib/utils";

export function LogoBar({ bounce = false, className }: { bounce?: boolean; className?: string }) {
  const { thumb, reduced } = useDeck();
  const anim = bounce && !thumb && !reduced;
  return (
    <motion.div
      className={cn("flex items-center gap-4 rounded-full bg-foreground px-5 py-2 shadow-lg flow:gap-2 flow:px-3 flow:py-1", className)}
      initial={anim ? { opacity: 0, y: 40, scale: 0.6 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 11, delay: 1.2 }}
    >
      <img src="/logos/enig.png" alt="Logo ENIG" className="h-10 w-auto flow:h-6" />
      <span className="h-8 w-px bg-navy/20" aria-hidden />
      <img src="/logos/4c.png" alt="Logo Centre 4C ENIG" className="h-10 w-auto flow:h-6" />
    </motion.div>
  );
}
