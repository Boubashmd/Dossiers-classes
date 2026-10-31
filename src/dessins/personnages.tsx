import React from "react";
import { CREME, JAUNE, NOIR, PEAU } from "../theme";

const MANTEAU = "#7A3442";
const MANTEAU_OMBRE = "#5E2732";

/**
 * Victor Lustig : chapeau melon, long manteau bordeaux, moustache en guidon.
 * Repère : pieds en (0,0), hauteur ~610.
 */
export const Lustig: React.FC<{ frame: number; expr?: "malin" | "content" | "inquiet"; bras?: number; doigt?: number }> = ({
  frame,
  expr = "malin",
  bras = 0,
  doigt = 0,
}) => {
  const souffle = Math.sin(frame / 13) * 0.012;
  const cligne = frame % 97 < 4 ? 0.12 : 1;
  const tete = Math.sin(frame / 20) * 2;
  const ouvert = expr === "malin" ? 6 : 9;
  return (
    <g>
      <ellipse cx={0} cy={4} rx={120} ry={15} fill="rgba(0,0,0,.35)" />
      <rect x={-46} y={-150} width={38} height={146} rx={9} fill={NOIR} />
      <rect x={8} y={-150} width={38} height={146} rx={9} fill={NOIR} />
      <path d="M-58 0 Q-58 -20 -28 -20 L-8 -20 L-8 0 Z" fill="#0E1016" />
      <path d="M58 0 Q58 -20 28 -20 L8 -20 L8 0 Z" fill="#0E1016" />
      <g transform={`translate(0 -150) scale(1 ${1 + souffle}) translate(0 150)`}>
        <path d="M-100 -120 Q-104 -400 0 -410 Q104 -400 100 -120 Z" fill={MANTEAU} />
        <path d="M-26 -405 L0 -310 L26 -405 Z" fill={CREME} />
        <path d="M-8 -396 L8 -396 L6 -318 L0 -306 L-6 -318 Z" fill={NOIR} />
        <path d="M-26 -405 L-4 -300 L-54 -340 Z" fill={MANTEAU_OMBRE} />
        <path d="M26 -405 L4 -300 L54 -340 Z" fill={MANTEAU_OMBRE} />
        <line x1={0} y1={-300} x2={0} y2={-125} stroke={MANTEAU_OMBRE} strokeWidth={5} />
        <circle cx={-48} cy={-350} r={10} fill={JAUNE} />
        <g transform={`rotate(${-bras} 80 -390)`}>
          <path d="M80 -390 Q124 -330 118 -258" stroke={MANTEAU} strokeWidth={42} fill="none" strokeLinecap="round" />
          <circle cx={118} cy={-246} r={20} fill={PEAU} />
        </g>
        <g transform={`rotate(${tete} 0 -410)`}>
          <rect x={-17} y={-430} width={34} height={30} fill={PEAU} />
          <ellipse cx={0} cy={-482} rx={58} ry={68} fill={PEAU} />
          <ellipse cx={-57} cy={-478} rx={9} ry={15} fill={PEAU} />
          <ellipse cx={57} cy={-478} rx={9} ry={15} fill={PEAU} />
          <ellipse cx={-21} cy={-488} rx={7} ry={ouvert * cligne} fill={NOIR} />
          <ellipse cx={21} cy={-488} rx={7} ry={ouvert * cligne} fill={NOIR} />
          <path d={expr === "inquiet" ? "M-34 -508 L-10 -500" : "M-34 -504 L-10 -502"} stroke={NOIR} strokeWidth={5} strokeLinecap="round" />
          <path
            d={expr === "malin" ? "M34 -512 Q22 -514 10 -504" : expr === "inquiet" ? "M34 -508 L10 -500" : "M34 -506 L10 -504"}
            stroke={NOIR}
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
          />
          <path d="M-34 -452 Q-30 -466 0 -460 Q30 -466 34 -452 Q24 -458 0 -454 Q-24 -458 -34 -452 Z" fill={NOIR} />
          <path
            d={expr === "content" ? "M-18 -440 Q0 -424 18 -440" : expr === "inquiet" ? "M-14 -434 Q0 -444 14 -434" : "M-14 -440 Q4 -432 18 -444"}
            stroke={NOIR}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
          {expr === "inquiet" && <path d="M56 -520 Q48 -504 56 -498 Q64 -504 56 -520 Z" fill="#9FD3F5" />}
          <rect x={-76} y={-540} width={152} height={13} rx={6} fill={NOIR} />
          <path d="M-52 -534 Q-54 -606 0 -608 Q54 -606 52 -534 Z" fill={NOIR} />
          <rect x={-52} y={-548} width={104} height={10} fill={MANTEAU} />
        </g>
        <g transform={`rotate(${doigt * -138} -80 -390)`}>
          <path d="M-80 -390 Q-124 -330 -118 -258" stroke={MANTEAU} strokeWidth={42} fill="none" strokeLinecap="round" />
          <circle cx={-118} cy={-246} r={20} fill={PEAU} />
        </g>
      </g>
    </g>
  );
};

