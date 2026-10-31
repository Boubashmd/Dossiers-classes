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

// ============================================================================================
// Affaire nº 2 (Opération Mincemeat) — objets centrés en (0,0), taille ~ s px de large.
// ============================================================================================

/** Mallette en cuir reliée par une chaîne à une manche d'uniforme. chaine = 0 -> 1 (la chaîne se tend). */
export const Mallette: React.FC<{ x: number; y: number; s: number; chaine?: number; o?: number }> = ({ x, y, s, chaine = 1, o = 1 }) => {
  const maillons = 9;
  return (
    <g transform={`translate(${x} ${y}) scale(${s / 400})`} opacity={o}>
      {/* manche d'uniforme en haut à gauche */}
      {/* bras en uniforme qui arrive du coin, poignet + bracelet */}
      <path d="M-520 -560 L-400 -620 L-140 -230 L-260 -170 Z" fill="#B9A57A" />
      <path d="M-262 -174 L-140 -234 L-128 -212 L-250 -150 Z" fill="#9A8960" />
      <circle cx={-190} cy={-170} r={22} fill="none" stroke="#C9CDD4" strokeWidth={9} />
      {/* chaîne */}
      {Array.from({ length: maillons }, (_, i) => {
        const u = i / (maillons - 1);
        const cx = -190 + (-40 + 190) * u;
        const cy = -150 + (-70 + 150) * u + Math.sin(u * Math.PI) * 60 * (1 - chaine);
        return u <= chaine + 0.01 ? <ellipse key={i} cx={cx} cy={cy} rx={14} ry={8} transform={`rotate(${30 + (i % 2) * 60} ${cx} ${cy})`} fill="none" stroke="#C9CDD4" strokeWidth={6} /> : null;
      })}
      {/* poignée + corps */}
      <path d="M-60 -60 V-96 Q-60 -110 -46 -110 H46 Q60 -110 60 -96 V-60" fill="none" stroke="#3E2618" strokeWidth={14} />
      <rect x={-200} y={-64} width={400} height={250} rx={22} fill="#6E4630" />
      <rect x={-200} y={-64} width={400} height={60} rx={22} fill="#80553A" />
      <rect x={-200} y={-14} width={400} height={10} fill="#3E2618" />
      <rect x={-130} y={-26} width={40} height={34} rx={6} fill={JAUNE} />
      <rect x={90} y={-26} width={40} height={34} rx={6} fill={JAUNE} />
      <ellipse cx={0} cy={200} rx={220} ry={18} fill="rgba(0,0,0,.35)" />
    </g>
  );
};

/** Flacon de poison avec tête de mort. */
export const Flacon: React.FC<{ x: number; y: number; s: number; o?: number }> = ({ x, y, s, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s / 300})`} opacity={o}>
    <ellipse cx={0} cy={250} rx={170} ry={16} fill="rgba(0,0,0,.35)" />
    <rect x={-40} y={-260} width={80} height={50} rx={8} fill="#5A3A22" />
    <path d="M-34 -210 V-160 Q-130 -120 -130 -20 V200 Q-130 250 -80 250 H80 Q130 250 130 200 V-20 Q130 -120 34 -160 V-210 Z" fill="#4E7A5A" />
    <path d="M-110 -10 Q-110 -100 -40 -140" stroke="rgba(255,255,255,.35)" strokeWidth={14} fill="none" strokeLinecap="round" />
    <rect x={-100} y={0} width={200} height={170} rx={10} fill={CREME} />
    <circle cx={0} cy={60} r={34} fill={NOIR} />
    <rect x={-20} y={84} width={40} height={22} rx={4} fill={NOIR} />
    <circle cx={-12} cy={56} r={9} fill={CREME} />
    <circle cx={12} cy={56} r={9} fill={CREME} />
    <path d="M-60 120 L60 156 M60 120 L-60 156" stroke={NOIR} strokeWidth={12} strokeLinecap="round" />
  </g>
);

/** Photo de fiancée (dessinée) : portrait sépia d'une jeune femme, bordure blanche. */
export const PhotoPortrait: React.FC<{ x: number; y: number; s: number; rot?: number; o?: number; legende?: string }> = ({ x, y, s, rot = -4, o = 1, legende }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s / 400})`} opacity={o}>
    <rect x={-200} y={-250} width={400} height={500} rx={6} fill="#F4EFE4" />
    <rect x={-176} y={-226} width={352} height={400} fill="#B89A72" />
    {/* buste */}
    <path d="M-150 174 Q-150 60 0 50 Q150 60 150 174 Z" fill="#6E5440" />
    <rect x={-24} y={10} width={48} height={50} fill="#E8CDAE" />
    <ellipse cx={0} cy={-40} rx={62} ry={76} fill="#E8CDAE" />
    {/* cheveux courts ondulés années 40 */}
    <path d="M-70 -30 Q-86 -140 0 -134 Q86 -140 70 -30 Q66 -80 30 -96 Q-10 -70 -54 -84 Q-70 -60 -70 -30 Z" fill="#4A3424" />
    <path d="M-72 -40 Q-90 0 -66 20 L-58 -30 Z M72 -40 Q90 0 66 20 L58 -30 Z" fill="#4A3424" />
    <path d="M-20 -28 h10 M10 -28 h10" stroke="#5A4030" strokeWidth={5} strokeLinecap="round" />
    <path d="M-14 6 Q0 14 14 6" stroke="#A05050" strokeWidth={5} fill="none" strokeLinecap="round" />
    {legende && (
      <text x={0} y={228} textAnchor="middle" fontFamily="cursive" fontSize={44} fill="#3A3A5A">
        {legende}
      </text>
    )}
  </g>
);

