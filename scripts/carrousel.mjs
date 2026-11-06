#!/usr/bin/env node
// Fabrique le carrousel TikTok d'un épisode à partir de sa section "carrousel" :
// une image JPG 1080 x 1920 par diapo (composition Remotion « Carrousel », src/Carrousel.tsx).
//
// Utilisation :
//   node scripts/carrousel.mjs episodes/affaire-15-cinq-affaires.json
//
// Résultat : sorties/<épisode>/carrousel/01.jpg, 02.jpg, …
// Chaque diapo : { "image": "illustrations/…jpg", "numero": "Nº 1" (facultatif), "grand": "TITRE JAUNE", "petit": "texte crème" }

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."); // gère espaces et accents du chemin

const fichier = process.argv[2];
if (!fichier) {
  console.log("Utilisation : node scripts/carrousel.mjs episodes/<épisode>.json");
  process.exit(1);
}
const episode = JSON.parse(fs.readFileSync(path.resolve(RACINE, fichier), "utf8"));
const diapos = episode.carrousel || [];
if (!diapos.length) {
  console.log(`❌ Pas de section "carrousel" dans ${fichier}.`);
  process.exit(1);
}

// vérifie les images avant de lancer le rendu
let manque = false;
for (const d of diapos) {
  if (d.image && !fs.existsSync(path.join(RACINE, "public", d.image))) {
    console.log(`❌ Image introuvable : public/${d.image}`);
    manque = true;
  }
}
if (manque) process.exit(1);

const dossier = path.join(RACINE, "sorties", episode.id, "carrousel");
fs.mkdirSync(dossier, { recursive: true });

console.log("📦 Préparation du rendu…");
const serveUrl = await bundle({ entryPoint: path.join(RACINE, "src", "index.ts") });

for (let i = 0; i < diapos.length; i++) {
  const inputProps = { diapo: diapos[i], index: i, total: diapos.length };
  const composition = await selectComposition({ serveUrl, id: "Carrousel", inputProps });
  const sortie = path.join(dossier, `${String(i + 1).padStart(2, "0")}.jpg`);
  await renderStill({ composition, serveUrl, output: sortie, inputProps, imageFormat: "jpeg", jpegQuality: 85 });
  console.log(`🖼️  ${path.relative(RACINE, sortie)} — ${diapos[i].grand}`);
}

console.log(`\n✅ ${diapos.length} image(s). Dossier : ${path.relative(RACINE, dossier)}`);
