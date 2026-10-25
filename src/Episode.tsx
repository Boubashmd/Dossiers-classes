import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, CREME, JAUNE, NUIT, NUIT2, Polices, txt } from "./theme";
import { Fondu, Mot, RenduSequence } from "./sequences";
import config from "../config.json";

export type Ligne = {
  id: string;
  debut: number; // image de départ
  duree: number; // nombre d'images jusqu'à la ligne suivante
  audio: string | null; // fichier de voix (dans public/)
  texte: string;
  mots: Mot[]; // horodatage des mots (secondes depuis le début de la ligne)
  sequence: any;
  sousTitres: boolean;
};

export type Timeline = { episode: string; fps: number; total: number; avecVoix: boolean; lignes: Ligne[] };

const CHEVAUCHEMENT = 6; // images de fondu enchaîné entre deux séquences

/** Sous-titres mot à mot (le mot prononcé passe en jaune). */
const SousTitres: React.FC<{ lignes: Ligne[] }> = ({ lignes }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l = lignes.find((x) => f >= x.debut && f < x.debut + x.duree);
  if (!l || !l.sousTitres || !l.texte) return null;
  const t = (f - l.debut) / fps;
  const mots = l.texte.split(" ");
  let idx = -1;
  l.mots.forEach((m, i) => {
    if (t >= m.t) idx = i;
  });
  const fin = l.mots.length ? l.mots[l.mots.length - 1].t + 0.6 : l.duree / fps;
  const o = interpolate(t, [0, 0.12, fin, fin + 0.25], [0, 1, 1, 0], C);
  // découpe en morceaux de 7 mots maximum pour rester lisible
  const taille = 7;
  const bloc = Math.max(0, Math.floor(Math.max(0, idx) / taille));
  const visibles = mots.slice(bloc * taille, bloc * taille + taille);
  return (
    <div
      style={{
        position: "absolute",
        top: 1590,
        left: 60,
        right: 60,
        textAlign: "center",
        opacity: o,
        lineHeight: 1.3,
        ...txt(56, CREME, 700, { textShadow: "0 4px 0 rgba(0,0,0,.65), 0 0 24px rgba(0,0,0,.6)" }),
      }}
    >
      {visibles.map((m, i) => {
        const j = bloc * taille + i;
        return (
          <span key={j} style={{ color: j === idx ? JAUNE : CREME, display: "inline-block", margin: "0 11px", transform: `scale(${j === idx ? 1.08 : 1})` }}>
            {m}
          </span>
        );
      })}
    </div>
  );
};

export const Episode: React.FC<{ timeline: Timeline }> = ({ timeline }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = 1 + 0.02 * ((f % 150) / 150);
  const fonduFin = interpolate(f, [durationInFrames - 15, durationInFrames], [1, 0], C);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${NUIT2} 0%, ${NUIT} 75%)` }}>
      <Polices />
      <Audio src={staticFile("son/musique.mp3")} volume={(config as any).volumes?.musique ?? 0.1} loop />
      <AbsoluteFill style={{ opacity: fonduFin }}>
        <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
          {timeline.lignes.map((l, i) => {
            const dernier = i === timeline.lignes.length - 1;
            const dur = l.duree + (dernier ? 0 : CHEVAUCHEMENT);
            return (
              <Sequence key={l.id} from={l.debut} durationInFrames={dur}>
                <Fondu dur={dur} entree={i === 0 ? 0 : CHEVAUCHEMENT} sortie={dernier ? 0 : CHEVAUCHEMENT}>
                  <RenduSequence p={l.sequence} dur={l.duree} texte={l.texte} mots={l.mots} id={l.id} />
                </Fondu>
              </Sequence>
            );
          })}
        </AbsoluteFill>
        {timeline.lignes.map((l) =>
          l.audio ? (
            <Sequence key={`a-${l.id}`} from={l.debut}>
              <Audio src={staticFile(l.audio)} />
            </Sequence>
          ) : null
        )}
        <SousTitres lignes={timeline.lignes} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(2,6,14,.7) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
