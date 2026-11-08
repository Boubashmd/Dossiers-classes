# Dossiers Décryptés — consignes pour Claude Code

Chaîne TikTok **Dossiers Décryptés** (ancien nom : Dossiers Classés, changé le 08/11/2026 ; identifiant @dossiersdecryptes) : récits animés d'affaires vraies et sourcées, et depuis le 08/11/2026 des « dossiers expliqués » (fonctionnement d'un système, fait de société : retraite, chômage…), toujours neutres et sourcés (sources officielles : COR, Cour des comptes, Unédic, INSEE, service-public.fr). En français. Vidéo fabriquée avec Remotion 4.0.300.
Ce dépôt est **séparé** de Flash Monde et de Kalia et Kouli : ne jamais toucher à ces projets.

## L'utilisateur
- Ingénieur IT débutant : lui donner les commandes une par une avec le résultat attendu.
- Ne jamais lui demander ses clés ou mots de passe (ElevenLabs : variable `ELEVENLABS_API_KEY`, qu'il règle lui-même).
- Répondre d'abord aux questions avant d'agir. Jamais `git add -A` : ajouter seulement les fichiers modifiés.
- Ne rien pousser sur GitHub sans son accord.

## Ligne éditoriale
- Faits établis, au moins 2 sources par fait ; tout fait non prouvé est attribué (« selon… »).
- Suspects non jugés : ne pas les nommer. Pas de mots sensibles écrits à l'écran (bombe, arme…), pas d'explication technique de piratage, ne jamais valoriser un criminel (modération TikTok).
- Illustrations : en test depuis le 02/11/2026, des illustrations générées par IA (style gravure blanche sur bleu nuit) ; jamais de fausses photos réalistes ni de visages reconnaissables.

## Illustrations (méthode hybride, depuis le 02/11/2026)
- Script : `node scripts/generer-illustrations.mjs <fichier.json> [--refaire id1,id2]` (clé `GEMINI_API_KEY` dans le Terminal, jamais dans un fichier). Il ne génère que les images manquantes.
- Coût : seule l'image d'**accroche** utilise le modèle Pro (~0,13 $) ; toutes les autres le modèle simple (~0,04 $). Budget visé : ~0,25–0,55 € par épisode.
- Par épisode : 1 accroche + **3 à 6 illustrations propres à l'histoire** (séquence `illustration` avec `prompt`). Tout le reste en séquences codées gratuites (compteur, document, tampon, carte, chronologie…).
- **Bibliothèque commune** à réutiliser avant de générer quoi que ce soit : `public/illustrations/commun/<nom>.jpg` (JPG qualité 85 pour alléger le dépôt ; image de style : `reference.jpg`) (liste et prompts dans `bibliotheque/commune.json`) :
  tribunal, marteau, cellule, barreaux, menottes, police, interrogatoire, commissariat, loupe, dossier, billets, lingots, coffre, hacker, ecoute, camera, avion, aeroport, mappemonde, paris, newyork, bourse, journaux, ombre, journalistes, banque, diamants, enveloppe, horloge, empreinte.
- Style imposé (champ `style` du JSON) + image de référence (`reference`) pour garder le même rendu. Jamais de visage reconnaissable, jamais de rendu photo.
- Séquence `illustration` : `image`, `titre`, `focus {x,y}` (%), `zoom [début, fin]`, `etiquettes [{texte, x, y, dx, dy}]` (x, y en % de l'écran) : vérifier visuellement leur position sur l'image. Options : `legende`, `heure` (effet vidéosurveillance, ex. « 19/10/2025 10:27 »), `tampon`.

## Format d'un épisode (`episodes/<id>.json`)
- Une ligne = une phrase lue + une séquence animée (`src/sequences/index.tsx`, liste dans `README.md`).
- Ouverture : séquence `accroche` (image + gros titre jaune dès la 1re image, phrase 1 très courte). Pas de générique au début.
- Fin : question à deux choix (« réponds 1 ou 2 ») + abonnement.
- Durée : 2 min 30 à 3 min. Zone sûre TikTok : rien d'important sous ~1200 px (sous-titres à 1250 px).
- Couleurs : bleu nuit #0B1626, crème #ECE6D8, jaune #FFD400, rouge #E6504A ; police Poppins.

## Logo (refonte du 07/11/2026 : « le dossier qui regarde »)
- Nom dessiné : DOSSIERS + tampon rouge DÉCRYPTÉS (les deux É portent l'accent en forme d'œil). Script qui redessine les SVG : `scripts/logo/build_decryptes.py` (besoin de fonttools). Images de marque (profil, bannière, logos PNG) : compositions `Profil`, `Banniere`, `LogoHorizontal`, `LogoVertical` (`src/Marque.tsx`).
- Fichiers dans `public/logo/` : `horizontal-couleur.svg`, `vertical-couleur.svg`, `symbole-couleur.svg`, `symbole-blanc.svg` (transparents, pour fond bleu nuit). Composants dans `src/Logo.tsx` : `Signature` (en-tête de l'accroche, de la couverture et du carrousel) et `Filigrane`.
- Filigrane : symbole blanc à 60 % en haut à gauche, de 1 s jusqu'à la séquence `cta`/`fin` (qui montre le logo). Désactivable avec `"filigrane": false` dans `config.json`. Jamais à droite ni en bas (boutons et légende TikTok).
- Ne pas retaper le nom avec une police, ne pas déformer ni recolorer le logo. Règles complètes : guide d'usage du kit du logo.

## Commandes
- Préparer sans voix : `node scripts/preparer.mjs episodes/<id>.json --sans-voix`
- Préparer avec voix : `node scripts/preparer.mjs episodes/<id>.json` (demande `ELEVENLABS_API_KEY`)
- Vidéo : `npx remotion render src/index.ts Episode sorties/<id>/<id>.mp4 --crf=20`
- Couverture : `npx remotion still src/index.ts Couverture sorties/<id>/couverture.png`
- Image d'un instant : `npx remotion still src/index.ts Episode sorties/test.png --frame=<n>`
- Studio (aperçu interactif) : `npm run studio`

## Fabrication en ligne
GitHub Actions « Fabriquer un épisode » (`.github/workflows/fabriquer-episode.yml`), entrée `episode` = id, « avec voix ».

## Livraison de la vidéo finale
Toujours dans un dossier `<id>/` à la **racine** du projet (comme `affaire-11-louvre-2/`), avec 3 fichiers : `<id>.mp4`, `couverture.png`, `description.txt`. Jamais dans `sorties/` ni dans un sous-dossier. Ces dossiers ne sont pas versionnés (ne pas les ajouter à git).
