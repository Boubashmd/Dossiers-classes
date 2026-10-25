import React from "react";
import { CREME, GRIS, JAUNE, KRAFT, NUIT2 } from "../theme";

// Décors plein écran (1080 x 1920), sol à y = 1350. Couleurs sourdes pour laisser ressortir les personnages.
const SOL = 1350;
const MUR = "#1C3352";
const MUR2 = "#234068";
const LIGNE = "rgba(236,230,216,.18)";

const Sol: React.FC<{ couleur?: string }> = ({ couleur = "#0E1D33" }) => <rect x={0} y={SOL} width={1080} height={570} fill={couleur} />;

/** Petite ville de Bohême : maisons, clocher. */
export const Maison: React.FC<{ frame: number }> = () => (
  <g>
    <Sol />
    {[
      [120, 220, 260],
      [380, 260, 300],
      [700, 230, 240],
    ].map(([x, w, h], i) => (
      <g key={i}>
        <rect x={x} y={SOL - h} width={w} height={h} fill={i === 1 ? MUR2 : MUR} />
        <path d={`M${x - 20} ${SOL - h} L${x + w / 2} ${SOL - h - 120} L${x + w + 20} ${SOL - h} Z`} fill="#3A2A26" />
        {[0, 1].map((r) =>
          [0, 1].map((c) => (
            <rect key={`${r}${c}`} x={x + 40 + c * (w - 120)} y={SOL - h + 50 + r * 100} width={40} height={50} fill={JAUNE} opacity={0.75} />
          ))
        )}
      </g>
    ))}
    <rect x={940} y={SOL - 520} width={70} height={520} fill={MUR} />
    <path d={`M925 ${SOL - 520} L975 ${SOL - 680} L1025 ${SOL - 520} Z`} fill="#3A2A26" />
  </g>
);

