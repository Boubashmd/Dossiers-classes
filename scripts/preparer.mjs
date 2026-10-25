#!/usr/bin/env node
// Prépare un épisode avant la fabrication de la vidéo :
//  1. trouve ta voix ElevenLabs par son nom (config.json -> voix_nom),
//  2. génère la narration phrase par phrase (avec l'horodatage de chaque mot),
//  3. calcule le calage de chaque séquence -> src/generated/timeline.json,
//  4. écrit la description TikTok -> sorties/<épisode>/description.txt
//
// Utilisation :
//   node scripts/preparer.mjs episodes/affaire-01-lustig.json            (avec la voix, clé dans ELEVENLABS_API_KEY)
//   node scripts/preparer.mjs episodes/affaire-01-lustig.json --sans-voix (aperçu gratuit, durées estimées)
//
// Les voix déjà générées sont gardées dans public/voix/ : relancer ne recoûte rien si le texte n'a pas changé.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const RACINE = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const API = "https://api.elevenlabs.io";
const FPS = 30;

const args = process.argv.slice(2);
const fichierEpisode = args.find((a) => !a.startsWith("--"));
const sansVoix = args.includes("--sans-voix");
if (!fichierEpisode) {
  console.error("❌ Indique le fichier de l'épisode, par exemple : node scripts/preparer.mjs episodes/affaire-01-lustig.json");
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(path.join(RACINE, "config.json"), "utf8"));
const episode = JSON.parse(fs.readFileSync(path.resolve(fichierEpisode), "utf8"));
const cle = process.env.ELEVENLABS_API_KEY;

const normaliser = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

async function appel(url, options = {}) {
  const r = await fetch(url, { ...options, headers: { "xi-api-key": cle, ...(options.headers || {}) } });
  return r;
}

async function trouverVoix() {
  const r = await appel(`${API}/v1/voices`);
  if (!r.ok) {
    console.error(`❌ Impossible de lire la liste des voix (code ${r.status}). La clé a-t-elle le droit « Voices : Read » ?`);
    console.error(await r.text());
    process.exit(1);
  }
  const { voices } = await r.json();
  const cherche = normaliser(config.voix_nom);
  const trouvee = voices.find((v) => normaliser(v.name).includes(cherche));
  if (!trouvee) {
    console.error(`❌ Aucune voix dont le nom contient « ${config.voix_nom} ». Voix disponibles :`);
    voices.forEach((v) => console.error(`   - ${v.name}  (${v.voice_id})`));
    process.exit(1);
  }
  console.log(`🎙️  Voix trouvée : « ${trouvee.name} » (identifiant ${trouvee.voice_id})`);
  return trouvee.voice_id;
}

/** Transforme l'horodatage par caractère d'ElevenLabs en horodatage par mot. */
function motsDepuisAlignement(texte, al) {
  const mots = [];
  const chars = al.characters || [];
  const debuts = al.character_start_times_seconds || [];
  let enMot = false;
  let courant = "";
  let t0 = 0;
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (/\s/.test(c)) {
      if (enMot) mots.push({ t: t0, m: courant });
      enMot = false;
      courant = "";
    } else {
      if (!enMot) {
        t0 = debuts[i] ?? 0;
        enMot = true;
      }
      courant += c;
    }
  }
  if (enMot) mots.push({ t: t0, m: courant });
  return mots;
}

/** Horodatage estimé (proportionnel aux caractères) quand on n'a pas l'alignement. */
function motsEstimes(texte, duree) {
  const mots = texte.split(" ").filter(Boolean);
  const total = mots.reduce((a, m) => a + m.length + 1, 0);
  let pos = 0;
  return mots.map((m) => {
    const t = (pos / total) * duree * 0.96;
    pos += m.length + 1;
    return { t: Math.round(t * 1000) / 1000, m };
  });
}

let modeleRetenu = null;

async function genererPhrase(voiceId, texte) {
  const reglages = config.reglages_voix;
  const modeles = modeleRetenu ? [modeleRetenu] : config.modeles;
  for (const modele of modeles) {
    for (const avecLangue of [true, false]) {
      const corps = { text: texte, model_id: modele, voice_settings: reglages };
      if (avecLangue && config.langue) corps.language_code = config.langue;
      // 1er essai : avec l'horodatage des mots
      let r = await appel(`${API}/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corps),
      });
      if (r.ok) {
        const j = await r.json();
        const audio = Buffer.from(j.audio_base64, "base64");
        const al = j.alignment || j.normalized_alignment;
        const fins = al?.character_end_times_seconds || [];
        const duree = fins.length ? fins[fins.length - 1] : (audio.length * 8) / 128000;
        if (!modeleRetenu) console.log(`   modèle utilisé : ${modele}${avecLangue ? " (langue forcée : " + config.langue + ")" : ""}`);
        modeleRetenu = modele;
        return { audio, duree, mots: al ? motsDepuisAlignement(texte, al) : motsEstimes(texte, duree) };
      }
      const erreur = await r.text();
      if (r.status === 401 || r.status === 403) {
        if (/quota|credits/i.test(erreur)) {
          console.error("❌ Crédits épuisés ou plafond de la clé atteint.");
        } else {
          console.error("❌ Clé refusée. Vérifie le secret ELEVENLABS_API_KEY et le droit « Text to Speech ».");
        }
        console.error(erreur);
        process.exit(1);
      }
      // 2e essai : sans horodatage (certains modèles ne le proposent pas)
      r = await appel(`${API}/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corps),
      });
      if (r.ok) {
        const audio = Buffer.from(await r.arrayBuffer());
        const duree = (audio.length * 8) / 128000;
        if (!modeleRetenu) console.log(`   modèle utilisé : ${modele} (sans horodatage, mots estimés)`);
        modeleRetenu = modele;
        return { audio, duree, mots: motsEstimes(texte, duree) };
      }
      console.log(`   (modèle ${modele}${avecLangue ? " + langue" : ""} refusé : ${r.status}, essai suivant)`);
    }
  }
  console.error("❌ Aucun modèle n'a fonctionné. Vérifie config.json -> modeles.");
  process.exit(1);
}

