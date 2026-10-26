# Dossiers Classés

Chaîne de récits animés d'affaires vraies et sourcées (TikTok d'abord).
Chaque épisode dure environ 3 minutes : accroche avec une vraie photo d'archive, générique, récit animé phrase par phrase, fin « DOSSIER CLASSÉ » et appel aux commentaires.

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
| `pochette` | Dossier qui s'ouvre sur la vraie photo, zoom sur le visage | `photo`, `visage {x,y}`, `etiquette`, `legende` |
| `choc` | Phrase choc en jaune sur la photo assombrie | `photo`, `visage` |
| `generique` | Enquêteur dans l'ombre + « DOSSIERS CLASSÉS » | `sousTitre` |
| `fiche` | Personnage + nom + infos clés | `personnage`, `nom`, `infos[]` |
| `scene` | Décor + personnages + accessoires | `decor`, `personnages[]`, `tampon`, `legende`, `cartes`, `billets`, `corde`, `gyrophare`, `menottes` |
| `icones` | Bulles qui apparaissent une à une | `grand`, `items[]` |
| `carte` | Trajet en pointillés entre des lieux | `points[]`, `voyageur` (bateau, sac) |
| `objet` | La boîte à billets (apparition, billet, vue en coupe), ou un objet dessiné | `mode`, ou `dessin` (mallette, flacon, photo, enveloppe, coupon, voiture) + `legende`, `tampon` |
| `compteur` | Horloge ou nombre qui défile | `mode`, `valeur`, `unite`, `milliers`, `taille` |
| `chiffre` | Somme d'argent qui monte, option « × 2 » | `valeur`, `unite`, `x2`, `sous` |
| `document` | Coupure de presse, papier à en-tête, affiche, carte de visite, lettre, rapport, télégramme, message codé | `genre`, `manchette`, `entete`, `lignes[]` (« ■ » = ligne caviardée), `surligne[]`, `tampon` |
| `secret` | Cadenas (+ Lustig qui fait « chut » par défaut) | `texte`, `sous`, `personnage` (« aucun » pour le cadenas seul) |
| `flux` | Un sac ou une valise passe d'un personnage à l'autre | `de`, `vers`, `objet`, `retour`, `mot` |
| `barre` | Mot barré en rouge, personnage tête basse | `mot`, `personnage` |
| `tour` | Tour Eiffel (rouille, démontage, « À VENDRE », police) | `rouille`, `casse`, `etiquette`, `police` |
| `chronologie` | Les grandes dates | `dates[]` |
| `fin` | Le dossier se referme, tampon « DOSSIER CLASSÉ » | `etiquette` |
| `cta` | Bulle « Ton prochain dossier ? » + s'abonner | `bulle` |
| `carte_med` | Carte de l'Europe et de la Méditerranée (vrais contours) | `zones[]` (afrique, sicile, sardaigne, grece, espagne), `lieux[]` (nom, lon, lat, style : point, cible, barre), `fleches[]` (de, vers, label) |
| `pyramide` | L'argent des nouveaux remonte vers les anciens | `mode` (construit, grandit, vacille, ecroule, nom, duo), `etages`, `nom`, `tampon`, `gauche`/`droite` (duo) |
| `suite` | Fin de partie 1 : tampon « À SUIVRE », bulle, s'abonner | `annonce`, `bulle` |
| `courbe` | La Bourse en zigzag contre une ligne trop parfaite | `mode` (krach), `labelMarche`, `labelDroite`, `legende` |
| `carte_monde` | Planisphère simplifié, points qui s'allument | `points[]` (lon, lat, nom), `pas` |
| `etapes` | Plusieurs séquences dans une même phrase | `etapes[]` |

**Personnages** : `lustig`, `ferrailleur`, `poisson`, `passager`, `passagere`, `capone`, `shaw`, `agent`, `policier`, `victime`, `officier`, `soldat`, `pecheur`, `sansabri`, `employee`, `ponzi`, `madoff`, `markopolos`, `ombre`. Option `rot` pour incliner un personnage.
**Décors** : `maison`, `paquebot`, `hotel`, `prison`, `consignes`, `alcatraz`, `ville`, `bureau`, `cote`, `sousmarin`, `derive`, `plage`, `tombe` (option `graver`), `banque` (option `enseigne`).

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
