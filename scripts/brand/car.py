"""An MPV (Innova Crysta-like) in side view, facing left, with the brand written on its side.
Coordinates: 120 x 40, wheels' bottom at y = 39."""
import os
from textpath import text_path
HERE = os.path.dirname(os.path.abspath(__file__))

BODY = ('M 4 32 C 2 32 1 30.6 1 28.6 L 1.4 23.4 C 1.8 21 3.6 19.6 7 19 L 21 16.4 '
        'L 33.5 4.6 C 35.4 3 37.6 2.4 40.5 2.4 L 104 2.4 C 108 2.4 110.4 3.4 112.2 6 '
        'L 117.4 14.6 C 118.6 16.6 119.2 18.8 119.2 21.6 L 119.2 29 C 119.2 30.9 117.8 32 116 32 Z')
WIN_FRONT = 'M 24.6 16 L 36 6.3 L 56.5 6.3 L 56.5 16 Z'
WIN_MID = 'M 59.5 6.3 L 82 6.3 L 82 16 L 59.5 16 Z'
WIN_REAR = 'M 85 6.3 L 103.5 6.3 C 106.5 6.3 108 7.2 109.5 9.4 L 113.6 16 L 85 16 Z'

def wheel(cx, tyre, animated):
    """A wheel; animated → in a group the site can spin (with spokes, so the spin shows)."""
    if not animated:
        return f'<circle cx="{cx}" cy="32" r="6.4" fill="{tyre}"/><circle cx="{cx}" cy="32" r="2.7" fill="#BFC5CC"/>'
    return (f'<g class="gr-wheel" style="transform-origin:{cx}px 32px">'
            f'<circle cx="{cx}" cy="32" r="6.4" fill="{tyre}"/><circle cx="{cx}" cy="32" r="2.7" fill="#BFC5CC"/>'
            f'<path d="M {cx} 29.4 V 34.6 M {cx - 2.6} 32 H {cx + 2.6}" stroke="{tyre}" stroke-width=".9"/></g>')

def car(font_path, body='#FFFFFF', outline='#1E3A7B', text='#8E1B1B', stripe='#E0A93B', glass='#1E3A7B', tyre='#1B1B1F', animated=False):
    d, w, b = text_path(font_path, 'Ghoomo Rajasthan', 7.4)
    tw = b[2] - b[0]
    tx = 61 - tw / 2 - b[0]
    ty = 26.6
    parts = [
        f'<path d="{BODY}" fill="{body}" stroke="{outline}" stroke-width="1.3" stroke-linejoin="round"/>',
        f'<path d="{WIN_FRONT}" fill="{glass}" opacity=".85"/>',
        f'<path d="{WIN_MID}" fill="{glass}" opacity=".85"/>',
        f'<path d="{WIN_REAR}" fill="{glass}" opacity=".85"/>',
        # roof rails
        f'<rect x="42" y="0.4" width="60" height="1.6" rx=".8" fill="{outline}"/>',
        # the gold stripe and the name
        f'<rect x="3" y="17.6" width="115" height="1.4" fill="{stripe}"/>',
        f'<path fill="{text}" transform="translate({tx:.1f} {ty})" d="{d}"/>',
        # lights, mirror
        f'<path d="M 1.8 21.2 C 3.6 20.2 6.6 19.9 8.6 20.2 L 8.2 22.2 C 6 22.4 3.6 22.4 1.6 22.4 Z" fill="{stripe}"/>',
        f'<rect x="115" y="19.6" width="3.4" height="4.6" rx="1" fill="#C0392B"/>',
        f'<path d="M 27.5 15 L 31 13.2 L 32 15.4 Z" fill="{outline}"/>',
        # wheels
        wheel(23, tyre, animated),
        wheel(99, tyre, animated),
    ]
    return ''.join(parts)

if __name__ == '__main__':
    import sys
    f = os.path.join(HERE, 'fonts/RozhaOne-Regular.ttf')
    open(sys.argv[1], 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -3 128 46" width="768" height="276"><rect x="-4" y="-3" width="128" height="46" fill="#FBF7EF"/>{car(f)}</svg>')
