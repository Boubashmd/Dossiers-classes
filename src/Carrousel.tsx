import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { CREME, JAUNE, NUIT_NOIRE, Polices, ROUGE, txt } from "./theme";

/** Une image du carrousel TikTok (section "carrousel" de l'épisode). */
export type Diapo = { image?: string; numero?: string; grand: string; petit?: string };
export type InfosDiapo = { diapo: Diapo; index: number; total: number };

/**
 * Carrousel TikTok : une image fixe 1080 x 1920 par diapo.
 * Tout le contenu reste entre 250 et 1250 px de haut (la légende TikTok cache le bas).
 * Fabriqué par scripts/carrousel.mjs <episode.json>.
 */
export const Carrousel: React.FC<InfosDiapo> = ({ diapo, index, total }) => {
  const g = diapo.grand || "";
  const tailleGrand = g.length > 34 ? 84 : g.length > 24 ? 96 : g.length > 16 ? 110 : 124;
  const p = diapo.petit || "";
  const taillePetit = p.length > 110 ? 42 : p.length > 70 ? 46 : 52;
  return (
    <AbsoluteFill style={{ background: NUIT_NOIRE }}>
      <Polices />
      {diapo.image && (
        <Img
          src={staticFile(diapo.image)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 0%",
            filter: "contrast(1.05) brightness(.95)",
          }}
        />
      )}
      {/* assombrit le haut (signature) et surtout le bas (texte + légende TikTok) */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(7,14,26,.9) 0%, rgba(7,14,26,.35) 18%, rgba(7,14,26,0) 26%, rgba(7,14,26,.15) 34%, rgba(7,14,26,.82) 48%, rgba(7,14,26,.96) 62%, rgba(7,14,26,1) 100%)",
        }}
      />

      {/* signature de la chaîne */}
      <div style={{ position: "absolute", top: 250, width: "100%", textAlign: "center", ...txt(40, CREME, 700, { letterSpacing: 8 }) }}>
        DOSSIERS{" "}
        <span style={{ border: `5px solid ${ROUGE}`, borderRadius: 10, padding: "0 14px 4px", color: ROUGE, display: "inline-block", transform: "rotate(-4deg)" }}>CLASSÉS</span>
      </div>
      <div style={{ position: "absolute", top: 335, width: "100%", textAlign: "center", ...txt(30, CREME, 500, { letterSpacing: 6, textShadow: "0 0 12px #070E1A, 0 0 6px #070E1A, 0 2px 4px #070E1A" }) }}>
        {index + 1} / {total}
      </div>

      {/* bloc texte, calé en bas de la zone sûre (fin à 1250 px) */}
      <div
        style={{
          position: "absolute",
          top: 420,
          bottom: 1920 - 1250,
          left: 70,
          right: 70,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          textAlign: "center",
          gap: 30,
        }}
      >
        {diapo.numero && (
          <div style={{ background: JAUNE, borderRadius: 14, padding: "6px 26px 4px", ...txt(54, NUIT_NOIRE, 700, { letterSpacing: 4 }) }}>{diapo.numero}</div>
        )}
        <div style={{ lineHeight: 1.05, ...txt(tailleGrand, JAUNE, 700, { textShadow: "0 6px 30px rgba(0,0,0,.95)" }) }}>{g}</div>
        {p && <div style={{ lineHeight: 1.35, ...txt(taillePetit, CREME, 500, { textShadow: "0 3px 14px rgba(0,0,0,.95)" }) }}>{p}</div>}
      </div>
    </AbsoluteFill>
  );
};
