// Tous les textes et données de la présentation. Modifiez ici sans toucher aux composants.

export const forum = {
  badge: "FORUM ENTREPRISE ENIG · 6ème ÉDITION",
  committee: "COMITÉ D’ANIMATION",
  forumName: "GREEN TECH ENGINEERING FORUM 2026",
  theme: "Innovation industrielle et technologies durables",
  responsible: "Mohamed Fateh Ismail",
  year: "2026–2027",
  startHint: "Appuyez sur → pour commencer",
  /** Début du forum, heure de Tunis (UTC+1) */
  eventStartISO: "2026-11-11T08:30:00+01:00",
  eventDateKey: "2026-11-11",
  timezone: "Africa/Tunis",
};

/** Teinte de fond par slide (même ordre que src/slides/index.ts) */
export const slideHues = [
  "#1E9BE9", "#2FBF4F", "#22E5FF", "#9DFF3C", "#FFDD57", "#2FBF4F",
  "#1E9BE9", "#22E5FF", "#F58220", "#9DFF3C", "#2FBF4F",
];

export const welcome = {
  title: "BIENVENUE DANS L’ÉQUIPE DU COMITÉ D’ANIMATION !",
  text: "Ensemble, animons un Forum d’Entreprise réussi grâce à notre engagement, notre collaboration et notre esprit d’équipe.",
  tag: "UNE RÉUSSITE COLLECTIVE !",
};

export const overview = {
  title: "LE FORUM EN BREF",
  subtitle: "Innovation industrielle et technologies durables",
  cards: [
    { key: "edition", big: "Édition 6.0", small: "Forum d’entreprise ENIG" },
    { key: "date", big: "11 NOV.", small: "Mercredi 11 novembre 2026" },
    { key: "place", big: "ENIG", small: "École Nationale d’Ingénieurs de Gabès" },
    { key: "4c", big: "Centre 4C", small: "" },
  ],
  sentence: "Un rendez-vous entre étudiants-ingénieurs, entreprises et partenaires autour de l’industrie de demain.",
  slogan: "Ensemble, concevons l’industrie durable de demain",
  countdownLabel: "Ouverture du forum dans",
};

export const objectives = {
  title: "OBJECTIFS DU FORUM",
  text: "L’édition 2026, intitulée « GREEN TECH ENGINEERING FORUM 2026 : Innovation industrielle et technologies durables », met en avant le rôle des technologies vertes, de l’ingénierie durable et de l’innovation industrielle dans la transformation du secteur industriel tunisien. Elle ambitionne de démontrer comment les solutions technologiques durables peuvent contribuer à bâtir une industrie plus performante, plus responsable et plus respectueuse de l’environnement.",
  axes: [
    { title: "Technologies vertes & ingénierie durable", items: ["énergie propre", "économie circulaire", "gestion de l’eau"] },
    { title: "Innovation industrielle & compétitivité", items: ["Industrie 4.0", "automatisation durable", "matériaux innovants"] },
    { title: "Impact : industrie responsable & performante", items: ["décarbonation", "emplois verts", "croissance durable"] },
  ],
  pillars: [
    { key: "conf", label: "Conférences", desc: "Experts et décideurs partagent leur vision." },
    { key: "stands", label: "Stands", desc: "Les entreprises présentent leurs solutions." },
    { key: "workshops", label: "Workshops", desc: "Ateliers pratiques et formations." },
    { key: "meet", label: "Rencontres professionnelles", desc: "Échanges directs étudiants ↔ entreprises." },
  ],
  hexLabel: ["GREEN TECH", "2026"],
  conclusion: "Un véritable catalyseur d’idées, d’innovations et de partenariats au service du développement industriel, technologique et durable en Tunisie.",
};

export const about = {
  title: "QUI SOMMES-NOUS ?",
  text: "Le Comité d’Animation est le cœur de l’événement. Il assure la présentation, le bon déroulement et le respect du temps des sessions du programme, et accompagne les invités et les intervenants tout au long de la journée. Notre objectif : un forum vivant, fluide et professionnel.",
  values: ["DYNAMISME", "COMMUNICATION", "RIGUEUR"],
};

export const missions = {
  title: "NOS MISSIONS",
  hint: "Cliquez sur une carte pour la retourner",
  items: [
    { icon: "clock", title: "Gérer le temps", desc: "Respecter les horaires et fluidifier les enchaînements du programme.", detail: "Chronomètre, signaux discrets aux intervenants, ajustements en temps réel." },
    { icon: "mic", title: "Présenter le programme", desc: "Mots d’ouverture, conférences, interventions flash des entreprises.", detail: "Scripts préparés, transitions soignées entre chaque session." },
    { icon: "users", title: "Animer la table ronde", desc: "« Économie circulaire & RSE dans la Formation ».", detail: "Questions préparées, distribution équitable de la parole, échanges avec le public." },
    { icon: "handshake", title: "Accueillir et coordonner", desc: "Invités et intervenants (briefing, accompagnement, mise en relation).", detail: "Point d’accueil, accompagnement en salle, liaison avec les autres comités." },
    { icon: "trophy", title: "Animer le concours et la clôture", desc: "Concours « Green Tech Innov’ » (pitches étudiants), ateliers, clôture du forum et remise des prix.", detail: "Gestion des passages, annonce des lauréats, cérémonie de clôture." },
  ],
};

