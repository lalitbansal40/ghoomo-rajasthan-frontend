"""Text → SVG path (shaped with HarfBuzz, outlines from fontTools). Usage as a module."""
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

def text_path(font_path, text, size, x=0.0, y=0.0, tracking=0.0):
    """Return (d, width, (xmin, ymin, xmax, ymax)) for [text] at [size] px, baseline at y."""
    blob = hb.Blob.from_file_path(font_path)
    face = hb.Face(blob)
    font = hb.Font(face)
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(font, buf, {"kern": True, "liga": True})
    tt = TTFont(font_path)
    upem = tt["head"].unitsPerEm
    gs = tt.getGlyphSet()
    order = tt.getGlyphOrder()
    scale = size / upem
    pen = SVGPathPen(gs, ntos=lambda v: ("%.1f" % v).rstrip("0").rstrip("."))
    bpen = BoundsPen(gs)
    cx = 0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = order[info.codepoint]
        ox = x + (cx + pos.x_offset) * scale
        oy = y - pos.y_offset * scale
        t = (scale, 0, 0, -scale, ox, oy)
        gs[name].draw(TransformPen(pen, t))
        gs[name].draw(TransformPen(bpen, t))
        cx += pos.x_advance + tracking / scale
    return pen.getCommands(), cx * scale, bpen.bounds
