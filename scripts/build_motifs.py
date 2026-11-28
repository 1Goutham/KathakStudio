# Draws the section background motifs (line-art SVG) and writes motifs.json + preview.html.
# Usage: python3 scripts/build_motifs.py  -> paste the data URIs into the [data-motif] rules in app/globals.css
import math, json
def rot(inner, n, cx=100, cy=100, off=0):
    return ''.join(f'<g transform="rotate({off + i*360/n:.3f} {cx} {cy})">{inner}</g>' for i in range(n))
def svg(body, sw=0.55):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none" stroke="#b07a35" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round">{body}</svg>'
M = {}

# 1. mandala (existing)
petals = rot('<path d="M100 24 C 112 50, 112 64, 100 78 C 88 64, 88 50, 100 24 Z"/><circle cx="100" cy="14" r="2.2"/>', 16)
inner = rot('<path d="M100 80 C 105 88, 105 92, 100 98 C 95 92, 95 88, 100 80 Z"/>', 12, off=15)
M['mandala'] = svg('<circle cx="100" cy="100" r="96"/><circle cx="100" cy="100" r="90" stroke-dasharray="1 3"/><circle cx="100" cy="100" r="78" stroke-dasharray="2 4"/><circle cx="100" cy="100" r="22"/><circle cx="100" cy="100" r="8"/>' + petals + inner, 0.45)

# 2. lotus, side view
def mirror(d): return f'<path d="{d}"/><path d="{d}" transform="translate(200 0) scale(-1 1)"/>'
lotus = (
  '<path d="M100 30 C 122 62, 124 104, 100 140 C 76 104, 78 62, 100 30 Z"/>'
  '<path d="M100 44 C 112 72, 112 104, 100 130"/>'
  + mirror('M100 140 C 70 128, 54 96, 58 58 C 82 74, 98 104, 100 140 Z')
  + mirror('M64 70 C 70 96, 84 118, 99 134')
  + mirror('M100 140 C 62 142, 32 120, 18 90 C 52 92, 82 112, 100 140 Z')
  + mirror('M28 96 C 52 104, 78 120, 97 137')
  + mirror('M100 142 C 70 152, 40 150, 16 136 C 44 128, 76 130, 100 142 Z')
  + '<path d="M40 160 Q 100 172 160 160"/><path d="M58 172 Q 100 181 142 172"/><path d="M78 183 Q 100 188 122 183"/>'
  + ''.join(f'<circle cx="{100+dx}" cy="{y}" r="1.6"/>' for dx, y in ((0, 18), (-14, 24), (14, 24), (-26, 34), (26, 34)))
)
M['lotus'] = svg(lotus)

# 3. kolam: diamond lattice of pulli dots, each wrapped by a rounded diamond loop
s, h, k = 14.5, 10.8, 3.6   # spacing, half-diagonal, corner rounding
def rdiamond(cx, cy, h, k):
    # rounded diamond through (cx±h, cy), (cx, cy±h)
    pts = [(cx, cy - h), (cx + h, cy), (cx, cy + h), (cx - h, cy)]
    d = ''
    for i in range(4):
        p0, p1, p2 = pts[i - 1], pts[i], pts[(i + 1) % 4]
        a = (p1[0] + (p0[0] - p1[0]) * k / h, p1[1] + (p0[1] - p1[1]) * k / h)
        b = (p1[0] + (p2[0] - p1[0]) * k / h, p1[1] + (p2[1] - p1[1]) * k / h)
        d += ('M' if i == 0 else 'L') + f'{a[0]:.2f} {a[1]:.2f} Q {p1[0]} {p1[1]} {b[0]:.2f} {b[1]:.2f} '
    return f'<path d="{d}Z"/>'
kol = ''
for i in range(-4, 5):
    for j in range(-4, 5):
        if abs(i) + abs(j) <= 4:
            x, y = 100 + i * s, 100 + j * s
            kol += f'<circle cx="{x}" cy="{y}" r="1.7" fill="#b07a35" stroke="none"/>' + rdiamond(x, y, h, k)
kol += rdiamond(100, 100, 4 * s + h + 7, 10) + rdiamond(100, 100, 4 * s + h + 13, 12)
R = 4 * s + h + 13
for i in range(4):  # petal loops at the four tips, kept inside the frame
    kol += (f'<g transform="rotate({i*90} 100 100)"><path d="M100 {100-R} C 106 {100-R-4}, 106 {100-R-8}, 100 {100-R-13} C 94 {100-R-8}, 94 {100-R-4}, 100 {100-R} Z"/>'
            f'<circle cx="100" cy="{100-R-16.5}" r="1.7" fill="#b07a35" stroke="none"/></g>')
M['kolam'] = svg(kol)

