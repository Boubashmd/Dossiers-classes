import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, CREME, GRIS, JAUNE, NUIT, ROUGE, Tampon, Texte, Titre, VERT, io, prog, txt } from "../theme";
import { Billet } from "../dessins/objets";
import config from "../../config.json";

// ============================================================================================
// Séquences « finance » (affaires nº 3 et 4 : Ponzi, Madoff) — réutilisables pour toute arnaque.
//   pyramide    : l'argent des nouveaux remonte vers les anciens (modes : construit, grandit,
//                 vacille, ecroule, nom, duo)
//   suite       : fin de partie 1 — tampon « À SUIVRE », bulle, s'abonner
//   courbe      : la Bourse en zigzag contre une ligne trop parfaite (mode krach)
//   carte_monde : planisphère simplifié, points qui s'allument
// ============================================================================================

const Sfx: React.FC<{ at: number; son: string; volume?: number }> = ({ at, son, volume = 0.6 }) => {
  const v = (config as any).volumes || {};
  const facteur = son === "swoosh" ? v.transitions ?? 0.2 : v.bruitages ?? 0.35;
  return (
    <Sequence from={Math.max(0, Math.round(at))}>
      <Audio src={staticFile(`son/${son}.wav`)} volume={Math.min(1, volume * facteur * 1.6)} />
    </Sequence>
  );
};

type SP = { p: any; dur: number };