/** Paquebot sur l'océan, fumée. */
export const Paquebot: React.FC<{ frame: number }> = ({ frame }) => {
  const roulis = Math.sin(frame / 18) * 1.5;
  return (
    <g>
      <rect x={0} y={1180} width={1080} height={740} fill="#0D2440" />
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M0 ${1220 + i * 70} Q135 ${1200 + i * 70 + Math.sin(frame / 10 + i) * 8} 270 ${1220 + i * 70} T540 ${1220 + i * 70} T810 ${1220 + i * 70} T1080 ${1220 + i * 70}`}
          stroke={LIGNE}
          strokeWidth={4}
          fill="none"
        />
      ))}
      <g transform={`rotate(${roulis} 540 1200)`}>
        <path d="M120 1060 L960 1060 L880 1210 L200 1210 Z" fill="#1A1D26" />
        <rect x={120} y={1060} width={840} height={18} fill={CREME} />
        <rect x={260} y={960} width={560} height={100} fill={CREME} />
        {Array.from({ length: 9 }, (_, i) => (
          <circle key={i} cx={300 + i * 60} cy={1010} r={12} fill={JAUNE} opacity={0.8} />
        ))}
        {[380, 540, 700].map((x, i) => (
          <g key={i}>
            <rect x={x - 35} y={830} width={70} height={130} fill="#B8423C" />
            <rect x={x - 35} y={830} width={70} height={24} fill="#1A1D26" />
            <circle cx={x + 20 + ((frame + i * 20) % 60)} cy={790 - ((frame + i * 20) % 60)} r={26 + ((frame + i * 20) % 60) / 3} fill="rgba(236,230,216,.25)" />
          </g>
        ))}
      </g>
    </g>
  );
};

/** Grand hôtel parisien : façade, lustre. */
export const Hotel: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <rect x={0} y={0} width={1080} height={SOL} fill="#152B47" />
    {[100, 330, 560, 790].map((x, i) => (
      <g key={i}>
        <path d={`M${x} ${SOL} V${720} Q${x + 95} ${600} ${x + 190} ${720} V${SOL}`} fill="#1E3A5E" />
        <rect x={x - 20} y={560} width={30} height={SOL - 560} fill={MUR2} />
      </g>
    ))}
    <rect x={0} y={520} width={1080} height={40} fill={KRAFT} opacity={0.35} />
    <g transform="translate(540 420)">
      <line x1={0} y1={-200} x2={0} y2={-40} stroke={JAUNE} strokeWidth={4} />
      <path d="M-130 0 Q0 70 130 0" stroke={JAUNE} strokeWidth={7} fill="none" />
      {[-130, -65, 0, 65, 130].map((x, i) => {
        const yy = x === 0 ? 34 : Math.abs(x) === 65 ? 26 : 0;
        return (
          <g key={i}>
            <circle cx={x} cy={yy} r={10} fill={JAUNE} />
            <circle cx={x} cy={yy - 20} r={8} fill="#FFF3B0" opacity={0.6 + 0.4 * Math.sin(frame / 5 + i)} />
          </g>
        );
      })}
    </g>
    <Sol couleur="#3A2430" />
  </g>
);

/** Mur de prison avec fenêtre à barreaux. */
export const Prison: React.FC<{ frame: number }> = () => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#1A2638" />
    {Array.from({ length: 22 }, (_, r) =>
      Array.from({ length: 6 }, (_, c) => (
        <rect key={`${r}-${c}`} x={c * 190 - (r % 2) * 95} y={r * 90} width={180} height={80} fill="#22324A" />
      ))
    )}
    <rect x={340} y={420} width={400} height={480} fill="#0B1626" />
    <rect x={340} y={420} width={400} height={480} fill="none" stroke="#3A4150" strokeWidth={16} />
    {[420, 500, 580, 660].map((x) => (
      <rect key={x} x={x - 8} y={420} width={16} height={480} fill="#5A6475" />
    ))}
    <circle cx={620} cy={540} r={40} fill={CREME} opacity={0.8} />
  </g>
);

/** Consignes du métro. */
export const Consignes: React.FC<{ frame: number; ouverte?: number }> = ({ ouverte = 0 }) => (
  <g>
    <rect x={0} y={0} width={1080} height={SOL} fill="#20304A" />
    {Array.from({ length: 4 }, (_, r) =>
      Array.from({ length: 4 }, (_, c) => {
        const x = 150 + c * 200;
        const y = 420 + r * 220;
        const cible = r === 2 && c === 1;
        return (
          <g key={`${r}${c}`}>
            <rect x={x} y={y} width={180} height={200} rx={8} fill={cible ? "#2E4A70" : "#2A4060"} stroke="#3A5478" strokeWidth={4} />
            <rect x={x + 140} y={y + 90} width={16} height={30} rx={4} fill={GRIS} />
            <text x={x + 20} y={y + 40} style={{ fontFamily: "Poppins", fontSize: 26, fill: GRIS }}>
              {r * 4 + c + 101}
            </text>
            {cible && ouverte > 0 && (
              <g>
                <rect x={x} y={y} width={180} height={200} fill="#0B1626" opacity={ouverte} />
                <path d={`M${x} ${y} L${x - 120 * ouverte} ${y + 20} L${x - 120 * ouverte} ${y + 220} L${x} ${y + 200} Z`} fill="#3A5478" />
              </g>
            )}
          </g>
        );
      })
    )}
    <Sol couleur="#151F30" />
  </g>
);

/** Île d'Alcatraz, phare. */
export const Alcatraz: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <rect x={0} y={1150} width={1080} height={770} fill="#0D2440" />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M0 ${1200 + i * 90} Q270 ${1180 + i * 90 + Math.sin(frame / 12 + i) * 8} 540 ${1200 + i * 90} T1080 ${1200 + i * 90}`} stroke={LIGNE} strokeWidth={4} fill="none" />
    ))}
    <path d="M80 1180 Q200 1000 420 990 L760 980 Q920 1000 1000 1180 Z" fill="#2B3A4F" />
    <rect x={300} y={860} width={420} height={130} fill="#C9C2B2" />
    {Array.from({ length: 10 }, (_, i) => (
      <rect key={i} x={320 + i * 40} y={890} width={18} height={60} fill="#5A6475" />
    ))}
    <rect x={770} y={760} width={40} height={230} fill="#C9C2B2" />
    <path d="M760 760 L790 720 L820 760 Z" fill="#3A4150" />
    <path d={`M790 740 L${790 + 500 * Math.cos(frame / 20)} ${740 - 90} L${790 + 500 * Math.cos(frame / 20)} ${740 + 30} Z`} fill="rgba(255,236,170,.15)" />
  </g>
);

