# Dossiers Classés

Chaîne de récits animés d'affaires vraies et sourcées (TikTok d'abord).
Chaque épisode dure environ 3 minutes : accroche avec une vraie photo d'archive, générique, récit animé phrase par phrase, fin « DOSSIER CLASSÉ » et appel aux commentaires.

La vidéo est fabriquée par **GitHub Actions** avec **Remotion** (vidéo en code React). La voix vient d'**ElevenLabs** (ta voix « voix 4 dossiers classés »). Rien à installer sur ton Mac.

---

## 1. Installer le projet dans ton dépôt GitHub (une seule fois)

Ouvre le **Terminal** et copie les commandes **une par une**.

```bash
cd iCloud/Projets_IT
```
➜ Tu es dans ton dossier de projets.

```bash
git clone https://github.com/Boubashmd/dossiers-classes.git
```
➜ Un dossier `dossiers-classes` apparaît (avec le README créé sur GitHub).

```bash
unzip -o ~/Downloads/dossiers-classes.zip
```
➜ Les fichiers du zip se rangent dans le dossier `dossiers-classes` (réponds `A` si on te demande de remplacer le README).

```bash
cd dossiers-classes
```

```bash
git add .
```

```bash
git commit -m "Mise en place de la chaîne Dossiers Classés"
```
➜ Une liste de fichiers ajoutés s'affiche.

```bash
git push
```
➜ Le code part sur GitHub. Si on te demande un mot de passe, utilise ton jeton GitHub habituel (comme pour Flash Monde).

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
   Le zip contient la vidéo `.mp4` et `description.txt` (description TikTok, hashtags, commentaire à épingler).

💡 **Relancer ne recoûte rien** si le texte n'a pas changé : les voix déjà générées sont gardées en cache. Seules les phrases modifiées sont regénérées.

---

## 3. Publier sur TikTok

- Colle la description de `description.txt`.
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
| `objet` | La boîte à billets (apparition, billet, vue en coupe) | `mode` |
| `compteur` | Horloge ou jours qui défilent | `mode`, `valeur` |
| `chiffre` | Somme d'argent qui monte, option « × 2 » | `valeur`, `unite`, `x2`, `sous` |
| `document` | Coupure de presse, papier à en-tête, affiche, carte de visite | `genre`, `manchette`, `tampon` |
| `secret` | Cadenas + « chut » | `texte` |
| `flux` | Un sac ou une valise passe d'un personnage à l'autre | `de`, `vers`, `objet`, `retour`, `mot` |
| `barre` | Mot barré en rouge, personnage tête basse | `mot`, `personnage` |
| `tour` | Tour Eiffel (rouille, démontage, « À VENDRE », police) | `rouille`, `casse`, `etiquette`, `police` |
| `chronologie` | Les grandes dates | `dates[]` |
| `fin` | Le dossier se referme, tampon « DOSSIER CLASSÉ » | `etiquette` |
| `cta` | Bulle « Ton prochain dossier ? » + s'abonner | `bulle` |
| `etapes` | Plusieurs séquences dans une même phrase | `etapes[]` |

**Personnages** : `lustig`, `ferrailleur`, `poisson`, `passager`, `passagere`, `capone`, `shaw`, `agent`, `policier`, `victime`.
**Décors** : `maison`, `paquebot`, `hotel`, `prison`, `consignes`, `alcatraz`, `ville`, `bureau`.

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
