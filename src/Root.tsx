import React from "react";
import { Composition } from "remotion";
import { Episode, Timeline } from "./Episode";
import { Couverture, InfosCouverture } from "./Couverture";
import timeline from "./generated/timeline.json";

// La timeline est écrite par scripts/preparer.mjs (voix + calage de chaque phrase).
const t = timeline as unknown as Timeline & { couverture?: InfosCouverture };

const couvertureParDefaut: InfosCouverture = { titre: "DOSSIERS CLASSÉS", sous: "", photo: null, visage: { x: 0, y: 0 }, largeur: 540 };

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
  </>
);
