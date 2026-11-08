#!/usr/bin/env python3
"""Convertit les documents sources d'un épisode en Markdown, pour les envoyer à Claude sans perdre de place.

Dépose tes documents (PDF de jugements, rapports, pages web enregistrées…) dans
    sources/<id-episode>/
puis lance (avec l'environnement Python dédié, PAS celui de Remotion) :
    ~/.venvs/dossiers-sources/bin/python scripts/sources-en-markdown.py <id-episode>
Chaque document donne un fichier .md à côté de lui (jugement.pdf -> jugement.md).

Options :
    --refaire   reconvertit tout, même les fichiers déjà à jour

Installation (une seule fois, Python 3.10 ou plus, dans un environnement à part) :
    curl -LsSf https://astral.sh/uv/install.sh | sh
    uv venv --python 3.12 ~/.venvs/dossiers-sources
    uv pip install --python ~/.venvs/dossiers-sources/bin/python "markitdown[pdf,docx,pptx,xlsx]==0.1.9"

Le dossier sources/ est dans .gitignore : ni les documents bruts ni leurs conversions ne vont sur GitHub.
"""
import argparse
import plistlib
import re
import sys
import tempfile
from datetime import date
from pathlib import Path

if sys.version_info < (3, 10):
    sys.exit("❌ Il faut Python 3.10 ou plus. Lance le script avec l'environnement dédié :\n"
             "   ~/.venvs/dossiers-sources/bin/python scripts/sources-en-markdown.py <id-episode>")

try:
    from markitdown import MarkItDown
    from importlib.metadata import version as _version
    VERSION_MARKITDOWN = _version("markitdown")
except ImportError:
    sys.exit("❌ MarkItDown n'est pas installé pour ce Python. Lance le script avec l'environnement dédié :\n"
             "   ~/.venvs/dossiers-sources/bin/python scripts/sources-en-markdown.py <id-episode>\n"
             "   (installation : voir les commandes en haut de ce fichier)")

RACINE = Path(__file__).resolve().parent.parent
SOURCES = RACINE / "sources"
MARQUEUR = "<!-- converti par scripts/sources-en-markdown.py -->"
# Formats lus par MarkItDown (+ .webarchive, le format « Archive web » de Safari, traité ici)
FORMATS = {".pdf", ".html", ".htm", ".xhtml", ".webarchive", ".docx", ".pptx", ".xlsx",
           ".csv", ".json", ".xml", ".txt", ".epub"}


def taille(n: int) -> str:
    for unite in ("o", "Ko", "Mo", "Go"):
        if n < 1024 or unite == "Go":
            return f"{n:.0f} {unite}" if unite == "o" else f"{n:.1f} {unite}".replace(".", ",")
        n /= 1024


def milliers(n: int) -> str:
    return f"{n:,}".replace(",", " ")


def nettoyer(texte: str) -> str:
    """Retire ce qui prend de la place sans rien dire : sauts de page, espaces en fin de ligne, lignes vides en série."""
    texte = texte.replace("\x0c", "\n\n").replace("\r\n", "\n")
    texte = "\n".join(ligne.rstrip() for ligne in texte.split("\n"))
    texte = re.sub(r"\n{3,}", "\n\n", texte)
    return texte.strip() + "\n"


def alleger_html(html: str | bytes, nom: str) -> Path:
    """Retire d'une page web enregistrée ce qui n'est jamais l'article (menus, pied de page, encadrés,
    formulaires, bandeaux de cookies…) et l'écrit dans un fichier temporaire pour MarkItDown."""
    from bs4 import BeautifulSoup  # installé avec MarkItDown
    soupe = BeautifulSoup(html, "html.parser")  # devine l'encodage de la page (utf-8, iso-8859-1…)
    for balise in soupe(["nav", "footer", "aside", "form", "noscript", "iframe", "svg", "button", "dialog"]):
        balise.decompose()
    for meta in soupe.find_all("meta"):  # le fichier temporaire est écrit en utf-8 : on le dit
        if meta.get("charset"):
            meta["charset"] = "utf-8"
        elif str(meta.get("http-equiv", "")).lower() == "content-type":
            meta["content"] = "text/html; charset=utf-8"
    tmp = Path(tempfile.mkdtemp()) / (nom + ".html")
    tmp.write_text(str(soupe), encoding="utf-8")
    return tmp


def lire_webarchive(fichier: Path) -> tuple[str, str | None]:
    """Extrait la page HTML principale d'une archive web Safari (format .webarchive)."""
    with fichier.open("rb") as f:
        archive = plistlib.load(f)
    principal = archive["WebMainResource"]
    encodage = principal.get("WebResourceTextEncodingName") or "utf-8"
    return principal["WebResourceData"].decode(encodage, errors="replace"), principal.get("WebResourceURL")


def url_enregistree(fichier: Path) -> str | None:
    """Les pages enregistrées par Chrome gardent leur adresse dans un commentaire « saved from url »."""
    debut = fichier.read_bytes()[:4000].decode("utf-8", errors="ignore")
    m = re.search(r"saved from url=\(\d+\)(\S+?)\s*-->", debut)
    return m.group(1) if m else None


def cible(fichier: Path, homonymes: set[str]) -> Path:
    """jugement.pdf -> jugement.md ; si deux documents ont le même nom (jugement.pdf + jugement.html)
    ou si un .md écrit à la main porte déjà ce nom, on garde l'extension : jugement.pdf.md."""
    simple = fichier.with_suffix(".md")
    if fichier.stem in homonymes or (simple.exists() and not est_genere(simple)):
        return fichier.with_name(fichier.name + ".md")
    return simple


