"""Dossiers Décryptés — étape 3 : logo final (piste B « le dossier qui regarde »).
Lancer : python3 scripts/logo/build_decryptes.py  -> fichiers SVG maîtres dans scripts/logo/out/ (à copier dans public/logo/ si besoin)
Besoin : pip install fonttools ; police public/polices/Poppins-Bold.ttf."""
import math, os
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out'); os.makedirs(OUT, exist_ok=True)
FONT = TTFont(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'public', 'polices', 'Poppins-Bold.ttf'))
GS, CMAP, UPM = FONT.getGlyphSet(), FONT.getBestCmap(), FONT['head'].unitsPerEm
CAP = FONT['OS/2'].sCapHeight / UPM

MOT, ACCENTS = 'DECRYPTES', (1, 7)   # tampon : DÉCRYPTÉS (les deux É portent l'accent-œil)
# Palette
NAVY, KRAFT, NUIT, JAUNE, CREME, ROUGE, NOIR, BLANC = ('#0B1626', '#C9A66B', '#050A12', '#FFD400',
                                                      '#ECE6D8', '#E6504A', '#111111', '#FFFFFF')
def f(v):
    s = f"{v:.2f}".rstrip('0').rstrip('.'); return '0' if s in ('-0', '') else s

def svg(body, w, h, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {f(w)} {f(h)}" width="{f(w)}" height="{f(h)}">'
            f'<title>{title}</title>{body}</svg>')

# ------------------------------------------------------------------ symbole
OY = -4   # centrage optique : le dossier remonte un peu au-dessus du centre géométrique

def folder(oy=OY):
    """Silhouette du dossier : un seul tracé, onglet avec pente à 45°, coins r12, raccords r4."""
    t = 4 * math.tan(math.radians(22.5)); c = t * math.cos(math.radians(45))
    y = lambda v: f(v + oy)
    return (f'M36 {y(64)} A12 12 0 0 1 48 {y(52)} H{f(98-t)} A4 4 0 0 1 {f(98+c)} {y(52+c)} '
            f'L{f(116-c)} {y(70-c)} A4 4 0 0 0 {f(116+t)} {y(70)} H208 A12 12 0 0 1 220 {y(82)} V{y(198)} '
            f'A12 12 0 0 1 208 {y(210)} H48 A12 12 0 0 1 36 {y(198)} Z')

def lens(l=56, r=200, cy=132, hh=22, oy=OY):
    """La fente en forme de paupière."""
    cy += oy; hw = (r - l) / 2; R = (hw * hw + hh * hh) / (2 * hh)
    return f'M{l} {f(cy)} A{f(R)} {f(R)} 0 0 1 {r} {f(cy)} A{f(R)} {f(R)} 0 0 1 {l} {f(cy)} Z'

def plisse(cx, top, w, d):
    """Oeil plissé (méfiant) : paupière droite en haut, arc en bas."""
    hw = w / 2; r = (hw * hw + d * d) / (2 * d)
    return f'M{f(cx-hw)} {f(top)} H{f(cx+hw)} A{f(r)} {f(r)} 0 0 1 {f(cx-hw)} {f(top)} Z'

def eyes(small=False, d=13, oy=OY):
    if small:
        return plisse(104, 124 + oy, 40, 20) + plisse(152, 124 + oy, 40, 20)
    return plisse(108, 126 + oy, 32, d) + plisse(148, 126 + oy, 32, d)

def symbol(mode='couleur', small=False, inverse=False):
    """mode 'couleur' : dossier kraft, fente nuit, yeux jaunes (pour fond bleu nuit).
       sinon mode = une couleur (#hex) : la fente est un vide (fill-rule evenodd)."""
    L = lens(48, 208, 132, 32) if small else lens()
    E = eyes(small, d=12 if inverse else 13)   # inversé : yeux un peu affinés (irradiation)
    if mode == 'couleur':
        return f'<path fill="{KRAFT}" d="{folder()}"/><path fill="{NUIT}" d="{L}"/><path fill="{JAUNE}" d="{E}"/>'
    return f'<path fill="{mode}" fill-rule="evenodd" d="{folder()} {L}"/><path fill="{mode}" d="{E}"/>'