/** Enveloppe fermée par un cachet de cire. cachet = 0 -> 1 (le cachet se pose). */
export const Enveloppe: React.FC<{ x: number; y: number; s: number; cachet?: number; o?: number }> = ({ x, y, s, cachet = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s / 500})`} opacity={o}>
    <ellipse cx={0} cy={180} rx={260} ry={18} fill="rgba(0,0,0,.35)" />
    <rect x={-250} y={-160} width={500} height={330} rx={10} fill="#EDE3CC" />
    <path d="M-250 -160 L0 40 L250 -160" fill="#E0D3B4" stroke="#C8B994" strokeWidth={4} />
    <path d="M-250 170 L-60 10 M250 170 L60 10" stroke="#C8B994" strokeWidth={4} />
    {cachet > 0 && (
      <g transform={`translate(0 40) scale(${0.4 + 0.6 * Math.min(1, cachet)})`} opacity={Math.min(1, cachet * 2)}>
        <circle r={58} fill="#A3282A" />
        <circle r={40} fill="none" stroke="#7E1C1E" strokeWidth={6} />
        <text y={16} textAnchor="middle" fontFamily="serif" fontWeight={700} fontSize={46} fill="#7E1C1E">
          M
        </text>
      </g>
    )}
  </g>
);

// ============================================================================================
// Affaires nº 3 et 4 (Ponzi, Madoff)
// ============================================================================================

/** Coupon-réponse international (1920) : papier dentelé, bandeau, valeur. timbres = des timbres sortent du coupon. */
export const Coupon: React.FC<{ x: number; y: number; s: number; rot?: number; o?: number; timbres?: number }> = ({ x, y, s, rot = -3, o = 1, timbres = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s / 500})`} opacity={o}>
    {timbres > 0 &&
      [-1, 0, 1].map((i) => (
        <g key={i} transform={`translate(${i * 170} ${-260 * timbres}) rotate(${i * 12 * timbres})`} opacity={Math.min(1, timbres * 2)}>
          <rect x={-70} y={-85} width={140} height={170} fill="#F4EFE4" stroke="#C8B994" strokeWidth={4} strokeDasharray="10 6" />
          <rect x={-52} y={-66} width={104} height={110} fill={i === 0 ? "#B04A3A" : "#3A6A8A"} />
          <text x={0} y={70} textAnchor="middle" fontFamily="serif" fontWeight={700} fontSize={26} fill="#3A2A20">
            {i === 0 ? "2 c" : "1 c"}
          </text>
        </g>
      ))}
    <rect x={-250} y={-150} width={500} height={300} fill="#E8E0C6" stroke="#B9A97E" strokeWidth={6} strokeDasharray="14 8" />
    <rect x={-220} y={-122} width={440} height={60} fill="#3E5A6E" />
    <text x={0} y={-80} textAnchor="middle" fontFamily="serif" fontWeight={700} fontSize={24} fill="#F4EFE4">
      UNION POSTALE UNIVERSELLE
    </text>
    <text x={0} y={-10} textAnchor="middle" fontFamily="serif" fontWeight={700} fontSize={34} fill="#3A2A20">
      COUPON-RÉPONSE
    </text>
    <text x={0} y={30} textAnchor="middle" fontFamily="serif" fontWeight={700} fontSize={34} fill="#3A2A20">
      INTERNATIONAL
    </text>
    <circle cx={150} cy={95} r={38} fill="none" stroke="#7A3442" strokeWidth={5} />
    <path d="M-200 100 H60" stroke="#B9A97E" strokeWidth={4} />
  </g>
);

