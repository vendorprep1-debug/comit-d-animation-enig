import { Award, Sparkles, Network, Heart } from "lucide-react";
import { SlideShell } from "@/components/SlideShell";
import { TiltCard } from "@/components/TiltCard";
import { Typewriter } from "@/components/TextFx";
import { join } from "@/data/forum";

const icons = { award: Award, sparkles: Sparkles, network: Network, heart: Heart } as const;

export default function Slide09Join() {
  return (
    <SlideShell title={join.title}>
      <div className="grid flex-1 grid-cols-4 items-stretch gap-8 flow:grid-cols-1 flow:gap-4">
        {join.cards.map((c, i) => {
          const Icon = icons[c.icon as keyof typeof icons];
          return (
            <TiltCard key={c.title} index={i} className="flex min-h-[380px] flex-col p-9 flow:min-h-0 flow:p-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-sun flow:h-12 flow:w-12">
                <Icon className="h-12 w-12 text-navy flow:h-6 flow:w-6" aria-hidden />
              </div>
              <p className="mt-8 font-display text-[52px] leading-none flow:mt-3 flow:text-2xl">{c.title}</p>
              <p className="t-small mt-4 text-muted-foreground">{c.text}</p>
            </TiltCard>
          );
        })}
      </div>
      <Typewriter text={join.sentence} className="t-body mt-10 text-lime" delay={1.2} speed={30} />
    </SlideShell>
  );
}