/** Silhouette de New York la nuit. */
export const Ville: React.FC<{ frame: number }> = () => (
  <g>
    {[
      [40, 300],
      [150, 520],
      [270, 380],
      [360, 680],
      [470, 450],
      [570, 820],
      [660, 520],
      [770, 600],
      [880, 400],
      [970, 560],
    ].map(([x, h], i) => (
      <g key={i}>
        <rect x={x} y={SOL - h} width={100} height={h} fill={i % 2 ? MUR : MUR2} />
        {Array.from({ length: Math.floor(h / 70) }, (_, r) => (
          <rect key={r} x={x + 20 + (r % 2) * 40} y={SOL - h + 30 + r * 70} width={20} height={26} fill={JAUNE} opacity={(r + i) % 3 === 0 ? 0.7 : 0.15} />
        ))}
      </g>
    ))}
    <Sol />
  </g>
);

/** Bureau sombre avec lampe (pour les documents). */
export const Bureau: React.FC<{ frame: number }> = () => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill={NUIT2} opacity={0.35} />
  </g>
);

// ============================================================================================
// Affaire nº 2 (Opération Mincemeat)
// ============================================================================================
const CIEL_NUIT = "#0A1730";
const MER = "#11284A";
const MER_CLAIRE = "#1B3A63";

const Vagues: React.FC<{ frame: number; y0: number; n?: number; couleur?: string }> = ({ frame, y0, n = 6, couleur = "rgba(236,230,216,.16)" }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const y = y0 + i * 90;
      const dx = ((frame * (1.5 + i * 0.3)) % 160) - 160;
      let d = `M${dx} ${y}`;
      for (let x = dx; x < 1240; x += 80) d += ` q20 -14 40 0 t40 0`;
      return <path key={i} d={d} stroke={couleur} strokeWidth={4} fill="none" />;
    })}
  </g>
);

const Lune: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <circle cx={x} cy={y} r={120} fill="rgba(236,230,216,.06)" />
    <circle cx={x} cy={y} r={56} fill={CREME} opacity={0.85} />
  </g>
);

const Etoiles: React.FC = () => (
  <g>
    {Array.from({ length: 28 }, (_, i) => (
      <circle key={i} cx={(i * 389) % 1080} cy={280 + ((i * 211) % 640)} r={i % 3 === 0 ? 3 : 2} fill={CREME} opacity={0.5} />
    ))}
  </g>
);

/** Côte de Sicile la nuit : falaise, mer, projecteur qui balaie. Personnages sur la falaise (sol 1350). */
export const Cote: React.FC<{ frame: number }> = ({ frame }) => {
  const a = Math.sin(frame / 25) * 22 - 30;
  return (
    <g>
      <rect x={0} y={0} width={1080} height={1920} fill={CIEL_NUIT} />
      <Etoiles />
      <rect x={0} y={1080} width={1080} height={840} fill={MER} />
      <Vagues frame={frame} y0={1130} n={4} />
      <g transform={`rotate(${a} 160 1240)`}>
        <path d="M160 1240 L1300 1040 L1300 1320 Z" fill="rgba(255,232,170,.13)" />
      </g>
      <path d="M0 1350 L0 1250 Q300 1225 540 1245 Q800 1265 1080 1235 L1080 1350 Z" fill="#1C2A3E" />
      <rect x={0} y={1350} width={1080} height={570} fill="#121E30" />
      <circle cx={160} cy={1240} r={26} fill={JAUNE} opacity={0.9} />
    </g>
  );
};

