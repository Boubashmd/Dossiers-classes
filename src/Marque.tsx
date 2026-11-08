import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { CREME, GRIS, NUIT, Polices, txt } from "./theme";

// Images de la marque « Dossiers Décryptés » (photo de profil, bannière, logos en PNG).
// Fabriquées avec : npx remotion still src/index.ts <Composition> sorties/marque/<fichier>.png

/** Photo de profil (TikTok, YouTube, Instagram) : le symbole seul sur bleu nuit, lisible dans le rond. */
export const Profil: React.FC = () => (
  <AbsoluteFill style={{ background: NUIT, alignItems: "center", justifyContent: "center" }}>
    <Img src={staticFile("logo/symbole-couleur.svg")} style={{ width: 860 }} />
  </AbsoluteFill>
);

/** Logo complet sur bleu nuit (horizontal ou vertical), pour partager ou poser ailleurs. */
export const LogoPng: React.FC<{ fichier: string; largeur: number }> = ({ fichier, largeur }) => (
  <AbsoluteFill style={{ background: NUIT, alignItems: "center", justifyContent: "center" }}>
    <Img src={staticFile(fichier)} style={{ width: largeur }} />
  </AbsoluteFill>
);

// bords des illustrations fondus (pas de cadre visible)
const fondu = {
  maskImage: "radial-gradient(ellipse 50% 40% at 50% 35%, #000 55%, transparent 100%)",
  WebkitMaskImage: "radial-gradient(ellipse 50% 40% at 50% 35%, #000 55%, transparent 100%)",
} as const;

/**
 * Bannière YouTube / X / Facebook (2560 x 1440). TikTok n'a pas de bannière.
 * Zone toujours visible (téléphone) : 1546 x 423 au centre ; les côtés n'apparaissent que sur ordinateur et télé.
 */
export const Banniere: React.FC = () => (
  <AbsoluteFill style={{ background: NUIT }}>
    <Polices />
    {/* illustrations de la chaîne sur les côtés, fondues dans le bleu nuit */}
    <Img src={staticFile("illustrations/commun/loupe.jpg")} style={{ position: "absolute", left: 40, top: -60, width: 900, opacity: 0.6, ...fondu }} />
    <Img src={staticFile("illustrations/commun/mappemonde.jpg")} style={{ position: "absolute", right: 40, top: -60, width: 900, opacity: 0.6, ...fondu }} />
    <AbsoluteFill
      style={{
        background: `linear-gradient(90deg, rgba(11,22,38,.2) 0%, ${NUIT} 34%, ${NUIT} 66%, rgba(11,22,38,.2) 100%)`,
      }}
    />
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${NUIT} 0%, rgba(11,22,38,0) 30%, rgba(11,22,38,0) 70%, ${NUIT} 100%)` }} />
    {/* contenu centré dans la zone sûre */}
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 18 }}>
      <Img src={staticFile("logo/horizontal-couleur.svg")} style={{ width: 720 }} />
      <div style={{ ...txt(44, CREME, 500, { letterSpacing: 1 }) }}>Affaires vraies et systèmes décryptés, sources à l'appui.</div>
      <div style={{ ...txt(30, GRIS, 500, { letterSpacing: 6 }) }}>@DOSSIERSDECRYPTES</div>
    </AbsoluteFill>
  </AbsoluteFill>
);