/** Petit investisseur : tête + buste. Pieds en (0,0). */
const Bonhomme: React.FC<{ x: number; y: number; k: number; couleur: string; rot?: number; o?: number }> = ({ x, y, k, couleur, rot = 0, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`} opacity={o}>
    <path d="M-30 0 V-22 Q-30 -46 0 -46 Q30 -46 30 -22 V0 Z" fill={couleur} />
    <circle cx={0} cy={-62} r={15} fill={couleur} />
  </g>
);

/** Une pyramide de n étages centrée en cx, sommet en haut (y0), hauteur max H. */
const PyramideDessin: React.FC<{
  f: number;
  n: number;
  cx: number;
  y0: number;
  H: number;
  W: number;
  apparition?: boolean;
  argent?: boolean;
  vacille?: number;
  chute?: number; // 0 -> 1
  graine?: number;
}> = ({ f, n, cx, y0, H, W, apparition = true, argent = true, vacille = 0, chute = 0, graine = 0 }) => {
  const nEntier = Math.ceil(n);
  const k = Math.min(1.9, H / (nEntier * 110), W / (nEntier * 80));
  const dy = 110 * k;
  const dx = 80 * k;
  const elts: React.ReactNode[] = [];
  for (let r = 0; r < nEntier; r++) {
    const kr = apparition ? prog(f, 4 + r * 7, 10) : 1;
    const partiel = Math.min(1, Math.max(0, n - r));
    for (let i = 0; i <= r; i++) {
      const x = cx + (i - r / 2) * dx;
      const y = y0 + (r + 1) * dy;
      // chute : les étages du bas partent d'abord
      const ordre = (nEntier - 1 - r) / Math.max(1, nEntier);
      const t = Math.max(0, chute * 1.6 - ordre);
      const tremble = vacille ? Math.sin(f / 2 + i * 1.7 + r) * vacille * (1 + (nEntier - r) / nEntier) * 6 : 0;
      const fy = t * t * 900;
      const rot = t * (((i + r + graine) % 2 ? 1 : -1) * 70);
      const absent = vacille > 0.6 && r === nEntier - 1 && (i + Math.floor(f / 8)) % 3 === 0;
      elts.push(
        <Bonhomme
          key={`${r}-${i}`}
          x={x + tremble}
          y={y + fy + (1 - kr) * 40}
          k={k * Math.min(1, kr) * partiel}
          rot={rot}
          o={(absent ? 0.15 : 1) * Math.min(1, kr * 1.5) * (1 - Math.max(0, t - 0.8))}
          couleur={r === 0 ? JAUNE : CREME}
        />
      );
    }
  }
  // l'argent remonte du bas vers le haut
  const billets: React.ReactNode[] = [];
  if (argent && chute === 0 && nEntier >= 2) {
    for (let j = 0; j < 4; j++) {
      const cycle = 46;
      const u = ((f + j * (cycle / 4)) % cycle) / cycle;
      const debut = 4 + nEntier * 7;
      if (f < debut) continue;
      const xb = cx + ((j % 3) - 1) * dx * (nEntier - 1) * 0.35 * (1 - u);
      const yb = y0 + nEntier * dy - 30 * k - u * (nEntier - 1) * dy;
      billets.push(<Billet key={j} x={xb - 40 * k} y={yb} l={80 * k} o={Math.sin(u * Math.PI)} rot={-6 + j * 4} />);
    }
  }
  return (
    <g>
      {elts}
      {billets}
    </g>
  );
};

export const Pyramide: React.FC<SP> = ({ p, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mode = p.mode || "construit";
  if (mode === "duo") return <PyramideDuo p={p} dur={dur} />;
  const n = mode === "grandit" ? interpolate(f, [0, dur * 0.85], [p.depart || 3, p.max || 8], C) : p.etages || 5;
  const vacille = mode === "vacille" ? interpolate(f, [0, dur], [0.2, 1], C) : 0;
  const chute = mode === "ecroule" ? interpolate(f, [dur * 0.3, dur * 0.85], [0, 1], C) : 0;
  const nomA = p.nomA ?? 18;
  const tamponA = p.tamponA ?? Math.round(dur * 0.6);
  const nEntier = Math.ceil(n);
  const H = 640;
  const k = Math.min(1.9, H / (nEntier * 110), 820 / (nEntier * 80));
  const y0 = 420;
  const bas = y0 + nEntier * 110 * k;
  return (
    <AbsoluteFill>
      <Sfx at={0} son="swoosh" volume={0.35} />
      {mode === "ecroule" && <Sfx at={dur * 0.3} son="choc" volume={0.7} />}
      <Titre texte={p.titre} k={prog(f, 0, 10)} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <PyramideDessin f={f} n={n} cx={540} y0={y0} H={H} W={820} vacille={vacille} chute={chute} apparition={mode !== "nom"} />
        {/* flèche « l'argent monte » */}
        {chute === 0 && (
          <g opacity={prog(f, 20, 12)}>
            <line x1={980} y1={bas - 20} x2={980} y2={y0 + 60} stroke={VERT} strokeWidth={10} strokeLinecap="round" strokeDasharray="4 22" />
            <path d={`M955 ${y0 + 80} L980 ${y0 + 40} L1005 ${y0 + 80} Z`} fill={VERT} />
          </g>
        )}
      </svg>
      {chute === 0 && (
        <>
          <div style={{ position: "absolute", top: y0 + 60, left: 40, width: 260, opacity: prog(f, 10, 10), ...txt(36, JAUNE) }}>ANCIENS</div>
          <div style={{ position: "absolute", top: bas - 50, left: 40, width: 260, opacity: prog(f, 20, 10), ...txt(36, CREME) }}>NOUVEAUX</div>
          <div style={{ position: "absolute", top: y0 - 10, right: 30, width: 200, textAlign: "center", opacity: prog(f, 24, 10), ...txt(30, VERT) }}>
            l'argent monte
          </div>
        </>
      )}
      {p.legende && (
        <Texte top={p.legendeTop || 300} size={54} k={prog(f, 10, 12)}>
          {p.legende}
        </Texte>
      )}
      {mode === "nom" && (
        <>
          <Sfx at={nomA} son="tampon" volume={0.7} />
          <Tampon texte={p.nom || "PONZI"} k={spring({ frame: f - nomA, fps, config: { damping: 9, stiffness: 230 } })} top={680} size={150} couleur={JAUNE} />
        </>
      )}
      {p.tampon && (
        <>
          <Sfx at={tamponA} son="tampon" volume={0.7} />
          <Tampon texte={p.tampon} k={spring({ frame: f - tamponA, fps, config: { damping: 9, stiffness: 230 } })} top={p.tamponTop || 700} />
        </>
      )}
    </AbsoluteFill>
  );
};

/** Deux pyramides côte à côte : une minuscule (Ponzi), une géante (Madoff). */
const PyramideDuo: React.FC<SP> = ({ p, dur }) => {
  const f = useCurrentFrame();
  const g = p.gauche || { nom: "PONZI", sous: "1920" };
  const d = p.droite || { nom: "MADOFF", sous: "2008" };
  const grand = prog(f, 20, Math.max(20, dur * 0.4), io);
  const bas = 1060;
  return (
    <AbsoluteFill>
      <Sfx at={0} son="swoosh" volume={0.35} />
      <Titre texte={p.titre} k={prog(f, 0, 10)} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={60} x2={1020} y1={bas + 6} y2={bas + 6} stroke="rgba(127,147,174,.3)" strokeWidth={4} />
        <PyramideDessin f={f} n={2} cx={210} y0={bas - 2 * 110 * 0.55} H={2 * 110 * 0.55} W={260} graine={1} />
        <PyramideDessin f={f} n={2 + 5 * grand} cx={680} y0={bas - 620} H={620} W={640} apparition={false} />
      </svg>
      {[
        { x: 210, l: g, c: CREME },
        { x: 680, l: d, c: JAUNE },
      ].map(({ x, l, c }, i) => (
        <div key={i} style={{ position: "absolute", top: bas + 20, left: x - 230, width: 460, textAlign: "center", opacity: prog(f, 8 + i * 10, 10) }}>
          <div style={txt(48, c)}>{l.nom}</div>
          <div style={txt(32, GRIS, 500)}>{l.sous}</div>
        </div>
      ))}
      {p.legende && (
        <Texte top={p.legendeTop || 300} size={56} color={p.legendeCouleur === "jaune" ? JAUNE : CREME} k={prog(f, Math.round(dur * 0.35), 12)}>
          {p.legende}
        </Texte>
      )}
    </AbsoluteFill>
  );
};

/** Fin de partie 1 : tampon « À SUIVRE », annonce de la partie 2, bulle + s'abonner. */
export const Suite: React.FC<SP> = ({ p }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: f - 6, fps, config: { damping: 9, stiffness: 230 } });
  const bulle = spring({ frame: f - 40, fps, config: { damping: 9, stiffness: 180 } });
  const abo = spring({ frame: f - 70, fps, config: { damping: 9, stiffness: 180 } });
  return (
    <AbsoluteFill>
      <Sfx at={6} son="tampon" volume={0.8} />
      <Sfx at={40} son="pop" volume={0.5} />
      <Sfx at={70} son="pop" volume={0.5} />
      <Tampon texte={p.tampon || "À SUIVRE"} k={t} top={330} size={110} />
      {p.annonce && (
        <Texte top={560} size={56} color={JAUNE} k={prog(f, 24, 12)}>
          {p.annonce}
        </Texte>
      )}
      <div style={{ position: "absolute", top: 700, left: 150, right: 150, transform: `scale(${bulle})`, transformOrigin: "20% 100%" }}>
        <div style={{ background: CREME, borderRadius: 40, padding: "40px 40px", boxShadow: "0 20px 40px rgba(0,0,0,.4)", ...txt(56, NUIT), textAlign: "center", lineHeight: 1.2 }}>
          {p.bulle || "Tu aurais investi ?"}
        </div>
        <svg width={120} height={60} style={{ marginLeft: 120, display: "block" }}>
          <path d="M0 0 L120 0 L20 60 Z" fill={CREME} />
        </svg>
      </div>
      <div style={{ position: "absolute", top: 1010, width: "100%", display: "flex", justifyContent: "center", transform: `scale(${abo})` }}>
        <div style={{ background: ROUGE, borderRadius: 60, padding: "24px 64px", ...txt(54, "#FFFFFF"), boxShadow: "0 16px 30px rgba(0,0,0,.4)" }}>+ S'abonner</div>
      </div>
    </AbsoluteFill>
  );
};

/** Courbe : la Bourse en zigzag contre la ligne trop parfaite de Madoff. */
export const Courbe: React.FC<SP> = ({ p, dur }) => {
  const f = useCurrentFrame();
  const x0 = 110;
  const x1 = 990;
  const yb = 1050;
  const yh = 480;
  const N = 48;
  const krach = p.mode === "krach";
  // marché : marche aléatoire déterministe, tendance légèrement haussière
  const pts: number[] = [];
  let v = 0.35;
  for (let i = 0; i < N; i++) {
    const r = Math.sin(i * 12.9898 + 4.1) * 43758.5453;
    const bruit = (r - Math.floor(r) - 0.5) * 0.16;
    v = Math.min(0.95, Math.max(0.08, v + 0.006 + bruit));
    if (krach && i > N * 0.78) v = Math.max(0.04, v - 0.09);
    pts.push(v);
  }
  const avance = interpolate(f, [8, Math.max(20, dur * 0.75)], [0, 1], { ...C, easing: io });
  const n = Math.max(2, Math.round(avance * N));
  const X = (i: number) => x0 + ((x1 - x0) * i) / (N - 1);
  const Y = (val: number) => yb - (yb - yh) * val;
  const marche = pts
    .slice(0, n)
    .map((val, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(val).toFixed(1)}`)
    .join(" ");
  const droite = `M${x0} ${Y(0.3)} L${X(n - 1)} ${Y(0.3 + 0.5 * ((n - 1) / (N - 1)))}`;
  return (
    <AbsoluteFill>
      <Sfx at={4} son="swoosh" volume={0.35} />
      <Titre texte={p.titre} k={prog(f, 0, 10)} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={x0} y1={yb} x2={x1} y2={yb} stroke="rgba(127,147,174,.5)" strokeWidth={4} />
        <line x1={x0} y1={yb} x2={x0} y2={yh - 30} stroke="rgba(127,147,174,.5)" strokeWidth={4} />
        {Array.from({ length: 5 }, (_, i) => (
          <line key={i} x1={x0} x2={x1} y1={yh + i * 114} y2={yh + i * 114} stroke="rgba(127,147,174,.10)" strokeWidth={2} />
        ))}
        <path d={marche} stroke={krach ? ROUGE : CREME} strokeWidth={8} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {!krach && <path d={droite} stroke={JAUNE} strokeWidth={12} fill="none" strokeLinecap="round" />}
      </svg>
      {/* légende sous le graphique */}
      <div style={{ position: "absolute", top: yb + 24, left: x0, display: "flex", gap: 40, opacity: prog(f, 10, 10) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, ...txt(36, krach ? ROUGE : CREME) }}>
          <span style={{ width: 40, height: 8, borderRadius: 4, background: krach ? ROUGE : CREME, display: "inline-block" }} />
          {p.labelMarche || "LA BOURSE"}
        </div>
        {!krach && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, ...txt(36, JAUNE) }}>
            <span style={{ width: 40, height: 10, borderRadius: 4, background: JAUNE, display: "inline-block" }} />
            {p.labelDroite || "MADOFF"}
          </div>
        )}
      </div>
      {p.legende && (
        <Texte top={p.legendeTop || 300} size={56} color={p.legendeCouleur === "jaune" ? JAUNE : CREME} k={prog(f, Math.round(dur * 0.3), 12)}>
          {p.legende}
        </Texte>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// Planisphère simplifié (longitude, latitude).
// ---------------------------------------------------------------------------------------------
const MX = (lon: number) => 40 + (lon + 170) * (1000 / 345);
const MY = (lat: number) => 470 + (75 - lat) * (600 / 135);
const chemin = (pts: number[][]) => "M" + pts.map(([lo, la]) => `${MX(lo).toFixed(1)} ${MY(la).toFixed(1)}`).join(" L") + " Z";
const MONDE: number[][][] = [
  [[-165, 65], [-140, 70], [-95, 72], [-75, 70], [-60, 58], [-53, 48], [-70, 43], [-76, 35], [-81, 26], [-90, 30], [-97, 26], [-96, 19], [-87, 15], [-80, 8], [-85, 12], [-105, 20], [-115, 30], [-124, 40], [-125, 49], [-135, 58], [-150, 60], [-165, 60]],
  [[-80, 8], [-60, 10], [-50, 0], [-35, -7], [-40, -22], [-48, -28], [-58, -38], [-65, -45], [-70, -54], [-75, -48], [-72, -30], [-70, -18], [-80, -5]],
  [[-10, 36], [-9, 43], [-1, 46], [-5, 48], [2, 51], [8, 54], [10, 57], [5, 62], [12, 66], [25, 71], [40, 68], [60, 70], [60, 45], [40, 42], [28, 41], [26, 38], [22, 36], [19, 40], [15, 38], [12, 44], [8, 44], [3, 42], [0, 39], [-5, 36]],
  [[60, 70], [100, 77], [140, 73], [175, 68], [175, 62], [160, 60], [140, 52], [135, 43], [127, 35], [122, 30], [120, 22], [108, 20], [105, 10], [100, 13], [98, 8], [92, 22], [80, 8], [77, 8], [72, 20], [67, 24], [57, 25], [50, 30], [48, 29], [56, 24], [52, 16], [44, 12], [35, 30], [36, 36], [28, 41], [40, 42], [60, 45]],
  [[-17, 21], [-10, 36], [10, 37], [20, 32], [32, 31], [43, 12], [51, 12], [40, -2], [40, -15], [32, -28], [20, -35], [15, -28], [12, -10], [9, 4], [-8, 5], [-17, 14]],
  [[114, -22], [122, -18], [131, -12], [142, -11], [146, -19], [153, -27], [150, -37], [140, -38], [132, -32], [115, -34]],
  [[-5, 50], [1, 51], [1.7, 52.6], [-3, 58.5], [-6, 57], [-4.5, 54], [-5, 52]],
  [[130, 31], [140, 35], [142, 40], [141, 43], [139, 38], [132, 34]],
];

export const CarteMonde: React.FC<SP> = ({ p, dur }) => {
  const f = useCurrentFrame();
  const pts: any[] = p.points || [];
  const pulse = 0.5 + 0.5 * Math.sin(f / 5);
  return (
    <AbsoluteFill>
      <Sfx at={4} son="swoosh" volume={0.35} />
      <Titre texte={p.titre} k={prog(f, 0, 10)} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: prog(f, 0, 12) }}>
        <rect x={30} y={430} width={1020} height={680} rx={18} fill="#10284A" />
        {MONDE.map((m, i) => (
          <path key={i} d={chemin(m)} fill="#2A4468" stroke="#4A6890" strokeWidth={2} strokeLinejoin="round" />
        ))}
        {/* flèches (de -> vers, en [lon, lat]) */}
        {(p.fleches || []).map((fl: any, i: number) => {
          const a = fl.a ?? 10 + i * 14;
          const u = interpolate(f, [a, a + 22], [0, 1], { ...C, easing: io });
          if (u <= 0) return null;
          const A = { x: MX(fl.de[0]), y: MY(fl.de[1]) };
          const B = { x: MX(fl.vers[0]), y: MY(fl.vers[1]) };
          const c = fl.courbe ?? 0.25;
          const M = { x: (A.x + B.x) / 2 - (B.y - A.y) * c, y: (A.y + B.y) / 2 + (B.x - A.x) * c };
          const Q = { x: A.x + (M.x - A.x) * u, y: A.y + (M.y - A.y) * u };
          const E = { x: (1 - u) ** 2 * A.x + 2 * (1 - u) * u * M.x + u * u * B.x, y: (1 - u) ** 2 * A.y + 2 * (1 - u) * u * M.y + u * u * B.y };
          return <path key={`f${i}`} d={`M${A.x} ${A.y} Q${Q.x} ${Q.y} ${E.x} ${E.y}`} stroke={fl.couleur === "rouge" ? ROUGE : JAUNE} strokeWidth={9} fill="none" strokeLinecap="round" strokeDasharray={fl.pointilles ? "4 18" : undefined} />;
        })}
        {pts.map((pt, i) => {
          const a = (p.debut ?? 10) + i * (p.pas ?? 5);
          const k = prog(f, a, 8);
          const x = MX(pt.lon);
          const y = MY(pt.lat);
          return (
            <g key={i} opacity={k}>
              <circle cx={x} cy={y} r={14 + 26 * pulse} fill="none" stroke={ROUGE} strokeWidth={4} opacity={1 - pulse * 0.7} />
              <circle cx={x} cy={y} r={12} fill={ROUGE} stroke="#0B1626" strokeWidth={3} />
            </g>
          );
        })}
      </svg>
      {pts
        .map((pt, i) => ({ pt, i }))
        .filter(({ pt }) => pt.nom)
        .map(({ pt, i }) => (
          <div key={i} style={{ position: "absolute", left: Math.min(1060 - 260, Math.max(20, MX(pt.lon) - 130)), width: 260, top: MY(pt.lat) + 18, textAlign: "center", opacity: prog(f, (p.debut ?? 10) + i * (p.pas ?? 5) + 4, 8), ...txt(30, CREME, 700, { textShadow: "0 3px 10px rgba(0,0,0,.95)" }) }}>
            {pt.nom}
          </div>
        ))}
      {p.legende && (
        <Texte top={p.legendeTop || 300} size={56} k={prog(f, Math.round(dur * 0.3), 12)}>
          {p.legende}
        </Texte>
      )}
    </AbsoluteFill>
  );
};

