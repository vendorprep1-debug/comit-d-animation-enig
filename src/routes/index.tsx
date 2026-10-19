import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { Deck } from "@/components/Deck";

const TITLE = "Comité d’Animation – Forum Entreprise ENIG 2026";
const DESC = "Présentation du Comité d’Animation du GREEN TECH ENGINEERING FORUM 2026 – 6ème édition du Forum des Entreprises ENIG, mercredi 11 novembre 2026 à Gabès.";

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): { slide?: number } => (Number(s["slide"]) > 0 ? { slide: Math.floor(Number(s["slide"])) } : {}),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
  }),
  component: Index,
});

function Index() {
  const { slide } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const onChange = useCallback(
    (i: number) => navigate({ search: { slide: i === 0 ? undefined : i + 1 }, replace: true }),
    [navigate],
  );
  return <Deck initial={(slide ?? 1) - 1} onChange={onChange} />;
}