/** Mer de nuit, lune, sous-marin qui fait surface (frame anime la montée). */
export const SousMarin: React.FC<{ frame: number }> = ({ frame }) => {
  const monte = Math.min(1, frame / 45);
  const y = 1080 - 70 * monte + Math.sin(frame / 14) * 4;
  return (
    <g>
      <rect x={0} y={0} width={1080} height={1920} fill={CIEL_NUIT} />
      <Etoiles />
      <Lune x={820} y={560} />
      <rect x={0} y={1020} width={1080} height={900} fill={MER} />
      <path d="M770 1020 L870 1020 L860 1900 L780 1900 Z" fill="rgba(236,230,216,.06)" />
      <g transform={`translate(540 ${y})`}>
        <path d="M-420 40 Q-440 0 -380 -10 L380 -10 Q460 0 420 40 Q300 70 0 70 Q-300 70 -420 40 Z" fill="#2B3646" />
        <path d="M-70 -10 L-60 -120 L80 -120 L110 -10 Z" fill="#2B3646" />
        <rect x={-30} y={-170} width={8} height={50} fill="#2B3646" />
        <rect x={30} y={-150} width={6} height={30} fill="#2B3646" />
        <text x={10} y={-50} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={34} fill="rgba(236,230,216,.55)">
          P219
        </text>
      </g>
      <rect x={0} y={1076} width={1080} height={850} fill={MER} opacity={0.55} />
      <Vagues frame={frame} y0={1090} n={9} />
    </g>
  );
};

/** Le corps dérive vers la côte espagnole avant l'aube (gilet de sauvetage jaune). */
export const Derive: React.FC<{ frame: number }> = ({ frame }) => {
  const u = Math.min(1, frame / 120);
  const x = 180 + 480 * u;
  const y = 1090 + Math.sin(frame / 10) * 10;
  return (
    <g>
      <rect x={0} y={0} width={1080} height={1920} fill="#14284A" />
      <rect x={0} y={600} width={1080} height={390} fill="#2A3F66" opacity={0.6} />
      <path d="M760 960 Q900 920 1080 940 L1080 1020 L760 1020 Z" fill="#3A3A40" />
      <rect x={0} y={990} width={1080} height={930} fill={MER_CLAIRE} />
      <Vagues frame={frame} y0={1030} n={10} />
      <g transform={`translate(${x} ${y}) rotate(${Math.sin(frame / 12) * 4})`}>
        <rect x={-120} y={-22} width={200} height={40} rx={20} fill="#B9A57A" />
        <rect x={-60} y={-28} width={70} height={50} rx={14} fill={JAUNE} />
        <circle cx={104} cy={-4} r={22} fill="#B9A57A" />
      </g>
      <rect x={0} y={1102} width={1080} height={830} fill={MER_CLAIRE} opacity={0.5} />
    </g>
  );
};

