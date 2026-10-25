import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, CREME, JAUNE, ROUGE, Texte, Titre, io, prog, txt } from "../theme";
import config from "../../config.json";

// ============================================================================================
// CARTE DE LA MÉDITERRANÉE (Europe de l'Ouest + Afrique du Nord), dessinée à partir de
// coordonnées réelles simplifiées (longitude, latitude).
// Paramètres (fichier de l'épisode) :
//   titre, legende, legendeTop
//   lieux   : [{ nom, lon, lat, style: "point" | "cible" | "barre" | "zone", couleur, a }]
//   fleches : [{ de: [lon, lat], vers: [lon, lat], label, couleur, a, courbe }]
//   zones   : ["afrique", "sicile", "sardaigne", "grece", "espagne"] (surlignées)
// ============================================================================================

const X = (lon: number) => 40 + (lon + 10) * 25;
const Y = (lat: number) => 400 + (54 - lat) * 31;
const chemin = (pts: number[][]) => "M" + pts.map(([lo, la]) => `${X(lo).toFixed(1)} ${Y(la).toFixed(1)}`).join(" L") + " Z";

const TERRES: Record<string, number[][]> = {
  europe: [
    [-4.7, 48.4], [-1.8, 48.7], [-1.3, 49.7], [0.2, 49.5], [1.6, 50.9], [3.5, 51.4], [4.5, 52.5], [5, 53.4], [8, 53.6], [8.6, 54.2], [30, 54.2],
    [30, 41], [29, 41.2], [26.5, 41.3], [26, 40.8], [24, 40.8], [22.8, 40.5], [23.4, 39], [24, 38.2], [23.2, 38], [22.8, 37.6], [23.2, 36.4],
    [22.4, 36.4], [21.6, 36.9], [21.1, 38.3], [20, 39.5], [19.4, 40.5], [19.4, 42], [17.5, 43], [15, 45.1], [13.7, 45.7], [12.5, 45.5],
    [12.3, 44.5], [13.5, 43.6], [14.2, 42.1], [16, 41.4], [18.5, 40.2], [18.4, 39.9], [17, 40.5], [16.5, 39.7], [17.1, 39], [16.6, 38.4],
    [16.1, 38], [15.7, 38.2], [15.6, 40], [14.2, 40.8], [12.5, 41.4], [11.2, 42.4], [10.5, 42.9], [10.2, 43.9], [8.8, 44.4], [7.5, 43.8],
    [4.8, 43.4], [3.2, 42.4], [3.2, 41.9], [0.9, 41], [0, 39.8], [-0.5, 38.5], [-2, 36.8], [-5.6, 36], [-6.3, 36.8], [-7.4, 37.2],
    [-8.9, 37], [-8.8, 38.7], [-9.5, 39.5], [-8.8, 41], [-9, 43.2], [-8, 43.7], [-1.8, 43.4], [-1.2, 46.2], [-2.2, 47.2],
  ],
  angleterre: [
    [-5.7, 50.1], [-3, 50.6], [-1, 50.8], [1.4, 51.2], [1.6, 51.9], [1.7, 52.6], [0.3, 53.4], [-0.2, 54.2], [-3.2, 54.2], [-3, 53.4],
    [-4.6, 53.3], [-4.4, 52.8], [-5.2, 51.8], [-3.2, 51.5], [-4.2, 51.2], [-5.2, 50.9],
  ],
  irlande: [[-10, 51.6], [-6.2, 52.2], [-6, 53.5], [-6.2, 54.2], [-10, 54.2]],
  anatolie: [[26.6, 40.3], [26.1, 39.8], [26.8, 39], [26.4, 38.3], [27.2, 37.7], [27.4, 37], [28, 36.7], [30, 36.3], [30, 41], [29, 41.1], [27.5, 40.9]],
  afrique: [
    [-10, 29.5], [-9.6, 30.4], [-6.8, 34], [-5.9, 35.8], [-5.3, 35.9], [-2, 35.1], [1, 36.5], [3, 36.8], [8, 36.9], [10.2, 37.3],
    [11.1, 37], [10.5, 36], [11, 35.2], [10, 34.3], [10.4, 33.6], [11.5, 33.2], [15.2, 32.3], [19.6, 30.3], [20.1, 31.2], [20, 32.1],
    [21.5, 32.8], [23.5, 32.4], [25, 31.8], [29, 30.9], [30, 31.3], [30, 29.5],
  ],
  sicile: [[12.4, 37.8], [13.3, 38.2], [15.6, 38.3], [15.1, 37.3], [15.1, 36.7], [14.3, 37], [12.6, 37.6]],
  sardaigne: [[8.4, 39], [8.2, 40.6], [9.2, 41.2], [9.8, 40.9], [9.6, 39.2], [9.1, 39.2]],
  corse: [[8.6, 41.4], [8.6, 42.6], [9.4, 43], [9.5, 42.1], [9.2, 41.4]],
  crete: [[23.5, 35.3], [24.5, 35.6], [26.3, 35.3], [25, 35], [23.6, 35.2]],
};

