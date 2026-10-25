import React from "react";
import { CREME, JAUNE, NOIR, NUIT, ROUGE, ROUILLE, VERT, txt } from "../theme";

/** Tour Eiffel. Pied au centre (0,0), sommet à y = -915. k = construction, casse = démontage, rouille = taches. */
export const Tour: React.FC<{ id: string; k?: number; casse?: number; rouille?: number }> = ({ id, k = 1, casse = 0, rouille = 0 }) => {
  const morceau = (i: number) => {
    const d = Math.max(0, casse * 1.6 - i * 0.18);
    const e = Math.min(1, d) ** 2;
    const sens = i % 2 ? 1 : -1;
    return `translate(${sens * e * (60 + i * 40)} ${e * (180 + (3 - i) * 260)}) rotate(${sens * e * (25 + i * 12)})`;
  };
  const treillis = (x1: number, y1: number, x2: number, y2: number, n: number) => {
    const l = [];
    for (let i = 0; i < n; i++) {
      const a = i / n;
      const b = (i + 1) / n;
      const ya = y1 + (y2 - y1) * a;
      const yb = y1 + (y2 - y1) * b;
      const xa = x1 + (x2 - x1) * a;
      const xb = x1 + (x2 - x1) * b;
      l.push(<line key={`a${i}`} x1={-xa} y1={ya} x2={xb} y2={yb} />, <line key={`b${i}`} x1={xa} y1={ya} x2={-xb} y2={yb} />);
    }
    return <g stroke="#B8AE98" strokeWidth={3}>{l}</g>;
  };
  const taches = (pts: [number, number][]) =>
    pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={9 * Math.min(1, Math.max(0, rouille * 3 - i * 0.25))} fill={ROUILLE} />);
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={-400} y={-930 * k} width={800} height={930 * k + 1400} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <g transform={morceau(0)}>
          <path d="M-180 0 L-72 -282 L72 -282 L180 0 L118 0 Q0 -175 -118 0 Z" fill={CREME} />
          {treillis(150, -20, 80, -260, 4)}
          <rect x={-104} y={-300} width={208} height={24} rx={3} fill={CREME} />
          {taches([[-120, -60], [95, -150], [-60, -230], [140, -20]])}
        </g>
        <g transform={morceau(1)}>
          <path d="M-64 -300 L-34 -562 L34 -562 L64 -300 Z" fill={CREME} />
          {treillis(56, -310, 38, -550, 4)}
          <rect x={-50} y={-580} width={100} height={20} rx={3} fill={CREME} />
          {taches([[30, -360], [-40, -470]])}
        </g>
        <g transform={morceau(2)}>
          <path d="M-28 -580 L-8 -832 L8 -832 L28 -580 Z" fill={CREME} />
          {treillis(24, -590, 9, -820, 5)}
          <rect x={-16} y={-848} width={32} height={16} rx={3} fill={CREME} />
          {taches([[-10, -700]])}
        </g>
        <g transform={morceau(3)}>
          <path d="M-6 -848 L0 -915 L6 -848 Z" fill={CREME} />
        </g>
      </g>
    </g>
  );
};

/** Étiquette suspendue (« À VENDRE »). */
export const Etiquette: React.FC<{ x: number; y: number; k: number; balance: number; texte?: string }> = ({ x, y, k, balance, texte = "À VENDRE" }) => (
  <g transform={`translate(${x} ${y}) rotate(${balance}) scale(${k})`} opacity={Math.min(1, k)}>
    <line x1={0} y1={0} x2={0} y2={70} stroke={CREME} strokeWidth={4} />
    <g transform="translate(0 70)">
      <path d="M-110 20 L-80 0 L160 0 L160 80 L-80 80 L-110 60 Z" fill={JAUNE} />
      <circle cx={-82} cy={40} r={9} fill={NUIT} />
      <text x={40} y={54} textAnchor="middle" style={txt(38, NUIT)}>
        {texte}
      </text>
    </g>
  </g>
);