# ------------------------------------------------------------------ texte
def text_path(txt, size, x, base, tracking=0.0):
    pen = SVGPathPen(GS); cx = 0.0; sc = size / UPM; xs = []
    for ch in txt:
        g = CMAP[ord(ch)]; xs.append((x + cx, GS[g].width * sc))
        GS[g].draw(TransformPen(pen, (sc, 0, 0, -sc, x + cx, base)))
        cx += GS[g].width * sc + tracking * size
    return pen.getCommands(), cx - tracking * size, xs

def accent_oeil(cx, cy, size):
    """L'accent du É dessiné comme un oeil en amande, incliné à 30° : le détail propre à la marque."""
    L, T = 0.30 * size, 0.11 * size; hw = L / 2; r = (hw * hw + (T / 2) ** 2) / T
    d = (f'M{f(cx-hw)} {f(cy)} A{f(r)} {f(r)} 0 0 1 {f(cx+hw)} {f(cy)} '
         f'A{f(r)} {f(r)} 0 0 1 {f(cx-hw)} {f(cy)} Z')
    return d, f'rotate(-30 {f(cx)} {f(cy)})'

def stamp(x, top, width, color, angle=-6, c_accent=None):
    """Tampon « CLASSÉS » : cadre arrondi (anneau) + texte, penché de 6°. Renvoie (svg, hauteur)."""
    k_txt = text_path(MOT, 1, 0, 0, 0.06)[1]; pad, ptop, pbot, ring = 0.30, 0.32, 0.24, 0.09
    size = width / (k_txt + 2 * pad + 2 * ring)
    capH = CAP * size; w = width; h = capH + (ptop + pbot) * size + 2 * ring * size   # ptop laisse la place de l'accent
    R, r = 0.20 * size, 0.12 * size; t = ring * size
    def rr(x0, y0, ww, hh, rad):
        return (f'M{f(x0+rad)} {f(y0)} H{f(x0+ww-rad)} A{f(rad)} {f(rad)} 0 0 1 {f(x0+ww)} {f(y0+rad)} V{f(y0+hh-rad)} '
                f'A{f(rad)} {f(rad)} 0 0 1 {f(x0+ww-rad)} {f(y0+hh)} H{f(x0+rad)} A{f(rad)} {f(rad)} 0 0 1 {f(x0)} {f(y0+hh-rad)} '
                f'V{f(y0+rad)} A{f(rad)} {f(rad)} 0 0 1 {f(x0+rad)} {f(y0)} Z')
    frame = rr(x, top, w, h, R) + ' ' + rr(x + t, top + t, w - 2 * t, h - 2 * t, r)
    base = top + h - t - pbot * size
    d, tw, xs = text_path(MOT, size, x + t + pad * size, base, 0.06)
    acc = ''
    for i in ACCENTS:                                # les É de DÉCRYPTÉS : deux accents-yeux
        ex, ew = xs[i]
        ad, atr = accent_oeil(ex + ew * 0.56, base - capH - 0.13 * size, size)
        acc += f'<path transform="{atr}" fill="{c_accent or color}" d="{ad}"/>'
    cx, cy = x + w / 2, top + h / 2
    body = (f'<g transform="rotate({angle} {f(cx)} {f(cy)})" fill="{color}">'
            f'<path fill-rule="evenodd" d="{frame}"/><path d="{d}"/>' + acc + '</g>')
    return body, h

def wordmark(x, top, c_dossiers, c_stamp, size=58, c_accent=None):
    """DOSSIERS au-dessus, tampon CLASSÉS en dessous, même largeur. Renvoie (svg, largeur, hauteur)."""
    capH = CAP * size
    d1, w1, _ = text_path('DOSSIERS', size, x, top + capH, 0.04)
    sb, sh = stamp(x + w1 * 0.02, top + capH + 0.44 * size, w1 * 0.96, c_stamp, c_accent=c_accent)
    return f'<path fill="{c_dossiers}" d="{d1}"/>' + sb, w1, capH + 0.44 * size + sh

