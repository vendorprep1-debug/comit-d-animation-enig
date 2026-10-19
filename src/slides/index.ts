import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export interface SlideDef {
  id: string;
  title: string;
  component: LazyExoticComponent<ComponentType>;
  load: () => Promise<unknown>;
}

// Ordre des slides : réordonnez / ajoutez ici (et une teinte dans slideHues de forum.ts).
const defs: [string, string, () => Promise<{ default: ComponentType }>][] = [
  ["titre", "Comité d’Animation", () => import("./Slide01Title")],
  ["bienvenue", "Bienvenue", () => import("./Slide02Welcome")],
  ["forum", "Le forum en bref", () => import("./Slide03Overview")],
  ["objectifs", "Objectifs du forum", () => import("./Slide04Objectives")],
  ["qui", "Qui sommes-nous ?", () => import("./Slide05About")],
  ["missions", "Nos missions", () => import("./Slide06Missions")],
  ["programme", "Programme", () => import("./Slide07Program")],
  ["plan", "Plan d’action", () => import("./Slide08Plan")],
  ["rejoindre", "Pourquoi nous rejoindre ?", () => import("./Slide09Join")],
  ["partenaires", "Partenaires", () => import("./Slide10Partners")],
  ["merci", "Merci", () => import("./Slide11Thanks")],
];

export const slides: SlideDef[] = defs.map(([id, title, load]) => ({ id, title, component: lazy(load), load }));
