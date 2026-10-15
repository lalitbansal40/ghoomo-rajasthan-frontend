#!/bin/sh
# The three candidate lettering fonts, from Google Fonts' own repository (all SIL OFL 1.1).
set -e
cd "$(dirname "$0")" && mkdir -p fonts
for f in ofl/yatraone/YatraOne-Regular.ttf ofl/rozhaone/RozhaOne-Regular.ttf ofl/cinzeldecorative/CinzelDecorative-Bold.ttf; do
  curl -sfL -o "fonts/$(basename "$f")" "https://github.com/google/fonts/raw/main/$f"
done
ls -la fonts
