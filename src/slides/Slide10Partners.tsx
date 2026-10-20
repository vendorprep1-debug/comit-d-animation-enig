import { SlideShell } from "@/components/SlideShell";
import { FadeIn } from "@/components/TextFx";
import { partners } from "@/data/forum";
import { cn } from "@/lib/utils";

type P = (typeof partners.list)[number];

function Pill({ p }: { p: P }) {
  return (
    <div className="mx-5 flex h-[260px] min-w-[500px] items-center justify-center gap-8 px-16 bg-white rounded-3xl shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:scale-105 flow:h-28 flow:min-w-[240px] flow:px-8">
      {p.logo ? (
        <img 
          src={p.logo} 
          alt={`Logo ${p.name}`} 
          className="max-h-[190px] max-w-[440px] object-contain flow:max-h-20" 
        />
      ) : (
        <>
          <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-sun font-display text-5xl text-navy flow:h-12 flow:w-12 flow:text-2xl" aria-hidden>
            {p.name[0]}
          </span>
          <span className="t-label !text-[36px] !tracking-wider flow:!text-base">{p.name}</span>
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