/** Sac d'argent (lettre : F pour francs, $ pour dollars). */
export const Sac: React.FC<{ x: number; y: number; s: number; o?: number; lettre?: string }> = ({ x, y, s, o = 1, lettre = "$" }) => (
  <g transform={`translate(${x} ${y}) scale(${s / 100})`} opacity={o}>
    <path d="M-40 -70 Q-70 0 -40 10 L40 10 Q70 0 40 -70 Z" fill="#C9A86A" />
    <path d="M-22 -70 L-32 -92 L32 -92 L22 -70 Z" fill="#B08F52" />
    <rect x={-26} y={-76} width={52} height={10} rx={4} fill="#8C6F3B" />
    <text x={0} y={-12} textAnchor="middle" style={txt(46, "#7A5C2A")}>
      {lettre}
    </text>
  </g>
);

/** Billet de banque. */
export const Billet: React.FC<{ x: number; y: number; l: number; rot?: number; o?: number; couleur?: string }> = ({ x, y, l, rot = 0, o = 1, couleur = VERT }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${l / 100})`} opacity={o}>
    <rect x={-50} y={-24} width={100} height={48} rx={5} fill={couleur} />
    <rect x={-43} y={-17} width={86} height={34} rx={3} fill="none" stroke="#2F7A50" strokeWidth={2.5} />
    <circle r={10} fill="none" stroke="#2F7A50" strokeWidth={3} />
    <text y={5} textAnchor="middle" fontSize={14} fontWeight={700} fill="#2F7A50" fontFamily="Poppins">
      $
    </text>
  </g>
);

/** Valise. */
export const Valise: React.FC<{ x: number; y: number; s: number; o?: number }> = ({ x, y, s, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s / 100})`} opacity={o}>
    <rect x={-60} y={-80} width={120} height={80} rx={10} fill="#6E4630" />
    <path d="M-20 -80 V-96 Q-20 -102 -14 -102 H14 Q20 -102 20 -96 V-80" fill="none" stroke="#3E2618" strokeWidth={8} />
    <rect x={-60} y={-46} width={120} height={8} fill="#3E2618" />
    <rect x={-8} y={-52} width={16} height={18} rx={3} fill={JAUNE} />
  </g>
);

/** La « boîte roumaine » : coffre en acajou, deux fentes, leviers. coupe = vue en coupe avec le vrai billet caché. */
export const Boite: React.FC<{ x: number; y: number; s: number; coupe?: number; levier?: number; frame: number }> = ({ x, y, s, coupe = 0, levier = 0, frame }) => (
  <g transform={`translate(${x} ${y}) scale(${s / 100})`}>
    <ellipse cx={0} cy={6} rx={170} ry={16} fill="rgba(0,0,0,.35)" />
    <rect x={-160} y={-200} width={320} height={200} rx={14} fill="#7A3E22" />
    <rect x={-160} y={-200} width={320} height={34} rx={14} fill="#94502E" />
    {/* veinage du bois */}
    {[-150, -110, -60].map((yy, i) => (
      <path key={i} d={`M-150 ${yy + 20} Q-40 ${yy + 8 + i * 4} 60 ${yy + 22} T150 ${yy + 14}`} stroke="#5E2C16" strokeWidth={3} fill="none" opacity={0.6} />
    ))}
    {/* fentes */}
    <rect x={-120} y={-188} width={100} height={8} rx={4} fill="#2A140A" />
    <rect x={20} y={-188} width={100} height={8} rx={4} fill="#2A140A" />
    {/* cadrans et leviers */}
    <circle cx={-90} cy={-100} r={26} fill={CREME} stroke="#C9A86A" strokeWidth={6} />
    <line x1={-90} y1={-100} x2={-90 + 18 * Math.cos(frame / 6)} y2={-100 + 18 * Math.sin(frame / 6)} stroke={NOIR} strokeWidth={4} />
    <circle cx={0} cy={-100} r={26} fill={CREME} stroke="#C9A86A" strokeWidth={6} />
    <line x1={0} y1={-100} x2={0 + 18 * Math.cos(-frame / 9)} y2={-100 + 18 * Math.sin(-frame / 9)} stroke={NOIR} strokeWidth={4} />
    <g transform={`rotate(${-30 + 60 * levier} 110 -70)`}>
      <line x1={110} y1={-70} x2={110} y2={-140} stroke="#C9A86A" strokeWidth={10} strokeLinecap="round" />
      <circle cx={110} cy={-145} r={14} fill={ROUGE} />
    </g>
    {/* vue en coupe : l'intérieur est vide… sauf un vrai billet caché */}
    {coupe > 0 && (
      <g opacity={coupe}>
        <rect x={-150} y={-160} width={300} height={150} rx={10} fill="#1A0D06" />
        <Billet x={40} y={-60} l={130} />
        <rect x={-30} y={-104} width={140} height={88} rx={10} fill="none" stroke={JAUNE} strokeWidth={6} strokeDasharray="14 10" />
        <text x={-80} y={-120} textAnchor="middle" style={txt(30, "#7F93AE", 500)}>
          vide
        </text>
      </g>
    )}
  </g>
);

