# Comité d’Animation – Forum Entreprise ENIG 2026

Présentation plein écran (16:9) du Comité d’Animation du **GREEN TECH ENGINEERING FORUM 2026**.

## Modifier les textes
Tous les textes et données (programme, missions, partenaires, dates, couleur de fond par slide) se trouvent dans **`src/data/forum.ts`**. Modifiez les chaînes, enregistrez : la présentation se met à jour.

## Ajouter ou réordonner des slides
1. Créez un fichier `src/slides/SlideXX.tsx` qui exporte par défaut un composant enveloppé dans `<SlideShell>` (coordonnées 1920×1080).
2. Ajoutez-le dans **`src/slides/index.ts`** à la position voulue (l’ordre du tableau = l’ordre des slides).
3. Ajoutez une teinte correspondante dans `slideHues` (`forum.ts`).

## Logos
- ENIG et 4C : `public/logos/enig.svg` et `public/logos/4c.svg` (remplacez-les par les fichiers officiels, même nom, ou changez le chemin dans `src/components/LogoBar.tsx`).
- Partenaires : déposez les logos dans **`public/partners/`** (ex. `actia.png`) puis renseignez `logo: "/partners/actia.png"` dans `partners.list` de `forum.ts`. Sans logo, une pastille stylisée s’affiche.

## Musique d’ambiance
Déposez le fichier **`public/audio/ambiance.mp3`**. Le lecteur (bouton note de musique en bas à droite) est désactivé par défaut et joue en boucle.

## Raccourcis
← → / Espace : navigation · F : plein écran · G : vue d’ensemble · T : chronomètre · L : laser · S : spotlight · H : masquer l’interface · ? : aide · Échap : fermer. Swipe sur mobile.

## Impression
Ctrl/Cmd + P : une slide par page A4 paysage, fond sombre conservé, sans fond animé (activez « Graphiques d’arrière-plan »).