/** Voiture de luxe des années 1920 avec chauffeur. avance = 0 -> 1 (arrive de la gauche). */
export const Voiture: React.FC<{ x: number; y: number; s: number; o?: number; frame?: number }> = ({ x, y, s, o = 1, frame = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s / 600})`} opacity={o}>
    <ellipse cx={0} cy={10} rx={320} ry={20} fill="rgba(0,0,0,.35)" />
    <path d="M-300 -40 L-300 -110 Q-300 -130 -270 -130 L-60 -130 L-40 -230 L140 -230 L170 -130 L260 -120 Q300 -110 300 -70 L300 -40 Z" fill="#7A3442" />
    <path d="M-30 -215 L130 -215 L150 -135 L-45 -135 Z" fill="#9FC3D8" opacity={0.8} />
    <rect x={-300} y={-62} width={600} height={14} fill="#5E2632" />
    <rect x={250} y={-112} width={30} height={20} rx={4} fill={JAUNE} />
    {/* chauffeur */}
    <circle cx={60} cy={-170} r={26} fill="#2A2A2A" />
    <rect x={36} y={-206} width={50} height={14} rx={4} fill="#1A1D26" />
    {[-190, 190].map((wx) => (
      <g key={wx} transform={`translate(${wx} -30) rotate(${frame * 6})`}>
        <circle r={58} fill="#1A1D26" />
        <circle r={30} fill="#C9CDD4" />
        <path d="M-30 0 H30 M0 -30 V30" stroke="#1A1D26" strokeWidth={6} />
      </g>
    ))}
  </g>
);

// ============================================================================================
// Affaire nº 5 (D. B. Cooper)
// ============================================================================================

/** Mallette ouverte : bâtons rouges, fils, batterie (la « bombe »). ouvre = 0 -> 1. */
export const MalletteBombe: React.FC<{ x: number; y: number; s: number; ouvre?: number; o?: number }> = ({ x, y, s, ouvre = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s / 500})`} opacity={o}>
    <ellipse cx={0} cy={170} rx={270} ry={18} fill="rgba(0,0,0,.35)" />
    <rect x={-250} y={0} width={500} height={160} rx={16} fill="#2E2E34" />
    <rect x={-230} y={14} width={460} height={130} rx={10} fill="#4A3A2A" />
    {ouvre > 0.3 &&
      [-150, -105, -60].map((bx, i) => <rect key={i} x={bx} y={24} width={36} height={110} rx={8} fill="#C0392B" opacity={Math.min(1, (ouvre - 0.3) * 2)} />)}
    {ouvre > 0.3 && <rect x={60} y={40} width={120} height={80} rx={8} fill="#D4A017" opacity={Math.min(1, (ouvre - 0.3) * 2)} />}
    {ouvre > 0.3 && (
      <g stroke="#E6E6E6" strokeWidth={5} fill="none" opacity={Math.min(1, (ouvre - 0.3) * 2)}>
        <path d="M-130 30 Q-40 -10 60 60" />
        <path d="M-85 40 Q0 120 70 100" stroke="#E6504A" />
        <path d="M-40 60 Q20 20 100 50" stroke="#4A90D9" />
      </g>
    )}
    {/* couvercle */}
    <g transform={`rotate(${-75 * ouvre} -250 0)`}>
      <rect x={-250} y={-150} width={500} height={150} rx={16} fill="#3A3A42" />
      <rect x={-30} y={-170} width={60} height={24} rx={8} fill="#1A1A1E" />
    </g>
  </g>
);

/** Quatre parachutes (n = combien sont visibles, 0 -> 4). */
export const Parachutes: React.FC<{ x: number; y: number; s: number; n?: number }> = ({ x, y, s, n = 4 }) => (
  <g transform={`translate(${x} ${y}) scale(${s / 600})`}>
    {[0, 1, 2, 3].map((i) => {
      const k = Math.max(0, Math.min(1, n - i));
      const cx = -225 + i * 150;
      return (
        <g key={i} transform={`translate(${cx} ${(i % 2) * 60}) scale(${k})`} opacity={k}>
          <path d="M-65 0 Q0 -80 65 0 Q32 -12 0 -10 Q-32 -12 -65 0 Z" fill={i % 2 ? "#E6504A" : "#ECE6D8"} />
          <path d="M-63 0 L-8 90 M63 0 L8 90 M-30 -8 L-4 90 M30 -8 L4 90" stroke="#9AA8BD" strokeWidth={3} />
          <rect x={-16} y={90} width={32} height={40} rx={6} fill="#4A5C78" />
        </g>
      );
    })}
  </g>
);

