# Dossiers Décryptés (ex-Dossiers Classés)

Chaîne de récits animés d'affaires vraies et sourcées (TikTok d'abord).
Chaque épisode dure environ 3 minutes : accroche avec une vraie photo d'archive, générique, récit animé phrase par phrase, fin « DOSSIER DÉCRYPTÉ » et appel aux commentaires.

La vidéo est fabriquée par **GitHub Actions** avec **Remotion** (vidéo en code React). La voix vient d'**ElevenLabs** (ta voix « voix 4 dossiers classés »). Rien à installer sur ton Mac.

---

## 1. Installer une mise à jour (comme pour Flash Monde)

Chaque mise à jour arrive dans un zip `maj-xxx.zip`. Dépose-le **directement dans le dossier `Dossiers-Classés`**, puis dans le Terminal :

```bash
cd "iCloud/Projets_IT/Dossiers-Classés"
```

```bash
unzip -o maj-xxx.zip && ./maj-xxx.sh
```
➜ Le script récupère GitHub, copie les fichiers et n'envoie que ceux qui ont changé. Résultat attendu : `Termine : mise a jour en ligne.`

Les zips et les scripts `maj-*.sh` restent sur ton Mac : ils ne partent jamais sur GitHub.

> Le secret `ELEVENLABS_API_KEY` est déjà dans le dépôt : rien d'autre à configurer.

---

## 2. Fabriquer un épisode

1. Ouvre 👉 https://github.com/Boubashmd/dossiers-classes/actions
2. À gauche, clique sur **« Fabriquer un épisode »**.
3. À droite, clique sur **« Run workflow »**.
4. Laisse `affaire-01-lustig` et choisis :
   - **avec voix** → la vraie vidéo (≈ 3 000 crédits ElevenLabs la première fois),
   - **sans voix (aperçu gratuit)** → pour vérifier les animations sans dépenser de crédits.
5. Clique sur le bouton vert **« Run workflow »**.
6. Attends ~10 à 20 minutes (la pastille devient verte ✅).
7. Clique sur l'exécution, puis en bas, dans **Artifacts**, télécharge **affaire-01-lustig**.
   Le zip contient la vidéo `.mp4`, `couverture.png` (image de couverture à importer dans TikTok : « Modifier la couverture » > « Importer ») et `description.txt` (description TikTok, hashtags, commentaire à épingler).

💡 **Relancer ne recoûte rien** si le texte n'a pas changé : les voix déjà générées sont gardées en cache. Seules les phrases modifiées sont regénérées.

---

## 3. Publier sur TikTok

- Colle la description de `description.txt`.
- Importe `couverture.png` comme couverture.
- N'ajoute pas de texte TikTok par-dessus la vidéo : elle a déjà ses sous-titres (placés au-dessus de la zone cachée par TikTok).
- Épingle le commentaire proposé juste après la publication.
- Active l'étiquette **« Contenu généré par IA »**.
- Créneaux conseillés : **lundi 20 h · vendredi 19 h · dimanche 13 h**.

---

## 4. Créer un nouvel épisode

1. Claude écrit le script sourcé et le fichier `episodes/affaire-XX-nom.json` (une ligne = une phrase lue + son animation).
2. La photo d'archive (libre de droits) va dans `public/photos/`.
3. Tu envoies sur GitHub (`git add .`, `git commit -m "..."`, `git push`), puis tu lances l'action avec le nom du nouvel épisode.

### Les séquences disponibles

