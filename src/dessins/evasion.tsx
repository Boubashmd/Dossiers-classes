import React from "react";
import { CREME, JAUNE, NOIR } from "../theme";

// ============================================================================================
// Évasion d'Alcatraz (affaire nº 6) — cellule, couloir technique, toit, baie ; objets de l'évasion.
// Décors 1080 x 1920 ; rien d'important sous ~1200.
// ============================================================================================

const MUR = "#C9C2B2";
const MUR_SOMBRE = "#8E887A";
const NUIT = "#0A1730";

const Vagues: React.FC<{ frame: number; y0: number; n?: number }> = ({ frame, y0, n = 6 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const dx = ((frame * (1.5 + i * 0.3)) % 160) - 160;
      let d = `M${dx} ${y0 + i * 80}`;
      for (let x = dx; x < 1240; x += 80) d += ` q20 -14 40 0 t40 0`;
      return <path key={i} d={d} stroke="rgba(236,230,216,.16)" strokeWidth={4} fill="none" />;
    })}
  </g>
);

/** Grille d'aération percée de trous (perce = 0 -> 1). */
const Grille: React.FC<{ x: number; y: number; perce?: number; ouverte?: boolean }> = ({ x, y, perce = 0, ouverte = false }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-80} y={-50} width={160} height={100} fill={ouverte ? "#0B0F16" : "#6A6458"} />
    {!ouverte &&
      Array.from({ length: 6 }, (_, i) => <rect key={i} x={-70 + i * 24} y={-40} width={12} height={80} fill="#3A362E" />)}
    {Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2;
      return i / 16 < perce ? <circle key={i} cx={Math.cos(a) * 100} cy={Math.sin(a) * 66} r={5} fill="#1A1A1A" /> : null;
    })}
  </g>
);

/** Cellule : mur du fond, grille d'aération sous le lavabo, lit. p.lit = fausse tête dans le lit ; p.perce = trous qui apparaissent. */
export const Cellule: React.FC<{ frame: number; p?: any }> = ({ frame, p = {} }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#2A2F38" />
    <rect x={60} y={380} width={960} height={970} fill={MUR} />
    {Array.from({ length: 9 }, (_, i) => (
      <line key={i} x1={60} x2={1020} y1={380 + i * 110} y2={380 + i * 110} stroke={MUR_SOMBRE} strokeWidth={2} />
    ))}
    {/* lavabo + grille */}
    <rect x={660} y={720} width={200} height={40} rx={10} fill="#E8E6E0" />
    <rect x={745} y={760} width={30} height={120} fill="#B8B4AA" />
    <Grille x={760} y={980} perce={p.perce ? Math.min(1, frame / 60) : 0} ouverte={p.ouverte} />
    {/* lit */}
    <rect x={100} y={1050} width={460} height={60} fill="#5A6475" />
    <rect x={100} y={1110} width={20} height={150} fill="#3A4150" />
    <rect x={540} y={1110} width={20} height={150} fill="#3A4150" />
    <path d="M140 1060 Q320 990 520 1050 L520 1070 L140 1070 Z" fill="#7A8AA0" />
    {p.lit && (
      <g transform="translate(160 1030)">
        <ellipse cx={0} cy={0} rx={44} ry={36} fill="#D8B48E" />
        <path d="M-44 -4 Q-40 -42 0 -40 Q40 -42 44 -4 Q20 -24 0 -22 Q-20 -24 -44 -4 Z" fill="#3A2A20" />
      </g>
    )}
    {/* barreaux de la porte (premier plan, côté gauche) */}
    {p.barreaux !== false &&
      [20, 70].map((x) => <rect key={x} x={x} y={380} width={14} height={970} fill="#3A4150" opacity={0.9} />)}
    <rect x={0} y={1350} width={1080} height={570} fill="#1A1E26" />
  </g>
);