/** Plage de Huelva à l'aube : mer, sable, barque, corps allongé sur le sable. */
export const Plage: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <defs>
      <linearGradient id="aube" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1B2D52" />
        <stop offset="1" stopColor="#C98A5E" />
      </linearGradient>
    </defs>
    <rect x={0} y={0} width={1080} height={940} fill="url(#aube)" />
    <circle cx={260} cy={940} r={90} fill="#F2C178" opacity={0.85} />
    <rect x={0} y={920} width={1080} height={160} fill={MER_CLAIRE} />
    <Vagues frame={frame} y0={960} n={2} />
    <g transform={`translate(780 ${990 + Math.sin(frame / 15) * 4})`}>
      <path d="M-90 0 L90 0 L70 30 L-70 30 Z" fill="#6E4630" />
      <rect x={-4} y={-90} width={8} height={90} fill="#6E4630" />
    </g>
    <path d="M0 1080 Q300 1050 600 1075 Q850 1095 1080 1070 L1080 1920 L0 1920 Z" fill="#C9A86A" />
    <path d="M0 1080 Q300 1050 600 1075 Q850 1095 1080 1070" stroke="rgba(236,230,216,.6)" strokeWidth={8} fill="none" />
    {/* corps allongé (uniforme kaki + gilet) */}
    <g transform="translate(330 1150)">
      <rect x={-130} y={-24} width={220} height={44} rx={22} fill="#B9A57A" />
      <rect x={-70} y={-30} width={76} height={56} rx={14} fill={JAUNE} />
      <circle cx={112} cy={-2} r={24} fill="#B9A57A" />
    </g>
  </g>
);

/** Cimetière de Huelva : pierre tombale « William Martin ». p.graver = un nouveau nom se grave. */
export const Tombe: React.FC<{ frame: number; p?: any }> = ({ frame, p = {} }) => {
  const g = p.graver ? Math.min(1, Math.max(0, (frame - 20) / 40)) : 0;
  const nom = "GLYNDWR MICHAEL";
  return (
    <g>
      <rect x={0} y={0} width={1080} height={1920} fill="#13233D" />
      <Etoiles />
      {[150, 930].map((x) => (
        <g key={x}>
          <rect x={x - 12} y={900} width={24} height={450} fill="#1A2C46" />
          <ellipse cx={x} cy={880} rx={90} ry={150} fill="#1A2C46" />
        </g>
      ))}
      <rect x={0} y={1350} width={1080} height={570} fill="#0F1C2E" />
      {/* drapeau britannique sur la tombe */}
      {p.drapeau !== false && (
        <g transform="translate(250 1060)">
          <rect x={0} y={0} width={8} height={290} fill="#C9CDD4" />
          <g transform={`translate(8 4) skewY(${Math.sin(frame / 10) * 3})`}>
            <rect width={150} height={90} fill="#24407A" />
            <path d="M0 0 L150 90 M150 0 L0 90" stroke={CREME} strokeWidth={18} />
            <path d="M0 0 L150 90 M150 0 L0 90" stroke={ROUGE_DRAPEAU} strokeWidth={6} />
            <path d="M75 0 V90 M0 45 H150" stroke={CREME} strokeWidth={26} />
            <path d="M75 0 V90 M0 45 H150" stroke={ROUGE_DRAPEAU} strokeWidth={14} />
          </g>
        </g>
      )}
      <path d="M380 1350 V900 Q380 800 540 800 Q700 800 700 900 V1350 Z" fill="#C9C3B6" />
      <path d="M520 840 h40 v40 h40 v40 h-40 v80 h-40 v-80 h-40 v-40 h40 Z" fill="#A9A396" />
      <text x={540} y={1090} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={34} fill="#4A4A4A">
        WILLIAM MARTIN
      </text>
      <text x={540} y={1136} textAnchor="middle" fontFamily="Poppins" fontWeight={500} fontSize={28} fill="#5A5A5A">
        1907 – 1943
      </text>
      {g > 0 && (
        <text x={540} y={1220} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={32} fill="#2A2A2A">
          {nom.slice(0, Math.round(nom.length * g))}
        </text>
      )}
    </g>
  );
};
const ROUGE_DRAPEAU = "#C8102E";

export const DECORS: Record<string, React.FC<{ frame: number; p?: any }>> = {
  maison: Maison,
  paquebot: Paquebot,
  hotel: Hotel,
  prison: Prison,
  consignes: Consignes,
  alcatraz: Alcatraz,
  ville: Ville,
  bureau: Bureau,
  cote: Cote,
  sousmarin: SousMarin,
  derive: Derive,
  plage: Plage,
  tombe: Tombe,
};
