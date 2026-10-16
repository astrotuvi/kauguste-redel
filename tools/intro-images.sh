#!/bin/sh
# Fetches the DSS2 colour images of the intro animation (intro.js) from the CDS hips2fits service
# into img/intro/, each 1280 × 720 px, north up and east left, in a gnomonic (TAN) projection.
# Run from the root of the repository: sh tools/intro-images.sh
#
#   file          object                        RA (deg)   Dec (deg)  field of view (width, deg)
#   plejaadid     Pleiades (M45)                 56.750     24.117    2.6
#   ngc6087       NGC 6087, S Nor near centre   244.712    -57.920    0.5
#   m101          M101, with SN 2011fe           210.802     54.349    0.75
set -e
cd "$(dirname "$0")/.."
mkdir -p img/intro

fetch() { # file ra dec fov
  curl -sSf -o "img/intro/$1.jpg" -G "https://alasky.cds.unistra.fr/hips-image-services/hips2fits" \
    --data-urlencode "hips=CDS/P/DSS2/color" --data-urlencode "format=jpg" \
    --data-urlencode "width=1280" --data-urlencode "height=720" --data-urlencode "projection=TAN" \
    --data-urlencode "ra=$2" --data-urlencode "dec=$3" --data-urlencode "fov=$4"
  echo "img/intro/$1.jpg: $(wc -c < "img/intro/$1.jpg") bytes"
}

fetch plejaadid 56.750 24.117 2.6
fetch ngc6087 244.712 -57.920 0.5
fetch m101 210.802 54.349 0.75