async function main() {
  const voiceId = sansVoix ? null : cle ? await trouverVoix() : null;
  if (!sansVoix && !cle) {
    console.error("❌ Pas de clé ElevenLabs (variable ELEVENLABS_API_KEY). Pour un aperçu sans voix : ajoute --sans-voix");
    process.exit(1);
  }
  fs.mkdirSync(path.join(RACINE, "public/voix"), { recursive: true });
  const lignes = [];
  let debut = 0;
  let caracteres = 0;
  for (const l of episode.lignes) {
    const type = l.sequence?.type;
    let duree = 0;
    let audio = null;
    let mots = [];
    if (l.texte) {
      if (sansVoix) {
        const n = l.texte.split(" ").length;
        duree = n / config.mots_par_seconde_sans_voix + 0.2;
        mots = motsEstimes(l.texte, duree);
      } else {
        const empreinte = crypto
          .createHash("sha1")
          .update([l.texte, voiceId, config.modeles.join(","), JSON.stringify(config.reglages_voix), config.langue].join("|"))
          .digest("hex")
          .slice(0, 16);
        const fMp3 = path.join(RACINE, "public/voix", `${empreinte}.mp3`);
        const fJson = path.join(RACINE, "public/voix", `${empreinte}.json`);
        if (fs.existsSync(fMp3) && fs.existsSync(fJson)) {
          ({ duree, mots } = JSON.parse(fs.readFileSync(fJson, "utf8")));
          console.log(`♻️  ${l.id} déjà généré`);
        } else {
          console.log(`🗣️  ${l.id} : ${l.texte.slice(0, 60)}…`);
          const res = await genererPhrase(voiceId, l.texte);
          fs.writeFileSync(fMp3, res.audio);
          fs.writeFileSync(fJson, JSON.stringify({ duree: res.duree, mots: res.mots }));
          duree = res.duree;
          mots = res.mots;
          caracteres += l.texte.length;
        }
        audio = `voix/${empreinte}.mp3`;
      }
    }
    const min = l.duree ?? config.durees_minimales[type] ?? 0;
    const total = Math.max(duree + config.pause_entre_phrases, min);
    const frames = Math.ceil(total * FPS);
    lignes.push({
      id: l.id,
      debut,
      duree: frames,
      audio,
      texte: l.texte || "",
      mots,
      sequence: l.sequence,
      sousTitres: l.sousTitres !== false,
    });
    debut += frames;
  }
  const timeline = { episode: episode.id, fps: FPS, total: debut + 15, avecVoix: !sansVoix, lignes };
  fs.mkdirSync(path.join(RACINE, "src/generated"), { recursive: true });
  fs.writeFileSync(path.join(RACINE, "src/generated/timeline.json"), JSON.stringify(timeline, null, 1));

  // Description TikTok prête à copier
  const pub = episode.publication || {};
  const hashtags = [...(config.hashtags_fixes || []), ...(pub.hashtags_episode || [])].join(" ");
  const description = [
    pub.accroche || episode.titre,
    `Affaire nº ${episode.numero} · ${episode.personnage}`,
    "",
    pub.sources ? `Sources : ${pub.sources}` : "",
    episode.photo?.credit || "",
    "",
    hashtags,
  ]
    .filter((x, i, a) => !(x === "" && a[i - 1] === ""))
    .join("\n");
  const dossierSortie = path.join(RACINE, "sorties", episode.id);
  fs.mkdirSync(dossierSortie, { recursive: true });
  fs.writeFileSync(
    path.join(dossierSortie, "description.txt"),
    `${description}\n\n--- Commentaire à épingler ---\n${pub.commentaire_epingle || ""}\n\n--- Rappel ---\nActive l'étiquette « Contenu généré par IA » à la publication.\n`
  );

  const secondes = (debut + 15) / FPS;
  console.log(`\n✅ Épisode prêt : ${lignes.length} séquences, durée ${Math.floor(secondes / 60)} min ${Math.round(secondes % 60)} s`);
  if (!sansVoix) console.log(`   Caractères envoyés à ElevenLabs cette fois-ci : ${caracteres} (≈ autant de crédits)`);
  console.log(`   Description : sorties/${episode.id}/description.txt`);
}

main().catch((e) => {
  console.error("❌ Erreur inattendue :", e);
  process.exit(1);
});
