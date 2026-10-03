#!/usr/bin/env bash
# Builds the PNG brand pieces in assets/brand/ from the event site's own files:
#   - the stacked "python brasil" lockup, "em floripa" and "2026", which the site's
#     img/hero-principal.svg embeds as grayscale masks;
#   - the surfing witch, from assets/brand/surf.svg (the site's menu illustration);
#   - a pixelated hand-drawn circle in the style of the site's "pybr" mini logo.
# Needs curl, python3 and ImageMagick 7 (`magick`).
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

echo "brand pieces written to $BRAND"
