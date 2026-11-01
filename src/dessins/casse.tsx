import React from "react";
import { interpolate } from "remotion";
import { C, CREME, JAUNE, NOIR, ROUGE } from "../theme";

// ============================================================================================
// Le casse du Louvre (affaire nº 10) — la façade côté Seine, la galerie d'Apollon,
// la vitrine aux bijoux, la couronne de l'impératrice Eugénie.
// ============================================================================================

const PIERRE = "#CBBF9F";
const PIERRE2 = "#B5A886";
const JOINT = "#A39674";
const OR = "#D8B24E";
const OR2 = "#A8862E";
const VITRE = "rgba(190,220,245,.16)";

const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], C);

/** Petit ouvrier en gilet fluo (silhouette). Pieds en (x, y). */
const Ouvrier: React.FC<{ x: number; y: number; s?: number; gilet?: string; f: number; i: number }> = ({ x, y, s = 1, gilet = "#F2B21B", f, i }) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 7 + i) * 1.5}) scale(${s})`}>
    <rect x={-16} y={-58} width={13} height={58} fill="#2A2F3A" />
    <rect x={3} y={-58} width={13} height={58} fill="#2A2F3A" />
    <path d="M-28 -58 V-110 Q-28 -132 0 -132 Q28 -132 28 -110 V-58 Z" fill={gilet} />
    <rect x={-28} y={-92} width={56} height={7} fill="#E8EEF2" opacity={0.85} />
    <rect x={-28} y={-74} width={56} height={7} fill="#E8EEF2" opacity={0.85} />
    <circle cx={0} cy={-150} r={19} fill="#1E2430" />
  </g>
);

/** Scooter avec pilote, vu de profil (roule vers la gauche). Roues au sol en y. */
const Scooter: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2].map((i) => (
      <line key={i} x1={70 + i * 30} x2={150 + i * 40} y1={-30 - i * 22} y2={-30 - i * 22} stroke={CREME} strokeWidth={5} strokeLinecap="round" opacity={0.35 + 0.15 * Math.sin(f + i)} />
    ))}
    <circle cx={-50} cy={-24} r={24} fill="#14181F" stroke="#5A6272" strokeWidth={5} />
    <circle cx={55} cy={-24} r={24} fill="#14181F" stroke="#5A6272" strokeWidth={5} />
    <path d="M-60 -40 L-30 -95 L-18 -95 L-35 -45 L40 -45 Q75 -45 80 -24 L-70 -24 Z" fill="#3A4252" />
    <rect x={-40} y={-105} width={26} height={8} rx={4} fill="#1A1D26" />
    {/* pilote casqué */}
    <path d="M0 -50 L-20 -110 Q-10 -130 15 -125 L30 -55 Z" fill="#1E2430" />
    <circle cx={-6} cy={-142} r={20} fill="#0E1118" />
    <rect x={-24} y={-150} width={16} height={10} rx={4} fill="#3A4A62" />
  </g>
);

/**
 * Façade du Louvre côté Seine, un matin d'automne.
 * p.camion : camion-nacelle garé ; p.deploie : la nacelle se déploie jusqu'au balcon ;
 * p.ouvriers : quatre hommes en gilets ; p.brise : la fenêtre du balcon est brisée (alarme) ;
 * p.scooters : deux scooters filent le long de la Seine.
 */
export const FacadeLouvre: React.FC<{ frame: number; p?: any }> = ({ frame: f, p = {} }) => {
  const sol = 1350;
  const ext = p.deploie ? lin(f, 8, 40) : p.nacelleHaute ? 1 : 0;
  const pied = { x: 790, y: sol - 120 };
  const haut = { x: 700, y: 880 };
  const bx = pied.x + (haut.x - pied.x) * ext;
  const by = pied.y + (haut.y - pied.y) * ext;
  const alarme = p.brise ? 0.5 + 0.5 * Math.sin(f / 3) : 0;
  return (
    <g>
      <defs>
        <linearGradient id="cielMatin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1C2A3C" />
          <stop offset="0.12" stopColor="#3C5470" />
          <stop offset="1" stopColor="#B7C4CC" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1080} height={1920} fill="url(#cielMatin)" />
      {/* bâtiment */}
      <rect x={0} y={330} width={1080} height={sol - 330} fill={PIERRE} />
      <rect x={0} y={300} width={1080} height={44} fill={PIERRE2} />
      <path d="M0 300 L0 250 L1080 250 L1080 300 Z" fill="#6E7A86" />
      {Array.from({ length: 14 }, (_, i) => (
        <line key={`j${i}`} x1={0} x2={1080} y1={400 + i * 68} y2={400 + i * 68} stroke={JOINT} strokeWidth={2} opacity={0.5} />
      ))}
      {/* deux étages de grandes fenêtres cintrées */}
      {[0, 1, 2, 3].map((i) => {
        const x = 70 + i * 260;
        return (
          <g key={`f${i}`}>
            {[520, 950].map((y, k) => {
              const cible = k === 1 ? false : i === 2;
              return (
                <g key={y}>
                  <path d={`M${x} ${y + 260} V${y + 60} Q${x + 80} ${y - 20} ${x + 160} ${y + 60} V${y + 260} Z`} fill={cible && p.brise ? `rgba(230,80,74,${0.25 + 0.35 * alarme})` : "#3E4A58"} stroke={PIERRE2} strokeWidth={14} />
                  <line x1={x + 80} x2={x + 80} y1={y + 30} y2={y + 260} stroke={PIERRE2} strokeWidth={6} />
                  <line x1={x} x2={x + 160} y1={y + 140} y2={y + 140} stroke={PIERRE2} strokeWidth={6} />
                  {cible && p.brise && (
                    <g stroke={CREME} strokeWidth={4} opacity={0.9}>
                      <path d={`M${x + 70} ${y + 120} l-40 -60 M${x + 70} ${y + 120} l60 -50 M${x + 70} ${y + 120} l-30 80 M${x + 70} ${y + 120} l70 40`} />
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
      {/* balcon du premier étage */}
      <rect x={570} y={800} width={260} height={18} fill={PIERRE2} />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={`b${i}`} x={580 + i * 29} y={740} width={8} height={60} fill="#3A3A3A" />
      ))}
      <rect x={570} y={734} width={260} height={10} fill="#3A3A3A" />
      {p.brise && <circle cx={700} cy={640} r={180} fill={ROUGE} opacity={0.12 * alarme} />}
      {/* quai + Seine */}
      <rect x={0} y={sol} width={1080} height={160} fill="#5E6670" />
      <rect x={0} y={sol} width={1080} height={10} fill="#8A929C" />
      <rect x={0} y={sol + 160} width={1080} height={1920 - sol - 160} fill="#2E4E66" />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={`v${i}`} d={`M${((i * 170 + f * 2) % 1240) - 120} ${sol + 220 + (i % 3) * 60} q30 -10 60 0 t60 0`} stroke="#5E86A4" strokeWidth={5} fill="none" />
      ))}
      <text x={540} y={sol + 330} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={42} fill="#8FB0C8" letterSpacing={10}>LA SEINE</text>
      {/* camion-nacelle */}
      {(p.camion || p.deploie || p.nacelleHaute) && (
        <g>
          <line x1={pied.x} y1={pied.y} x2={bx} y2={by} stroke="#E0A21E" strokeWidth={22} />
          <line x1={pied.x} y1={pied.y} x2={bx} y2={by} stroke="#8A6410" strokeWidth={4} strokeDasharray="18 14" />
          <rect x={bx - 50} y={by - 40} width={100} height={46} fill="#E0A21E" stroke="#8A6410" strokeWidth={4} />
          <rect x={700} y={sol - 140} width={260} height={110} rx={10} fill="#E8E2D2" />
          <path d="M960 1240 h70 l20 50 v30 h-90 Z" fill="#D8D0BC" />
          <rect x={975} y={1250} width={40} height={30} fill="#3E4A58" />
          <circle cx={760} cy={sol - 20} r={26} fill="#1A1D26" />
          <circle cx={1000} cy={sol - 20} r={26} fill="#1A1D26" />
        </g>
      )}
      {p.ouvriers &&
        [0, 1, 2, 3].map((i) => <Ouvrier key={`o${i}`} x={180 + i * 120} y={sol + 70} s={1.25} gilet={i % 2 ? "#F07A1A" : "#F2C21B"} f={f} i={i} />)}
      {p.scooters &&
        [0, 1].map((i) => <Scooter key={`s${i}`} x={1150 - lin(f, 0, 110) * 1000 + i * 220} y={sol + 120 + i * 20} s={1.3} f={f} />)}
    </g>
  );
};

/** Diadème + collier stylisés (pierres bleues ou vertes). */
const Parure: React.FC<{ x: number; y: number; s: number; pierre: string; f: number; o?: number }> = ({ x, y, s, pierre, f, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s / 200})`} opacity={o}>
    <path d="M-90 20 Q0 -40 90 20" stroke={OR} strokeWidth={10} fill="none" />
    {[-70, -35, 0, 35, 70].map((dx, i) => (
      <g key={i}>
        <path d={`M${dx} ${dx === 0 ? -40 : -12 + Math.abs(dx) * 0.25} l-14 22 h28 Z`} fill={OR} />
        <circle cx={dx} cy={(dx === 0 ? -14 : 6 + Math.abs(dx) * 0.25) - 4} r={dx === 0 ? 14 : 9} fill={pierre} stroke={OR2} strokeWidth={3} />
      </g>
    ))}
    <path d="M-80 60 Q0 140 80 60" stroke={OR} strokeWidth={6} fill="none" />
    {[-60, -30, 0, 30, 60].map((dx, i) => (
      <circle key={i} cx={dx} cy={64 + 46 - Math.abs(dx) * 0.6} r={dx === 0 ? 16 : 10} fill={pierre} stroke={OR2} strokeWidth={3} />
    ))}
    {[0, 1, 2].map((i) => {
      const t = (f / 10 + i * 2.1) % 6;
      return t < 1 ? <path key={i} d={`M${-50 + i * 50} ${-10 + i * 30} l6 -16 l6 16 l16 6 l-16 6 l-6 16 l-6 -16 l-16 -6 Z`} fill="#FFFFFF" opacity={1 - t} /> : null;
    })}
  </g>
);