/** Cravate noire étroite à pince (clip-on). */
export const Cravate: React.FC<{ x: number; y: number; s: number; rot?: number; o?: number }> = ({ x, y, s, rot = -8, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s / 400})`} opacity={o}>
    <rect x={-90} y={-230} width={180} height={34} rx={8} fill="#C9CDD4" />
    <path d="M-40 -200 L40 -200 L28 -150 L-28 -150 Z" fill="#14161C" />
    <path d="M-26 -150 L26 -150 L48 170 L0 220 L-48 170 Z" fill="#1A1D26" />
    <path d="M-20 -140 L22 -140" stroke="#2E3240" strokeWidth={4} />
    <rect x={-60} y={10} width={120} height={14} rx={6} fill="#D4A017" />
    <circle cx={50} cy={17} r={10} fill="#ECE6D8" />
  </g>
);

// ============================================================================================
// Affaire nº 8 (cryptos, hackers) — ordinateur portable avec différents écrans.
// ============================================================================================

/** Ordinateur portable. ecran : "alerte" (accès non autorisé), "rancon" (écran rouge de rançongiciel),
 *  "fuite" (portefeuille qui se vide : valeur 0 -> 1), "graphique". */
export const Portable: React.FC<{ x: number; y: number; s: number; ecran?: string; frame?: number; valeur?: number }> = ({ x, y, s, ecran = "alerte", frame = 0, valeur = 0 }) => {
  const clign = Math.floor(frame / 8) % 2 === 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s / 600})`}>
      <ellipse cx={0} cy={210} rx={330} ry={20} fill="rgba(0,0,0,.4)" />
      <path d="M-300 170 L300 170 L340 210 L-340 210 Z" fill="#8A9099" />
      <rect x={-270} y={-200} width={540} height={370} rx={18} fill="#2A2F38" />
      <rect x={-250} y={-180} width={500} height={330} rx={6} fill={ecran === "rancon" ? "#7A1414" : "#0B1626"} />
      {ecran === "alerte" && (
        <g>
          <rect x={-200} y={-90} width={400} height={150} rx={12} fill={clign ? "#E6504A" : "#A33030"} />
          <text x={0} y={-20} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={40} fill="#FFFFFF">ACCÈS</text>
          <text x={0} y={30} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={40} fill="#FFFFFF">NON AUTORISÉ</text>
        </g>
      )}
      {ecran === "rancon" && (
        <g>
          <text x={0} y={-80} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={44} fill="#FFFFFF">FICHIERS BLOQUÉS</text>
          <rect x={-160} y={-40} width={320} height={110} rx={10} fill="#5A0E0E" />
          <path d="M-30 -10 L-30 -24 Q-30 -50 0 -50 Q30 -50 30 -24 L30 -10" stroke="#FFFFFF" strokeWidth={8} fill="none" />
          <rect x={-44} y={-12} width={88} height={64} rx={8} fill="#FFFFFF" />
          <text x={0} y={120} textAnchor="middle" fontFamily="Poppins" fontWeight={500} fontSize={30} fill="#FFD0D0">Payez pour récupérer vos fichiers</text>
        </g>
      )}
      {ecran === "fuite" && (
        <g>
          <text x={-220} y={-120} fontFamily="Poppins" fontWeight={700} fontSize={30} fill={CREME}>PORTEFEUILLE</text>
          <rect x={-220} y={-90} width={440} height={50} rx={10} fill="#1A2C46" />
          <rect x={-220} y={-90} width={440 * (1 - valeur)} height={50} rx={10} fill={valeur > 0.5 ? ROUGE : JAUNE} />
          {Array.from({ length: 5 }, (_, i) => (
            <g key={i} opacity={((frame + i * 6) % 30) / 30 < 0.8 ? 1 : 0}>
              <text x={-220} y={10 + i * 36} fontFamily="monospace" fontSize={24} fill={ROUGE}>
                {`- ${(((i * 7919 + frame * 13) % 9000) + 1000).toLocaleString("fr-FR")} ETH  ⟶ ???`}
              </text>
            </g>
          ))}
        </g>
      )}
      {ecran === "graphique" && (
        <path d="M-220 100 L-140 60 L-80 80 L0 0 L60 20 L140 -60 L220 -100" stroke={JAUNE} strokeWidth={10} fill="none" strokeLinejoin="round" />
      )}
    </g>
  );
};
