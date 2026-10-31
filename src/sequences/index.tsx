import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  C,
  CREME,
  GRIS,
  JAUNE,
  KRAFT,
  KRAFT_FONCE,
  NUIT,
  NUIT_NOIRE,
  ROUGE,
  Tampon,
  Texte,
  Titre,
  VERT,
  io,
  out,
  prog,
  txt,
} from "../theme";
import { Lustig, PERSONNAGES, Silhouette } from "../dessins/personnages";
import { Billet, Boite, Cadenas, Carte, Coupon, Enveloppe, Etiquette, Flacon, Gyrophare, Horloge, Cravate, Mallette, MalletteBombe, Menottes, Parachutes, PhotoPortrait, Sac, Tour, Trombone, Valise, Voiture } from "../dessins/objets";
import { DECORS } from "../dessins/decors";
import { Avion } from "../dessins/aviation";
import { Accordeon, FausseTete, Perceuse, Radeau } from "../dessins/evasion";
import { Joconde, Malle } from "../dessins/louvre";
import { Intro } from "./Generique";
import { CarteMed } from "./CarteMed";
import { CarteMonde, Courbe, Pyramide, Suite, Suspects } from "./Finance";
import config from "../../config.json";

// --------------------------------------------------------------------------------------------
// Chaque séquence reçoit : p (ses paramètres, écrits dans le fichier de l'épisode), dur (durée
// en images), texte (la phrase lue) et mots (horodatage de chaque mot, en secondes).
// --------------------------------------------------------------------------------------------
export type Mot = { t: number; m: string };
export type SeqProps = { p: any; dur: number; texte: string; mots: Mot[]; id: string };

/** Bruitage à un instant donné (en images depuis le début de la séquence). */
// Les volumes se règlent dans config.json -> volumes (transitions = « swoosh », bruitages = le reste).
const Sfx: React.FC<{ at: number; son: string; volume?: number }> = ({ at, son, volume = 0.6 }) => {
  const v = (config as any).volumes || {};
  const facteur = son === "swoosh" ? v.transitions ?? 0.2 : v.bruitages ?? 0.35;
  return (
    <Sequence from={Math.max(0, Math.round(at))}>
      <Audio src={staticFile(`son/${son}.wav`)} volume={Math.min(1, volume * facteur * 1.6)} />
    </Sequence>
  );
};

const ressort = (f: number, fps: number, debut: number, cfg = { damping: 12, stiffness: 160 }) => spring({ frame: f - debut, fps, config: cfg });

const Svg: React.FC<{ children: React.ReactNode; o?: number }> = ({ children, o = 1 }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: o }}>
    {children}
  </svg>
);

/** Image où un mot donné est prononcé (pour caler une animation sur la voix). */
const imageDuMot = (mots: Mot[], fps: number, cherche: string, defaut: number) => {
  const i = mots.findIndex((w) => w.m.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "").startsWith(cherche.toLowerCase()));
  return i >= 0 ? Math.round(mots[i].t * fps) : defaut;
};

/** Dessine un personnage par son nom (lustig = dessin détaillé, sinon silhouette). */
const Perso: React.FC<{ nom: string; x: number; y: number; s: number; f: number; o?: number; extra?: any }> = ({ nom, x, y, s, f, o = 1, extra = {} }) => {
  if (nom === "lustig")
    return (
      <g transform={`translate(${x} ${y}) scale(${s / 520})`} opacity={o}>
        <Lustig frame={f} expr={extra.expr} bras={extra.bras || 0} doigt={extra.doigt || 0} />
      </g>
    );
  const reglages = PERSONNAGES[nom] || PERSONNAGES.passager;
  const sil = <Silhouette x={x} y={y} s={s} o={o} tete={Math.sin(f / 9 + x) * 4} {...reglages} {...extra} />;
  // extra.rot : personnage incliné (ex. 90 = allongé), pivote autour des pieds
  return extra.rot ? <g transform={`rotate(${extra.rot} ${x} ${y})`}>{sil}</g> : sil;
};

