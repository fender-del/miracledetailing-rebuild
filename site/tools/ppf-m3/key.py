# Key the PPF zones on the M3 Touring photos (block 34).
#
#   python key.py <view> [review.png]      view = front | rear
#
# Painted panels: seeded watershed over the white paint, where the
# "height" is the panel gaps (black-hat of the grey image), so every
# boundary between two panels runs down the middle of the real gap.
# Where the car has no gap (the roof's leading edge) a `cut` polyline
# is drawn as a barrier. Parts that are not white paint (lights,
# mirrors) are `dark` zones: a hand polygon minus the paint, so their
# edge against the body is the body's own edge.
# Writes ppf-m3-<view>.json (zone -> SVG path, in image pixels) next to
# site/src/lib, and a review image with every zone tinted and outlined.
import sys, json, os, cv2, numpy as np
from skimage.segmentation import watershed

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..', '..', '..'))
sys.path.insert(0, HERE)
from zones import VIEWS

view = sys.argv[1]
V = VIEWS[view]
img = cv2.imread(os.path.join(ROOT, 'assets-src', 'ppf-m3', V['src']))
H, W = img.shape[:2]
g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# ---- the white paint ----
paint = (g > V.get('T', 100)).astype(np.uint8)
for poly, t in V.get('lowT', []):            # shaded paint: a lower threshold inside a polygon
    c = np.zeros((H, W), np.uint8); cv2.fillPoly(c, [np.int32(poly)], 1)
    paint[(c == 1) & (g > t)] = 1
for poly in V.get('notpaint', []):           # bright bits that are not paint (grille slats)
    cv2.fillPoly(paint, [np.int32(poly)], 0)
for poly in V.get('paint', []):              # shaded paint below the threshold
    cv2.fillPoly(paint, [np.int32(poly)], 1)
for cut in V.get('cuts', []):                # barriers where there is no gap
    cv2.polylines(paint, [np.int32(cut)], False, 0, 3)

# ---- watershed: seeds per panel, gaps as ridges ----
bh = cv2.morphologyEx(g, cv2.MORPH_BLACKHAT, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)))
elev = cv2.GaussianBlur(bh.astype(np.float32), (3, 3), 0)
names = list(V['seeds'].keys())
markers = np.zeros((H, W), np.int32)
for i, z in enumerate(names, 1):
    for s in V['seeds'][z]:
        if len(s) == 2:
            cv2.circle(markers, (int(s[0]), int(s[1])), 6, i, -1)
        else:                                 # a stroke [x0,y0,x1,y1]
            cv2.line(markers, (int(s[0]), int(s[1])), (int(s[2]), int(s[3])), i, 9)
markers[paint == 0] = 0
lab = watershed(elev, markers, mask=paint.astype(bool))

def clean(m, hole):
    m = m.astype(np.uint8)
    # fill holes smaller than `hole` px (sensors, badges, reflections)
    inv = 1 - m
    n, l, st, _ = cv2.connectedComponentsWithStats(inv, connectivity=4)
    for k in range(1, n):
        x, y, w, h, a = st[k]
        if a < hole and x > 0 and y > 0 and x + w < W and y + h < H:
            m[l == k] = 1
    # drop specks
    n, l, st, _ = cv2.connectedComponentsWithStats(m, connectivity=8)
    big = max([st[k, 4] for k in range(1, n)] + [0])
    for k in range(1, n):
        if st[k, 4] < max(400, big * 0.02):
            m[l == k] = 0
    return m

masks = {}
for i, z in enumerate(names, 1):
    m = lab == i
    for poly in V.get('clip', {}).get(z, []):  # trim a panel to a polygon
        c = np.zeros((H, W), np.uint8); cv2.fillPoly(c, [np.int32(poly)], 1)
        m &= c.astype(bool)
    k = V.get('smooth', {}).get(z)
    if k:                                      # round off lumps and lips where detail is noise
        m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
    k = V.get('close', {}).get(z)
    if k:                                      # bridge a seam that is not a panel edge
        m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
    masks[z] = clean(m, V.get('hole', 6000))

