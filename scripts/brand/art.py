"""The Ghoomo Rajasthan mark, drawn by hand as SVG. Coordinates in a 200 x 240 box."""
ROYAL, MAROON, GOLD, SUN, SUN_L, SAND, IVORY = '#1E3A7B', '#8E1B1B', '#E0A93B', '#F5A623', '#FFD27A', '#F3D9A4', '#FBF7EF'
DUNE_D = '#E8A93A'
CAMEL_DARK = '#6B1212'

def f(v):
    s = ('%.1f' % v).rstrip('0').rstrip('.')
    return s

def ogee(cx, base, ys, ya, W):
    """A pointed (ogee-tipped) arch: straight sides from base to ys, apex at ya."""
    h = ys - ya
    L = lambda x, y: f(x) + ' ' + f(y)
    return ('M ' + L(cx - W, base) + ' L ' + L(cx - W, ys) +
            ' C ' + L(cx - W, ys - 0.42 * h) + ', ' + L(cx - 0.62 * W, ys - 0.62 * h) + ', ' + L(cx - 0.28 * W, ys - 0.78 * h) +
            ' C ' + L(cx - 0.1 * W, ys - 0.86 * h) + ', ' + L(cx - 0.03 * W, ys - 0.93 * h) + ', ' + L(cx, ya) +
            ' C ' + L(cx + 0.03 * W, ys - 0.93 * h) + ', ' + L(cx + 0.1 * W, ys - 0.86 * h) + ', ' + L(cx + 0.28 * W, ys - 0.78 * h) +
            ' C ' + L(cx + 0.62 * W, ys - 0.62 * h) + ', ' + L(cx + W, ys - 0.42 * h) + ', ' + L(cx + W, ys) +
            ' L ' + L(cx + W, base) + ' Z')

CAMEL = ('M 2 -26 C 4 -34 10 -42 18 -42 C 25 -42 28 -34 33 -30 C 37 -31 40 -36 43 -41 '
         'C 45 -45 49 -47 53 -46 L 59 -44 C 61 -43 61 -40 58 -40 L 53 -40 C 50 -40 48 -37 47 -33 '
         'C 45 -28 44 -24 42 -21 L 43 0 L 40.5 0 L 38.5 -17 L 37 0 L 34.5 0 L 34 -17 '
         'C 26 -15 18 -15 13 -17 L 12 0 L 9.5 0 L 8.5 -16 L 6.5 0 L 4 0 L 4.5 -20 '
         'C 3 -22 2 -23 0.5 -22 C 0.5 -24 1 -25 2 -26 Z')
SADDLE = 'M 11 -38 C 15 -45 22 -45 26 -38 L 25 -31 C 21 -29 15 -29 12 -31 Z'

def camel(x, y, s, fill, saddle=None):
    g = f'<path fill="{fill}" d="{CAMEL}"/>'
    if saddle:
        g += f'<path fill="{saddle}" d="{SADDLE}"/>'
    return f'<g transform="translate({f(x)} {f(y)}) scale({f(s)})">{g}</g>'