def est_genere(md: Path) -> bool:
    try:
        with md.open(encoding="utf-8") as f:
            return f.readline().strip() == MARQUEUR
    except OSError:
        return False


def convertir_dossier(dossier: Path, refaire: bool, md: MarkItDown) -> tuple[int, int, int, int, int]:
    fichiers = sorted(p for p in dossier.iterdir() if p.is_file())
    a_convertir, ignores, icloud = [], [], []
    for p in fichiers:
        if p.name.startswith("."):
            if p.name.endswith(".icloud"):  # fichier resté dans le nuage, pas encore téléchargé sur le Mac
                icloud.append(p.name[1:-len(".icloud")])
            continue
        if p.suffix.lower() == ".md":
            continue
        (a_convertir if p.suffix.lower() in FORMATS else ignores).append(p)

    stems = [p.stem for p in a_convertir]
    homonymes = {s for s in stems if stems.count(s) > 1}
    convertis = a_jour = erreurs = 0
    tokens_total = 0

    for p in a_convertir:
        sortie = cible(p, homonymes)
        if not refaire and sortie.exists() and est_genere(sortie) and sortie.stat().st_mtime >= p.stat().st_mtime:
            print(f"♻️  {p.name} : déjà à jour ({sortie.name})")
            a_jour += 1
            tokens_total += len(sortie.read_text(encoding="utf-8")) // 4
            continue
        url, a_lire, tmp = None, p, None
        try:
            if p.suffix.lower() == ".webarchive":
                html, url = lire_webarchive(p)
                tmp = a_lire = alleger_html(html, p.stem)
            elif p.suffix.lower() in {".html", ".htm", ".xhtml"}:
                url = url_enregistree(p)
                tmp = a_lire = alleger_html(p.read_bytes(), p.stem)
            resultat = md.convert(str(a_lire))
            texte = nettoyer(getattr(resultat, "markdown", None) or resultat.text_content or "")
        except Exception as e:  # un document illisible ne doit pas bloquer les autres
            print(f"❌ {p.name} : conversion impossible ({type(e).__name__} : {str(e)[:160]})")
            erreurs += 1
            continue
        finally:
            if tmp:
                tmp.unlink(missing_ok=True)
                tmp.parent.rmdir()

        if len(re.sub(r"\s", "", texte)) < 100:
            print(f"⚠️  {p.name} : presque pas de texte, rien n'est écrit. PDF scanné (une image) ? "
                  "Envoie-le tel quel à Claude, qui sait lire les pages scannées.")
            erreurs += 1
            continue

        entete = [MARQUEUR, f"Source : {p.name} — converti le {date.today():%d/%m/%Y} (MarkItDown {VERSION_MARKITDOWN})"]
        if url:
            entete.append(f"URL d'origine : {url}")
        contenu = "\n".join(entete) + "\n\n" + texte
        sortie.write_text(contenu, encoding="utf-8")
        tokens = len(contenu) // 4
        tokens_total += tokens
        convertis += 1
        print(f"✅ {p.name} ({taille(p.stat().st_size)}) → {sortie.name} "
              f"({taille(sortie.stat().st_size)}, ≈ {milliers(tokens)} tokens)")

    for nom in icloud:
        print(f"⏳ {nom} est encore dans iCloud (pas téléchargé sur ce Mac) : ouvre le dossier dans le Finder, "
              "clique sur le petit nuage, puis relance.")
    for p in ignores:
        print(f"⏭️  {p.name} : format non pris en charge ({p.suffix or 'sans extension'}), ignoré.")
    return convertis, a_jour, len(ignores) + len(icloud), erreurs, tokens_total


def main() -> int:
    parser = argparse.ArgumentParser(description="Convertit sources/<id-episode>/ en fichiers Markdown (MarkItDown).")
    parser.add_argument("episodes", nargs="+", help="identifiant de l'épisode, ex. affaire-17-piaget")
    parser.add_argument("--refaire", action="store_true", help="reconvertit même les fichiers déjà à jour")
    args = parser.parse_args()

    md = MarkItDown(enable_plugins=False)
    code = 0
    for brut in args.episodes:
        # accepte aussi « sources/<id> » ou « episodes/<id>.json »
        ep = Path(brut.rstrip("/")).name.removesuffix(".json")
        dossier = SOURCES / ep
        print(f"\n📂 sources/{ep}/")
        if not dossier.is_dir():
            dossier.mkdir(parents=True)
            print("   Dossier créé. Dépose tes documents dedans (PDF, pages web, rapports…), puis relance la même commande.")
            continue
        convertis, a_jour, ignores, erreurs, tokens = convertir_dossier(dossier, args.refaire, md)
        if convertis + a_jour + ignores + erreurs == 0:
            print("   Dossier vide : dépose tes documents dedans, puis relance.")
            continue
        print(f"\n   Bilan : {convertis} converti(s), {a_jour} déjà à jour, {ignores} ignoré(s), {erreurs} problème(s).")
        print(f"   Total des .md de ce dossier : ≈ {milliers(tokens)} tokens à envoyer à Claude.")
        if erreurs:
            code = 1
    return code


if __name__ == "__main__":
    sys.exit(main())