// ============================================================================================
// 1. POCHETTE — la vraie photo d'archive dans un dossier, zoom sur le visage, phrase mot à mot.
// ============================================================================================
const Pochette: React.FC<SeqProps> = ({ p, dur, texte, mots }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const srcW = p.srcW || 540;
  const srcH = p.srcH || 519;
  const cw = p.carteW || 860;
  const carte = { left: Math.round((1080 - cw) / 2), top: 420, w: cw };
  const ech = carte.w / srcW;
  const fx = carte.left + p.visage.x * ech;
  const fy = carte.top + p.visage.y * ech;
  const monte = ressort(f, fps, 0, { damping: 15, stiffness: 90 });
  const ouverture = interpolate(f, [16, 40], [0, 1], { ...C, easing: io });
  const zoom = interpolate(f, [40, dur], [0, 1], { ...C, easing: Easing.inOut(Easing.quad) });
  const s = 1 + 2.0 * zoom;
  const tx = (540 - fx) * zoom;
  const ty = (760 - fy) * zoom;
  const motsT = texte.split(" ");
  return (
    <AbsoluteFill style={{ background: NUIT_NOIRE }}>
      <Sfx at={0} son="swoosh" />
      <Sfx at={18} son="swoosh" volume={0.4} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(255,232,170,.16) 0%, rgba(0,0,0,0) 70%)" }} />
      <AbsoluteFill style={{ transformOrigin: `${fx}px ${fy}px`, transform: `translate(${tx}px, ${ty + (1 - monte) * 1300}px) scale(${s})` }}>
        <div style={{ position: "absolute", left: 60, top: 300, width: 960, height: 1180, background: `linear-gradient(160deg, ${KRAFT} 0%, ${KRAFT_FONCE} 100%)`, borderRadius: 14, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }} />
        <div style={{ position: "absolute", left: 60, top: 262, width: 300, height: 60, background: KRAFT, borderRadius: "14px 14px 0 0" }} />
        <div style={{ position: "absolute", left: carte.left, top: carte.top, width: carte.w, transform: "rotate(-1.5deg)", boxShadow: "0 12px 30px rgba(0,0,0,.45)" }}>
          <Img src={staticFile(p.photo)} style={{ width: "100%", display: "block", filter: "grayscale(1) sepia(.35) contrast(1.15) brightness(.97)" }} />
        </div>
        <Trombone x={carte.left + 40} y={carte.top - 70} />
        {p.legende && (
          <div style={{ position: "absolute", left: carte.left, top: carte.top + srcH * ech + 24, fontFamily: "monospace", fontSize: 24, color: "#5A4524" }}>{p.legende}</div>
        )}
        <div style={{ position: "absolute", left: 60, top: 300, width: 960, height: 1180, perspective: 2200 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              transformOrigin: "left center",
              transform: `rotateY(${-178 * ouverture}deg)`,
              backfaceVisibility: "hidden",
              background: `linear-gradient(160deg, #D6B87A 0%, ${KRAFT} 100%)`,
              borderRadius: 14,
            }}
          >
            <div style={{ position: "absolute", left: 90, top: 140, fontFamily: "monospace", fontSize: 44, color: "#4A3618", lineHeight: 1.6 }}>
              {(p.etiquette || []).map((l: string, i: number) => (
                <div key={i}>{l}</div>
              ))}
            </div>
            <div style={{ position: "absolute", left: 230, top: 560, border: `12px solid ${ROUGE}`, borderRadius: 18, padding: "6px 40px 12px", transform: "rotate(-10deg)", ...txt(120, ROUGE, 700, { letterSpacing: 12 }), opacity: 0.9 }}>
              CLASSÉ
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1060, bottom: 0, background: "linear-gradient(180deg, rgba(7,14,26,0) 0%, rgba(7,14,26,.9) 30%, rgba(7,14,26,.95) 100%)", opacity: prog(f, 30, 12) }} />
      <div style={{ position: "absolute", top: 1240, left: 70, right: 110, textAlign: "center", lineHeight: 1.3, ...txt(66, CREME, 700, { textShadow: "0 4px 18px rgba(0,0,0,.9)" }) }}>
        {motsT.map((m, i) => {
          const debut = mots[i] ? mots[i].t * fps : 40 + i * 7;
          const k = interpolate(f, [debut, debut + 6], [0, 1], C);
          return (
            <span key={i} style={{ display: "inline-block", margin: "0 10px", opacity: k, transform: `translateY(${(1 - k) * 18}px)` }}>
              {m}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================================
// 2. CHOC — phrase choc en jaune sur la photo assombrie, puis éclair.
// ============================================================================================
const Choc: React.FC<SeqProps> = ({ p, dur, texte }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = ressort(f, fps, 4, { damping: 8, stiffness: 220 });
  const secousse = f >= 4 && f < 14 ? Math.sin(f * 3.3) * 10 * (1 - (f - 4) / 10) : 0;
  const flash = interpolate(f, [dur - 10, dur - 5, dur], [0, 0.9, 0], C);
  return (
    <AbsoluteFill style={{ background: NUIT_NOIRE, transform: `translate(${secousse}px, ${secousse * 0.5}px)` }}>
      <Sfx at={4} son="choc" volume={0.8} />
      {p.photo && (
        <Img
          src={staticFile(p.photo)}
          style={{
            position: "absolute",
            width: 2400,
            left: 540 - p.visage.x * (2400 / (p.srcW || 540)),
            top: 760 - p.visage.y * (2400 / (p.srcW || 540)),
            filter: "grayscale(1) sepia(.35) contrast(1.15) brightness(.45)",
          }}
        />
      )}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(7,14,26,.2) 30%, rgba(7,14,26,.9) 100%)" }} />
      <Texte top={760} size={92} color={JAUNE} k={Math.min(1, k * 1.4)} scale={0.8 + 0.2 * k}>
        {p.texte || texte}
      </Texte>
      <AbsoluteFill style={{ background: "#FFF6DA", opacity: flash }} />
    </AbsoluteFill>
  );
};

// ============================================================================================
// 3. GÉNÉRIQUE — enquêteur dans l'ombre + « DOSSIERS CLASSÉS » (commence à 0,9 s de l'intro).
// ============================================================================================
const Generique: React.FC<SeqProps> = ({ p }) => (
  <Sequence from={-28}>
    <Intro sousTitre={p.sousTitre || ""} />
  </Sequence>
);

// ============================================================================================
// 4. FICHE — un personnage et ses informations clés.
// ============================================================================================
const Fiche: React.FC<SeqProps> = ({ p }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entree = ressort(f, fps, 0, { damping: 13, stiffness: 110 });
  const nom = ressort(f, fps, 10, { damping: 14, stiffness: 120 });
  const souligne = prog(f, 14, 16);
  return (
    <AbsoluteFill>
      <Sfx at={0} son="swoosh" volume={0.4} />
      <Titre texte={p.titre || "DOSSIER"} k={prog(f, 0, 10)} />
      <div style={{ position: "absolute", left: 210, top: 230, width: 660, height: 660, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,212,0,.15) 0%, rgba(255,212,0,0) 68%)", opacity: entree }} />
      <Svg>
        <Perso nom={p.personnage} x={540} y={900 + (1 - entree) * 700} s={p.personnage === "lustig" ? 520 : 480} f={f} extra={p.extra} />
      </Svg>
      <Texte top={935} size={p.nom && p.nom.length > 14 ? 84 : 100} color={JAUNE} k={nom} scale={0.85 + 0.15 * nom}>
        {p.nom}
      </Texte>
      <div style={{ position: "absolute", top: 1062, left: 540 - 360 * souligne, width: 720 * souligne, height: 6, borderRadius: 3, background: JAUNE }} />
      {(p.infos || []).map((l: string, i: number) => {
        const k = ressort(f, fps, 22 + i * 10, { damping: 15, stiffness: 120 });
        return (
          <div key={i} style={{ position: "absolute", top: 1100 + i * 70, width: "100%", textAlign: "center", opacity: k, transform: `translateY(${(1 - k) * 20}px)`, ...txt(48, CREME) }}>
            {l}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ============================================================================================
// 5. SCÈNE — un décor + des personnages + accessoires.
// ============================================================================================
const Scene: React.FC<SeqProps> = ({ p, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Decor = DECORS[p.decor];
  const persos: any[] = p.personnages || [];
  const n = persos.length;
  const sol = p.sol || 1350;
  return (
    <AbsoluteFill>
      <Sfx at={0} son="swoosh" volume={0.35} />
      <Svg>
        {Decor && <Decor frame={f} p={p} />}
        {persos.map((pp, i) => {
          const k = ressort(f, fps, 4 + i * 4, { damping: 12, stiffness: 140 });
          const x = pp.x ?? (n === 1 ? 540 : 200 + (680 * i) / Math.max(1, n - 1));
          const y = pp.y ?? sol;
          const s = pp.s ?? (pp.nom === "lustig" ? 560 : 180);
          return <Perso key={i} nom={pp.nom} x={x} y={y + (1 - k) * 60} s={s * Math.min(1, k)} f={f} o={Math.min(1, k)} extra={pp} />;
        })}
        {p.gyrophare && <Gyrophare x={880} y={480} frame={f} s={110} />}
        {p.cartes &&
          ["♠", "♥", "♦", "♣", "♠"].map((sg, i) => {
            const k = prog(f, 4 + i * 4, 16);
            return <Carte key={i} x={540 + (i - 2) * 130} y={-200 + (1080 + Math.abs(i - 2) * 30) * k} rot={(i - 2) * 14 * k + (1 - k) * 90} signe={sg} o={Math.min(1, k * 3)} s={150} />;
          })}
        {p.corde && <path d={`M590 ${560} Q${600 + Math.sin(f / 8) * 10} 900 590 ${560 + 800 * prog(f, 6, 30)}`} stroke="#F2EEE6" strokeWidth={16} fill="none" strokeDasharray="30 8" />}
        {p.menottes && <Menottes x={540} y={700} s={150 * ressort(f, fps, 10)} />}
        {p.billets &&
          Array.from({ length: 6 }, (_, i) => {
            const k = prog(f, 8 + i * 4, 18);
            return <Billet key={i} x={420 + (i % 3) * 120} y={980 - Math.floor(i / 3) * 40 - k * 20} l={110} rot={-8 + i * 4} o={k} />;
          })}
      </Svg>
      <Titre texte={p.titre} k={prog(f, 0, 10)} />
      {p.legende && (
        <Texte top={p.legendeTop || 420} size={60} k={prog(f, 12, 12)}>
          {p.legende}
        </Texte>
      )}
      {p.tampon && (
        <>
          <Sfx at={p.tamponA ?? Math.round(dur * 0.45)} son="tampon" volume={0.7} />
          <Tampon texte={p.tampon} k={ressort(f, fps, p.tamponA ?? Math.round(dur * 0.45), { damping: 9, stiffness: 230 })} top={p.tamponTop || 640} />
        </>
      )}
    </AbsoluteFill>
  );
};

// ============================================================================================
// 6. ICÔNES — des bulles qui apparaissent une à une (langues, étapes…).
// ============================================================================================
const Icones: React.FC<SeqProps> = ({ p }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items: any[] = p.items || [];
  return (
    <AbsoluteFill>
      <Titre texte={p.titre} k={prog(f, 0, 10)} />
      {p.grand && (
        <Texte top={430} size={150} color={JAUNE} k={ressort(f, fps, 0)}>
          {p.grand}
        </Texte>
      )}
      {items.map((it, i) => {
        const k = ressort(f, fps, 10 + i * 8, { damping: 9, stiffness: 200 });
        const col = i % 2;
        const row = Math.floor(i / 2);
        const centre = items.length % 2 === 1 && i === items.length - 1;
        const x = centre ? 540 : 330 + col * 420;
        const y = 760 + row * 240;
        return (
          <React.Fragment key={i}>
            <Sfx at={10 + i * 8} son="pop" volume={0.35} />
            <div
              style={{
                position: "absolute",
                left: x - 170,
                top: y,
                width: 340,
                height: 180,
                borderRadius: 40,
                background: i % 3 === 0 ? JAUNE : CREME,
                transform: `scale(${k})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 16px 30px rgba(0,0,0,.35)",
              }}
            >
              <div style={txt(String(it.label).length > 7 ? 50 : 64, NUIT)}>{it.label}</div>
              {it.sous && <div style={txt(28, "#3A4150", 500)}>{it.sous}</div>}
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// ============================================================================================
// 7. CARTE — des lieux reliés par un trajet en pointillés (bateau, sac d'argent ou point).
// ============================================================================================
const CarteTrajet: React.FC<SeqProps> = ({ p, dur }) => {
  const f = useCurrentFrame();
  const pts: any[] = p.points || [];
  const nSeg = Math.max(1, pts.length - 1);
  const avance = interpolate(f, [10, Math.max(20, dur - 15)], [0, nSeg], { ...C, easing: io });
  const segs: React.ReactNode[] = [];
  let cur = pts[0] ? { x: pts[0].x, y: pts[0].y } : { x: 540, y: 900 };
  for (let s = 0; s < nSeg; s++) {
    const A = pts[s];
    const B = pts[s + 1];
    if (!A || !B) break;
    const M = { x: (A.x + B.x) / 2, y: Math.min(A.y, B.y) - 160 };
    const local = Math.max(0, Math.min(1, avance - s));
    const pt = (u: number) => ({ x: (1 - u) ** 2 * A.x + 2 * (1 - u) * u * M.x + u * u * B.x, y: (1 - u) ** 2 * A.y + 2 * (1 - u) * u * M.y + u * u * B.y });
    for (let i = 0; i < 30; i++) {
      const u0 = i / 30;
      if (u0 > local) break;
      const a = pt(u0);
      const b = pt(Math.min((i + 0.55) / 30, local));
      segs.push(<line key={`${s}-${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={JAUNE} strokeWidth={8} strokeLinecap="round" />);
    }
    if (local > 0 && local < 1) cur = pt(local);
    if (local >= 1) cur = { x: B.x, y: B.y };
  }
  return (
    <AbsoluteFill>
      <Sfx at={8} son="swoosh" volume={0.4} />
      <Titre texte={p.titre} k={prog(f, 0, 10)} />
      <Svg>
        {Array.from({ length: 14 }, (_, i) => (
          <line key={`h${i}`} x1={60} x2={1020} y1={400 + i * 70} y2={400 + i * 70} stroke="rgba(127,147,174,.12)" strokeWidth={2} />
        ))}
        {Array.from({ length: 14 }, (_, i) => (
          <line key={`v${i}`} y1={400} y2={1310} x1={60 + i * 74} x2={60 + i * 74} stroke="rgba(127,147,174,.12)" strokeWidth={2} />
        ))}
        {segs}
        {pts.map((pt, i) => {
          const atteint = avance >= i - 0.02;
          return <circle key={i} cx={pt.x} cy={pt.y} r={atteint ? 18 : 10} fill={i === 0 ? CREME : atteint ? JAUNE : GRIS} />;
        })}
        {p.voyageur === "sac" && <Sac x={cur.x} y={cur.y - 22} s={60} lettre={p.lettre || "$"} />}
        {p.voyageur === "avion" && <Avion x={cur.x} y={cur.y - 40} s={200} />}
        {p.voyageur === "bateau" && (
          <g transform={`translate(${cur.x} ${cur.y - 30})`}>
            <path d="M-50 0 L50 0 L36 26 L-36 26 Z" fill={CREME} />
            <rect x={-26} y={-24} width={52} height={24} fill={CREME} />
            <rect x={-6} y={-46} width={14} height={22} fill={ROUGE} />
          </g>
        )}
      </Svg>
      {pts.map((pt, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: pt.y + 30,
            left: pt.x - 200,
            width: 400,
            textAlign: "center",
            opacity: interpolate(avance, [i - 0.3, i], [0, 1], C),
            ...txt(40, i === 0 ? CREME : JAUNE),
          }}
        >
          {pt.nom}
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ============================================================================================
// 8. OBJET — la boîte roumaine (apparition, billet qui entre, vue en coupe).
// ============================================================================================
const Objet: React.FC<SeqProps> = ({ p, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = ressort(f, fps, 0, { damping: 11, stiffness: 120 });
  const mode = p.mode || "apparait";
  const billet = prog(f, 12, 30, io);
  const coupe = mode === "coupe" ? prog(f, 10, 18) : 0;
  if (p.dessin) return <ObjetDessin p={p} dur={dur} f={f} k={k} />;
  return (
    <AbsoluteFill>
      <Titre texte={p.titre} k={prog(f, 0, 10)} />
      {mode === "apparait" && <Sfx at={2} son="pop" volume={0.5} />}
      <Svg>
        <Boite x={540} y={1150} s={260 * Math.min(1, k)} frame={f} coupe={coupe} levier={mode === "billet" ? prog(f, 40, 12) : 0} />
        {mode === "billet" && <Billet x={540 - 182} y={1150 - 260 * 2.0 - 120 + billet * 120} l={190} o={1 - prog(f, 36, 6)} />}
      </Svg>
      {p.legende && (
        <Texte top={460} size={64} k={prog(f, 8, 12)}>
          {p.legende}
        </Texte>
      )}
      {mode === "coupe" && (
        <Texte top={1300} size={52} color={JAUNE} k={prog(f, dur * 0.4, 12)}>
          {p.revelation || "Un vrai billet, caché à l'avance"}
        </Texte>
      )}
    </AbsoluteFill>
  );
};

/** Objet dessiné (mallette, flacon, photo, enveloppe) : apparition + légende + tampon éventuel. */
const ObjetDessin: React.FC<{ p: any; dur: number; f: number; k: number }> = ({ p, dur, f, k }) => {
  const { fps } = useVideoConfig();
  const s = Math.min(1, k);
  const y = 960 + (1 - s) * 200;
  const tamponA = p.tamponA ?? Math.round(dur * 0.5);
  return (
    <AbsoluteFill>
      <Sfx at={2} son="pop" volume={0.5} />
      <Titre texte={p.titre} k={prog(f, 0, 10)} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,212,0,.10) 0%, rgba(0,0,0,0) 45%)" }} />
      <Svg o={s}>
        {p.dessin === "mallette" && <Mallette x={540} y={y} s={640 * (0.8 + 0.2 * s)} chaine={prog(f, 10, 24)} />}
        {p.dessin === "flacon" && <Flacon x={540} y={y} s={420 * (0.8 + 0.2 * s)} />}
        {p.dessin === "photo" && <PhotoPortrait x={540} y={y} s={520 * (0.8 + 0.2 * s)} rot={-4 + (1 - s) * 10} legende={p.ecrit} />}
        {p.dessin === "joconde" && <Joconde x={540} y={y - 40} s={560 * (0.8 + 0.2 * s)} vitre={p.vitre} rot={p.penche ? -6 + (1 - s) * 10 : 0} />}
        {p.dessin === "cadre_vide" && (
          <g transform={`translate(540 ${y - 40})`}>
            <rect x={-210} y={-280} width={420} height={560} fill="rgba(200,230,255,.10)" stroke="#C9A24A" strokeWidth={30} />
            <rect x={-210} y={-280} width={420} height={560} fill="none" stroke="rgba(220,240,255,.7)" strokeWidth={6} />
            {p.empreinte && <g opacity={prog(f, 20, 12)} transform="translate(90 120)"><ellipse rx={34} ry={46} fill="none" stroke="#E6504A" strokeWidth={4} />{[12, 22, 32].map((r) => <ellipse key={r} rx={r * 0.75} ry={r} fill="none" stroke="#E6504A" strokeWidth={3} />)}</g>}
          </g>
        )}
        {p.dessin === "malle" && <Malle x={540} y={y + 60} s={760} ouverte={p.ouverte ? prog(f, 10, 30) : 0} />}
        {p.dessin === "perceuse" && <Perceuse x={540} y={y} s={720 * (0.8 + 0.2 * s)} frame={f} />}
        {p.dessin === "accordeon" && <Accordeon x={540} y={y} s={640 * (0.8 + 0.2 * s)} frame={f} />}
        {p.dessin === "radeau" && <Radeau x={540} y={y} s={760 * (0.8 + 0.2 * s)} />}
        {p.dessin === "tete" && <FausseTete x={540} y={y} s={460 * (0.8 + 0.2 * s)} cheveux={p.sansCheveux ? 0 : p.cheveux ? prog(f, Math.round(dur * 0.35), 16) : 1} />}
        {p.dessin === "mallette_bombe" && <MalletteBombe x={540} y={y + 80} s={680 * (0.8 + 0.2 * s)} ouvre={prog(f, 10, 24)} />}
        {p.dessin === "parachutes" && <Parachutes x={540} y={y - 120} s={820} n={interpolate(f, [4, Math.max(10, dur * 0.6)], [0, 4], C)} />}
        {p.dessin === "cravate" && <Cravate x={540} y={y} s={520 * (0.8 + 0.2 * s)} />}
        {p.dessin === "coupon" && <Coupon x={540} y={y} s={720 * (0.8 + 0.2 * s)} rot={-3 + (1 - s) * 12} timbres={p.timbres ? prog(f, Math.round(dur * 0.4), 20) : 0} />}
        {p.dessin === "voiture" && <Voiture x={540 + (1 - prog(f, 0, 24)) * -900} y={y + 120} s={760} frame={f} />}
        {p.dessin === "enveloppe" && <Enveloppe x={540} y={y} s={720 * (0.8 + 0.2 * s)} cachet={ressort(f, fps, Math.round(dur * 0.45), { damping: 9, stiffness: 200 })} />}
      </Svg>
      {p.dessin === "enveloppe" && <Sfx at={Math.round(dur * 0.45)} son="tampon" volume={0.5} />}
      {p.legende && (
        <Texte top={p.legendeTop || 400} size={62} k={prog(f, 8, 12)}>
          {p.legende}
        </Texte>
      )}
      {p.tampon && (
        <>
          <Sfx at={tamponA} son="tampon" volume={0.7} />
          <Tampon texte={p.tampon} k={ressort(f, fps, tamponA, { damping: 9, stiffness: 230 })} top={p.tamponTop || 900} size={p.tamponTaille || 120} />
        </>
      )}
    </AbsoluteFill>
  );
};

// ============================================================================================
// 9. COMPTEUR — horloge (heures) ou jours qui défilent.
// ============================================================================================
const Compteur: React.FC<SeqProps> = ({ p, dur }) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [8, Math.max(20, dur - 20)], [0, p.valeur], { ...C, easing: io });
  return (
    <AbsoluteFill>
      <Titre texte={p.titre} k={prog(f, 0, 10)} />
      {p.mode === "horloge" ? (
        <>
          <Svg>
            <Horloge x={540} y={820} heures={v} s={160} />
            {p.billetSort && <Billet x={540} y={1260 - prog(f, dur - 30, 20) * 60} l={220} o={prog(f, dur - 30, 10)} />}
          </Svg>
          <Texte top={1080} size={110} color={JAUNE}>
            {Math.floor(v)} h
          </Texte>
        </>
      ) : (
        <>
          <Texte top={p.taille ? 760 - p.taille / 2 : 640} size={p.taille || 300} color={p.couleur === "rouge" ? ROUGE : JAUNE}>
            {p.milliers ? Math.floor(v).toLocaleString("fr-FR").replace(/[\u202f\u00a0]/g, " ") : Math.floor(v)}
          </Texte>
          <Texte top={1000} size={80}>
            {p.unite || "jours"}
          </Texte>
          {p.legende && (
            <Texte top={1150} size={52} color={GRIS} k={prog(f, dur - 30, 12)}>
              {p.legende}
            </Texte>
          )}
        </>
      )}
    </AbsoluteFill>
  );
};

// ============================================================================================
// 10. CHIFFRE CHOC — compteur d'argent, option « × 2 ».
// ============================================================================================
const Chiffre: React.FC<SeqProps> = ({ p, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = interpolate(f, [6, 6 + Math.min(40, dur * 0.5)], [0, p.valeur], { ...C, easing: out });
  const fin = 6 + Math.min(40, dur * 0.5);
  const x2 = p.x2 ? ressort(f, fps, fin + 8, { damping: 8, stiffness: 220 }) : 0;
  const nombre = p.decimales ? v.toFixed(p.decimales).replace(".", ",") : Math.round(v).toLocaleString("fr-FR").replace(/ | /g, " ");
  return (
    <AbsoluteFill>
      <Sfx at={fin} son="caisse" volume={0.45} />
      <Titre texte={p.titre} k={prog(f, 0, 10)} />
      <Svg>
        {Array.from({ length: 10 }, (_, i) => {
          const k = prog(f, 4 + i * 3, 20);
          return <Billet key={i} x={140 + ((i * 97) % 800)} y={200 + k * (1100 + (i % 4) * 90)} l={110} rot={-30 + i * 13 + k * 60} o={0.35 * Math.min(1, k * 4) * (1 - prog(f, dur - 12, 10))} />;
        })}
      </Svg>
      <Texte top={800} size={p.valeur >= 100000 ? 150 : 180} color={p.couleur === "rouge" ? ROUGE : VERT}>
        {nombre} {p.unite || "$"}
      </Texte>
      {p.sous && (
        <Texte top={1030} size={52} k={prog(f, 14, 12)}>
          {p.sous}
        </Texte>
      )}
      {p.x2 && (
        <Texte top={1120} size={150} color={JAUNE} k={Math.min(1, x2 * 1.4)} scale={x2}>
          × 2
        </Texte>
      )}
    </AbsoluteFill>
  );
};

// ============================================================================================
// 11. DOCUMENT — coupure de presse, papier à en-tête, affiche, carte de visite (+ tampon).
// ============================================================================================
const Document: React.FC<SeqProps> = ({ p, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = ressort(f, fps, 0, { damping: 13, stiffness: 120 });
  const genre = p.genre || "presse";
  const tamponA = p.tamponA ?? Math.round(dur * 0.55);
  const style: Record<string, React.CSSProperties> = {
    presse: { background: "#EDE6D3", width: 820, padding: "40px 46px", fontFamily: "Georgia, serif" },
    entete: { background: "#F6F2EA", width: 760, padding: "50px 56px" },
    affiche: { background: "#F2D27A", width: 700, padding: "60px 50px", textAlign: "center" },
    carte_visite: { background: CREME, width: 760, padding: "50px 40px", textAlign: "center", borderRadius: 12 },
    lettre: { background: "#F3EEE2", width: 800, padding: "50px 56px" },
    telegramme: { background: "#F2E6B8", width: 820, padding: "40px 50px", fontFamily: "monospace" },
    rapport: { background: "#EAF0F2", width: 800, padding: "50px 56px" },
    code: { background: "#E8E2D2", width: 820, padding: "46px 50px", fontFamily: "monospace" },
    billet: { background: "#F2EEE2", width: 860, padding: "0", borderRadius: 14, overflow: "hidden" },
  };
  const lignes: string[] = p.lignes || [];
  const surligne: string[] = p.surligne || [];
  const ligneAvecSurligne = (l: string, i: number) => {
    if (l.startsWith("■")) return <div key={i} style={{ height: 26, background: "#2A2620", margin: "22px 0", width: `${55 + ((i * 37) % 40)}%`, borderRadius: 3 }} />;
    const mots = l.split(" ");
    const kl = prog(f, 10 + i * 6, 10);
    return (
      <div key={i} style={{ margin: "16px 0", opacity: kl, ...txt(p.tailleLignes || 44, "#2A2620", 600) }}>
        {mots.map((m, j) => {
          const s = surligne.some((w) => m.toUpperCase().includes(w.toUpperCase()));
          const ks = s ? prog(f, (p.surligneA ?? Math.round(dur * 0.45)) + j * 2, 10) : 0;
          return (
            <span key={j} style={{ padding: "0 6px", background: s ? `linear-gradient(90deg, rgba(255,212,0,.85) ${ks * 100}%, rgba(255,212,0,0) ${ks * 100}%)` : undefined }}>
              {m}
            </span>
          );
        })}
      </div>
    );
  };
  const brouille = (l: string, i: number) => {
    const fin = (p.decodeA ?? Math.round(dur * 0.35)) + i * 8;
    const u = interpolate(f, [fin - 20, fin + 20], [0, 1], C);
    const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const t = l
      .split("")
      .map((c, j) => (c === " " || j / l.length < u ? c : ALPHA[(j * 7 + i * 13 + Math.floor(f / 2) * 5) % 26]))
      .join("");
    return (
      <div key={i} style={{ margin: "14px 0", letterSpacing: 4, ...txt(46, u >= 1 ? "#A3282A" : "#2A2620", 700), fontFamily: "monospace" }}>
        {t}
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Sfx at={0} son="swoosh" volume={0.4} />
      <Titre texte={p.titre} k={prog(f, 0, 10)} />
      <div style={{ position: "absolute", top: genre === "carte_visite" ? 640 : 460, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ ...style[genre], transform: `rotate(${(1 - k) * 8 - 2}deg) scale(${0.6 + 0.4 * k}) translateY(${(1 - k) * 200}px)`, opacity: Math.min(1, k * 1.5), boxShadow: "0 24px 50px rgba(0,0,0,.5)", color: "#2A2620" }}>
          {genre === "presse" && (
            <>
              <div style={{ fontSize: 30, letterSpacing: 6, borderBottom: "3px solid #2A2620", paddingBottom: 10, marginBottom: 20, textAlign: "center" }}>{p.journal || "LE JOURNAL"}</div>
              <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.15, marginBottom: 24 }}>{p.manchette}</div>
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} style={{ height: 14, background: "#B9B09A", margin: "14px 0", width: `${70 + ((i * 37) % 30)}%` }} />
              ))}
            </>
          )}
          {genre === "entete" && (
            <>
              <div style={{ textAlign: "center", ...txt(30, "#3A4150", 700, { letterSpacing: 4 }) }}>RÉPUBLIQUE FRANÇAISE</div>
              <div style={{ textAlign: "center", ...txt(26, "#6A7280", 500, { letterSpacing: 3, marginTop: 6 }) }}>{p.ministere || "MINISTÈRE DES POSTES ET TÉLÉGRAPHES"}</div>
              <div style={{ height: 3, background: "#3A4150", margin: "26px 80px" }} />
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} style={{ height: 12, background: "#D0C8B6", margin: "16px 0", width: `${60 + ((i * 29) % 40)}%` }} />
              ))}
            </>
          )}
          {genre === "affiche" && (
            <>
              <div style={txt(34, "#7A3442", 700, { letterSpacing: 6 })}>{p.surtitre ?? "BROADWAY"}</div>
              <div style={txt(84, "#2A2620", 700, { lineHeight: 1.05, margin: "20px 0" })}>{p.manchette || "LE GRAND SPECTACLE"}</div>
              <div style={txt(30, "#2A2620", 500)}>{p.sousAffiche ?? "Investisseurs recherchés"}</div>
            </>
          )}
          {(genre === "lettre" || genre === "rapport" || genre === "telegramme") && (
            <>
              {p.entete && (
                <div style={{ textAlign: "center", ...txt(34, genre === "lettre" ? "#A3282A" : "#3A4150", 700, { letterSpacing: 6 }), fontFamily: genre === "telegramme" ? "monospace" : undefined }}>
                  {p.entete}
                </div>
              )}
              {p.sousEntete && <div style={{ textAlign: "center", ...txt(26, "#6A7280", 500, { letterSpacing: 3, marginTop: 6 }) }}>{p.sousEntete}</div>}
              <div style={{ height: 3, background: genre === "lettre" ? "#A3282A" : "#3A4150", margin: "22px 60px 26px" }} />
              {lignes.map(ligneAvecSurligne)}
            </>
          )}
          {genre === "billet" && (
            <>
              <div style={{ background: "#B0332E", padding: "22px 40px", ...txt(36, "#FFFFFF", 700, { letterSpacing: 4 }) }}>{p.compagnie || "NORTHWEST ORIENT"}</div>
              <div style={{ padding: "30px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 22, columnGap: 30 }}>
                {(p.champs || []).map((c: any, i: number) => (
                  <div key={i} style={{ opacity: prog(f, 8 + i * 5, 8) }}>
                    <div style={txt(22, "#7A8090", 600, { letterSpacing: 3 })}>{c.label}</div>
                    <div style={txt(c.grand ? 50 : 40, c.surligne ? "#B0332E" : "#2A2620", 700)}>{c.valeur}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          {genre === "code" && (
            <>
              {p.entete && <div style={{ textAlign: "center", ...txt(30, "#3A4150", 700, { letterSpacing: 6 }), marginBottom: 20 }}>{p.entete}</div>}
              {lignes.map(brouille)}
            </>
          )}
          {genre === "carte_visite" && (
            <>
              <div style={txt(28, GRIS, 500, { letterSpacing: 3 })}>{p.ministere || "MINISTÈRE DES POSTES ET TÉLÉGRAPHES"}</div>
              <div style={{ height: 3, background: JAUNE, margin: "18px 100px" }} />
              <div style={txt(48, NUIT)}>{p.nom || "Victor Lustig"}</div>
              <div style={txt(34, "#3A4150", 500, { marginTop: 8 })}>{p.fonction || "Directeur général adjoint"}</div>
            </>
          )}
        </div>
      </div>
      {p.legende && (
        <Texte top={1340} size={54} k={prog(f, 14, 12)}>
          {p.legende}
        </Texte>
      )}
      {p.tampon && (
        <>
          <Sfx at={tamponA} son="tampon" volume={0.7} />
          <Tampon texte={p.tampon} k={ressort(f, fps, tamponA, { damping: 9, stiffness: 230 })} top={p.tamponTop || (genre === "carte_visite" ? 700 : 820)} size={p.tamponTaille || 120} />
        </>
      )}
    </AbsoluteFill>
  );
};

// ============================================================================================
// 12. SECRET — cadenas + Lustig qui fait « chut ».
// ============================================================================================
const Secret: React.FC<SeqProps> = ({ p }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = ressort(f, fps, 8, { damping: 9, stiffness: 200 });
  return (
    <AbsoluteFill>
      <Sfx at={8} son="pop" volume={0.5} />
      <Titre texte={p.titre} k={prog(f, 0, 10)} />
      <div style={{ position: "absolute", top: p.personnage === "aucun" ? 560 : 330, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${k})`, opacity: Math.min(1, k * 1.4) }}>
        <Cadenas />
        <div style={txt(p.taille || 80, JAUNE, 700, { letterSpacing: 12, marginTop: 10, textAlign: "center" })}>{p.texte || "SECRET"}</div>
        {p.sous && <div style={{ ...txt(50, CREME, 500, { marginTop: 24, textAlign: "center" }), opacity: prog(f, 20, 12) }}>{p.sous}</div>}
      </div>
      <Svg>
        {(p.personnage ?? "lustig") === "lustig" && <Perso nom="lustig" x={540} y={1400} s={600} f={f} extra={{ doigt: prog(f, 4, 14, io) }} />}
        {p.personnage && p.personnage !== "lustig" && p.personnage !== "aucun" && <Perso nom={p.personnage} x={540} y={1350} s={420} f={f} extra={p.extra} />}
      </Svg>
    </AbsoluteFill>
  );
};

// ============================================================================================
// 13. FLUX D'ARGENT — un objet passe d'un personnage à l'autre.
// ============================================================================================
const Flux: React.FC<SeqProps> = ({ p, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const A = { x: 250, y: 1330 };
  const B = { x: 800, y: 1330 };
  const depart = p.retour ? B : A;
  const arrivee = p.retour ? A : B;
  const u = interpolate(f, [16, Math.max(40, dur * 0.6)], [0, 1], { ...C, easing: io });
  const x = depart.x + (arrivee.x - depart.x) * u;
  const y = depart.y - 300 - Math.sin(u * Math.PI) * 260;
  const recu = ressort(f, fps, Math.max(40, dur * 0.6), { damping: 8, stiffness: 180 });
  return (
    <AbsoluteFill>
      <Sfx at={Math.max(40, dur * 0.6)} son="caisse" volume={0.45} />
      <Titre texte={p.titre} k={prog(f, 0, 10)} />
      <Svg>
        <Perso nom={p.de} x={A.x} y={A.y} s={p.de === "lustig" ? 560 : 400} f={f} extra={p.deExtra} />
        <Perso nom={p.vers} x={B.x} y={B.y} s={p.vers === "lustig" ? 560 : 400} f={f} extra={{ ...(p.versExtra || {}), expr: recu > 0.3 ? "content" : "malin", bras: u * 40 }} />
        {p.objet === "valise" ? <Valise x={x} y={y} s={110 + recu * 10} /> : <Sac x={x} y={y} s={100 + recu * 15} lettre={p.lettre || "$"} />}
      </Svg>
      {p.legendeA && (
        <div style={{ position: "absolute", top: 1360, left: A.x - 200, width: 400, textAlign: "center", opacity: prog(f, 6, 12), ...txt(44, JAUNE) }}>{p.legendeA}</div>
      )}
      {p.legendeB && (
        <div style={{ position: "absolute", top: 1360, left: B.x - 200, width: 400, textAlign: "center", opacity: prog(f, 6, 12), ...txt(44, CREME) }}>{p.legendeB}</div>
      )}
      {p.mot && (
        <Texte top={430} size={110} color={VERT} k={Math.min(1, recu * 1.4)} scale={recu}>
          {p.mot}
        </Texte>
      )}
    </AbsoluteFill>
  );
};

// ============================================================================================
// 14. BARRÉ — un mot barré en rouge, personnage tête basse.
// ============================================================================================
const Barre: React.FC<SeqProps> = ({ p, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const croix = ressort(f, fps, Math.round(dur * 0.4), { damping: 10, stiffness: 200 });
  return (
    <AbsoluteFill>
      <Sfx at={Math.round(dur * 0.4)} son="tampon" volume={0.5} />
      <Svg>
        <Perso nom={p.personnage || "poisson"} x={540} y={1250} s={330} f={f} extra={{ tete: interpolate(f, [10, 30], [0, 16], { ...C, easing: io }) }} />
      </Svg>
      {p.nom && (
        <div style={{ position: "absolute", top: 1290, width: "100%", textAlign: "center", ...txt(40, GRIS, 500, { letterSpacing: 6 }) }}>{p.nom}</div>
      )}
      <div style={{ position: "absolute", top: 420, width: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", ...txt(96, CREME, 700, { letterSpacing: 6 }) }}>
          {p.mot || "PLAINTE"}
          <svg width={560} height={160} style={{ position: "absolute", left: -40, top: -10 }}>
            <line x1={20} y1={20} x2={20 + 500 * croix} y2={20 + 120 * croix} stroke={ROUGE} strokeWidth={16} strokeLinecap="round" />
            <line x1={20} y1={140} x2={20 + 500 * croix} y2={140 - 120 * croix} stroke={ROUGE} strokeWidth={16} strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================================
// 15. TOUR EIFFEL — construction, rouille, démontage, étiquette « À VENDRE », gyrophare.
// ============================================================================================
const TourSeq: React.FC<SeqProps> = ({ p, dur, id }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = p.construire ? prog(f, 2, 40) : 1;
  const rouille = p.rouille ? prog(f, 10, 40) : 0;
  const casse = p.casse ? prog(f, dur * 0.5, dur * 0.4, (t) => t) : 0;
  const tagDebut = p.construire ? 44 : 8;
  const tag = p.etiquette ? ressort(f, fps, tagDebut, { damping: 6, stiffness: 90 }) : 0;
  const balance = f > tagDebut ? Math.sin((f - tagDebut) / 6) * 18 * Math.exp(-(f - tagDebut) / 30) : 0;
  return (
    <AbsoluteFill>
      {p.etiquette && <Sfx at={tagDebut} son="pop" volume={0.5} />}
      <Titre texte={p.titre} k={prog(f, 0, 10)} />
      <Svg>
        {p.police && <Gyrophare x={860} y={520} frame={f} s={120} />}
        <g transform={`translate(${p.x || 540} 1400)`}>
          <Tour id={`tour-${id}`} k={k} rouille={rouille} casse={casse} />
          {p.etiquette && <Etiquette x={44} y={-575} k={tag} balance={balance + 8} />}
        </g>
      </Svg>
      {p.legende && (
        <Texte top={p.legendeTop || 330} size={60} color={p.rouille ? "#E08A50" : CREME} k={prog(f, 12, 12)}>
          {p.legende}
        </Texte>
      )}
    </AbsoluteFill>
  );
};

// ============================================================================================
// 16. CHRONOLOGIE — les grandes dates.
// ============================================================================================
const Chronologie: React.FC<SeqProps> = ({ p, dur }) => {
  const f = useCurrentFrame();
  const dates: any[] = p.dates || [];
  const n = dates.length;
  const ligne = prog(f, 4, dur * 0.6, io);
  const H = p.hauteur || 920;
  return (
    <AbsoluteFill>
      <Titre texte={p.titre} k={prog(f, 0, 10)} />
      <Svg>
        <line x1={540} y1={420} x2={540} y2={420 + (H + 80) * ligne} stroke={JAUNE} strokeWidth={8} strokeLinecap="round" />
        {dates.map((_, i) => {
          const y = 460 + (H * i) / Math.max(1, n - 1);
          const atteint = ligne * (H + 80) + 420 >= y - 10;
          return <circle key={i} cx={540} cy={y} r={atteint ? 22 : 0} fill={i === n - 1 ? ROUGE : JAUNE} />;
        })}
      </Svg>
      {dates.map((d, i) => {
        const y = 460 + (H * i) / Math.max(1, n - 1);
        const k = interpolate(ligne * (H + 80) + 420, [y - 10, y + 40], [0, 1], C);
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", top: y - 40, left: 0, width: 470, textAlign: "right", opacity: k, ...txt(64, i === n - 1 ? ROUGE : JAUNE) }}>{d.an}</div>
            <div style={{ position: "absolute", top: y - 28, left: 610, width: 420, opacity: k, ...txt(40, CREME, 500) }}>{d.label}</div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// ============================================================================================
// 17. APPEL À L'ACTION — bulle de commentaire + abonnement.
// ============================================================================================
const Cta: React.FC<SeqProps> = ({ p }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bulle = ressort(f, fps, 6, { damping: 9, stiffness: 180 });
  const abo = ressort(f, fps, 50, { damping: 9, stiffness: 180 });
  return (
    <AbsoluteFill>
      <Sfx at={6} son="pop" volume={0.5} />
      <Sfx at={50} son="pop" volume={0.5} />
      <div style={{ position: "absolute", top: 480, left: 140, right: 140, transform: `scale(${bulle})`, transformOrigin: "20% 100%" }}>
        <div style={{ background: CREME, borderRadius: 40, padding: "50px 50px", boxShadow: "0 20px 40px rgba(0,0,0,.4)", ...txt(64, NUIT), textAlign: "center", lineHeight: 1.2 }}>
          {p.bulle || "✍️ Ton prochain dossier ?"}
        </div>
        <svg width={120} height={70} style={{ marginLeft: 120, display: "block" }}>
          <path d="M0 0 L120 0 L20 70 Z" fill={CREME} />
        </svg>
      </div>
      <div style={{ position: "absolute", top: 1020, width: "100%", display: "flex", justifyContent: "center", transform: `scale(${abo})` }}>
        <div style={{ background: ROUGE, borderRadius: 60, padding: "26px 70px", ...txt(58, "#FFFFFF"), boxShadow: "0 16px 30px rgba(0,0,0,.4)" }}>+ S'abonner</div>
      </div>
      <Texte top={1240} size={46} color={GRIS} k={prog(f, 60, 14)}>
        @dossiersclasses
      </Texte>
    </AbsoluteFill>
  );
};

// ============================================================================================
// 18. FIN — la pochette se referme, tampon « DOSSIER CLASSÉ ».
// ============================================================================================
const Fin: React.FC<SeqProps> = ({ p, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ferme = prog(f, 6, 24, io);
  const tamponA = Math.min(40, Math.round(dur * 0.55));
  return (
    <AbsoluteFill style={{ background: NUIT_NOIRE }}>
      <Sfx at={6} son="swoosh" volume={0.5} />
      <Sfx at={tamponA} son="tampon" volume={0.8} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 50% at 50% 45%, rgba(255,232,170,.14) 0%, rgba(0,0,0,0) 70%)" }} />
      <div style={{ position: "absolute", left: 60, top: 380, width: 960, height: 1180, background: `linear-gradient(160deg, ${KRAFT} 0%, ${KRAFT_FONCE} 100%)`, borderRadius: 14 }} />
      <div style={{ position: "absolute", left: 60, top: 342, width: 300, height: 60, background: KRAFT, borderRadius: "14px 14px 0 0" }} />
      <div style={{ position: "absolute", left: 60, top: 380, width: 960, height: 1180, perspective: 2200 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "left center",
            transform: `rotateY(${-178 * (1 - ferme)}deg)`,
            backfaceVisibility: "hidden",
            background: `linear-gradient(160deg, #D6B87A 0%, ${KRAFT} 100%)`,
            borderRadius: 14,
            boxShadow: "0 30px 60px rgba(0,0,0,.5)",
          }}
        >
          <div style={{ position: "absolute", left: 90, top: 140, fontFamily: "monospace", fontSize: 44, color: "#4A3618", lineHeight: 1.6 }}>
            {(p.etiquette || []).map((l: string, i: number) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        </div>
      </div>
      <Tampon texte={p.texte || "DOSSIER CLASSÉ"} k={ressort(f, fps, tamponA, { damping: 9, stiffness: 230 })} top={900} size={78} />
    </AbsoluteFill>
  );
};

// ============================================================================================
// Enchaînement : plusieurs séquences dans la même phrase (la durée est partagée).
// ============================================================================================
const Etapes: React.FC<SeqProps> = (props) => {
  const etapes: any[] = props.p.etapes || [];
  const poids = etapes.map((e) => e.poids || 1);
  const total = poids.reduce((a, b) => a + b, 0);
  let debut = 0;
  return (
    <>
      {etapes.map((e, i) => {
        const d = Math.round((props.dur * poids[i]) / total);
        const el = (
          <Sequence key={i} from={debut} durationInFrames={i === etapes.length - 1 ? props.dur - debut : d}>
            <Fondu dur={i === etapes.length - 1 ? props.dur - debut : d}>
              <RenduSequence {...props} p={e} dur={i === etapes.length - 1 ? props.dur - debut : d} mots={[]} id={`${props.id}-${i}`} />
            </Fondu>
          </Sequence>
        );
        debut += d;
        return el;
      })}
    </>
  );
};

/** Fondu enchaîné d'entrée et de sortie. */
export const Fondu: React.FC<{ dur: number; children: React.ReactNode; entree?: number; sortie?: number }> = ({ dur, children, entree = 6, sortie = 6 }) => {
  const f = useCurrentFrame();
  const o = Math.min(entree ? interpolate(f, [0, entree], [0, 1], C) : 1, sortie ? interpolate(f, [dur - sortie, dur], [1, 0], C) : 1);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const SEQUENCES: Record<string, React.FC<SeqProps>> = {
  pochette: Pochette,
  choc: Choc,
  generique: Generique,
  fiche: Fiche,
  scene: Scene,
  icones: Icones,
  carte: CarteTrajet,
  objet: Objet,
  compteur: Compteur,
  chiffre: Chiffre,
  document: Document,
  secret: Secret,
  flux: Flux,
  barre: Barre,
  tour: TourSeq,
  chronologie: Chronologie,
  cta: Cta,
  fin: Fin,
  etapes: Etapes,
  carte_med: CarteMed,
  pyramide: Pyramide,
  suite: Suite,
  courbe: Courbe,
  carte_monde: CarteMonde,
  suspects: Suspects,
};

export const RenduSequence: React.FC<SeqProps> = (props) => {
  const Comp = SEQUENCES[props.p?.type];
  if (!Comp)
    return (
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={txt(48, ROUGE)}>Séquence inconnue : {String(props.p?.type)}</div>
      </AbsoluteFill>
    );
  return <Comp {...props} />;
};
