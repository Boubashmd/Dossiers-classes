import React from "react";
import { Composition } from "remotion";
import { Episode, Timeline } from "./Episode";
import { Couverture, InfosCouverture } from "./Couverture";
import { Carrousel, InfosDiapo } from "./Carrousel";
import { Banniere, LogoPng, Profil } from "./Marque";
import timeline from "./generated/timeline.json";

// La timeline est écrite par scripts/preparer.mjs (voix + calage de chaque phrase).
const t = timeline as unknown as Timeline & { couverture?: InfosCouverture };

const couvertureParDefaut: InfosCouverture = { titre: "DOSSIERS DÉCRYPTÉS", sous: "", photo: null, visage: { x: 0, y: 0 }, largeur: 540 };

export const Root: React.FC = () => (
  <>
    <Composition id="Episode" component={Episode} durationInFrames={Math.max(30, t.total)} fps={t.fps || 30} width={1080} height={1920} defaultProps={{ timeline: t }} />
    <Composition
      id="Couverture"
      component={Couverture}
      durationInFrames={1}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ infos: t.couverture || couvertureParDefaut }}
    />
    {/* Carrousel TikTok : une diapo à la fois, fabriquées par scripts/carrousel.mjs */}
    <Composition
      id="Carrousel"
      component={Carrousel}
      durationInFrames={1}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ diapo: { grand: "DOSSIERS DÉCRYPTÉS", petit: "" }, index: 0, total: 1 } as InfosDiapo}
    />
    {/* Images de la marque (photo de profil, bannière, logos) : voir src/Marque.tsx */}
    <Composition id="Profil" component={Profil} durationInFrames={1} fps={30} width={1080} height={1080} />
    <Composition id="Banniere" component={Banniere} durationInFrames={1} fps={30} width={2560} height={1440} />
    <Composition id="LogoHorizontal" component={LogoPng} durationInFrames={1} fps={30} width={2000} height={900} defaultProps={{ fichier: "logo/horizontal-couleur.svg", largeur: 1700 }} />
    <Composition id="LogoVertical" component={LogoPng} durationInFrames={1} fps={30} width={1200} height={1400} defaultProps={{ fichier: "logo/vertical-couleur.svg", largeur: 1000 }} />
  </>
);
