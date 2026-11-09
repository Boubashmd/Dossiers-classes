import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, CREME, GRIS, JAUNE, ROUGE, VERT, Titre, out, prog, txt } from "../theme";

// ============================================================================================
// BARRES — comparaison de 2 à 4 montants : les barres montent une à une, les chiffres défilent.
// Paramètres : titre, barres [{ label, valeur, sous?, couleur? }], unite (ex. "€ / mois" ou "%"),
// max (échelle, sinon la plus grande valeur), surligne (index de la barre mise en avant, les autres
// s'estompent), ecart { de, a, texte } (flèche jaune entre deux barres), legende (source, en bas).
// Couleurs : "jaune" (défaut), "rouge", "vert", "gris", "creme". Tout reste au-dessus de 1200 px.
// ============================================================================================
const COULEURS: Record<string, string> = { jaune: JAUNE, rouge: ROUGE, vert: VERT, gris: GRIS, creme: CREME };
const HAUT = 490; // haut de la zone des barres (au-dessus : titre et texte de l'écart)
const BAS = 1010; // ligne de base des barres

const nombre = (v: number) => Math.round(v).toLocaleString("fr-FR").replace(/[  ]/g, " ");

export const Barres: React.FC<{ p: any; dur: number }> = ({ p, dur }) => {
  const f = useCurrentFrame();
  const barres: { label: string; valeur: number; sous?: string; couleur?: string }[] = p.barres || [];
  const n = Math.max(1, barres.length);
  const max = p.max || Math.max(...barres.map((b) => b.valeur), 1);
  const largeur = n <= 2 ? 250 : n === 3 ? 220 : 180;
  const pas = Math.min(320, 900 / n);
  const x0 = 540 - (pas * (n - 1)) / 2; // centre de la première barre
  const debut = (i: number) => 6 + i * 10;
  const finBarres = debut(n - 1) + 24;
  const hauteur = (v: number) => ((BAS - HAUT) * v) / max;
  const unite = p.unite || "";
  const ecartK = p.ecart ? prog(f, Math.min(finBarres + 4, Math.max(8, dur - 26)), 14) : 0;

  return (
    <AbsoluteFill>
      <Titre texte={p.titre} k={prog(f, 0, 10)} />
      {barres.map((b, i) => {
        const k = interpolate(f, [debut(i), debut(i) + 24], [0, 1], { ...C, easing: out });
        const h = hauteur(b.valeur) * k;
        const cx = x0 + i * pas;
        const couleur = COULEURS[b.couleur || "jaune"] || JAUNE;
        const estompe = p.surligne !== undefined && p.surligne !== i ? 0.35 : 1;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute", left: cx - largeur / 2, top: BAS - h, width: largeur, height: h,
                background: couleur, opacity: estompe, borderRadius: "14px 14px 0 0",
                boxShadow: estompe === 1 ? "0 0 40px rgba(255,212,0,.18)" : "none",
              }}
            />
            <div style={{ position: "absolute", left: cx - 200, width: 400, top: BAS - h - 92, textAlign: "center", opacity: Math.min(1, k * 2) * estompe, ...txt(n >= 4 ? 54 : 64, CREME) }}>
              {nombre(b.valeur * k)}
              <span style={{ fontSize: n >= 4 ? 30 : 34, marginLeft: 6 }}>{unite}</span>
            </div>
            <div style={{ position: "absolute", left: cx - 170, width: 340, top: BAS + 18, textAlign: "center", opacity: prog(f, debut(i), 10) * estompe, lineHeight: 1.15, ...txt(n >= 4 ? 32 : 38, CREME) }}>
              {b.label}
              {b.sous && <div style={{ ...txt(n >= 4 ? 24 : 28, GRIS, 500), marginTop: 4 }}>{b.sous}</div>}
            </div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 60, right: 60, top: BAS, height: 4, background: "rgba(236,230,216,.35)" }} />
      {p.ecart && barres[p.ecart.de] && barres[p.ecart.a] && (() => {
        const xa = x0 + p.ecart.de * pas;
        const xb = x0 + p.ecart.a * pas;
        const ya = BAS - hauteur(barres[p.ecart.de].valeur);
        const yb = BAS - hauteur(barres[p.ecart.a].valeur);
        const haut = Math.min(ya, yb);
        const bas = Math.max(ya, yb);
        const xFleche = Math.abs(ya - yb) < 1 ? (xa + xb) / 2 : ya > yb ? xa : xb; // au-dessus de la barre la plus basse
        return (
          <>
            <div style={{ position: "absolute", left: Math.min(xa, xb), width: Math.abs(xb - xa), top: haut - 2, borderTop: `4px dashed ${JAUNE}`, opacity: ecartK }} />
            <div style={{ position: "absolute", left: xFleche - 3, width: 6, top: haut, height: (bas - haut - 110) * ecartK, background: JAUNE, opacity: ecartK }} />
            <div style={{ position: "absolute", left: 60, right: 60, top: 282, textAlign: "center", opacity: ecartK, transform: `scale(${0.85 + 0.15 * ecartK})`, ...txt(60, JAUNE, 700, { textShadow: "0 4px 18px rgba(0,0,0,.8)" }) }}>
              {p.ecart.texte}
            </div>
          </>
        );
      })()}
      {p.legende && (
        <div style={{ position: "absolute", left: 60, right: 60, top: 1150, textAlign: "center", opacity: prog(f, finBarres, 12), ...txt(28, GRIS, 500) }}>
          {p.legende}
        </div>
      )}
    </AbsoluteFill>
  );
};