| Type | Ce que ça montre | Réglages principaux |
|---|---|---|
| `illustration` | Illustration générée (Gemini) en plein écran : apparition au trait, zoom lent, étiquettes reliées par un trait | `image`, `prompt`, `titre`, `focus`, `zoom`, `etiquettes` ; options `legende` (texte crème sous le titre), `heure` (vidéosurveillance : REC clignotant + horodatage + lignes de balayage), `tampon` (+ `tamponA`, `tamponTop`, `tamponTaille`) |
| `accroche` | **Ouverture recommandée (depuis l'épisode 10)** : photo plein écran + gros titre jaune visibles dès la 1re image, voix dès 0 s | `photo`, `titre`, `sous`, `couleur` (photo en couleurs), `visageY`, `titreTop`, `taille` |
| `pochette` | Ancienne ouverture : dossier qui s'ouvre sur la vraie photo (démarre lentement, déconseillée) | `photo`, `visage {x,y}`, `etiquette`, `legende` |
| `choc` | Phrase choc en jaune sur la photo assombrie | `photo`, `visage` |
| `generique` | Enquêteur dans l'ombre + « DOSSIERS DÉCRYPTÉS » | `sousTitre` |
| `fiche` | Personnage + nom + infos clés | `personnage`, `nom`, `infos[]` |
| `scene` | Décor + personnages + accessoires | `decor`, `personnages[]`, `tampon`, `legende`, `cartes`, `billets`, `corde`, `gyrophare`, `menottes` |
| `icones` | Bulles qui apparaissent une à une | `grand`, `items[]` |
| `carte` | Trajet en pointillés entre des lieux | `points[]`, `voyageur` (bateau, sac, avion) |
| `objet` | La boîte à billets (apparition, billet, vue en coupe), ou un objet dessiné | `mode`, ou `dessin` (mallette, flacon, photo, enveloppe, coupon, voiture, mallette_bombe, parachutes, cravate, perceuse, accordeon, radeau, tete, joconde, cadre_vide, malle, vitrine (option `vide`), couronne (option `abimee`), portable (écrans : alerte, rancon, fuite, graphique)) + `legende`, `tampon` |
| `compteur` | Horloge ou nombre qui défile | `mode`, `valeur`, `unite`, `milliers`, `taille` |
| `chiffre` | Somme d'argent qui monte, option « × 2 » | `valeur`, `unite`, `x2`, `sous` |
| `document` | Coupure de presse, papier à en-tête, affiche, carte de visite, lettre, rapport, télégramme, message codé, billet d'avion (`champs[]`) | `genre`, `manchette`, `entete`, `lignes[]` (« ■ » = ligne caviardée), `surligne[]`, `tampon` |
| `secret` | Cadenas (+ Lustig qui fait « chut » par défaut) | `texte`, `sous`, `personnage` (« aucun » pour le cadenas seul) |
| `flux` | Un sac ou une valise passe d'un personnage à l'autre | `de`, `vers`, `objet`, `retour`, `mot` |
| `barre` | Mot barré en rouge, personnage tête basse | `mot`, `personnage` |
| `tour` | Tour Eiffel (rouille, démontage, « À VENDRE », police) | `rouille`, `casse`, `etiquette`, `police` |
| `chronologie` | Les grandes dates | `dates[]` |
| `fin` | Le dossier se referme, tampon « DOSSIER DÉCRYPTÉ » (par défaut) | `etiquette` |
| `cta` | Bulle « Ton prochain dossier ? » + s'abonner | `bulle` |
| `carte_med` | Carte de l'Europe et de la Méditerranée (vrais contours) | `zones[]` (afrique, sicile, sardaigne, grece, espagne), `lieux[]` (nom, lon, lat, style : point, cible, barre), `fleches[]` (de, vers, label) |
| `pyramide` | L'argent des nouveaux remonte vers les anciens | `mode` (construit, grandit, vacille, ecroule, nom, duo), `etages`, `nom`, `tampon`, `gauche`/`droite` (duo) |
| `suite` | Fin de partie 1 : tampon « À SUIVRE », bulle, s'abonner | `annonce`, `bulle` |
| `courbe` | La Bourse en zigzag contre une ligne trop parfaite | `mode` (krach), `labelMarche`, `labelDroite`, `legende` |
| `carte_monde` | Planisphère simplifié, points qui s'allument | `points[]` (lon, lat, nom), `pas`, `fleches[]` (de, vers, couleur, pointilles) |
| `suspects` | Mur de silhouettes barrées une à une | `legende` |
| `etapes` | Plusieurs séquences dans une même phrase | `etapes[]` |

**Personnages** : `lustig`, `ferrailleur`, `poisson`, `passager`, `passagere`, `capone`, `shaw`, `agent`, `policier`, `victime`, `officier`, `soldat`, `pecheur`, `sansabri`, `employee`, `ponzi`, `madoff`, `markopolos`, `ombre`, `cooper`, `detenu`, `peruggia`, `apollinaire`, `picasso`, `marchand`. Option `cravate`. Option `rot` pour incliner un personnage.
**Décors** : `maison`, `paquebot`, `hotel`, `prison`, `consignes`, `alcatraz`, `ville`, `bureau`, `cote`, `sousmarin`, `derive`, `plage`, `tombe` (option `graver`), `banque` (option `enseigne`), `aeroport`, `cabine` (option `siege`), `piste`, `vol`, `cockpit`, `escalier`, `saut` (option `sac`), `fleuve`, `cellule` (options `perce`, `lit`), `couloir` (option `atelier`), `toit`, `baie` (option `radeau`), `salon` (options `joconde`, `vide`, `foule`), `chambre`, `facade` (Louvre côté Seine ; options `camion`, `deploie`, `nacelleHaute`, `ouvriers`, `brise`, `scooters`), `galerie` (galerie d'Apollon ; options `alarme`, `vides`), `parking` (parking souterrain filmé par une caméra ; options `motos`, `bijoux`, `vide`, `heure`).

**Ouverture d'un épisode (leçon des statistiques TikTok)** : la plupart des spectateurs décident à 0:01. Commencer par `accroche` (pas de générique au début), phrase 1 très courte et choc, une question ouverte dans les 10 premières secondes ; finir par une question à deux choix (« réponds 1 ou 2 »).

---

## 5. Réglages (`config.json`)

| Réglage | Rôle |
|---|---|
| `voix_nom` | Le programme cherche la voix dont le nom contient ce texte (« voix 4 ») |
| `modeles` | Modèles essayés dans l'ordre (v4, puis v3, puis Multilingual v2) |
| `reglages_voix` | Stabilité, similarité, style, vitesse |
| `pause_entre_phrases` | Silence entre deux phrases (secondes) |
| `hashtags_fixes` | Hashtags ajoutés à chaque description |

---

## 6. En cas de problème

| Message dans GitHub Actions | Solution |
|---|---|
| « Aucune voix dont le nom contient… » | La liste de tes voix est affichée juste en dessous : corrige `voix_nom` dans `config.json` |
| « Impossible de lire la liste des voix » | Ajoute le droit **Voices : Read** à la clé ElevenLabs |
| « Clé refusée » | Vérifie le secret `ELEVENLABS_API_KEY` et le droit **Text to Speech** |
| « Crédits épuisés ou plafond de la clé atteint » | Monte le plafond de la clé ou attends le renouvellement mensuel |

---

*Remotion est gratuit pour un particulier (licence entreprise au-delà de 3 personnes). Photos d'archive : uniquement libres de droits, créditées dans la description.*


### Photo d'archive : taille automatique
Si `srcW`, `srcH` ou `visage` ne sont pas indiqués, `preparer.mjs` lit la taille de la photo et place le visage au centre.


## Illustrations
`node scripts/generer-illustrations.mjs episodes/<id>.json` génère les images des séquences qui ont un `prompt` (clé `GEMINI_API_KEY`). Bibliothèque commune : `node scripts/generer-illustrations.mjs bibliotheque/commune.json` → `public/illustrations/commun/`.

## API publiques

On pioche les API dans le catalogue [public-apis](https://github.com/public-apis/public-apis#index) (milliers d'API gratuites, classées par thème). Beaucoup de lignes sont anciennes : une API listée peut être morte, devenue payante ou avoir changé d'adresse.

### Règles avant d'en brancher une

1. **Tester d'abord à la main** avec la commande `curl` du tableau. Résultat attendu : du texte JSON ou XML, pas une erreur ni une page vide.
2. **Lire la licence** : « données gratuites » ne veut pas dire « réutilisables sur une chaîne ». Images et sons : seulement domaine public, CC0, CC BY (avec crédit) ; jamais « NC » (non commercial) dès qu'une chaîne peut être monétisée.
3. **Clé éventuelle** : dans les secrets GitHub du dépôt et le `.env` du Mac, jamais dans le code ni dans la conversation.
4. **Toujours un repli** : si l'API ne répond pas, la fabrication continue sans elle (pas d'échec à cause d'un bonus).
5. **Citer la source** quand on montre une donnée ou une image.
6. Noter ici chaque API ajoutée, avec sa date et son état (`à brancher`, `branchée`, `abandonnée`).

### API retenues pour Dossiers Décryptés (06/11/2026, toutes « à brancher »)

| API | Clé | Sert à | Test |
|---|---|---|---|
| **Wikidata** (données CC0) | non | Dates, lieux et identités vérifiables pour croiser les 2 sources de chaque fait | `curl -s -A "DossiersClasses/1.0" "https://www.wikidata.org/w/api.php?action=wbsearchentities&search=Victor%20Lustig&language=fr&format=json"` |
| **Wikimedia Commons** | non | Vraies photos d'archive libres (domaine public, CC0, CC BY) pour l'accroche, avec l'auteur et la licence pour le crédit | `curl -s -A "DossiersClasses/1.0" "https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=Alcatraz%201962&srnamespace=6&srlimit=1&format=json"` |
| **Gallica** (BnF) | non | Journaux français d'époque pour les affaires françaises (collier de la reine, Joconde 1911…) : **sources** et lecture. Attention : réutiliser une image Gallica sur une chaîne monétisée demande une licence BnF, donc on s'en sert pour vérifier, pas pour illustrer | `curl -s "https://gallica.bnf.fr/SRU?operation=searchRetrieve&version=1.2&query=gallica%20all%20%22Lustig%22&maximumRecords=1" \| head -c 400` |
| **Library of Congress** (Chronicling America) | non | Journaux américains anciens (Ponzi, Cooper, Alcatraz) : sources et pages souvent du domaine public | `curl -s "https://www.loc.gov/collections/chronicling-america/?q=Ponzi&fo=json&c=1" \| head -c 400` |
| **Europeana** | gratuite ([demande ici](https://pro.europeana.eu/page/get-api)) | Archives européennes (Mata Hari, Garbo) ; toujours filtrer `reusability=open` | `curl -s "https://api.europeana.eu/record/v2/search.json?wskey=$EUROPEANA_API_KEY&query=Mata%20Hari&reusability=open&rows=1"` |

Si on branche Europeana : secret `EUROPEANA_API_KEY` à ajouter sur https://github.com/Boubashmd/dossiers-classes/settings/secrets/actions.
Rappel : une photo réelle ne montre jamais de scène macabre, et les règles TikTok de la fiche (mots sensibles, suspects non jugés) s'appliquent aussi aux images trouvées.
