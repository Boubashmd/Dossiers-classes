import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";

// Logo de la chaîne (refonte du 07/11/2026 : « le dossier qui regarde »).
// Fichiers dans public/logo/ (originaux et règles d'usage : kit du logo, dossier svg/ et guide/).
const C = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Signature en haut d'écran : symbole + DOSSIERS + tampon CLASSÉS, centrée. */
export const Signature: React.FC<{ top: number; largeur?: number }> = ({ top, largeur = 400 }) => (
  <Img
    src={staticFile("logo/horizontal-couleur.svg")}
    style={{ position: "absolute", top, left: (1080 - largeur) / 2, width: largeur }}
  />
);

/**
 * Filigrane : symbole blanc à 60 %, en haut à gauche (jamais à droite ni en bas : boutons et légende TikTok).
 * Apparaît après 1 s et disparaît à partir de « masquerA » (la fin de l'épisode montre déjà le logo).
 */
export const Filigrane: React.FC<{ masquerA: number }> = ({ masquerA }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [30, 45, masquerA - 10, masquerA], [0, 0.6, 0.6, 0], C);
  if (o <= 0) return null;
  return (
    <Img
      src={staticFile("logo/symbole-blanc.svg")}
      style={{ position: "absolute", top: 180, left: 40, width: 84, opacity: o, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.5))" }}
    />
  );
};
