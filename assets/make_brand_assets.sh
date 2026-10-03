#!/usr/bin/env bash
# Builds the PNG brand pieces in assets/brand/ from the event site's own files:
#   - the stacked "python brasil" lockup, "em floripa" and "2026", which the site's
#     img/hero-principal.svg embeds as grayscale masks;
#   - the surfing witch, from assets/brand/surf.svg (the site's menu illustration);
#   - a pixelated hand-drawn circle in the style of the site's "pybr" mini logo;
#   - the typing wizard, traced to a vector from source/mago.pdf, whose drawing is a
#     raster too small to enlarge.
# Needs curl, python3, ImageMagick 7 (`magick`), poppler (`pdfimages`) and uv.
set -euo pipefail

BRAND="$(cd "$(dirname "$0")" && pwd)/brand"
WORK="$(mktemp -d)"
trap 'rm -r "$WORK"' EXIT

LIME="#B7FF06"
LIGHT_GREEN="#E8F4BA"
BLACK="#0F0F0F"

curl -sfL -o "$WORK/hero.svg" \
  https://raw.githubusercontent.com/pythonbrasil/pybr2026-site/main/img/hero-principal.svg

# The hero embeds each piece twice; the first copy of each is enough.
python3 - "$WORK" <<'EOF'
import base64, re, sys
work = sys.argv[1]
svg = open(f"{work}/hero.svg").read()
images = re.findall(r"data:image/png;base64,([A-Za-z0-9+/=\s]+)", svg)
for name, index in {"lockup": 4, "year": 5, "em-floripa": 6}.items():
    open(f"{work}/{name}-mask.png", "wb").write(base64.b64decode(images[index]))
EOF

# A grayscale mask becomes a one-color PNG whose opacity follows the mask.
tint() { magick "$1" -trim +repage -alpha copy -channel RGB -fill "$2" -colorize 100 +channel "$3"; }

tint "$WORK/lockup-mask.png" "$LIGHT_GREEN" "$BRAND/lockup-on-dark.png"
tint "$WORK/lockup-mask.png" "$BLACK" "$BRAND/lockup-on-light.png"
tint "$WORK/em-floripa-mask.png" "$LIME" "$BRAND/em-floripa-on-dark.png"
tint "$WORK/em-floripa-mask.png" "$BLACK" "$BRAND/em-floripa-on-light.png"
tint "$WORK/year-mask.png" "$LIME" "$BRAND/year-on-dark.png"
tint "$WORK/year-mask.png" "$BLACK" "$BRAND/year-on-light.png"

# Witch: one color per background, for watermarks and the footer.
magick -background none -density 300 "$BRAND/surf.svg" -trim +repage "$WORK/witch.png"
magick "$WORK/witch.png" -channel RGB -fill "$LIGHT_GREEN" -colorize 100 +channel "$BRAND/witch-light.png"
magick "$WORK/witch.png" -channel RGB -fill "$BLACK" -colorize 100 +channel "$BRAND/witch-dark.png"

# Witch sticker: the black witch on a lime silhouette grown around it, like the site's sticker.
magick "$WORK/witch.png" -bordercolor none -border 60 \
  \( +clone -alpha extract -morphology Dilate Disk:75 -background "$LIME" -alpha shape \) \
  +swap -compose over -composite "$BRAND/sticker-witch.png"

# Pixelated circle: drawn small without antialiasing, tilted, then enlarged with hard edges.
magick -size 64x34 xc:none +antialias -stroke "$LIME" -strokewidth 2 -fill none \
  -draw "ellipse 32,17 29,14 0,360" -background none -rotate -4 -trim +repage -bordercolor none -border 1 \
  -filter point -resize 1000% "$BRAND/pixel-circle.png"

# Wizard: the PDF holds one-color ink whose shape lives in the image's soft mask.
pdfimages -png "$BRAND/source/mago.pdf" "$WORK/mago"
magick "$WORK/mago-001.png" -trim +repage -resize 400% -blur 0x2 -threshold 50% "$WORK/mago-ink.png"
uv run -q --with potracer --with numpy --with pillow python - "$WORK/mago-ink.png" "$BRAND/mago.svg" <<'PY'
import sys
import numpy as np, potrace
from PIL import Image
ink, out = sys.argv[1:]
image = Image.open(ink).convert("L")
# potracer traces the False pixels, so the ink (white in the mask) goes in as False.
curves = potrace.Bitmap(np.array(image) < 128).trace(turdsize=8, alphamax=1.0, opticurve=True, opttolerance=0.4)
def point(p):
    return f"{p.x:.1f},{p.y:.1f}"
paths = []
for curve in curves:
    d = [f"M{point(curve.start_point)}"]
    for seg in curve.segments:
        if seg.is_corner:
            d.append(f"L{point(seg.c)}L{point(seg.end_point)}")
        else:
            d.append(f"C{point(seg.c1)} {point(seg.c2)} {point(seg.end_point)}")
    paths.append("".join(d) + "Z")
w, h = image.size
open(out, "w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">'
                     f'<path fill="#0F0F0F" fill-rule="evenodd" d="{" ".join(paths)}"/></svg>')
PY
magick -background none -density 150 "$BRAND/mago.svg" -resize 2400x "$BRAND/mago-dark.png"
# The ink is drawn for light paper, so on dark slides the wizard sits on a lime sticker.
magick "$BRAND/mago-dark.png" -bordercolor none -border 90 \
  \( +clone -alpha extract -morphology Close Disk:40 -morphology Dilate Disk:70 -background "$LIME" -alpha shape \) \
  +swap -compose over -composite "$BRAND/sticker-mago.png"

echo "brand pieces written to $BRAND"