/** Mur de suspects : des silhouettes barrées une à une (affaire nº 5). */
export const Suspects: React.FC<SP> = ({ p, dur }) => {
  const f = useCurrentFrame();
  const cols = 5;
  const rows = 4;
  const n = cols * rows;
  return (
    <AbsoluteFill>
      <Sfx at={0} son="swoosh" volume={0.35} />
      <Titre texte={p.titre} k={prog(f, 0, 10)} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: n }, (_, i) => {
          const x = 160 + (i % cols) * 190;
          const y = 560 + Math.floor(i / cols) * 170;
          const kA = prog(f, 2 + i * 1.5, 8);
          const barreA = 14 + ((i * 7) % n) * ((dur * 0.65) / n);
          const kB = prog(f, barreA, 6);
          return (
            <g key={i} opacity={kA}>
              <Bonhomme x={x} y={y} k={1.4} couleur={kB > 0.5 ? "#4A5C78" : CREME} />
              {kB > 0 && (
                <g stroke={ROUGE} strokeWidth={10} strokeLinecap="round">
                  <line x1={x - 45} y1={y - 110} x2={x - 45 + 90 * kB} y2={y - 110 + 110 * kB} />
                  <line x1={x + 45} y1={y - 110} x2={x + 45 - 90 * kB} y2={y - 110 + 110 * kB} />
                </g>
              )}
            </g>
          );
        })}
      </svg>
      {p.legende && (
        <Texte top={p.legendeTop || 300} size={56} k={prog(f, 10, 12)}>
          {p.legende}
        </Texte>
      )}
    </AbsoluteFill>
  );
};
