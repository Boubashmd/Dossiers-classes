import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Générique « Dossiers Classés » : la lumière tombe, l'enquêteur apparaît, ses yeux s'allument, le tampon claque.
const NUIT = "#070E1A";
const CREME = "#ECE6D8";
const JAUNE = "#FFD400";
const ROUGE = "#E6504A";
const TRENCH = "#CDBB98";
const TRENCH_OMBRE = "#A8946F";
const TRENCH_CLAIR = "#DFD0B2";
const CHAPEAU = "#2A2F3A";
const CHAPEAU_CLAIR = "#3A4150";

const fontFace = `
@font-face { font-family: 'Poppins'; font-weight: 700; src: url('${staticFile("polices/Poppins-Bold.ttf")}'); }
@font-face { font-family: 'Poppins'; font-weight: 500; src: url('${staticFile("polices/Poppins-Medium.ttf")}'); }
`;
const C = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Repère : centre (0,0) au niveau des yeux. Personnage ~ 900 px de haut.
const Enqueteur: React.FC<{ yeux: number; cligne: number }> = ({ yeux, cligne }) => (
  <g>
    <defs>
      <linearGradient id="trench" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={TRENCH_CLAIR} />
        <stop offset="1" stopColor={TRENCH_OMBRE} />
      </linearGradient>
      <linearGradient id="visage" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#020409" />
        <stop offset="0.75" stopColor="#0B111D" />
        <stop offset="1" stopColor="#1A2232" />
      </linearGradient>
      <linearGradient id="chapeau" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={CHAPEAU_CLAIR} />
        <stop offset="1" stopColor={CHAPEAU} />
      </linearGradient>
      <radialGradient id="halo">
        <stop offset="0" stopColor={JAUNE} stopOpacity="0.9" />
        <stop offset="1" stopColor={JAUNE} stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* épaules et trench */}
    <path d="M-430 640 C-420 420 -330 330 -170 300 L-70 270 L70 270 L170 300 C330 330 420 420 430 640 Z" fill="url(#trench)" />
    {/* chemise sombre + cravate */}
    <path d="M-90 255 L0 470 L90 255 Z" fill="#1C2230" />
    <path d="M-22 290 L22 290 L34 470 L0 520 L-34 470 Z" fill="#7A3442" />
    {/* revers du trench */}
    <path d="M-170 300 L-80 250 L0 480 L-60 560 L-190 380 Z" fill={TRENCH} />
    <path d="M170 300 L80 250 L0 480 L60 560 L190 380 Z" fill={TRENCH} />
    <path d="M-80 250 L0 480 L-40 420 Z" fill={TRENCH_OMBRE} />
    <path d="M80 250 L0 480 L40 420 Z" fill={TRENCH_OMBRE} />
    {/* col relevé, haut et pointu */}
    <path d="M-230 330 L-150 120 L-70 260 L-110 360 Z" fill={TRENCH_CLAIR} />
    <path d="M230 330 L150 120 L70 260 L110 360 Z" fill={TRENCH_CLAIR} />
    <path d="M-150 120 L-70 260 L-120 250 Z" fill={TRENCH_OMBRE} opacity={0.8} />
    <path d="M150 120 L70 260 L120 250 Z" fill={TRENCH_OMBRE} opacity={0.8} />
    {/* boutons */}
    <circle cx={-120} cy={470} r={13} fill="#5B4A30" />
    <circle cx={120} cy={470} r={13} fill="#5B4A30" />

    {/* cou + visage dans l'ombre */}
    <path d="M-60 180 L-60 270 L60 270 L60 180 Z" fill="#0B111D" />
    <path d="M-120 -60 C-125 80 -70 210 0 215 C70 210 125 80 120 -60 Z" fill="url(#visage)" />

    {/* yeux lumineux */}
    <g opacity={yeux}>
      <ellipse cx={-48} cy={18} rx={70} ry={40} fill="url(#halo)" opacity={0.55} />
      <ellipse cx={48} cy={18} rx={70} ry={40} fill="url(#halo)" opacity={0.55} />
      <g transform={`translate(0 18) scale(1 ${cligne}) translate(0 -18)`}>
        <path d="M-82 18 C-66 -2 -32 -2 -16 16 C-34 30 -64 32 -82 18 Z" fill={JAUNE} />
        <path d="M82 18 C66 -2 32 -2 16 16 C34 30 64 32 82 18 Z" fill={JAUNE} />
        <circle cx={-48} cy={15} r={6} fill="#FFF6C2" />
        <circle cx={48} cy={15} r={6} fill="#FFF6C2" />
      </g>
    </g>

    {/* chapeau mou (fedora) : calotte pincée + bord large */}
    <path d="M-150 -95 C-160 -210 -120 -290 -40 -305 C-15 -290 15 -290 40 -305 C120 -290 160 -210 150 -95 Z" fill="url(#chapeau)" />
    {/* pli central de la calotte */}
    <path d="M-30 -298 C-10 -250 10 -250 30 -298 C10 -270 -10 -270 -30 -298 Z" fill={CHAPEAU} />
    {/* ruban jaune */}
    <path d="M-152 -150 C-60 -165 60 -165 152 -150 L150 -96 C60 -110 -60 -110 -150 -96 Z" fill={JAUNE} />
    {/* bord, plus épais sur les côtés et légèrement rabattu devant */}
    <path
      d="M-330 -70 C-250 -120 -120 -128 0 -128 C120 -128 250 -120 330 -70 C300 -50 200 -48 120 -54 C60 -40 -60 -40 -120 -54 C-200 -48 -300 -50 -330 -70 Z"
      fill={CHAPEAU}
    />
    <path d="M-330 -70 C-250 -120 -120 -128 0 -128 C120 -128 250 -120 330 -70 C250 -100 120 -108 0 -108 C-120 -108 -250 -100 -330 -70 Z" fill={CHAPEAU_CLAIR} />
  </g>
);