export type Chapeau = "casquette" | "fedora" | "melon" | "kepi" | "officier" | "casque" | "beret" | "canotier" | "cheveux" | "aucun";

export interface SilhouetteProps {
  x: number;
  y: number;
  s: number; // 100 = hauteur ~120 px
  couleur?: string;
  o?: number;
  tete?: number; // inclinaison de la tête (degrés)
  main?: number; // 0 -> 1 : lève une pancarte jaune
  chapeau?: Chapeau;
  ruban?: string; // couleur du ruban de chapeau
  cigare?: boolean;
  blouse?: boolean;
  lunettes?: boolean;
  badge?: boolean;
  rayures?: boolean;
  miroir?: boolean;
  cravate?: boolean; // cravate noire étroite
}

/** Silhouette générique (ferrailleur, passager, Capone, chimiste, agent…). Pieds en (0,0). */
export const Silhouette: React.FC<SilhouetteProps> = ({
  x,
  y,
  s,
  couleur = CREME,
  o = 1,
  tete = 0,
  main = 0,
  chapeau = "casquette",
  ruban,
  cigare,
  blouse,
  lunettes,
  badge,
  rayures,
  miroir,
  cravate,
}) => {
  const sombre = "rgba(11,22,38,.45)";
  return (
    <g transform={`translate(${x} ${y}) scale(${(miroir ? -1 : 1) * (s / 100)} ${s / 100})`} opacity={o}>
      <path d="M-38 0 V-32 Q-38 -60 0 -60 Q38 -60 38 -32 V0 Z" fill={couleur} />
      {rayures && [-24, -12, 0, 12, 24].map((rx) => <line key={rx} x1={rx} y1={-52} x2={rx} y2={0} stroke={sombre} strokeWidth={2} />)}
      {blouse && <path d="M-30 0 V-30 Q-30 -54 0 -54 Q30 -54 30 -30 V0 Z" fill="#FFFFFF" opacity={0.85} />}
      {cravate && (
        <g>
          <path d="M-9 -60 L0 -40 L9 -60 Z" fill="#FFFFFF" />
          <path d="M-3 -54 L3 -54 L6 -20 L0 -12 L-6 -20 Z" fill={NOIR} />
        </g>
      )}
      {badge && <path d="M-18 -42 l3 6 6 1 -4.5 4 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4 6 -1 Z" fill={JAUNE} />}
      <g transform={`rotate(${tete} 0 -62)`}>
        <circle cx={0} cy={-80} r={17} fill={couleur} />
        {lunettes && (
          <g stroke={NOIR} strokeWidth={2.4} fill="none">
            <circle cx={4} cy={-82} r={5} />
            <circle cx={15} cy={-82} r={5} />
          </g>
        )}
        {cigare && (
          <g>
            <rect x={12} y={-74} width={16} height={4} rx={2} fill="#8C6F3B" />
            <circle cx={29} cy={-72} r={2.6} fill="#FF8A3D" />
          </g>
        )}
        {chapeau === "casquette" && <path d="M-19 -86 Q-18 -104 2 -103 Q20 -102 20 -88 L34 -86 L34 -82 L-19 -82 Z" fill={couleur} />}
        {chapeau === "fedora" && (
          <g>
            <path d="M-32 -91 Q0 -97 32 -91 L32 -88 Q0 -93 -32 -88 Z" fill={couleur} />
            <path d="M-17 -91 Q-18 -112 -6 -114 Q0 -110 6 -114 Q18 -112 17 -91 Z" fill={couleur} />
            {ruban && <path d="M-17 -97 Q0 -100 17 -97 L17 -92 Q0 -95 -17 -92 Z" fill={ruban} />}
          </g>
        )}
        {chapeau === "melon" && (
          <g>
            <rect x={-26} y={-93} width={52} height={5} rx={2.5} fill={couleur} />
            <path d="M-17 -91 Q-18 -116 0 -117 Q18 -116 17 -91 Z" fill={couleur} />
          </g>
        )}
        {chapeau === "kepi" && (
          <g>
            <path d="M-17 -88 L-15 -106 L15 -106 L17 -88 Z" fill={couleur} />
            <path d="M0 -90 L30 -86 L30 -82 L0 -84 Z" fill={couleur} />
            <rect x={-15} y={-99} width={30} height={4} fill={ruban || JAUNE} />
          </g>
        )}
        {chapeau === "officier" && (
          <g>
            <path d="M-21 -93 Q0 -101 21 -93 L17 -86 L-17 -86 Z" fill={couleur} />
            <path d="M-17 -88 L-16 -95 L16 -95 L17 -88 Z" fill={couleur} />
            <rect x={-17} y={-91} width={34} height={4} fill={ruban || NOIR} />
            <path d="M2 -87 L28 -84 L26 -81 L2 -83 Z" fill={NOIR} />
          </g>
        )}
        {chapeau === "casque" && (
          <g>
            <path d="M-19 -84 Q-21 -106 0 -107 Q21 -106 19 -84 Z" fill={couleur} />
            <path d="M-24 -78 L-19 -88 L19 -88 L26 -78 Z" fill={couleur} />
            <path d="M-19 -88 L19 -88" stroke="rgba(11,22,38,.35)" strokeWidth={2} />
          </g>
        )}
        {chapeau === "canotier" && (
          <g>
            <rect x={-30} y={-93} width={60} height={5} rx={2.5} fill={ruban ? "#E9D9A6" : couleur} />
            <rect x={-18} y={-106} width={36} height={14} rx={2} fill="#E9D9A6" />
            <rect x={-18} y={-99} width={36} height={5} fill={ruban || NOIR} />
          </g>
        )}
        {chapeau === "cheveux" && <path d="M-18 -78 Q-22 -101 0 -101 Q22 -101 18 -78 Q16 -90 0 -91 Q-16 -90 -18 -78 Z" fill="#E4E4E4" />}
        {chapeau === "beret" && <ellipse cx={-2} cy={-95} rx={20} ry={8} fill={couleur} />}
      </g>
      {main > 0 && (
        <g opacity={main}>
          <line x1={30} y1={-40} x2={40} y2={-40 - 60 * main} stroke={couleur} strokeWidth={12} strokeLinecap="round" />
          <rect x={22} y={-40 - 60 * main - 40} width={36} height={30} rx={4} fill={JAUNE} />
        </g>
      )}
    </g>
  );
};

