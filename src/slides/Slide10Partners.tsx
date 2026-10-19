import { SlideShell } from "@/components/SlideShell";
import { FadeIn } from "@/components/TextFx";
import { partners } from "@/data/forum";
import { cn } from "@/lib/utils";

type P = (typeof partners.list)[number];

function Pill({ p }: { p: P }) {
  return (
    <div className="glass mx-4 flex h-[180px] min-w-[380px] items-center justify-center gap-4 px-12 flow:h-20 flow:min-w-[180px] flow:px-6">
      {p.logo ? (
        <img 
          src={p.logo} 
          alt={`Logo ${p.name}`} 
          className="max-h-[120px] max-w-[320px] object-contain flow:max-h-14" 
        />
      ) : (
        <>
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-sun font-display text-3xl text-navy flow:h-8 flow:w-8 flow:text-lg" aria-hidden>
            {p.name[0]}
          </span>
          <span className="t-label !text-[26px] !tracking-wider flow:!text-xs">{p.name}</span>
        </>
      )}
    </div>
  );
}

function Row({ items, reverse }: { items: P[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-wrap overflow-hidden py-3 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div className={cn("marquee", reverse && "reverse")}>
        {doubled.map((p, i) => <div key={i} aria-hidden={i >= items.length}><Pill p={p} /></div>)}
      </div>
    </div>
  );
}

export default function Slide10Partners() {
  const half = Math.ceil(partners.list.length / 2);
  return (
    <SlideShell title={partners.title} kicker={partners.subtitle}>
      <FadeIn delay={0.5} className="flex flex-1 flex-col justify-center gap-8 -mx-[110px] flow:-mx-5 flow:gap-3">
        <Row items={partners.list.slice(0, half)} />
        <Row items={partners.list.slice(half)} reverse />
      </FadeIn>
    </SlideShell>
  );
}
