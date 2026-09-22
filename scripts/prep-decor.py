#!/usr/bin/env python3
"""
Prepare decoration art for the page.

Source images sit on a black background with a soft white "sticker" glow.
This strips both, leaving only the artwork on transparent pixels:

  Output is lossy WebP with alpha in public/decor/.

  ink   -> a black alpha mask (lines opaque, white fill transparent), tinted
           at render time with the theme's ink colour via CSS mask-image
  color -> the artwork with its own colours, transparent outside

Usage:  python3 scripts/prep-decor.py            (all entries below)
        python3 scripts/prep-decor.py candle     (one entry)

Add a new decoration: drop the source in assets-src/decor/, add a row to
ENTRIES, run this, then register it in src/lib/decor.ts.

SVG sources (e.g. Faravahar-Gold.svg) skip this script: copy them straight
into public/decor/ and register them as kind 'color'.
"""
import sys
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'assets-src' / 'decor'
OUT = ROOT / 'public' / 'decor'
MAX = 1400  # longest side of the output
ERODE = 25  # px; must exceed the outline thickness at MAX size

# name, kind, darkness threshold for ink/outline pixels, gap-closing radius
# kind 'ink-precut': source is dark art on white/transparent (no black bg /
#   glow to strip); alpha = source alpha x darkness. Third column is a floor:
#   darkness below it is treated as paper and dropped (kills cream texture).
# kind 'color-white': full-colour art on white/cream paper; the white is keyed
#   out per pixel (alpha = 255 - min(r,g,b), colour un-premultiplied) so
#   anti-aliased edges stay clean. Third column is the same paper floor.
ENTRIES = [
    ('capital', 'ink', 140, 7),
    ('candle', 'ink', 80, 1),
    ('boteh', 'color', 110, 1),
    ('immortal', 'ink-precut', 0, 1),
    ('king-plate', 'ink-precut', 0, 1),
    ('column', 'ink-precut', 24, 1),
    ('sarv', 'ink-precut', 24, 1),
    ('shahin', 'ink-precut', 24, 1),
    ('lamassu', 'ink-precut', 40, 1),
    ('darbar', 'ink-precut', 70, 1),
    ('iran-map', 'color-white', 28, 1),
    # last: boxes (x0, y0, x1, y1) in source pixels to blank before keying
    ('iran-map-color', 'color-white', 60, 1, [(290, 0, 353, 45)]),
    ('nilufar', 'ink-precut', 60, 1),
    # colour art on transparent, wrapped in a white "sticker" halo; third
    # column = how white a pixel must be (min channel) to count as halo
    ('kurosh', 'color-sticker', 232, 1),
]


def outside_mask(gray: Image.Image, dark_t: int, close: int = 1) -> Image.Image:
    """255 where a pixel belongs to the outside (black bg + glow halo).

    `close` erodes the walkable area first so hairline gaps in an outline do
    not let the flood leak into the artwork.
    """
    w, h = gray.size
    # Anything not ink is walkable; flood from the four corners.
    walk = gray.point(lambda v: 255 if v >= dark_t else 0)
    if close > 1:
        walk = walk.filter(ImageFilter.MinFilter(close))
    # Background is black (< dark_t) so let the corner region start: mark
    # pixels that are very dark AND connected to the border as walkable too.
    # Erode the dark mask first so the thin black outline (which may touch
    # the black background directly) drops out and is not treated as bg.
    bg = gray.point(lambda v: 255 if v < dark_t else 0).filter(ImageFilter.MinFilter(ERODE))
    for pt in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        if bg.getpixel(pt) == 255:
            ImageDraw.floodfill(bg, pt, 128)
    bg_conn = bg.point(lambda v: 255 if v == 128 else 0).filter(ImageFilter.MaxFilter(ERODE + 4))
    walk.paste(255, mask=bg_conn)
    # Flood from the corners through everything walkable; stops at ink lines.
    fill = walk.copy()
    for pt in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        if fill.getpixel(pt) == 255:
            ImageDraw.floodfill(fill, pt, 128)
    out = fill.point(lambda v: 255 if v == 128 else 0)
    if close > 1:
        out = out.filter(ImageFilter.MaxFilter(close))
    return out


