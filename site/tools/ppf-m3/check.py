# check.py <view> <out.png> : rasterise the exported SVG paths (even-odd, as
# the page draws them) over the photo, each zone its own colour, at full size
import sys, os, json, re, cv2, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.normpath(os.path.join(HERE, '..', '..', '..'))
v = sys.argv[1]
d = json.load(open(os.path.join(ROOT, 'site', 'src', 'lib', f'ppf-m3-{v}.json')))
img = cv2.imread(os.path.join(ROOT, 'assets-src', 'ppf-m3', f'{v}-a.png'))
over = img.copy(); rng = np.random.default_rng(5); lines = []
for z, p in d['zones'].items():
    polys = [np.array(list(map(int, s.split())), np.int32).reshape(-1, 2) for s in re.findall(r'M([^Z]*)Z', p)]
    m = np.zeros(img.shape[:2], np.uint8)
    for q in polys:                       # even-odd: xor every subpath
        t = np.zeros_like(m); cv2.fillPoly(t, [q], 1); m ^= t
    over[m == 1] = rng.integers(60, 255, 3)
    lines += polys
out = cv2.addWeighted(over, .45, img, .55, 0)
cv2.polylines(out, lines, True, (0, 255, 255), 1, cv2.LINE_AA)
cv2.imwrite(sys.argv[2], out)
