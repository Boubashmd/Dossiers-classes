import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { CREME, GRIS, JAUNE, NUIT_NOIRE, Polices, ROUGE, txt } from "./theme";

export type InfosCouverture = { titre: string; sous: string; photo: string | null; visage: { x: number; y: number }; largeur: number };

/**
 * Image de couverture TikTok (1080 x 1920).
 * Tout l'important est dans le centre (zone visible en grille de profil, 3:4)
 * et au-dessus de la description TikTok.
 */
export const Couverture: React.FC<{ infos: InfosCouverture }> = ({ infos }) => {
  const L = 1500; // largeur d'affichage de la photo (zoom sur le visage)
  const ech = L / (infos.largeur || 540);
  return (
    <AbsoluteFill style={{ background: NUIT_NOIRE }}>
      <Polices />
      {infos.photo && (
        <Img
          src={staticFile(infos.photo)}
          style={{
            position: "absolute",
            width: L,
            left: Math.min(0, Math.max(1080 - L, 540 - infos.visage.x * ech)), // visage au plus près du centre, sans bord visible
            top: 800 - infos.visage.y * ech,
            filter: "grayscale(1) sepia(.4) contrast(1.2) brightness(.8)",
          }}
        />
      )}
      {/* assombrit le haut et le bas pour faire ressortir le titre */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(7,14,26,.97) 0%, rgba(7,14,26,.9) 19%, rgba(7,14,26,.15) 30%, rgba(7,14,26,.1) 42%, rgba(7,14,26,.85) 58%, rgba(7,14,26,.97) 75%)",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,.6) 100%)" }} />

      {/* signature de la chaîne */}
      <div style={{ position: "absolute", top: 300, width: "100%", textAlign: "center", ...txt(44, CREME, 700, { letterSpacing: 8 }) }}>
        DOSSIERS{" "}
        <span style={{ border: `5px solid ${ROUGE}`, borderRadius: 10, padding: "0 14px 4px", color: ROUGE, display: "inline-block", transform: "rotate(-4deg)" }}>CLASSÉS</span>
      </div>

      {/* titre accrocheur */}
      <div
        style={{
          position: "absolute",
          top: 1060,
          left: 70,
          right: 70,
          textAlign: "center",
          lineHeight: 1.05,
          ...txt(infos.titre.length > 30 ? 100 : infos.titre.length > 22 ? 118 : 136, JAUNE, 700, { textShadow: "0 6px 30px rgba(0,0,0,.9)" }),
        }}
      >
        {infos.titre}
      </div>
      <div style={{ position: "absolute", top: 1440, width: "100%", textAlign: "center", ...txt(46, GRIS, 500, { letterSpacing: 4 }) }}>{infos.sous}</div>
    </AbsoluteFill>
  );
};