// Zones surlignables (pour « zones ») : on surligne un polygone entier.
const ZONES: Record<string, number[][]> = {
  afrique: TERRES.afrique,
  sicile: TERRES.sicile,
  sardaigne: TERRES.sardaigne,
  grece: [[19.4, 40.5], [20, 39.5], [21.1, 38.3], [21.6, 36.9], [22.4, 36.4], [23.2, 36.4], [22.8, 37.6], [23.2, 38], [24, 38.2], [23.4, 39], [22.8, 40.5], [24, 40.8], [26, 40.8], [26.5, 41.3], [22.5, 41.8], [20.5, 41]],
  espagne: [[3.2, 42.4], [3.2, 41.9], [0.9, 41], [0, 39.8], [-0.5, 38.5], [-2, 36.8], [-5.6, 36], [-6.3, 36.8], [-7.4, 37.2], [-7.5, 39.5], [-6.9, 41.9], [-9, 43.2], [-8, 43.7], [-1.8, 43.4]],
};

const Sfx: React.FC<{ at: number; son: string; volume?: number }> = ({ at, son, volume = 0.6 }) => {
  const v = (config as any).volumes || {};
  const facteur = son === "swoosh" ? v.transitions ?? 0.2 : v.bruitages ?? 0.35;
  return (
    <Sequence from={Math.max(0, Math.round(at))}>
      <Audio src={staticFile(`son/${son}.wav`)} volume={Math.min(1, volume * facteur * 1.6)} />
    </Sequence>
  );
};