export const Intro: React.FC<{ sousTitre?: string; personnage?: boolean }> = ({ sousTitre = "", personnage = true }) => {
  // sans personnage : le titre seul, centré à l'écran
  const dy = personnage ? 0 : -560;
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lumiere = interpolate(f, [8, 34], [0, 1], { ...C, easing: Easing.out(Easing.cubic) });
  const perso = interpolate(f, [12, 40], [0, 1], { ...C, easing: Easing.out(Easing.cubic) });
  // allumage des yeux avec un petit grésillement
  const yeux = f < 38 ? 0 : f < 40 ? 1 : f < 43 ? 0.15 : f < 45 ? 1 : f < 46 ? 0.4 : 1;
  const cligne = f >= 66 && f < 71 ? 0.1 : 1;
  const titre = spring({ frame: f - 52, fps, config: { damping: 14 } });
  const tampon = spring({ frame: f - 70, fps, config: { damping: 9, stiffness: 230, mass: 0.8 } });
  const secousse = f >= 70 && f < 80 ? Math.sin(f * 3.2) * 12 * (1 - (f - 70) / 10) : 0;
  const slogan = interpolate(f, [84, 96], [0, 1], C);
  const fondu = 1;

  return (
    <AbsoluteFill style={{ background: NUIT }}>
      <style>{fontFace}</style>
      <Audio src={staticFile("son/generique.wav")} />
      <AbsoluteFill style={{ opacity: fondu, transform: `translate(${secousse}px, ${secousse * 0.5}px)` }}>
        {/* cône de lumière qui tombe d'une lampe au-dessus */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: lumiere,
            background:
              "radial-gradient(ellipse 60% 48% at 50% 30%, rgba(255,236,170,.22) 0%, rgba(255,236,170,.08) 45%, rgba(0,0,0,0) 75%)",
          }}
        />
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          {personnage && <polygon points="470,0 610,0 900,1250 180,1250" fill="rgba(255,236,170,0.05)" opacity={lumiere} />}
          {personnage && <g transform={`translate(540 ${640 + (1 - perso) * 40}) scale(${1.08 - 0.08 * perso})`} opacity={perso}>
            <Enqueteur yeux={yeux} cligne={cligne} />
          </g>}
          {/* fondu bas pour poser le titre */}
          <defs>
            <linearGradient id="bas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={NUIT} stopOpacity="0" />
              <stop offset="1" stopColor={NUIT} stopOpacity="1" />
            </linearGradient>
          </defs>
          {personnage && <rect x={0} y={930} width={1080} height={330} fill="url(#bas)" />}
          {personnage && <rect x={0} y={1258} width={1080} height={662} fill={NUIT} />}
        </svg>

        {/* titre */}
        <div
          style={{
            position: "absolute",
            top: 1290 + dy,
            width: "100%",
            textAlign: "center",
            fontFamily: "Poppins",
            fontWeight: 700,
            fontSize: 132,
            letterSpacing: 8,
            color: CREME,
            opacity: titre,
            transform: `translateY(${(1 - titre) * 40}px)`,
          }}
        >
          DOSSIERS
        </div>
        {f >= 68 && (
          <div
            style={{
              position: "absolute",
              top: 1500 + dy,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              transform: `rotate(-5deg) scale(${3 - 2 * tampon})`,
              opacity: Math.min(1, tampon * 1.4),
            }}
          >
            <div
              style={{
                border: `12px solid ${ROUGE}`,
                borderRadius: 18,
                padding: "0 40px 8px",
                fontFamily: "Poppins",
                fontWeight: 700,
                fontSize: 128,
                letterSpacing: 14,
                color: ROUGE,
                lineHeight: 1.15,
              }}
            >
              CLASSÉS
            </div>
          </div>
        )}
        <div
          style={{
            position: "absolute",
            top: 1750 + dy,
            width: "100%",
            textAlign: "center",
            fontFamily: "Poppins",
            fontWeight: 500,
            fontSize: 38,
            letterSpacing: 4,
            color: "#9AA8BD",
            opacity: slogan,
          }}
        >
          {sousTitre}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,.7) 100%)" }} />
    </AbsoluteFill>
  );
};