def fort(fill):
    """Fort on a rock, inside the arch. The rock's foot is hidden by the dunes."""
    p = [f'<path fill="{fill}" d="M 46 184 C 62 160 78 152 92 154 C 104 150 122 152 136 160 C 146 166 154 174 160 184 Z" opacity=".92"/>']
    parts = [(64, 146, 14, 30), (78, 138, 20, 38), (98, 126, 20, 50), (118, 136, 14, 40), (132, 146, 12, 30)]
    for x, y, w, h in parts:
        p.append(f'<rect fill="{fill}" x="{x}" y="{y}" width="{w}" height="{h}"/>')
        n = max(2, w // 5)
        for k in range(n):
            mx = x + k * (w / n) + 0.4
            p.append(f'<rect fill="{fill}" x="{f(mx)}" y="{y - 3}" width="{f(w / n * 0.55)}" height="3.2"/>')
    for cx, top, r in ((108, 126, 7), (88, 138, 6), (71, 146, 5), (125, 136, 5)):
        p.append(f'<path fill="{fill}" d="M {cx - r} {top - 3} C {cx - r} {top - 3 - 1.6 * r} {cx + r} {top - 3 - 1.6 * r} {cx + r} {top - 3} Z"/>')
        p.append(f'<rect fill="{fill}" x="{cx - 0.8}" y="{f(top - 3 - 1.4 * r - 4)}" width="1.6" height="5"/>')
    for wx, wy in ((104, 138), (110, 138), (84, 152), (90, 152), (123, 148), (69, 158)):
        p.append(f'<rect fill="{SUN}" opacity=".75" x="{wx}" y="{wy}" width="3" height="5.5" rx="1.5"/>')
    return ''.join(p)

def scene(detail=True):
    """Everything inside the arch: sun, fort, dunes, camel."""
    s = [f'<circle cx="100" cy="{124 if detail else 132}" r="{44 if detail else 40}" fill="url(#sun)"/>']
    if detail:
        s.append(f'<g transform="translate(9 0)">{fort(MAROON)}</g>')
    s.append(f'<path fill="{DUNE_D}" d="M 26 192 C 56 170 90 168 116 178 C 140 188 160 182 180 172 L 180 240 L 26 240 Z"/>')
    s.append(f'<path fill="url(#dune)" d="M 20 206 C 50 186 84 184 110 194 C 136 204 158 200 182 188 L 182 240 L 20 240 Z"/>')
    if detail:
        s.append(camel(50, 211, 0.6, CAMEL_DARK, GOLD))
    else:
        s.append(camel(62, 200, 0.95, MAROON))
    return ''.join(s)

def defs():
    return (f'<defs><linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="{SUN_L}"/><stop offset="1" stop-color="{SUN}"/></linearGradient>'
            f'<linearGradient id="dune" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="#F7C65A"/><stop offset="1" stop-color="{SAND}"/></linearGradient>'
            f'<clipPath id="win"><path d="{INNER}"/></clipPath></defs>')

OUTER = ogee(100, 214, 100, 16, 74)
INNER = ogee(100, 214, 104, 46, 56)

def _bez(p0, p1, p2, p3, t):
    u = 1 - t
    return (u**3*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t**3*p3[0],
            u**3*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t**3*p3[1])

def cusps():
    """Scallops along the inner curve — the jharokha's cusped edge."""
    cx, ys, ya, W = 100, 104, 46, 56
    h = ys - ya
    seg1 = ((cx - W, ys), (cx - W, ys - 0.42 * h), (cx - 0.62 * W, ys - 0.62 * h), (cx - 0.28 * W, ys - 0.78 * h))
    pts = [_bez(*seg1, t) for t in (0.08, 0.36, 0.66, 0.95)]
    out = []
    for (x, y) in pts:
        for sx in (x, 2 * cx - x):
            out.append(f'<circle cx="{f(sx)}" cy="{f(y)}" r="6.2" fill="{ROYAL}" stroke="{GOLD}" stroke-width="2"/>')
    return ''.join(out)

def arch_band(scallop=True):
    band = f'<path fill="{ROYAL}" fill-rule="evenodd" d="{OUTER} {INNER}"/>'
    return ((cusps() if scallop else '') + band +
            (f'<path fill="none" stroke="{GOLD}" stroke-width="2.2" d="{INNER}"/>' if not scallop else
             f'<path fill="none" stroke="{GOLD}" stroke-width="2.2" d="M 44 214 L 44 104 M 156 214 L 156 104"/>') +
            f'<path fill="none" stroke="{GOLD}" stroke-width="3.4" d="{OUTER}"/>'
            f'<path fill="{GOLD}" d="M 100 0 C 104 7 105 11 100 17 C 95 11 96 7 100 0 Z"/>'
            f'<rect x="20" y="211" width="160" height="7" rx="3.5" fill="{GOLD}"/>')

def mark(detail=True):
    return defs() + f'<g clip-path="url(#win)">{scene(detail)}</g>' + arch_band(detail)


def icon_svg(size_attr=''):
    """Square app/fav icon: the arch, the sun and the camel — the simple mark, centred."""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -1 240 240"{size_attr} role="img">'
            f'<title>Ghoomo Rajasthan</title>{mark(False)}</svg>')


def swoosh():
    """The gold sweep under the picture — the dune that runs out of the window in the owner's
    logo — from the left foot of the arch out past its right side."""
    return ('<path fill="url(#sw)" d="M 6 222 C 50 214 92 214 132 208 C 160 204 182 196 198 184 '
            'C 192 200 170 214 136 220 C 98 227 52 226 6 222 Z"/>')

def swoosh_defs():
    return ('<linearGradient id="sw" x1="0" y1="0" x2="1" y2="0">'
            f'<stop offset="0" stop-color="{GOLD}" stop-opacity=".2"/><stop offset=".45" stop-color="{GOLD}"/>'
            f'<stop offset="1" stop-color="{SUN}"/></linearGradient>')

def mark_with_car(font_path):
    """The full mark with the car parked in front of the window, on the gold sweep."""
    from car import car
    return (mark(True).replace('</defs>', swoosh_defs() + '</defs>', 1) + swoosh() +
            f'<g transform="translate(72 181) scale(1.05)">{car(font_path)}</g>')