/** Couloir technique derrière les cellules : tuyaux, pénombre. p.atelier = atelier secret (imperméables). */
export const Couloir: React.FC<{ frame: number; p?: any }> = ({ frame, p = {} }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#14181F" />
    {[160, 300, 780, 920].map((x, i) => (
      <rect key={x} x={x - 18} y={300} width={36} height={1050} fill={i % 2 ? "#4A505A" : "#5A616C"} />
    ))}
    {[520, 760].map((y) => (
      <rect key={y} x={60} y={y} width={960} height={26} fill="#4A505A" />
    ))}
    <path d="M540 300 L420 1350 L660 1350 Z" fill="rgba(255,232,170,.06)" />
    {p.atelier && (
      <g>
        <rect x={300} y={1100} width={480} height={30} fill="#6A5A44" />
        <rect x={320} y={1130} width={20} height={220} fill="#5A4A36" />
        <rect x={740} y={1130} width={20} height={220} fill="#5A4A36" />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${340 + i * 105} 1100 L${360 + i * 105} 980 L${420 + i * 105} 980 L${430 + i * 105} 1100 Z`} fill={i % 2 ? "#3E4A3A" : "#4A5644"} />
        ))}
      </g>
    )}
    <circle cx={540} cy={300} r={10} fill={JAUNE} opacity={0.5 + 0.3 * Math.sin(frame / 6)} />
  </g>
);

/** Toit du bloc cellulaire la nuit : bouche d'aération, projecteur qui balaie. */
export const Toit: React.FC<{ frame: number; p?: any }> = ({ frame }) => {
  const a = Math.sin(frame / 22) * 35;
  return (
    <g>
      <rect x={0} y={0} width={1080} height={1920} fill={NUIT} />
      {Array.from({ length: 26 }, (_, i) => (
        <circle key={i} cx={(i * 389) % 1080} cy={260 + ((i * 211) % 600)} r={2} fill={CREME} opacity={0.45} />
      ))}
      <g transform={`rotate(${a} 900 820)`}>
        <path d="M900 820 L-200 600 L-200 900 Z" fill="rgba(255,236,170,.12)" />
      </g>
      <rect x={870} y={820} width={60} height={380} fill={MUR_SOMBRE} />
      <circle cx={900} cy={815} r={22} fill={JAUNE} />
      <path d="M0 1050 L1080 990 L1080 1920 L0 1920 Z" fill="#3A3F48" />
      <rect x={300} y={960} width={140} height={90} fill="#5A616C" />
      <rect x={290} y={950} width={160} height={16} fill="#6A717C" />
    </g>
  );
};

/** Baie de San Francisco la nuit : l'île au loin, la côte. p.radeau = radeau sur l'eau. */
export const Baie: React.FC<{ frame: number; p?: any }> = ({ frame, p = {} }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill={NUIT} />
    {Array.from({ length: 26 }, (_, i) => (
      <circle key={i} cx={(i * 389) % 1080} cy={260 + ((i * 211) % 500)} r={2} fill={CREME} opacity={0.4} />
    ))}
    <path d="M0 860 L140 820 L300 850 L500 800 L700 840 L900 810 L1080 850 L1080 900 L0 900 Z" fill="#1A2C46" />
    {Array.from({ length: 14 }, (_, i) => (
      <circle key={i} cx={60 + i * 75} cy={870 + (i % 3) * 6} r={3} fill={JAUNE} opacity={0.6} />
    ))}
    <rect x={0} y={890} width={1080} height={1030} fill="#0D2440" />
    <Vagues frame={frame} y0={930} n={8} />
    {/* l'île au loin */}
    <path d="M760 960 Q820 900 900 905 Q960 910 1000 960 Z" fill="#2B3A4F" />
    <rect x={820} y={880} width={110} height={30} fill={MUR} opacity={0.7} />
    {p.radeau && (
      <g transform={`translate(${380 - Math.min(160, frame * 1.2)} ${1080 + Math.sin(frame / 10) * 8}) rotate(${Math.sin(frame / 14) * 4})`}>
        <path d="M-120 0 Q-130 -26 -100 -30 L100 -30 Q130 -26 120 0 Q100 18 0 18 Q-100 18 -120 0 Z" fill="#3E4A3A" />
        {[-50, 0, 50].map((x) => (
          <g key={x}>
            <circle cx={x} cy={-46} r={12} fill="#1A1E26" />
            <path d={`M${x - 14} -30 L${x - 10} -58 Q${x} -64 ${x + 10} -58 L${x + 14} -30 Z`} fill="#1A1E26" />
          </g>
        ))}
      </g>
    )}
  </g>
);

// ---------------------------------------------------------------------------------------------
// Objets (centrés en 0,0)
// ---------------------------------------------------------------------------------------------

/** Perceuse bricolée avec un moteur d'aspirateur. */
export const Perceuse: React.FC<{ x: number; y: number; s: number; frame?: number }> = ({ x, y, s, frame = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s / 500})`}>
    <ellipse cx={0} cy={150} rx={240} ry={16} fill="rgba(0,0,0,.35)" />
    <rect x={-200} y={-80} width={260} height={160} rx={40} fill="#7A8A9A" />
    <circle cx={-70} cy={0} r={46} fill="#5A6878" />
    {Array.from({ length: 6 }, (_, i) => (
      <line key={i} x1={-70} y1={0} x2={-70 + 40 * Math.cos(i + frame / 2)} y2={40 * Math.sin(i + frame / 2)} stroke="#3A4450" strokeWidth={6} />
    ))}
    <rect x={60} y={-22} width={70} height={44} fill="#4A5462" />
    <rect x={130} y={-8} width={110} height={16} fill="#C9CDD4" />
    <path d={`M240 -8 L262 0 L240 8 Z`} fill="#C9CDD4" />
    <path d="M-160 80 L-180 140 L-130 140 L-120 80 Z" fill="#3A4450" />
    <path d="M-200 -40 Q-260 -60 -250 -120" stroke={NOIR} strokeWidth={8} fill="none" />
  </g>
);

/** Accordéon (concertina). k = ouverture du soufflet. */
export const Accordeon: React.FC<{ x: number; y: number; s: number; frame?: number }> = ({ x, y, s, frame = 0 }) => {
  const k = 0.75 + 0.25 * Math.sin(frame / 6);
  return (
    <g transform={`translate(${x} ${y}) scale(${s / 500})`}>
      <ellipse cx={0} cy={170} rx={250} ry={16} fill="rgba(0,0,0,.35)" />
      <rect x={-240} y={-130} width={90} height={260} rx={12} fill="#A3282A" />
      <rect x={150} y={-130} width={90} height={260} rx={12} fill="#A3282A" />
      {Array.from({ length: 8 }, (_, i) => {
        const x0 = -150 + (i * 300 * k) / 8 - (300 * (k - 1)) / 2;
        return <path key={i} d={`M${x0} -120 L${x0 + 18 * k} -100 L${x0 + 18 * k} 100 L${x0} 120 Z`} fill={i % 2 ? "#2A2A30" : "#3A3A42"} />;
      })}
      {[-200, -180].map((xx, i) => [-80, -30, 20, 70].map((yy) => <circle key={`${i}${yy}`} cx={xx + i * 20} cy={yy} r={9} fill={CREME} />))}
    </g>
  );
};

/** Radeau en imperméables collés. */
export const Radeau: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s / 600})`}>
    <ellipse cx={0} cy={110} rx={300} ry={20} fill="rgba(0,0,0,.35)" />
    <path d="M-280 40 Q-300 -60 -220 -70 L220 -70 Q300 -60 280 40 Q240 90 0 90 Q-240 90 -280 40 Z" fill="#3E4A3A" />
    <path d="M-220 -40 L220 -40 L220 40 L-220 40 Z" fill="#4A5644" />
    {[-130, -40, 50, 140].map((xx) => (
      <line key={xx} x1={xx} y1={-66} x2={xx + 10} y2={86} stroke="#2A3428" strokeWidth={6} strokeDasharray="12 8" />
    ))}
    <rect x={160} y={-160} width={18} height={150} fill="#8C6F3B" transform="rotate(30 169 -85)" />
    <ellipse cx={210} cy={-170} rx={26} ry={44} fill="#8C6F3B" transform="rotate(30 210 -170)" />
  </g>
);

/** Fausse tête en papier mâché, peinte, avec de vrais cheveux. */
export const FausseTete: React.FC<{ x: number; y: number; s: number; cheveux?: number }> = ({ x, y, s, cheveux = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s / 400})`}>
    <ellipse cx={0} cy={210} rx={200} ry={18} fill="rgba(0,0,0,.35)" />
    <path d="M-150 40 Q-160 -170 0 -180 Q160 -170 150 40 Q140 170 0 190 Q-140 170 -150 40 Z" fill="#D8B48E" />
    <path d="M-150 10 Q-160 -40 -170 0 Q-168 50 -146 60 Z M150 10 Q160 -40 170 0 Q168 50 146 60 Z" fill="#C9A47E" />
    <path d="M-80 -10 Q-50 -26 -20 -10 M20 -10 Q50 -26 80 -10" stroke="#3A2A20" strokeWidth={8} fill="none" strokeLinecap="round" />
    <path d="M-70 10 L-30 10 M30 10 L70 10" stroke="#2A2020" strokeWidth={6} />
    <path d="M0 20 L-14 80 L12 82" stroke="#A8846A" strokeWidth={6} fill="none" />
    <path d="M-50 120 Q0 140 50 120" stroke="#8A4A40" strokeWidth={8} fill="none" strokeLinecap="round" />
    {cheveux > 0 && (
      <path
        d="M-156 -20 Q-170 -190 0 -196 Q170 -190 156 -20 Q140 -110 60 -126 Q0 -100 -70 -126 Q-140 -110 -156 -20 Z"
        fill="#3A2A20"
        opacity={Math.min(1, cheveux)}
      />
    )}
  </g>
);
