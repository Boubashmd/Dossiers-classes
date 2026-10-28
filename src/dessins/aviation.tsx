import React from "react";
import { CREME, JAUNE, NOIR, ROUGE } from "../theme";

// ============================================================================================
// Aviation (affaire nº 5, D. B. Cooper) — avion de ligne des années 70 et décors liés.
// Décors plein écran 1080 x 1920 ; personnages au sol à y = 1350 ; rien d'important sous ~1200.
// ============================================================================================

const CIEL = "#0A1730";
const FORET = "#0F2A22";
const FORET2 = "#163A2E";

/** Avion de ligne type Boeing 727 vu de profil (nez à droite). Centre en (0,0), longueur ~ s px. */
export const Avion: React.FC<{ x: number; y: number; s: number; rot?: number; o?: number; escalier?: number; hublots?: boolean; miroir?: boolean }> = ({
  x,
  y,
  s,
  rot = 0,
  o = 1,
  escalier = 0,
  hublots = true,
  miroir = false,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${(miroir ? -1 : 1) * (s / 600)} ${s / 600})`} opacity={o}>
    {/* dérive en T */}
    <path d="M-250 -30 L-300 -150 L-255 -150 L-200 -30 Z" fill="#C9CDD4" />
    <path d="M-330 -150 L-225 -150 L-230 -140 L-330 -140 Z" fill="#B5BAC2" />
    {/* escalier arrière (s'abaisse sous la queue) */}
    {escalier > 0 && (
      <g transform={`rotate(${35 * escalier} -270 30)`}>
        <rect x={-300} y={26} width={70} height={12} fill="#8A9099" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={-296 + i * 16} y={38} width={8} height={10} fill="#6A7078" />
        ))}
      </g>
    )}
    {/* fuselage */}
    <path d="M-300 -10 Q-290 -40 -240 -40 L230 -40 Q300 -38 300 0 Q298 35 230 38 L-230 38 Q-280 30 -300 -10 Z" fill="#E4E6EA" />
    <path d="M-290 6 L295 6 L290 22 L-280 22 Z" fill="#B0332E" />
    <path d="M-240 -40 L230 -40 Q290 -38 298 -14 L-292 -14 Q-284 -38 -240 -40 Z" fill="#F2F3F5" />
    {/* cockpit */}
    <path d="M250 -30 L282 -26 L288 -14 L252 -14 Z" fill="#2A3A55" />
    {hublots && Array.from({ length: 18 }, (_, i) => <circle key={i} cx={-200 + i * 24} cy={-8} r={5} fill="#2A3A55" />)}
    {/* moteurs arrière */}
    <rect x={-235} y={-58} width={90} height={26} rx={12} fill="#B5BAC2" />
    <rect x={-240} y={-20} width={80} height={22} rx={10} fill="#A9AEB6" />
    {/* aile */}
    <path d="M-40 10 L60 10 L-80 90 L-120 90 Z" fill="#B5BAC2" />
    <text x={20} y={-20} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={22} fill="#B0332E">
      NORTHWEST ORIENT
    </text>
  </g>
);

const Etoiles: React.FC = () => (
  <g>
    {Array.from({ length: 30 }, (_, i) => (
      <circle key={i} cx={(i * 389) % 1080} cy={260 + ((i * 211) % 700)} r={i % 3 === 0 ? 3 : 2} fill={CREME} opacity={0.45} />
    ))}
  </g>
);

const Pluie: React.FC<{ frame: number; n?: number }> = ({ frame, n = 60 }) => (
  <g stroke="rgba(180,200,230,.35)" strokeWidth={3}>
    {Array.from({ length: n }, (_, i) => {
      const x = (i * 157 + frame * 6) % 1180 - 50;
      const y = (i * 263 + frame * 38) % 1500 + 200;
      return <line key={i} x1={x} y1={y} x2={x - 10} y2={y + 46} />;
    })}
  </g>
);

const Sapins: React.FC<{ y0: number; couleur?: string; n?: number; h?: number; decal?: number }> = ({ y0, couleur = FORET2, n = 14, h = 160, decal = 0 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const x = ((i * 1080) / (n - 1) + decal) % 1160 - 40;
      const hh = h * (0.75 + ((i * 37) % 10) / 20);
      return <path key={i} d={`M${x} ${y0 - hh} L${x + hh * 0.32} ${y0} L${x - hh * 0.32} ${y0} Z`} fill={couleur} />;
    })}
  </g>
);

/** Aéroport des années 70 : grande baie vitrée, avion sur le tarmac, comptoir. */
export const Aeroport: React.FC<{ frame: number; p?: any }> = ({ frame }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#1A2A44" />
    <rect x={60} y={430} width={960} height={560} fill="#2C4A72" />
    {[300, 540, 780].map((x) => (
      <rect key={x} x={x - 6} y={430} width={12} height={560} fill="#1A2A44" />
    ))}
    <rect x={60} y={830} width={960} height={160} fill="#3A5478" />
    <Avion x={560 + Math.sin(frame / 40) * 4} y={800} s={620} />
    <rect x={0} y={990} width={1080} height={20} fill="#0E1D33" />
    <rect x={0} y={1350} width={1080} height={570} fill="#0E1D33" />
    <rect x={640} y={1150} width={380} height={200} fill="#4A5C78" />
    <rect x={640} y={1150} width={380} height={30} fill={JAUNE} opacity={0.85} />
    <text x={830} y={1172} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={22} fill={NOIR}>
      NORTHWEST ORIENT
    </text>
  </g>
);

/** Cabine d'avion vue de l'allée : rangées de sièges, un siège surligné. */
export const Cabine: React.FC<{ frame: number; p?: any }> = ({ p = {} }) => {
  const rangs = [0, 1, 2, 3, 4, 5];
  return (
    <g>
      <rect x={0} y={0} width={1080} height={1920} fill="#1C2A40" />
      <path d="M140 380 Q540 300 940 380 L1000 1350 L80 1350 Z" fill="#2A3A55" />
      {rangs.map((r) => {
        const k = 0.45 + r * 0.13;
        const y = 520 + r * 130;
        const larg = 140 * k;
        return (
          <g key={r}>
            {[-1, 1].map((cote) =>
              [0, 1, 2].map((i) => {
                const x = 540 + cote * (90 * k + i * (larg + 8) + larg / 2);
                const surligne = p.siege && r === 3 && cote === 1 && i === 0;
                return (
                  <g key={`${cote}${i}`}>
                    <rect x={x - larg / 2} y={y - 100 * k} width={larg} height={130 * k} rx={14 * k} fill={surligne ? JAUNE : "#4A5C78"} />
                    <rect x={x - larg / 2} y={y - 120 * k} width={larg} height={30 * k} rx={10 * k} fill={surligne ? "#E0B800" : "#5A6E8E"} />
                  </g>
                );
              })
            )}
          </g>
        );
      })}
      {p.siege && (
        <text x={674} y={905} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={40} fill={NOIR}>
          {p.siege}
        </text>
      )}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={120 + i * 20} cy={460 + i * 150} r={14} fill="#0B1626" />
      ))}
    </g>
  );
};

/** Tarmac de nuit : avion au sol, projecteurs. p.reno = nom d'escale. */
export const Piste: React.FC<{ frame: number; p?: any }> = ({ frame }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill={CIEL} />
    <Etoiles />
    <rect x={0} y={1000} width={1080} height={920} fill="#121E30" />
    {Array.from({ length: 9 }, (_, i) => (
      <rect key={i} x={i * 130 + ((frame * 2) % 130) - 130} y={1150} width={70} height={10} fill={JAUNE} opacity={0.6} />
    ))}
    <path d="M100 400 L330 1000 L-100 1000 Z" fill="rgba(255,232,170,.08)" />
    <path d="M980 400 L1180 1000 L760 1000 Z" fill="rgba(255,232,170,.08)" />
    <Avion x={540} y={930} s={820} />
    {[180, 900].map((x) => (
      <g key={x}>
        <rect x={x - 4} y={420} width={8} height={580} fill="#3A4150" />
        <circle cx={x} cy={410} r={16} fill={JAUNE} />
      </g>
    ))}
  </g>
);

/** Avion qui vole bas au-dessus des montagnes et des forêts, de nuit. */
export const Vol: React.FC<{ frame: number; p?: any }> = ({ frame }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill={CIEL} />
    <Etoiles />
    <path d="M0 1000 L180 760 L330 900 L520 700 L700 880 L860 740 L1080 950 L1080 1920 L0 1920 Z" fill="#1A2C46" />
    <rect x={0} y={1040} width={1080} height={900} fill={FORET} />
    <Sapins y0={1080} decal={-frame * 3} />
    <Avion x={700 - ((frame * 1.5) % 300)} y={640} s={480} rot={-1} />
    <line x1={120} y1={560} x2={120} y2={720} stroke={JAUNE} strokeWidth={8} strokeLinecap="round" />
    <path d="M100 700 L120 740 L140 700 Z" fill={JAUNE} />
  </g>
);

/** Cockpit : tableau de bord, voyant rouge qui clignote (porte arrière ouverte). */
export const Cockpit: React.FC<{ frame: number; p?: any }> = ({ frame }) => {
  const on = Math.floor(frame / 8) % 2 === 0;
  return (
    <g>
      <rect x={0} y={0} width={1080} height={1920} fill="#0B1424" />
      <path d="M80 380 L1000 380 L940 700 L140 700 Z" fill="#132849" />
      <Pluie frame={frame} n={20} />
      <path d="M540 380 L540 700" stroke="#0B1424" strokeWidth={24} />
      <rect x={60} y={700} width={960} height={500} fill="#2A2F38" />
      {Array.from({ length: 12 }, (_, i) => (
        <g key={i}>
          <circle cx={150 + (i % 6) * 156} cy={800 + Math.floor(i / 6) * 150} r={48} fill="#11151C" stroke="#4A505A" strokeWidth={6} />
          <line x1={150 + (i % 6) * 156} y1={800 + Math.floor(i / 6) * 150} x2={150 + (i % 6) * 156 + 30 * Math.cos(i + frame / 30)} y2={800 + Math.floor(i / 6) * 150 + 30 * Math.sin(i + frame / 30)} stroke={CREME} strokeWidth={4} />
        </g>
      ))}
      <rect x={380} y={1080} width={320} height={90} rx={12} fill={on ? ROUGE : "#5A1E1E"} />
      {on && <rect x={360} y={1060} width={360} height={130} rx={20} fill="rgba(230,80,74,.25)" />}
      <text x={540} y={1138} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={34} fill={on ? "#FFFFFF" : "#A06060"}>
        PORTE ARRIÈRE
      </text>
    </g>
  );
};

/** L'arrière de l'avion en vol : l'escalier arrière s'abaisse. */
export const Escalier: React.FC<{ frame: number; p?: any }> = ({ frame }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill={CIEL} />
    <Etoiles />
    <Pluie frame={frame} n={40} />
    <Avion x={600} y={720} s={1000} escalier={Math.min(1, frame / 40)} rot={-2} />
    {frame > 20 && <path d={`M150 760 L60 1000 L330 1000 Z`} fill="rgba(255,232,170,.10)" />}
    <rect x={0} y={1150} width={1080} height={770} fill={FORET} />
    <Sapins y0={1180} n={16} h={120} />
  </g>
);

/** Le saut : silhouette sous parachute, de nuit, sous la pluie, au-dessus de la forêt. p.sac = sac d'argent. */
export const Saut: React.FC<{ frame: number; p?: any }> = ({ frame, p = {} }) => {
  const y = 360 + Math.min(1, frame / 90) * 160;
  const x = 540 + Math.sin(frame / 20) * 40;
  return (
    <g>
      <rect x={0} y={0} width={1080} height={1920} fill="#08111F" />
      <Pluie frame={frame} n={80} />
      <Avion x={1000 - frame * 4} y={260} s={300} o={Math.max(0, 1 - frame / 60)} />
      <g transform={`translate(${x} ${y}) rotate(${Math.sin(frame / 15) * 6}) scale(1.7)`}>
        <path d="M-120 0 Q0 -110 120 0 Q60 -20 0 -18 Q-60 -20 -120 0 Z" fill="#4A5C78" />
        <path d="M-118 0 L-14 150 M118 0 L14 150 M-60 -14 L-8 150 M60 -14 L8 150" stroke="#8A9099" strokeWidth={3} />
        <circle cx={0} cy={160} r={16} fill="#2A3A55" />
        <path d="M-22 176 L22 176 L18 250 L-18 250 Z" fill="#2A3A55" />
        <path d="M-10 250 L-16 300 M10 250 L16 300" stroke="#2A3A55" strokeWidth={10} strokeLinecap="round" />
        {p.sac && (
          <g transform="translate(34 220)">
            <path d="M-20 -6 Q-28 30 0 34 Q28 30 20 -6 Z" fill="#B08A4A" />
            <text x={0} y={22} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={20} fill={NOIR}>
              $
            </text>
          </g>
        )}
      </g>
      <rect x={0} y={1080} width={1080} height={840} fill={FORET} />
      <Sapins y0={1110} n={16} h={150} couleur={FORET2} />
      <Sapins y0={1180} n={12} h={180} couleur="#0B2019" decal={60} />
    </g>
  );
};

/** Berge de la Columbia (1980) : fleuve, sable, enfant qui creuse. */
export const Fleuve: React.FC<{ frame: number; p?: any }> = ({ frame }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#2E4A70" />
    <rect x={0} y={700} width={1080} height={300} fill="#2E5A7E" />
    {Array.from({ length: 4 }, (_, i) => {
      const dx = ((frame * 2 + i * 60) % 160) - 160;
      let d = `M${dx} ${740 + i * 60}`;
      for (let x = dx; x < 1240; x += 80) d += ` q20 -12 40 0 t40 0`;
      return <path key={i} d={d} stroke="rgba(236,230,216,.25)" strokeWidth={4} fill="none" />;
    })}
    <path d="M0 640 L200 560 L420 620 L700 540 L1080 620 L1080 700 L0 700 Z" fill="#3E5A4A" />
    <path d="M0 980 Q540 940 1080 990 L1080 1920 L0 1920 Z" fill="#C9A86A" />
    {/* enfant qui creuse + liasses */}
    <g transform="translate(560 1100) scale(2)">
      <path d="M-24 0 V-26 Q-24 -46 0 -46 Q24 -46 24 -26 V0 Z" fill="#B0332E" />
      <circle cx={0} cy={-62} r={16} fill="#E2B58E" />
      <line x1={18} y1={-30} x2={60} y2={-2 + Math.sin(frame / 5) * 6} stroke="#E2B58E" strokeWidth={9} strokeLinecap="round" />
    </g>
    {[0, 1, 2].map((i) => (
      <rect key={i} x={700 + i * 60} y={1080 - (i % 2) * 14} width={110} height={46} rx={6} fill="#6FA07A" stroke="#3E6A4A" strokeWidth={4} transform={`rotate(${-10 + i * 12} ${755 + i * 60} 1100)`} />
    ))}
  </g>
);