/** Vitrine sur socle. vide = 0 -> 1 (les bijoux disparaissent, la vitre se fend). */
export const Vitrine: React.FC<{ x: number; y: number; s: number; f: number; vide?: number; pierre?: string }> = ({ x, y, s, f, vide = 0, pierre = "#3A6AC8" }) => (
  <g transform={`translate(${x} ${y}) scale(${s / 600})`}>
    <rect x={-230} y={120} width={460} height={260} fill="#3A2A20" />
    <rect x={-250} y={100} width={500} height={30} fill={OR2} />
    <rect x={-220} y={-260} width={440} height={360} fill={VITRE} stroke="rgba(220,240,255,.75)" strokeWidth={6} />
    <rect x={-200} y={60} width={400} height={40} fill="#5A1E2A" />
    <Parure x={0} y={-90} s={300} pierre={pierre} f={f} o={1 - vide} />
    {vide > 0.2 && (
      <g stroke="rgba(235,245,255,.9)" strokeWidth={4} fill="none" opacity={Math.min(1, (vide - 0.2) * 2)}>
        <path d="M60 -200 l-50 70 l30 40 l-60 80 M60 -200 l70 50 l-20 60 M60 -200 l-90 -30" />
      </g>
    )}
    <path d="M-200 -240 L-150 -240 L-210 -100 Z" fill="#FFFFFF" opacity={0.12} />
  </g>
);