# ---- dark zones: hand polygon minus the paint (or: only red, or as drawn) ----
paintish = cv2.dilate((g > V.get('T', 100)).astype(np.uint8), np.ones((3, 3), np.uint8))
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
red = (((hsv[..., 0] < 12) | (hsv[..., 0] > 165)) & (hsv[..., 1] > 90) & (hsv[..., 2] > 50)).astype(np.uint8)
def fill_holes(m):
    inv = 1 - m
    n, l, st, _ = cv2.connectedComponentsWithStats(inv, connectivity=4)
    for k in range(1, n):
        x, y, w, h, a = st[k]
        if x > 0 and y > 0 and x + w < W and y + h < H:
            m[l == k] = 1
    return m
body = np.zeros((H, W), np.uint8)
for m in masks.values():
    body |= m
body = cv2.dilate(body, np.ones((5, 5), np.uint8))
for z, parts in V.get('dark', {}).items():
    acc = np.zeros((H, W), np.uint8)
    for part in parts:
        m = np.zeros((H, W), np.uint8)
        cv2.fillPoly(m, [np.int32(part['poly'])], 1)
        mode = part.get('mode', 'notpaint')
        if mode == 'notpaint':
            m[paintish == 1] = 0
        elif mode == 'notbody':                 # minus the painted panels only: keeps bright DRLs
            m[body == 1] = 0
            m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((7, 7), np.uint8))   # no panel-gap slivers
        elif mode == 'red':
            m &= cv2.dilate(red, np.ones((5, 5), np.uint8))
        m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
        n, l, st, _ = cv2.connectedComponentsWithStats(m, connectivity=8)
        if n > 1:                               # keep the biggest piece of each part
            k = 1 + int(np.argmax(st[1:, 4])); m = (l == k).astype(np.uint8)
        acc |= fill_holes(m)
    prev = masks.get(z)
    masks[z] = acc if prev is None else (acc | prev)

# ---- vectorise: slightly smoothed contours, 1 px tolerance (0.3 px on screen) ----
def path(m):
    s = cv2.GaussianBlur(m.astype(np.float32), (7, 7), 0)
    s = (s > 0.5).astype(np.uint8)
    cs, hier = cv2.findContours(s, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    d = []
    for c in cs:
        if cv2.contourArea(c) < 60:
            continue
        a = cv2.approxPolyDP(c, 1.0, True)[:, 0, :]
        d.append('M' + ' '.join(f'{x} {y}' for x, y in a) + 'Z')
    return ''.join(d)

out = {'w': W, 'h': H, 'zones': {z: path(m) for z, m in masks.items() if m.any()}}
anchors = {}
for z, m in masks.items():
    if not m.any():
        continue
    # callout anchor: the point deepest inside the panel
    dt = cv2.distanceTransform(np.pad(m, 1), cv2.DIST_L2, 5)[1:-1, 1:-1]
    y, x = np.unravel_index(np.argmax(dt), dt.shape)
    anchors[z] = [int(x), int(y)]
out['anchors'] = anchors
with open(os.path.join(ROOT, 'site', 'src', 'lib', f'ppf-m3-{view}.json'), 'w') as f:
    json.dump(out, f, separators=(',', ':'))

# ---- review image ----
if len(sys.argv) > 2:
    rng = np.random.default_rng(7)
    vis = img.copy()
    over = img.copy()
    for z, m in masks.items():
        col = rng.integers(40, 255, 3).tolist()
        over[m == 1] = col
    vis = cv2.addWeighted(over, 0.45, img, 0.55, 0)
    for z, m in masks.items():
        cs, _ = cv2.findContours(m, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
        cv2.drawContours(vis, cs, -1, (0, 255, 255), 1)
        if z in anchors:
            x, y = anchors[z]
            cv2.putText(vis, z, (x - 30, y), 0, 0.8, (0, 0, 0), 4)
            cv2.putText(vis, z, (x - 30, y), 0, 0.8, (255, 255, 255), 2)
    # paint no zone took: magenta, so gaps in coverage show
    taken = np.zeros((H, W), bool)
    for m in masks.values():
        taken |= m.astype(bool)
    left = (paint == 1) & ~taken
    vis[left] = (vis[left] * 0.4 + np.array([255, 0, 255]) * 0.6).astype(np.uint8)
    cv2.imwrite(sys.argv[2], vis)
print({z: int(m.sum()) for z, m in masks.items()})
