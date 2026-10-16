"""Writes every logo file in public/brand from art.py and the lettering font.

    python3 -m venv .venv && .venv/bin/pip install fonttools uharfbuzz
    sh fetch-fonts.sh                     # the three Google Fonts (OFL), into ./fonts
    .venv/bin/python build.py rozha       # the lettering: rozha (chosen 16 Oct 2026), yatra or cinzel

The lettering is turned into paths, so no font is loaded to show the logo.
"""
import sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from art import mark, mark_with_car, icon_svg, ROYAL, MAROON, GOLD
from textpath import text_path

FONTS = {
    'yatra': (os.path.join(HERE, 'fonts/YatraOne-Regular.ttf'), 0),
    'rozha': (os.path.join(HERE, 'fonts/RozhaOne-Regular.ttf'), 0),
    'cinzel': (os.path.join(HERE, 'fonts/CinzelDecorative-Bold.ttf'), 0),
}
STAR = 'M 0 -9 C 1.5 -3 3 -1.5 9 0 C 3 1.5 1.5 3 0 9 C -1.5 3 -3 1.5 -9 0 C -3 -1.5 -1.5 -3 0 -9 Z'

def words(font, size1=104):
    """'Ghoomo' and 'Rajasthan', the second scaled so both read as one block."""
    path, _ = FONTS[font]
    d1, w1, b1 = text_path(path, 'Ghoomo', size1)
    _, w2, _ = text_path(path, 'Rajasthan', size1)
    size2 = size1 * min(1.0, (w1 * 1.18) / w2)
    d2, w2, b2 = text_path(path, 'Rajasthan', size2)
    return (d1, b1), (d2, b2)

def svg(vb, body, size=''):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}"{size} role="img">'
            f'<title>Ghoomo Rajasthan</title>{body}</svg>')

def placed(d, b, cx, top):
    """Translate a text path so its box is centred on cx with its top at `top`."""
    x0, y0, x1, y1 = b
    tx = cx - (x0 + x1) / 2
    ty = top - y0
    return tx, ty, (y1 - y0)

def full(font, one_colour=None):
    (d1, b1), (d2, b2) = words(font)
    W = max(b1[2] - b1[0], b2[2] - b2[0]) + 60
    K = 1.35  # the picture, larger than the words' natural size
    W = max(W, 200 * K + 40)
    cx = W / 2
    A = (236 if one_colour else 230) * K
    c1 = one_colour or ROYAL; c2 = one_colour or MAROON; cg = one_colour or GOLD
    if one_colour:
        art = (f'<g transform="translate({cx - 100 * K:.1f} 0) scale({K})">' + mono_mark(one_colour) + '</g>')
    else:
        art = f'<g transform="translate({cx - 100 * K:.1f} 0) scale({K})">{mark_with_car(FONTS[font][0])}</g>'
    t1x, t1y, h1 = placed(d1, b1, cx, A + 6)
    t2x, t2y, h2 = placed(d2, b2, cx, A + 6 + h1 + 26)
    star_y = A + 6 + h1 + 13
    H = A + 6 + h1 + 26 + h2 + 14
    body = (art +
            f'<path fill="{c1}" transform="translate({t1x:.1f} {t1y:.1f})" d="{d1}"/>'
            f'<path fill="{cg}" transform="translate({cx:.1f} {star_y:.1f})" d="{STAR}"/>'
            f'<path fill="{cg}" d="M {cx - 120:.1f} {star_y:.1f} H {cx - 16:.1f} M {cx + 16:.1f} {star_y:.1f} H {cx + 120:.1f}" stroke="{cg}" stroke-width="1.6"/>'
            f'<path fill="{c2}" transform="translate({t2x:.1f} {t2y:.1f})" d="{d2}"/>')
    return svg(f'0 0 {W:.0f} {H:.0f}', body), W, H

def mono_mark(c):
    """The full mark in one colour, drawn for it: the arch solid, the window open, the sun and
    the dunes as lines, the fort and the camel solid — so the picture still reads."""
    import art
    fort = art.fort(c).replace(f'fill="{art.SUN}" opacity=".75"', 'fill="none"').replace('opacity=".92"', '')
    inside = (f'<circle cx="100" cy="124" r="42" fill="none" stroke="{c}" stroke-width="3.5"/>'
              f'<g transform="translate(9 0)">{fort}</g>'
              f'<path fill="none" stroke="{c}" stroke-width="3.5" stroke-linecap="round" d="M 26 192 C 56 170 90 168 116 178 C 140 188 160 182 180 172"/>'
              f'<path fill="none" stroke="{c}" stroke-width="3.5" stroke-linecap="round" d="M 20 206 C 50 186 84 184 110 194 C 136 204 158 200 182 188"/>'
              + art.camel(50, 211, 0.6, c))
    cusps = art.cusps().replace(f'fill="{art.ROYAL}" stroke="{art.GOLD}"', f'fill="{c}" stroke="{c}"')
    return (f'<defs><clipPath id="win1"><path d="{art.INNER}"/></clipPath></defs>'
            f'<g clip-path="url(#win1)">{inside}</g>' + cusps +
            f'<path fill="{c}" fill-rule="evenodd" d="{art.OUTER} {art.INNER}"/>'
            f'<path fill="{c}" d="M 100 0 C 104 7 105 11 100 17 C 95 11 96 7 100 0 Z"/>'
            f'<rect x="20" y="211" width="160" height="7" rx="3.5" fill="{c}"/>')

def horizontal(font):
    (d1, b1), (d2, b2) = words(font, 64)
    # icon at left (scaled to 120 tall), words stacked at right
    s = 120 / 240
    tx0 = 200 * s + 18
    w = max(b1[2] - b1[0], b2[2] - b2[0])
    h1 = b1[3] - b1[1]; h2 = b2[3] - b2[1]
    total = h1 + 10 + h2
    top = (120 - total) / 2
    body = (f'<g transform="scale({s})">{mark(False)}</g>'
            f'<path fill="{ROYAL}" transform="translate({tx0 - b1[0]:.1f} {top - b1[1]:.1f})" d="{d1}"/>'
            f'<path fill="{MAROON}" transform="translate({tx0 - b2[0]:.1f} {top + h1 + 10 - b2[1]:.1f})" d="{d2}"/>')
    W = tx0 + w + 6
    return svg(f'0 0 {W:.0f} 120', body)

def write_all(out, font='rozha'):
    os.makedirs(out, exist_ok=True)
    open(f'{out}/logo-full.svg', 'w').write(full(font)[0])
    open(f'{out}/logo-horizontal.svg', 'w').write(horizontal(font))
    open(f'{out}/logo-icon.svg', 'w').write(icon_svg())
    open(f'{out}/logo-white.svg', 'w').write(full(font, '#FFFFFF')[0])
    open(f'{out}/logo-mono.svg', 'w').write(full(font, ROYAL)[0])


if __name__ == '__main__':
    font = sys.argv[1] if len(sys.argv) > 1 else 'rozha'
    brand = os.path.join(HERE, '../../public/brand')
    write_all(brand, font)
    os.makedirs(os.path.join(brand, 'options'), exist_ok=True)
    for f in FONTS:
        open(os.path.join(brand, f'options/full-{f}.svg'), 'w').write(full(f)[0])
        open(os.path.join(brand, f'options/horizontal-{f}.svg'), 'w').write(horizontal(f))