# 4. paisley (buta): classic teardrop; the curl lives only on the main contour
O = "M128 26 C 166 52, 170 118, 128 154 C 98 180, 54 168, 50 132 C 46 100, 76 88, 96 80 C 116 72, 128 58, 124 42 C 123 36, 125 30, 128 26 Z"
CURL = "M124 42 C 122 34, 118 30, 112 30 C 106 30, 104 38, 110 40"
def scaled(d, k, cx, cy, extra=""): return f'<path d="{d}" transform="translate({cx*(1-k):.2f} {cy*(1-k):.2f}) scale({k})"{extra}/>'
pais = f'<path d="{O}"/><path d="{CURL}"/>' + scaled(O, .76, 104, 128) + scaled(O, .52, 100, 132)
pais += scaled(O, 1.12, 106, 112, ' stroke-dasharray="1 3.5"')
pais += rot('<path d="M98 134 C 102 128, 102 124, 98 120 C 94 124, 94 128, 98 134 Z"/>', 6, 98, 134) + '<circle cx="98" cy="134" r="2.4"/>'
M['paisley'] = svg(pais)

# 5. rangoli star: two squares, petals, dotted ring
sq = '<rect x="38" y="38" width="124" height="124"/>'
star = sq + f'<g transform="rotate(45 100 100)">{sq}</g>'
star += '<rect x="56" y="56" width="88" height="88" stroke-dasharray="2 3"/>' + f'<g transform="rotate(45 100 100)"><rect x="56" y="56" width="88" height="88" stroke-dasharray="2 3"/></g>'
star += '<circle cx="100" cy="100" r="36"/>' + rot('<path d="M100 66 C 108 78, 108 88, 100 96 C 92 88, 92 78, 100 66 Z"/>', 8) + '<circle cx="100" cy="100" r="6"/>'
star += rot('<circle cx="100" cy="12.3" r="2.4"/>', 8) + rot('<circle cx="100" cy="26" r="1.4"/>', 8, off=22.5)
star += '<circle cx="100" cy="100" r="96" stroke-dasharray="1 3"/>'
M['rangoli'] = svg(star)

# 6. ghungroo: two strands of ankle bells with tassels
def bell(x, y):
    return (f'<line x1="{x}" y1="{y}" x2="{x}" y2="{y+4}"/>'
            f'<circle cx="{x}" cy="{y+10}" r="6"/>'
            f'<path d="M{x-4.2} {y+12.5} Q {x} {y+15.5} {x+4.2} {y+12.5}"/>'
            f'<circle cx="{x}" cy="{y+12.6}" r=".9" fill="#b07a35" stroke="none"/>')
def strand(y0, sag, n, x0=18, x1=182):
    d = f'<path d="M{x0} {y0} Q 100 {y0+2*sag} {x1} {y0}"/>'
    for i in range(n):
        t = (i + 0.5) / n; x = x0 + (x1 - x0) * t
        y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * (y0 + 2 * sag) + t * t * y0
        d += bell(x, y)
    for x in (x0, x1):
        d += f'<circle cx="{x}" cy="{y0}" r="2.4"/>' + ''.join(f'<path d="M{x} {y0+2} Q {x+dx*0.4} {y0+14} {x+dx} {y0+26}"/>' for dx in (-4, 0, 4))
    return d
M['ghungroo'] = svg(strand(46, 34, 11) + strand(112, 30, 9, 34, 166))

# 7. prabha: ring of flames
flame = '<path d="M100 18 C 106 12, 105 6, 100 0 C 95 6, 94 12, 100 18 Z"/><path d="M100 14 C 102 11, 101 8, 100 5"/>'
prabha = '<circle cx="100" cy="100" r="80"/><circle cx="100" cy="100" r="74"/><circle cx="100" cy="100" r="68" stroke-dasharray="1.5 3.5"/>'
prabha += rot('<path d="M100 20 C 104 16, 104 12, 100 8" />', 1) and ''
prabha += rot(flame.replace('M100 18', 'M100 20').replace('100 0', '100 2'), 28)
prabha += rot('<circle cx="100" cy="23" r="1.3" fill="#b07a35" stroke="none"/>', 28, off=360/56)
prabha += '<circle cx="100" cy="100" r="56" stroke-dasharray="1 4"/>'
M['prabha'] = svg(prabha)

# 8. padma: lotus seen from above
padma = rot('<path d="M100 84 C 118 70, 116 40, 100 16 C 84 40, 82 70, 100 84 Z"/><path d="M100 76 C 110 64, 109 44, 100 28 C 91 44, 90 64, 100 76 Z"/>', 8)
padma += rot('<path d="M100 86 C 110 76, 110 60, 100 46 C 90 60, 90 76, 100 86 Z"/>', 8, off=22.5)
padma += '<circle cx="100" cy="100" r="15"/>' + rot('<circle cx="100" cy="91" r="1.5" fill="#b07a35" stroke="none"/>', 8) + '<circle cx="100" cy="100" r="2" fill="#b07a35" stroke="none"/>'
padma += '<circle cx="100" cy="100" r="92" stroke-dasharray="1 4"/>'
M['padma'] = svg(padma)

json.dump(M, open('motifs.json', 'w'))
html = '<html><body style="margin:0;background:#f4ebdc;display:grid;grid-template-columns:repeat(4,300px);gap:16px;padding:16px;font:14px sans-serif">' + ''.join(f'<div><img src="data:image/svg+xml;utf8,{v.replace(chr(35), "%23")}" width="300" height="300" style="background:#fbf6ee"/><div>{k}</div></div>' for k, v in M.items()) + '</body></html>'
open('preview.html', 'w').write(html)
print(list(M))