export const CarteMed: React.FC<{ p: any; dur: number }> = ({ p, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const apparait = prog(f, 0, 14);
  const lieux: any[] = p.lieux || [];
  const fleches: any[] = p.fleches || [];
  const zones: string[] = p.zones || [];
  const pulse = 0.5 + 0.5 * Math.sin(f / 5);
  return (
    <AbsoluteFill>
      <Sfx at={4} son="swoosh" volume={0.4} />
      <Titre texte={p.titre} k={prog(f, 0, 10)} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: apparait }}>
        <defs>
          <marker id="pointe" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 Z" fill="context-stroke" />
          </marker>
        </defs>
        <rect x={40} y={400} width={1000} height={760} rx={18} fill="#10284A" />
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`m${i}`} x1={40 + i * 125} x2={40 + i * 125} y1={400} y2={1160} stroke="rgba(127,147,174,.10)" strokeWidth={2} />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`p${i}`} y1={400 + i * 152} y2={400 + i * 152} x1={40} x2={1040} stroke="rgba(127,147,174,.10)" strokeWidth={2} />
        ))}
        <clipPath id="cadre">
          <rect x={40} y={400} width={1000} height={760} rx={18} />
        </clipPath>
        <g clipPath="url(#cadre)">
          {Object.entries(TERRES).map(([nom, pts]) => (
            <path key={nom} d={chemin(pts)} fill="#2A4468" stroke="#4A6890" strokeWidth={2} strokeLinejoin="round" />
          ))}
          {zones.map((z, i) => {
            const k = prog(f, 8 + i * 6, 12);
            return ZONES[z] ? <path key={z} d={chemin(ZONES[z])} fill={JAUNE} opacity={k * (0.45 + 0.25 * pulse)} /> : null;
          })}
        </g>
        {fleches.map((fl, i) => {
          const a = fl.a ?? 14 + i * 12;
          const u = interpolate(f, [a, a + 22], [0, 1], { ...C, easing: io });
          if (u <= 0) return null;
          const A = { x: X(fl.de[0]), y: Y(fl.de[1]) };
          const B = { x: X(fl.vers[0]), y: Y(fl.vers[1]) };
          const c = fl.courbe ?? 0.25;
          const M = { x: (A.x + B.x) / 2 - (B.y - A.y) * c, y: (A.y + B.y) / 2 + (B.x - A.x) * c };
          const pt = (t: number) => ({ x: (1 - t) ** 2 * A.x + 2 * (1 - t) * t * M.x + t * t * B.x, y: (1 - t) ** 2 * A.y + 2 * (1 - t) * t * M.y + t * t * B.y });
          // Sous-courbe de 0 à u (de Casteljau)
          const Q = { x: A.x + (M.x - A.x) * u, y: A.y + (M.y - A.y) * u };
          const E = pt(u);
          const couleur = fl.couleur === "rouge" ? ROUGE : fl.couleur === "creme" ? CREME : JAUNE;
          return (
            <path key={i} d={`M${A.x} ${A.y} Q${Q.x} ${Q.y} ${E.x} ${E.y}`} stroke={couleur} strokeWidth={12} fill="none" strokeLinecap="round" markerEnd="url(#pointe)" />
          );
        })}
        {lieux.map((l, i) => {
          const a = l.a ?? 6 + i * 6;
          const k = spring({ frame: f - a, fps, config: { damping: 10, stiffness: 180 } });
          const x = X(l.lon);
          const y = Y(l.lat);
          const couleur = l.couleur === "rouge" ? ROUGE : l.couleur === "creme" ? CREME : JAUNE;
          if (l.style === "barre") {
            const kb = prog(f, a, 10);
            return (
              <g key={i} stroke={ROUGE} strokeWidth={18} strokeLinecap="round">
                <line x1={x - 70} y1={y - 70} x2={x - 70 + 140 * kb} y2={y - 70 + 140 * kb} />
                <line x1={x + 70} y1={y - 70} x2={x + 70 - 140 * kb} y2={y - 70 + 140 * kb} />
              </g>
            );
          }
          return (
            <g key={i} opacity={Math.min(1, k)}>
              {l.style === "cible" && <circle cx={x} cy={y} r={30 + 40 * pulse} fill="none" stroke={couleur} strokeWidth={6} opacity={1 - pulse * 0.6} />}
              <circle cx={x} cy={y} r={14 * Math.min(1.2, k)} fill={couleur} stroke="#0B1626" strokeWidth={4} />
            </g>
          );
        })}
      </svg>
      {lieux
        .filter((l) => l.nom)
        .map((l, i) => {
          const a = l.a ?? 6 + lieux.indexOf(l) * 6;
          const x = X(l.lon);
          const y = Y(l.lat);
          const dy = l.dy ?? (l.dessous ? 26 : -86);
          return (
            <div key={i} style={{ position: "absolute", left: Math.min(1060 - 340, Math.max(20, x - 170)), width: 340, top: y + dy, textAlign: "center", opacity: prog(f, a + 4, 10), ...txt(l.taille || 42, l.couleur === "rouge" ? ROUGE : CREME, 700, { textShadow: "0 3px 10px rgba(0,0,0,.95)" }) }}>
              {l.nom}
            </div>
          );
        })}
      {fleches
        .filter((fl) => fl.label)
        .map((fl, i) => {
          const a = fl.a ?? 14 + fleches.indexOf(fl) * 12;
          const x = (X(fl.de[0]) + X(fl.vers[0])) / 2 + (fl.labelDx || 0);
          const y = (Y(fl.de[1]) + Y(fl.vers[1])) / 2 + (fl.labelDy || 0);
          return (
            <div key={i} style={{ position: "absolute", left: Math.min(1060 - 380, Math.max(20, x - 190)), width: 380, top: y - 30, textAlign: "center", opacity: prog(f, a + 16, 10), ...txt(40, JAUNE, 700, { textShadow: "0 3px 10px rgba(0,0,0,.95)" }) }}>
              {fl.label}
            </div>
          );
        })}
      {p.legende && (
        <Texte top={p.legendeTop || 290} size={56} color={p.legendeCouleur === "jaune" ? JAUNE : CREME} k={prog(f, Math.round(dur * 0.35), 12)}>
          {p.legende}
        </Texte>
      )}
    </AbsoluteFill>
  );
};
