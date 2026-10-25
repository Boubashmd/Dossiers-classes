import React from "react";
import { Composition } from "remotion";
import { Episode, Timeline } from "./Episode";
import timeline from "./generated/timeline.json";

// La timeline est écrite par scripts/preparer.mjs (voix + calage de chaque phrase).
const t = timeline as unknown as Timeline;

export const Root: React.FC = () => (
  <Composition id="Episode" component={Episode} durationInFrames={Math.max(30, t.total)} fps={t.fps || 30} width={1080} height={1920} defaultProps={{ timeline: t }} />
);