def prep(name: str, kind: str, dark_t: int, close: int = 1, erase=()) -> None:
    im = Image.open(SRC / f'{name}.png').convert('RGBA')
    for box in erase:
        im.paste((255, 255, 255, 0), box)
    im.thumbnail((MAX, MAX), Image.LANCZOS)
    gray = im.convert('L')

    if kind == 'ink-precut':
        src_alpha = im.getchannel('A')
        darkness = gray.point(lambda v: 255 - v)
        darkness = lift_floor(darkness, dark_t)
        # multiply: opaque only where the source is both opaque and dark
        alpha = ImageChops.multiply(darkness, src_alpha)
        out = Image.new('RGBA', im.size, (0, 0, 0, 0))
        out.putalpha(alpha)
        save(name, out)
        return

    if kind == 'color-white':
        save(name, key_white(im, dark_t))
        return

    if kind == 'color-sticker':
        save(name, strip_sticker(im, dark_t))
        return

    outside = outside_mask(gray, dark_t, close)
    # Grow the outside region slightly so the halo edge does not survive.
    outside = outside.filter(ImageFilter.MaxFilter(5))
    inside = outside.point(lambda v: 255 - v)

    if kind == 'ink':
        # alpha = darkness, only inside the shape
        darkness = gray.point(lambda v: 255 - v)
        alpha = Image.composite(darkness, Image.new('L', im.size, 0), inside)
        out = Image.new('RGBA', im.size, (0, 0, 0, 0))
        out.putalpha(alpha)
    else:
        alpha = inside.filter(ImageFilter.GaussianBlur(0.6))
        out = im.copy()
        out.putalpha(alpha)

    save(name, out)


def lift_floor(chan: Image.Image, floor: int) -> Image.Image:
    """Map [floor, 255] -> [0, 255]; anything at or below the floor is 0."""
    if floor <= 0:
        return chan
    scale = 255 / (255 - floor)
    return chan.point(lambda v: 0 if v <= floor else min(255, round((v - floor) * scale)))


def key_white(im: Image.Image, floor: int) -> Image.Image:
    """Remove a white/cream ground from colour art.

    alpha = 255 - min(r, g, b) is the standard "unmultiply from white" key:
    pure white goes fully transparent, saturated ink stays opaque, and the
    colour is recovered as c' = 255 - (255 - c) * 255 / alpha so edges do not
    turn grey once composited on a coloured page.
    """
    r, g, b, a = im.split()
    ink = ImageChops.lighter(ImageChops.lighter(
        r.point(lambda v: 255 - v), g.point(lambda v: 255 - v)), b.point(lambda v: 255 - v))
    alpha = ImageChops.multiply(lift_floor(ink, floor), a)
    px = im.load()
    ap = alpha.load()
    out = Image.new('RGBA', im.size, (0, 0, 0, 0))
    op = out.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            al = ap[x, y]
            if al == 0:
                continue
            rr, gg, bb, _ = px[x, y]
            k = 255 / al
            op[x, y] = (
                max(0, min(255, round(255 - (255 - rr) * k))),
                max(0, min(255, round(255 - (255 - gg) * k))),
                max(0, min(255, round(255 - (255 - bb) * k))),
                al,
            )
    return out


def strip_sticker(im: Image.Image, white_t: int) -> Image.Image:
    """Drop a white outline halo that sits between transparent bg and art.

    Walkable = transparent OR near-white (all channels >= white_t). Flood from
    the corners; whatever the flood reaches is halo and goes transparent. Bright
    highlights inside the art are not connected to the outside, so they stay.
    """
    r, g, b, a = im.split()
    lo = ImageChops.darker(ImageChops.darker(r, g), b)
    white = lo.point(lambda v: 255 if v >= white_t else 0)
    clear = a.point(lambda v: 255 if v < 12 else 0)
    walk = ImageChops.lighter(white, clear)
    fill = walk.copy()
    w, h = im.size
    for pt in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        if fill.getpixel(pt) == 255:
            ImageDraw.floodfill(fill, pt, 128)
    outside = fill.point(lambda v: 255 if v == 128 else 0)
    # eat one more pixel of rim so no bright fringe survives, soften the edge
    outside = outside.filter(ImageFilter.MaxFilter(3))
    inside = outside.point(lambda v: 255 - v).filter(ImageFilter.GaussianBlur(0.7))
    out = im.copy()
    out.putalpha(ImageChops.multiply(a, inside))
    return out


def save(name: str, out: Image.Image) -> None:
    bbox = out.getbbox()
    if bbox:
        out = out.crop(bbox)
    OUT.mkdir(parents=True, exist_ok=True)
    out.save(OUT / f'{name}.webp', quality=88, method=6)
    print(f'{name}: {out.size[0]}x{out.size[1]} -> public/decor/{name}.webp')


if __name__ == '__main__':
    only = set(sys.argv[1:])
    for name, kind, t, close, *rest in ENTRIES:
        if not only or name in only:
            prep(name, kind, t, close, *rest)
