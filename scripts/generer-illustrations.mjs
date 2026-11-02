// Génère les illustrations d'un épisode avec l'API Gemini (modèle « Nano Banana »).
//
// Utilisation :
//   node scripts/generer-illustrations.mjs episodes/<id>.json            (génère les images manquantes)
//   node scripts/generer-illustrations.mjs episodes/<id>.json --refaire 03,05   (régénère certaines images)
//
// La clé se règle dans le Terminal (jamais dans un fichier du dépôt) :
//   export GEMINI_API_KEY="ta_cle"
// Coût : seule l'image d'accroche utilise le modèle cher (Nano Banana Pro, ~0,13 $).
// Toutes les autres utilisent Nano Banana simple (~0,04 $). Le modèle cher n'est jamais utilisé en secours.
// Pour changer (facultatif) : export MODELE_ACCROCHE="..."  /  export MODELE_IMAGE="..."
// Une séquence peut aussi forcer son modèle avec "modeleImage": "...".
//
// Dans le fichier de l'épisode :
//   "style": "phrase de style ajoutée à chaque prompt"
//   chaque séquence qui a une image ("image" ou "photo") peut avoir un "prompt".
// La première image générée sert ensuite de référence de style pour toutes les autres,
// sauf si le fichier indique "reference": "illustrations/.../xx.png" (image de style imposée).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// fileURLToPath : gère les espaces et accents du chemin (ex. « Mobile Documents », « Classés »)
const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fichier = process.argv[2];
if (!fichier) {
  console.error("Utilisation : node scripts/generer-illustrations.mjs episodes/<id>.json [--refaire 01,03]");
  process.exit(1);
}
const iRefaire = process.argv.indexOf("--refaire");
const refaire = iRefaire > 0 ? (process.argv[iRefaire + 1] || "").split(",") : [];

const cle = process.env.GEMINI_API_KEY;
if (!cle) {
  console.error('❌ Pas de clé. Tape d\'abord : export GEMINI_API_KEY="ta_cle"  (crée-la sur https://aistudio.google.com/apikey)');
  process.exit(1);
}
const MODELE_CHER = process.env.MODELE_ACCROCHE || "gemini-3-pro-image-preview";
const MODELE_SIMPLE = process.env.MODELE_IMAGE || "gemini-2.5-flash-image";

const episode = JSON.parse(fs.readFileSync(path.resolve(fichier), "utf8"));
const style = episode.style || "";

// Liste des images à produire : { chemin (dans public/), prompt, id }
const aFaire = [];
const vus = new Set();
for (const l of episode.lignes) {
  const s = l.sequence || {};
  const img = s.image || s.photo;
  if (!img || !s.prompt || vus.has(img)) continue;
  vus.add(img);
  const modeles = s.modeleImage ? [s.modeleImage] : s.type === "accroche" ? [MODELE_CHER, MODELE_SIMPLE] : [MODELE_SIMPLE];
  aFaire.push({ id: l.id, chemin: img, prompt: s.prompt, modeles });
}
if (!aFaire.length) {
  console.log("Aucune séquence avec un \"prompt\" dans cet épisode.");
  process.exit(0);
}

const enBase64 = (p) => fs.readFileSync(p).toString("base64");
// type réel lu dans les premiers octets (une image .jpg peut contenir du PNG si elle vient d'être générée)
const mimeDe = (p) => (fs.readFileSync(p).subarray(0, 4).toString("hex") === "89504e47" ? "image/png" : "image/jpeg");

async function generer(prompt, reference, modeles) {
  const parts = [];
  if (reference) {
    parts.push({ inlineData: { mimeType: mimeDe(reference), data: enBase64(reference) } });
    parts.push({ text: "Use exactly the same illustration style, colors and line work as the reference image, but a NEW subject: " });
  }
  parts.push({ text: `${prompt}\n\n${style}` });
  const corps = {
    contents: [{ role: "user", parts }],
    generationConfig: { responseModalities: ["TEXT", "IMAGE"], imageConfig: { aspectRatio: "9:16" } },
  };
  let derniereErreur = "";
  for (const modele of modeles) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modele}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": cle },
      body: JSON.stringify(corps),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      derniereErreur = `${modele} : ${res.status} ${json.error?.message || ""}`;
      continue; // on essaie le modèle suivant
    }
    const morceaux = json.candidates?.[0]?.content?.parts || [];
    const image = morceaux.find((m) => m.inlineData?.data);
    if (image) return { data: Buffer.from(image.inlineData.data, "base64"), modele };
    derniereErreur = `${modele} : pas d'image dans la réponse (${json.candidates?.[0]?.finishReason || "?"})`;
  }
  throw new Error(derniereErreur);
}

let reference = episode.reference ? path.join(RACINE, "public", episode.reference) : null;
if (reference && !fs.existsSync(reference)) {
  console.log(`⚠️  Image de référence introuvable (public/${episode.reference}) : je continue sans.`);
  reference = null;
}
const referenceImposee = !!reference;
let faites = 0;
for (const [i, t] of aFaire.entries()) {
  const dest = path.join(RACINE, "public", t.chemin);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const existe = fs.existsSync(dest);
  if (existe && !refaire.includes(t.id) && !refaire.includes(path.basename(dest, path.extname(dest)))) {
    console.log(`♻️  ${t.chemin} existe déjà`);
    if (i === 0 && !referenceImposee) reference = dest;
    continue;
  }
  process.stdout.write(`🎨 ${t.chemin} … `);
  try {
    const { data, modele } = await generer(t.prompt, referenceImposee || i > 0 ? reference : null, t.modeles);
    fs.writeFileSync(dest, data);
    console.log(`ok (${modele === MODELE_CHER ? "Pro, ~0,13 $" : "simple, ~0,04 $"})`);
    faites++;
    if (i === 0 && !referenceImposee) reference = dest;
  } catch (e) {
    console.log(`échec\n   ${e.message}`);
  }
}
console.log(`\n✅ ${faites} image(s) générée(s). Dossier : public/${path.dirname(aFaire[0].chemin)}`);