export type SessionType = "Accueil" | "Conférence" | "Table ronde" | "Concours" | "Atelier" | "Cérémonie" | "Entreprises";

export interface Session {
  start: string;
  end?: string;
  title: string;
  type: SessionType;
  sub?: string[];
}

export const program: { title: string; morning: Session[]; afternoon: Session[] } = {
  title: "PROGRAMME PRÉVISIONNEL DU FORUM",
  morning: [
    { start: "08h30", end: "09h00", title: "Accueil & Inscription", type: "Accueil" },
    { start: "09h00", end: "09h15", title: "Mots d’Ouverture Officiels", type: "Cérémonie" },
    { start: "09h15", end: "09h45", title: "Conférence 1 : Stratégie Nationale d’Innovation Verte", type: "Conférence" },
    { start: "09h45", end: "10h15", title: "Conférence 2 : Jumeaux Numériques & Intelligence Artificielle", type: "Conférence" },
    { start: "10h15", end: "10h45", title: "Conférence 3 : Biocomposites & Matériaux Biosourcés", type: "Conférence" },
    { start: "10h45", end: "11h30", title: "Interventions Industrielles : Présentations Flash des Entreprises", type: "Entreprises" },
    { start: "11h30", end: "12h00", title: "Conférence 4 : Énergies Renouvelables & Hydrogène Vert", type: "Conférence" },
    { start: "12h00", end: "13h00", title: "Table Ronde : Économie Circulaire & RSE dans la Formation", type: "Table ronde" },
  ],
  afternoon: [
    { start: "14h00", end: "15h00", title: "Concours « Green Tech Innov’ » : Pitches Étudiants", type: "Concours" },
    {
      start: "15h00", end: "17h00", title: "Ateliers Techniques & Formations Pratiques", type: "Atelier",
      sub: [
        "Session A : Éco-conception & Analyse du Cycle de Vie (ACV)",
        "Session B : IoT & Maintenance Prédictive Industrielle",
        "Session C : Management de l’Environnement & Audit Énergétique",
      ],
    },
    { start: "17h00", title: "Clôture du Forum & Remise des Prix", type: "Cérémonie" },
  ],
};

export const actionPlan = {
  title: "NOTRE PLAN D’ACTION",
  steps: [
    { title: "Avant le forum", text: "Planification, conducteur détaillé (run of show), scripts de présentation, briefing des intervenants." },
    { title: "La veille", text: "Répétition générale, tests son et micro, vérification du programme avec les autres comités." },
    { title: "Le jour J", text: "Animation, gestion du temps, coordination des invités, gestion des imprévus." },
    { title: "Après le forum", text: "Bilan, remerciements, retours d’expérience." },
  ],
};

export const join = {
  title: "POURQUOI NOUS REJOINDRE ?",
  cards: [
    { icon: "award", title: "Attestation de participation", text: "Valorisable sur votre CV" },
    { icon: "sparkles", title: "Expérience", text: "Prise de parole en public, leadership, gestion du temps" },
    { icon: "network", title: "Réseau", text: "Contact direct avec les entreprises, les intervenants et les enseignants" },
    { icon: "heart", title: "Esprit d’équipe", text: "Une aventure collective" },
  ],
  sentence: "Une question ? N’hésitez pas à demander : cette expérience sera très enrichissante !",
};

export const partners = {
  title: "ILS NOUS FONT CONFIANCE",
  subtitle: "Forum des Entreprises 5.0 · Industrie 5.0 et Développement durable",
  /** logo : chemin optionnel dans public/partners/ (ex. "/partners/actia.png") */
  list: [
    { name: "ETAP-OMV", logo: "/partners/etap.png" },
    { name: "Oasis des Sciences", logo: "/partners/oasis.png" },
    { name: "Université de Gabès", logo: "/partners/univ.png" },
    { name: "ENIG", logo: "/partners/enig.png" },
    { name: "Groupe STUDI", logo: "/partners/studi.png" },
    { name: "SECIL", logo: "/partners/secil.png" },
    { name: "M3E", logo: "/partners/m3e.png" },
    { name: "ACTIA", logo: "/partners/actia.png" },
    { name: "DNA Consulting", logo: "/partners/dna.png" },
    { name: "OneTech", logo: "/partners/one.png" },
  ],
};

export const thanks = {
  big: "MERCI",
  sub: "POUR VOTRE ATTENTION",
  questions: "Des questions ?",
  signature: "Responsable du comité d’animation – Mohamed Fateh Ismail · 2026–2027",
};

export const shortcuts = [
  ["← → / Espace", "Slide précédente / suivante"],
  ["F", "Plein écran"],
  ["G", "Vue d’ensemble"],
  ["T", "Chronomètre / minuteur"],
  ["L", "Pointeur laser"],
  ["S", "Mode Spotlight"],
  ["H", "Masquer / afficher l’interface"],
  ["?", "Aide"],
  ["Échap", "Fermer"],
];