# ------------------------------------------------------------------ assemblages
files = {}
SYM = 256
files['symbole-couleur'] = svg(symbol('couleur'), SYM, SYM, 'Dossiers Décryptés — symbole (couleur, sur fond sombre)')
files['symbole-noir'] = svg(symbol(NOIR), SYM, SYM, 'Dossiers Décryptés — symbole noir')
files['symbole-blanc'] = svg(symbol(BLANC, inverse=True), SYM, SYM, 'Dossiers Décryptés — symbole blanc')
files['symbole-bleu-nuit'] = svg(symbol(NAVY), SYM, SYM, 'Dossiers Décryptés — symbole bleu nuit (fond clair)')
files['symbole-petit-couleur'] = svg(symbol('couleur', small=True), SYM, SYM, 'Dossiers Décryptés — symbole petite taille (16-32 px)')
files['symbole-petit-noir'] = svg(symbol(NOIR, small=True), SYM, SYM, 'Dossiers Décryptés — symbole petite taille noir')
# Avatar rond (TikTok / YouTube) : symbole réduit pour respirer dans le cercle
files['avatar-rond'] = svg(f'<circle cx="128" cy="128" r="128" fill="{NAVY}"/>'
                           f'<g transform="translate(128 128) scale(0.84) translate(-128 -127)">{symbol("couleur")}</g>',
                           SYM, SYM, 'Dossiers Décryptés — avatar rond')

def horizontal(c_sym, c_d, c_s, bg=None, name='', c_a=None):
    x0 = 264; wm, w, h = wordmark(x0, 0, c_d, c_s, c_accent=c_a)
    top = 127 - h / 2                                  # centré sur le dossier (y 48 à 206)
    wm, w, h = wordmark(x0, top, c_d, c_s, c_accent=c_a)
    W = x0 + w + 24
    back = f'<rect width="{f(W)}" height="256" fill="{bg}"/>' if bg else ''
    return svg(back + symbol(c_sym) + wm, W, 256, name)

def vertical(c_sym, c_d, c_s, bg=None, name='', c_a=None):
    wm, w, h = wordmark(0, 0, c_d, c_s, size=52, c_accent=c_a)
    W = max(w + 64, 300); H = 222 + h + 36
    wm, w, h = wordmark((W - w) / 2, 222, c_d, c_s, size=52, c_accent=c_a)
    back = f'<rect width="{f(W)}" height="{f(H)}" fill="{bg}"/>' if bg else ''
    sym = f'<g transform="translate({f((W - 256) / 2)} -16)">{symbol(c_sym)}</g>'
    return svg(back + sym + wm, W, H, name)

files['horizontal-fond-sombre'] = horizontal('couleur', CREME, ROUGE, NAVY, 'Dossiers Décryptés — horizontal, fond sombre', JAUNE)
files['horizontal-fond-clair'] = horizontal(NAVY, NAVY, ROUGE, None, 'Dossiers Décryptés — horizontal, fond clair')
files['horizontal-noir'] = horizontal(NOIR, NOIR, NOIR, None, 'Dossiers Décryptés — horizontal, une couleur noir')
files['horizontal-blanc'] = horizontal(BLANC, BLANC, BLANC, None, 'Dossiers Décryptés — horizontal, une couleur blanc')
files['vertical-fond-sombre'] = vertical('couleur', CREME, ROUGE, NAVY, 'Dossiers Décryptés — vertical, fond sombre', JAUNE)
files['vertical-fond-clair'] = vertical(NAVY, NAVY, ROUGE, None, 'Dossiers Décryptés — vertical, fond clair')
wm, w, h = wordmark(16, 16, CREME, ROUGE, c_accent=JAUNE)
files['nom-seul-fond-sombre'] = svg(f'<rect width="{f(w+32)}" height="{f(h+40)}" fill="{NAVY}"/>' + wm, w + 32, h + 40,
                                    'Dossiers Décryptés — nom seul, fond sombre')
for k, s in files.items():
    open(os.path.join(OUT, k + '.svg'), 'w').write(s)
print('ok', len(files), 'fichiers')

# Versions transparentes pour Remotion (public/logo/) : même dessin que « fond sombre », sans le rectangle
extra = {
 'horizontal-couleur': horizontal('couleur', CREME, ROUGE, None, 'Dossiers Décryptés — horizontal, fond sombre', JAUNE),
 'vertical-couleur': vertical('couleur', CREME, ROUGE, None, 'Dossiers Décryptés — vertical, fond sombre', JAUNE),
}
for k, s in extra.items():
    open(os.path.join(OUT, k + '.svg'), 'w').write(s)
print('ok', len(extra), 'versions transparentes')
