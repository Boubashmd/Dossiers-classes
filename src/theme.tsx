import React from "react";
import { Easing, interpolate, staticFile } from "remotion";

// Charte « Dossiers Classés »
export const NUIT = "#0B1626";
export const NUIT2 = "#16304F";
export const NUIT_NOIRE = "#070E1A";
export const CREME = "#ECE6D8";
export const JAUNE = "#FFD400";
export const GRIS = "#7F93AE";
export const ROUGE = "#E6504A";
export const VERT = "#6FC88C";
export const ROUILLE = "#C9692E";
export const KRAFT = "#C9A86A";
export const KRAFT_FONCE = "#B08F52";
export const PEAU = "#E2B58E";
export const NOIR = "#1A1D26";

export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const C = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const io = Easing.inOut(Easing.cubic);
export const out = Easing.out(Easing.cubic);

export const Polices: React.FC = () => (
  <style>{`
@font-face { font-family: 'Poppins'; font-weight: 700; src: url('${staticFile("polices/Poppins-Bold.ttf")}'); }
@font-face { font-family: 'Poppins'; font-weight: 500; src: url('${staticFile("polices/Poppins-Medium.ttf")}'); }
`}</style>
);

export const txt = (size: number, color: string, weight = 700, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: "Poppins",
  fontWeight: weight,
  fontSize: size,
  color,
  ...extra,
});

/** Valeur 0 -> 1 entre deux images (avec courbe douce). */
export const prog = (f: number, debut: number, duree: number, easing = out) =>
  interpolate(f, [debut, debut + duree], [0, 1], { ...C, easing });

/** Petit titre gris en haut d'écran. */
export const Titre: React.FC<{ texte?: string; k?: number; top?: number }> = ({ texte, k = 1, top = 210 }) =>
  texte ? (
    <div style={{ position: "absolute", top, width: "100%", textAlign: "center", opacity: k, ...txt(38, GRIS, 500, { letterSpacing: 10 }) }}>
      {texte}
    </div>
  ) : null;

/** Texte centré (grand). */
export const Texte: React.FC<{ top: number; k?: number; size?: number; color?: string; children: React.ReactNode; scale?: number }> = ({
  top,
  k = 1,
  size = 72,
  color = CREME,
  children,
  scale = 1,
}) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 60,
      right: 60,
      textAlign: "center",
      opacity: k,
      transform: `scale(${scale})`,
      lineHeight: 1.2,
      ...txt(size, color, 700, { textShadow: "0 4px 18px rgba(0,0,0,.6)" }),
    }}
  >
    {children}
  </div>
);

/** Tampon rouge qui claque (k = ressort 0 -> 1). */
export const Tampon: React.FC<{ texte: string; k: number; top: number; rot?: number; size?: number; couleur?: string; sous?: string }> = ({
  texte,
  k,
  top,
  rot = -10,
  size = 120,
  couleur = ROUGE,
  sous,
}) =>
  k > 0 ? (
    <div
      style={{
        position: "absolute",
        top,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        transform: `rotate(${rot}deg) scale(${3 - 2 * Math.min(k, 1.2)})`,
        opacity: Math.min(1, k * 1.4),
      }}
    >
      <div
        style={{
          border: `${Math.round(size / 10)}px solid ${couleur}`,
          borderRadius: 18,
          padding: "4px 36px 10px",
          textAlign: "center",
          background: "rgba(11,22,38,.35)",
          ...txt(size, couleur, 700, { letterSpacing: size / 10, lineHeight: 1.1 }),
        }}
      >
        {texte}
        {sous && <div style={txt(size * 0.3, couleur, 700, { letterSpacing: 5 })}>{sous}</div>}
      </div>
    </div>
  ) : null;