/** Personnages réutilisables : nom -> réglages de silhouette. */
export const PERSONNAGES: Record<string, Partial<SilhouetteProps>> = {
  ferrailleur: { chapeau: "casquette" },
  poisson: { chapeau: "casquette", couleur: JAUNE },
  passager: { chapeau: "fedora" },
  passagere: { chapeau: "aucun" },
  capone: { chapeau: "fedora", couleur: "#D9CBB0", ruban: NOIR, cigare: true, rayures: true },
  shaw: { chapeau: "aucun", blouse: true, lunettes: true },
  agent: { chapeau: "fedora", couleur: "#9AA8BD", ruban: NOIR, badge: true },
  policier: { chapeau: "kepi", couleur: "#9AA8BD" },
  victime: { chapeau: "fedora" },
  // Affaire nº 2 (Opération Mincemeat)
  officier: { chapeau: "officier", couleur: "#B9A57A", ruban: NOIR },
  soldat: { chapeau: "casque", couleur: "#8C9479" },
  pecheur: { chapeau: "beret", couleur: CREME },
  sansabri: { chapeau: "casquette", couleur: "#9AA0A8" },
  employee: { chapeau: "aucun", couleur: CREME },
  // Affaires nº 3 et 4 (Ponzi, Madoff)
  ponzi: { chapeau: "canotier", couleur: "#D9CBB0", ruban: NOIR },
  madoff: { chapeau: "cheveux", couleur: "#5E6E86" },
  markopolos: { chapeau: "aucun", couleur: "#9AA8BD", lunettes: true },
  peruggia: { chapeau: "aucun", couleur: "#9AA0A8", blouse: true },
  apollinaire: { chapeau: "melon", couleur: "#7F93AE" },
  picasso: { chapeau: "aucun", couleur: "#C9B48A", rayures: true },
  marchand: { chapeau: "fedora", couleur: "#9AA8BD", lunettes: true },
  detenu: { chapeau: "aucun", couleur: "#C9C2B2" },
  cooper: { chapeau: "aucun", couleur: "#5E6E86", lunettes: true, cravate: true },
  ombre: { chapeau: "fedora", couleur: "#22324A", ruban: "#22324A" },
};