/** Cadenas. */
export const Cadenas: React.FC<{ couleur?: string }> = ({ couleur = JAUNE }) => (
  <svg width={160} height={180}>
    <path d="M42 80 V52 Q42 14 80 14 Q118 14 118 52 V80" stroke={couleur} strokeWidth={18} fill="none" />
    <rect x={20} y={76} width={120} height={96} rx={16} fill={couleur} />
    <circle cx={80} cy={118} r={13} fill={NUIT} />
    <rect x={74} y={118} width={12} height={30} rx={4} fill={NUIT} />
  </svg>
);

/** Menottes. */
export const Menottes: React.FC<{ x: number; y: number; s: number; o?: number }> = ({ x, y, s, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s / 100})`} opacity={o} fill="none" stroke="#C8CDD6" strokeWidth={14}>
    <circle cx={-55} cy={0} r={40} />
    <circle cx={55} cy={0} r={40} />
    <path d="M-15 0 h30" strokeWidth={10} strokeDasharray="8 6" />
  </g>
);

/** Carte à jouer. */
export const Carte: React.FC<{ x: number; y: number; rot: number; s?: number; signe?: string; o?: number }> = ({ x, y, rot, s = 100, signe = "♠", o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s / 100})`} opacity={o}>
    <rect x={-45} y={-65} width={90} height={130} rx={10} fill="#F6F1E6" stroke="#C9C2B2" strokeWidth={2} />
    <text x={0} y={22} textAnchor="middle" fontSize={64} fill={signe === "♥" || signe === "♦" ? ROUGE : NOIR}>
      {signe}
    </text>
  </g>
);

/** Gyrophare qui tourne. */
export const Gyrophare: React.FC<{ x: number; y: number; frame: number; s?: number }> = ({ x, y, frame, s = 100 }) => {
  const on = Math.floor(frame / 6) % 2 === 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s / 100})`}>
      <ellipse cx={0} cy={-40} rx={160} ry={120} fill={on ? "rgba(70,120,255,.35)" : "rgba(230,80,74,.35)"} />
      <rect x={-40} y={-10} width={80} height={20} rx={4} fill="#3A4150" />
      <path d="M-28 -10 Q-28 -60 0 -60 Q28 -60 28 -10 Z" fill={on ? "#4F7BFF" : ROUGE} />
    </g>
  );
};

/** Horloge dont l'aiguille tourne (tours = nombre d'heures parcourues). */
export const Horloge: React.FC<{ x: number; y: number; heures: number; s?: number }> = ({ x, y, heures, s = 100 }) => (
  <g transform={`translate(${x} ${y}) scale(${s / 100})`}>
    <circle r={150} fill={CREME} stroke={JAUNE} strokeWidth={14} />
    {Array.from({ length: 12 }, (_, i) => (
      <line key={i} x1={0} y1={-125} x2={0} y2={-110} stroke={NOIR} strokeWidth={6} transform={`rotate(${i * 30})`} />
    ))}
    <line x1={0} y1={0} x2={0} y2={-75} stroke={NOIR} strokeWidth={12} strokeLinecap="round" transform={`rotate(${heures * 30})`} />
    <line x1={0} y1={0} x2={0} y2={-110} stroke={ROUGE} strokeWidth={6} strokeLinecap="round" transform={`rotate(${heures * 360})`} />
    <circle r={12} fill={NOIR} />
  </g>
);

/** Trombone. */
export const Trombone: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg width={90} height={200} style={{ position: "absolute", left: x, top: y }}>
    <path
      d="M30 40 V150 A15 15 0 0 0 60 150 V25 A24 24 0 0 0 12 25 V165 A33 33 0 0 0 78 165 V60"
      fill="none"
      stroke="#C8CDD6"
      strokeWidth={8}
      strokeLinecap="round"
    />
  </svg>
);