/**
 * La couronne de l'impératrice Eugénie (dessin simplifié : bandeau, arceaux, aigles, globe).
 * abimee = la couronne tombée : penchée, un arceau plié, des pierres manquantes.
 */
export const Couronne: React.FC<{ x: number; y: number; s: number; f: number; abimee?: boolean }> = ({ x, y, s, f, abimee }) => {
  const gemmes = Array.from({ length: 9 }, (_, i) => -160 + i * 40);
  return (
    <g transform={`translate(${x} ${y}) rotate(${abimee ? -14 : 0}) scale(${s / 500})`}>
      <ellipse cx={0} cy={190} rx={230} ry={26} fill="rgba(0,0,0,.35)" />
      {/* arceaux */}
      {[-150, -60, 60, 150].map((dx, i) => {
        const plie = abimee && i === 3;
        return (
          <path
            key={i}
            d={plie ? `M${dx} 60 Q${dx + 70} -40 ${dx + 120} -10` : `M${dx} 60 Q${dx * 0.8} -170 0 -170`}
            stroke={OR}
            strokeWidth={22}
            fill="none"
            strokeLinecap="round"
          />
        );
      })}
      {[-150, -60, 60, 150].map((dx, i) =>
        Array.from({ length: 5 }, (_, k) => {
          if (abimee && i === 3) return null;
          const t = (k + 1) / 6;
          const px = (1 - t) * (1 - t) * dx + 2 * (1 - t) * t * dx * 0.8;
          const py = (1 - t) * (1 - t) * 60 + 2 * (1 - t) * t * -170 + t * t * -170;
          return <circle key={`${i}-${k}`} cx={px} cy={py} r={7} fill="#F4F6FA" />;
        })
      )}
      {/* aigles (petits) au pied des arceaux */}
      {[-150, -60, 60, 150].map((dx, i) =>
        abimee && i === 1 ? null : (
          <path key={`a${i}`} d={`M${dx} 70 l-26 -18 l14 -4 l12 -18 l12 18 l14 4 Z`} fill={OR2} />
        )
      )}
      {/* globe + croix */}
      <circle cx={0} cy={-200} r={30} fill={OR} stroke={OR2} strokeWidth={5} />
      <circle cx={0} cy={-200} r={12} fill="#2E8A5A" />
      <rect x={-5} y={-262} width={10} height={36} fill={OR} />
      <rect x={-16} y={-252} width={32} height={9} fill={OR} />
      {/* bandeau */}
      <rect x={-200} y={60} width={400} height={110} rx={18} fill={OR} stroke={OR2} strokeWidth={6} />
      {gemmes.map((gx, i) => {
        const manque = abimee && (i === 2 || i === 5 || i === 6);
        return i % 2 ? (
          <circle key={i} cx={gx + 20} cy={115} r={14} fill={manque ? "#3A2E14" : "#F4F6FA"} />
        ) : (
          <rect key={i} x={gx + 6} y={99} width={28} height={32} rx={6} fill={manque ? "#3A2E14" : "#2E8A5A"} stroke={OR2} strokeWidth={3} />
        );
      })}
      {!abimee &&
        [0, 1, 2].map((i) => {
          const t = (f / 9 + i * 2.3) % 7;
          return t < 1 ? <path key={i} transform={`translate(${-120 + i * 120} ${-60 + i * 50})`} d="M0 -22 l7 15 l15 7 l-15 7 l-7 15 l-7 -15 l-15 -7 l15 -7 Z" fill="#FFFFFF" opacity={1 - t} /> : null;
        })}
      {abimee && <path d="M-60 80 l20 30 l-14 24 l18 30" stroke={NOIR} strokeWidth={4} fill="none" />}
    </g>
  );
};

