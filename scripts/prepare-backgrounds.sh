#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p docs/previews
for source in backgrounds/*.webp; do
  name="$(basename "$source" .webp)"
  magick "$source" -resize 1280x720 -quality 85 "docs/previews/$name.jpg"
done
magick backgrounds/01-forest.webp -resize 1920x1080 preview.png
magick identify -format '%f %wx%h\n' backgrounds/*.webp
