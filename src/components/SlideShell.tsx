import type { ReactNode } from "react";
import { LogoBar } from "./LogoBar";
import { RevealTitle, DrawUnderline } from "./TextFx";
import { cn } from "@/lib/utils";

/** Cadre commun : carrés jaunes, titre, contenu, bandeau logos */
export function SlideShell({
  title, kicker, children, className, center = false, hideLogos = false, logoBounce = false,
}: {
  title?: string; kicker?: string; children: ReactNode; className?: string;
  center?: boolean; hideLogos?: boolean; logoBounce?: boolean;
}) {
  return (
    <section
      className={cn(
        "relative flex h-full w-full flex-col px-[110px] pb-[120px] pt-[90px]",
        "flow:h-auto flow:min-h-[100svh] flow:px-5 flow:pb-28 flow:pt-16",
        center && "items-center justify-center text-center",
        className,
      )}
    >
      <span className="corner-sq left-10 top-10 flow:left-3 flow:top-3 flow:h-3 flow:w-3" aria-hidden />
      <span className="corner-sq left-[74px] top-10 h-3 w-3 opacity-70 flow:hidden" aria-hidden />
      <span className="corner-sq bottom-10 right-10 flow:bottom-3 flow:right-3 flow:h-3 flow:w-3" aria-hidden />
      <span className="corner-sq bottom-10 right-[74px] h-3 w-3 opacity-70 flow:hidden" aria-hidden />
      {title && (
        <header className={cn("mb-10 flow:mb-6", center && "flex flex-col items-center")}>
          {kicker && <p className="t-label mb-3 text-lime">{kicker}</p>}
          <RevealTitle text={title} className="t-title" as="h2" />
          <DrawUnderline className="mt-2" />
        </header>
      )}
      <div className={cn("relative flex min-h-0 flex-1 flex-col", center && "items-center justify-center")}>{children}</div>
      {!hideLogos && <LogoBar bounce={logoBounce} className="absolute bottom-8 left-10 flow:bottom-4 flow:left-4" />}
    </section>
  );
}