/**
 * Galerie d'Apollon : plafond doré, murs sombres, vitrines.
 * p.vides : les vitrines sont vides ; p.alarme : lumière rouge qui clignote.
 */
export const Galerie: React.FC<{ frame: number; p?: any }> = ({ frame: f, p = {} }) => {
  const alarme = p.alarme ? 0.5 + 0.5 * Math.sin(f / 2.5) : 0;
  return (
    <g>
      <rect x={0} y={0} width={1080} height={1920} fill="#1A1E2A" />
      {/* plafond voûté */}
      <path d="M0 260 Q540 40 1080 260 V520 Q540 340 0 520 Z" fill="#3A2E1A" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${i * 270 - 40} 300 Q${i * 270 + 95} 200 ${i * 270 + 230} 300 L${i * 270 + 210} 440 Q${i * 270 + 95} 380 ${i * 270 - 20} 440 Z`} fill="#5A4628" stroke={OR} strokeWidth={6} />
      ))}
      <path d="M0 520 Q540 340 1080 520" stroke={OR} strokeWidth={12} fill="none" />
      {/* murs + boiseries dorées */}
      <rect x={0} y={520} width={1080} height={830} fill="#2A3040" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={60 + i * 340} y={600} width={280} height={420} fill="#232838" stroke={OR} strokeWidth={8} />
          <rect x={90 + i * 340} y={630} width={220} height={360} fill="none" stroke={OR2} strokeWidth={3} />
        </g>
      ))}
      <rect x={0} y={1350} width={1080} height={570} fill="#3A2C22" />
      {Array.from({ length: 10 }, (_, i) => (
        <line key={i} x1={i * 120} x2={540 + (i * 120 - 540) * 1.8} y1={1350} y2={1920} stroke="#2E2219" strokeWidth={4} />
      ))}
      <Vitrine x={300} y={1180} s={380} f={f} vide={p.vides ? 1 : 0} />
      <Vitrine x={780} y={1180} s={380} f={f + 20} vide={p.vides ? 1 : 0} pierre="#2E9A62" />
      {p.alarme && <rect x={0} y={0} width={1080} height={1920} fill={ROUGE} opacity={0.18 * alarme} />}
      {p.alarme && (
        <g transform="translate(540 600)">
          <circle r={36} fill={ROUGE} opacity={0.6 + 0.4 * alarme} />
          <circle r={90} fill={ROUGE} opacity={0.2 * alarme} />
        </g>
      )}
    </g>
  );
};

/** Moto (profil, vers la droite). Roues au sol en y. */
const Moto: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={-60} cy={-30} r={30} fill="#14181F" stroke="#5A6272" strokeWidth={6} />
    <circle cx={65} cy={-30} r={30} fill="#14181F" stroke="#5A6272" strokeWidth={6} />
    <path d="M-60 -30 L-20 -80 L40 -80 L65 -30 M30 -80 L50 -115" stroke="#3A4252" strokeWidth={10} fill="none" />
    <path d="M-30 -95 Q0 -110 35 -92 L30 -78 L-25 -78 Z" fill="#2A3040" />
    <rect x={40} y={-122} width={26} height={8} rx={4} fill="#1A1D26" />
  </g>
);

/** Homme casqué, debout, de face (silhouette). Pieds en (x, y). bras = lève les mains. */
const Casque: React.FC<{ x: number; y: number; s?: number; bras?: number }> = ({ x, y, s = 1, bras = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-20} y={-80} width={16} height={80} fill="#1A1E28" />
    <rect x={4} y={-80} width={16} height={80} fill="#1A1E28" />
    <path d="M-36 -80 V-150 Q-36 -175 0 -175 Q36 -175 36 -150 V-80 Z" fill="#232A38" />
    <path d={`M-36 -160 L${-50 - 10 * bras} ${-100 - 60 * bras}`} stroke="#232A38" strokeWidth={16} strokeLinecap="round" />
    <path d={`M36 -160 L${50 + 10 * bras} ${-100 - 60 * bras}`} stroke="#232A38" strokeWidth={16} strokeLinecap="round" />
    <circle cx={0} cy={-205} r={30} fill="#0E1118" />
    <rect x={-24} y={-214} width={48} height={16} rx={6} fill="#3A4A62" />
  </g>
);

/**
 * Parking souterrain (Aubervilliers) filmé par une caméra de surveillance.
 * p.motos : deux motos et deux hommes casqués ; p.bijoux : ils sortent les bijoux (éclats) ;
 * p.vide : le parking est vide ; p.heure : horodatage affiché façon vidéosurveillance.
 */
export const Parking: React.FC<{ frame: number; p?: any }> = ({ frame: f, p = {} }) => {
  const rec = Math.floor(f / 15) % 2 === 0;
  return (
    <g>
      <rect x={0} y={0} width={1080} height={1920} fill="#151A22" />
      <rect x={0} y={380} width={1080} height={970} fill="#3A3F48" />
      <rect x={0} y={380} width={1080} height={60} fill="#2A2E36" />
      {[160, 540, 920].map((x) => (
        <g key={x}>
          <rect x={x - 70} y={395} width={140} height={14} rx={6} fill="#E8F0D8" opacity={0.85} />
          <path d={`M${x - 70} 409 L${x - 220} 1350 L${x + 220} 1350 L${x + 70} 409 Z`} fill="#E8F0D8" opacity={0.05} />
        </g>
      ))}
      {/* box fermés */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={40 + i * 255} y={700} width={235} height={650} fill="#555B66" stroke="#2A2E36" strokeWidth={8} />
          {Array.from({ length: 12 }, (_, k) => (
            <line key={k} x1={44 + i * 255} x2={271 + i * 255} y1={740 + k * 50} y2={740 + k * 50} stroke="#474C56" strokeWidth={5} />
          ))}
          <text x={157 + i * 255} y={680} textAnchor="middle" fontFamily="monospace" fontSize={34} fill="#C9CED6">{`B${12 + i}`}</text>
        </g>
      ))}
      <rect x={0} y={1350} width={1080} height={570} fill="#2E3238" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={60 + i * 220} y={1420} width={120} height={14} fill="#C9B24A" opacity={0.6} />
      ))}
      {p.motos && !p.vide && (
        <g>
          <Moto x={260} y={1350} s={1.3} />
          <Moto x={800} y={1350} s={1.3} />
          <Casque x={430} y={1350} s={1.15} bras={p.bijoux ? Math.min(1, f / 20) : 0} />
          <Casque x={620} y={1350} s={1.15} bras={p.bijoux ? Math.min(1, Math.max(0, f - 6) / 20) : 0} />
          {p.bijoux &&
            [0, 1, 2, 3, 4].map((i) => {
              const t = (f / 6 + i * 1.3) % 5;
              return t < 1.2 ? (
                <path key={i} transform={`translate(${470 + i * 30} ${1080 + (i % 2) * 30})`} d="M0 -22 l7 15 l15 7 l-15 7 l-7 15 l-7 -15 l-15 -7 l15 -7 Z" fill={i % 2 ? "#BFE8FF" : JAUNE} opacity={1 - t / 1.2} />
              ) : null;
            })}
        </g>
      )}
      {/* caméra de surveillance */}
      <g transform="translate(930 470)">
        <rect x={-10} y={-30} width={20} height={40} fill="#20242C" />
        <rect x={-90} y={0} width={110} height={46} rx={8} fill="#D8DCE2" transform="rotate(18)" />
        <circle cx={-78} cy={-5} r={10} fill="#1A1D26" transform="rotate(18)" />
      </g>
      {/* effet vidéosurveillance */}
      <rect x={0} y={0} width={1080} height={1920} fill="#4A6A4A" opacity={0.12} />
      {Array.from({ length: 60 }, (_, i) => (
        <rect key={i} x={0} y={i * 32} width={1080} height={2} fill="#000" opacity={0.18} />
      ))}
      {p.heure && (
        <g fontFamily="monospace" fontSize={44} fill="#F2F2F2">
          {rec && <circle cx={80} cy={505} r={16} fill={ROUGE} />}
          <text x={110} y={520}>REC</text>
          <text x={60} y={580}>{p.heure}</text>
        </g>
      )}
    </g>
  );
};

export { JAUNE };
