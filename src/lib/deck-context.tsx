import { createContext, useContext, useEffect, useState } from "react";

export interface DeckCtx {
  /** true en vue d'ensemble / impression : pas d'effets coûteux */
  thumb: boolean;
  /** mobile portrait : contenu empilé */
  flow: boolean;
  reduced: boolean;
}

export const DeckContext = createContext<DeckCtx>({ thumb: false, flow: false, reduced: false });
export const useDeck = () => useContext(DeckContext);

export function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(m.matches);
    const on = () => setR(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return r;
}

/** Heure actuelle à Tunis : clé de date AAAA-MM-JJ et minutes depuis minuit */
export function tunisNow(tz: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date());
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return { dateKey: `${g("year")}-${g("month")}-${g("day")}`, minutes: Number(g("hour")) * 60 + Number(g("minute")) };
}

export const toMinutes = (h: string) => {
  const [a, b] = h.split("h");
  return Number(a) * 60 + Number(b || 0);
};
