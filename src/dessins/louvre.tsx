import React from "react";
import { CREME, JAUNE, NOIR } from "../theme";

// ============================================================================================
// Le vol de la Joconde (affaire nº 7) — la Joconde dessinée, le Salon Carré, la malle.
// ============================================================================================

const MUR = "#5A2E2E";
const MUR2 = "#4A2424";
const OR = "#C9A24A";

/** La Joconde, dessin simplifié (œuvre du domaine public). Centre (0,0), hauteur ~ s px. */
export const Joconde: React.FC<{ x: number; y: number; s: number; vitre?: boolean; rot?: number; o?: number }> = ({ x, y, s, vitre, rot = 0, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s / 400})`} opacity={o}>
    <rect x={-150} y={-200} width={300} height={400} fill="#6A5A2A" />
    <rect x={-138} y={-188} width={276} height={376} fill="#4E5A3A" />
    <path d="M-138 -40 Q-60 -80 0 -60 Q60 -90 138 -50 L138 188 L-138 188 Z" fill="#5E6A44" />
    <path d="M-138 40 Q-40 10 138 30 L138 188 L-138 188 Z" fill="#3E4A30" />
    {/* buste */}
    <path d="M-110 188 Q-100 40 0 30 Q100 40 110 188 Z" fill="#2E2418" />
    <path d="M-50 70 Q0 100 50 70 L40 120 Q0 140 -40 120 Z" fill="#C9A06A" />
    {/* mains */}
    <path d="M-60 150 Q0 130 60 150 Q40 170 0 168 Q-40 170 -60 150 Z" fill="#D8B07A" />
    {/* tête + cheveux */}
    <path d="M-62 -40 Q-70 -150 0 -152 Q70 -150 62 -40 Q60 40 40 70 L-40 70 Q-60 40 -62 -40 Z" fill="#2A1E14" />
    <ellipse cx={0} cy={-50} rx={44} ry={60} fill="#D8B07A" />
    <path d="M-20 -60 h12 M8 -60 h12" stroke="#5A3A20" strokeWidth={4} strokeLinecap="round" />
    <path d="M-14 -16 Q0 -8 14 -16" stroke="#8A5A3A" strokeWidth={4} fill="none" strokeLinecap="round" />
    {/* cadre doré */}
    <rect x={-150} y={-200} width={300} height={400} fill="none" stroke={OR} strokeWidth={22} />
    {vitre && <rect x={-150} y={-200} width={300} height={400} fill="rgba(200,230,255,.12)" stroke="rgba(220,240,255,.6)" strokeWidth={6} />}
  </g>
);

/** Petit tableau générique (pour garnir le mur). */
const Tableau: React.FC<{ x: number; y: number; w: number; h: number; c: string }> = ({ x, y, w, h, c }) => (
  <g>
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} fill={c} stroke={OR} strokeWidth={10} />
  </g>
);

/** Salon Carré du Louvre : mur rouge, tableaux. p.vide = la place de la Joconde est vide (4 crochets) ;
 *  p.foule = des visiteurs regardent le mur ; p.joconde = la Joconde est accrochée. */
export const Salon: React.FC<{ frame: number; p?: any }> = ({ frame, p = {} }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill={MUR2} />
    <rect x={0} y={380} width={1080} height={970} fill={MUR} />
    <rect x={0} y={360} width={1080} height={24} fill={OR} opacity={0.6} />
    <Tableau x={160} y={640} w={200} h={150} c="#4A5A6A" />
    <Tableau x={920} y={640} w={200} h={150} c="#6A4A3A" />
    <Tableau x={160} y={900} w={170} h={230} c="#3A4A3A" />
    <Tableau x={920} y={900} w={170} h={230} c="#5A5A4A" />
    {p.joconde && <Joconde x={540} y={800} s={380} vitre />}
    {p.vide && (
      <g>
        <rect x={392} y={600} width={296} height={396} fill="#4E2828" />
        {[
          [400, 610],
          [680, 610],
          [400, 990],
          [680, 990],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={8} fill="#2A2A2A" />
        ))}
      </g>
    )}
    <rect x={0} y={1350} width={1080} height={570} fill="#3A2A20" />
    {p.foule &&
      Array.from({ length: 9 }, (_, i) => {
        const x = 70 + i * 120 + Math.sin(frame / 12 + i) * 4;
        const s = 0.9 + (i % 3) * 0.12;
        return (
          <g key={i} transform={`translate(${x} 1350) scale(${s})`}>
            <path d="M-40 0 V-60 Q-40 -110 0 -110 Q40 -110 40 -60 V0 Z" fill={i % 2 ? "#1E2430" : "#2A3040"} />
            <circle cx={0} cy={-138} r={26} fill={i % 2 ? "#1E2430" : "#2A3040"} />
            {i % 3 === 0 && <rect x={-34} y={-172} width={68} height={12} rx={6} fill="#14181F" />}
          </g>
        );
      })}
  </g>
);

/** Petite chambre parisienne : la malle au double fond, la Joconde cachée dessous. p.ouverte = on voit le tableau. */
export const Chambre: React.FC<{ frame: number; p?: any }> = ({ frame, p = {} }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#2A2620" />
    <rect x={60} y={380} width={960} height={970} fill="#5A4E3A" />
    {Array.from({ length: 12 }, (_, i) => (
      <line key={i} x1={60 + i * 80} x2={60 + i * 80} y1={380} y2={1350} stroke="#4E4432" strokeWidth={4} />
    ))}
    <rect x={720} y={460} width={220} height={300} fill="#1A2638" stroke="#3A3026" strokeWidth={16} />
    <path d="M830 470 L830 750 M730 610 L930 610" stroke="#3A3026" strokeWidth={10} />
    <circle cx={300} cy={480} r={16} fill={JAUNE} opacity={0.7 + 0.2 * Math.sin(frame / 8)} />
    <line x1={300} y1={380} x2={300} y2={464} stroke="#2A2620" strokeWidth={4} />
    <Malle x={480} y={1180} s={600} ouverte={p.ouverte ? Math.min(1, frame / 40) : 0} />
    <rect x={0} y={1350} width={1080} height={570} fill="#3A2E22" />
  </g>
);

/** Malle en bois au double fond. ouverte = 0 -> 1 (le couvercle s'ouvre, la Joconde apparaît). */
export const Malle: React.FC<{ x: number; y: number; s: number; ouverte?: number }> = ({ x, y, s, ouverte = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s / 600})`}>
    <ellipse cx={0} cy={170} rx={320} ry={20} fill="rgba(0,0,0,.4)" />
    {ouverte > 0.2 && <Joconde x={0} y={-60 - 120 * ouverte} s={300} o={Math.min(1, (ouverte - 0.2) * 2)} />}
    <rect x={-280} y={-20} width={560} height={180} rx={10} fill="#6E4630" />
    {[-180, 0, 180].map((xx) => (
      <rect key={xx} x={xx - 12} y={-20} width={24} height={180} fill="#3E2618" />
    ))}
    <rect x={-280} y={60} width={560} height={14} fill="#3E2618" />
    <g transform={`rotate(${-70 * ouverte} -280 -20)`}>
      <path d="M-280 -20 L-280 -80 Q0 -140 280 -80 L280 -20 Z" fill="#80553A" />
      <rect x={-20} y={-60} width={40} height={40} rx={4} fill={OR} />
    </g>
  </g>
);

/** Ouvrier en blouse blanche, de dos, qui emporte un paquet (silhouette). Pieds en (0,0). */
export const OuvrierBlouse: React.FC<{ x: number; y: number; s: number; paquet?: boolean }> = ({ x, y, s, paquet }) => (
  <g transform={`translate(${x} ${y}) scale(${s / 100})`}>
    <path d="M-40 0 V-34 Q-40 -64 0 -64 Q40 -64 40 -34 V0 Z" fill="#ECE6D8" />
    <circle cx={0} cy={-82} r={17} fill="#2A2A30" />
    {paquet && <rect x={-26} y={-58} width={52} height={40} rx={6} fill="#D8D2C4" stroke={NOIR} strokeWidth={2} />}
  </g>
);

export { CREME };
